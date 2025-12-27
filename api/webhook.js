const { MercadoPagoConfig, Payment } = require('mercadopago');

// Tu URL de SheetDB
const SHEETDB_URL = 'https://sheetdb.io/api/v1/4pv5rmtfkd5oh';

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

module.exports = async (req, res) => {
  const { query, body } = req;
  
  // Mercado Pago manda el ID en el query o en el body dependiendo el caso
  const topic = query.topic || query.type;
  const id = query.id || query['data.id'];

  // Solo nos importa cuando se confirma un pago
  if (topic === 'payment' && id) {
    try {
      // 1. Preguntamos a MP qué pasó con ese ID
      const payment = new Payment(client);
      const paymentData = await payment.get({ id });
      
      // 2. Si el pago está APROBADO, restamos stock
      if (paymentData.status === 'approved') {
        const itemsVendidos = paymentData.additional_info.items;

        // Recorremos cada producto vendido
        for (const item of itemsVendidos) {
          // Recuperamos el talle del título (lo guardamos como "Nombre ###TALLE")
          const partes = item.title.split('###');
          if (partes.length < 2) continue; // Si no tiene talle, saltamos

          const idProducto = item.id;
          const talle = partes[1].trim().toLowerCase(); // "m", "s", "xl"
          const cantidadVendida = Number(item.quantity);

          // 3. Buscamos el stock actual en SheetDB
          const searchRes = await fetch(`${SHEETDB_URL}/search?id=${idProducto}`);
          const data = await searchRes.json();
          
          if (data && data.length > 0) {
            const productoSheet = data[0];
            const columnaStock = `stock_${talle}`; // ej: stock_m
            
            // Calculamos nuevo stock
            const stockActual = Number(productoSheet[columnaStock] || 0);
            const nuevoStock = stockActual - cantidadVendida;

            // 4. Actualizamos en SheetDB
            // PATCH /api/v1/{api_id}/id/{id}
            await fetch(`${SHEETDB_URL}/id/${idProducto}`, {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: {
                        [columnaStock]: nuevoStock >= 0 ? nuevoStock : 0
                    }
                })
            });
            console.log(`Stock actualizado: ID ${idProducto}, Talle ${talle}, Queda: ${nuevoStock}`);
          }
        }
      }
      res.status(200).send('OK');
    } catch (error) {
      console.error('Error webhook:', error);
      res.status(500).send('Error');
    }
  } else {
    res.status(200).send('Ignored');
  }
};
