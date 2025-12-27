import { MercadoPagoConfig, Preference } from 'mercadopago';

// 1. Configuración de Mercado Pago con tu Access Token (Guardado en Vercel)
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { items } = req.body;

    try {
      // 2. Transformamos tu carrito al formato que pide Mercado Pago
      const itemsProcesados = items.map(producto => ({
        id: producto.id.toString(),
        title: producto.name,
        quantity: Number(producto.quantity),
        currency_id: 'ARS',
        unit_price: Number(producto.price),
        picture_url: `https://hijo-prodigo.vercel.app/${producto.image}` // Tu URL real
      }));

      // 3. Creamos la "Preferencia" de pago
      const preference = new Preference(client);
      const result = await preference.create({
        body: {
          items: itemsProcesados,
          back_urls: {
            success: "https://tienda-urb.vercel.app/", // A dónde vuelve si paga bien
            failure: "https://tienda-urb.vercel.app/",
            pending: "https://tienda-urb.vercel.app/"
          },
          auto_return: "approved",
        }
      });

      // 4. Devolvemos el ID de la preferencia al Frontend
      res.status(200).json({ id: result.id });
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al crear la preferencia' });
    }
  } else {
    // Si no es POST, error
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
