const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTbnEh19rwIV-ksZZBaez6Ma_XpGtSYEkz_NSOLOvrczFTkQMdn7MB4rSPDLhTBazGXfOavA4c2zq4z/pub?output=csv';

window.products = [];

// Función para imágenes
const imgAPI = (ruta) => {
    if (!ruta) return 'assets/img/placeholder.jpg';
    if (ruta.startsWith('http')) return ruta;
    const dominio = 'https://hijo-prodigo.vercel.app/'; 
    return `https://wsrv.nl/?url=${dominio}${ruta}&output=webp&q=80`;
};

function cargarProductos() {
    console.log("Descargando Excel...");

    Papa.parse(SHEET_URL, {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: function(results) {
            // 🔎 MODO ESPÍA ACTIVADO
            
            // 1. Ver qué columnas detectó
            const columnas = results.meta.fields;
            
            // 2. Ver la primera fila cruda (sin filtros)
            const primeraFila = results.data[0];

            // 3. Mostrar el reporte en pantalla
            alert(`🔍 REPORTE DE GOOGLE:
            
            Columnas encontradas: 
            ${JSON.stringify(columnas)}
            
            Datos de la Fila 1:
            ${JSON.stringify(primeraFila)}`);

            // Intentamos cargar igual por si acaso
            window.products = results.data
                .filter(row => row.id) 
                .map(row => ({
                    id: row.id,
                    name: row.name,
                    price: Number(row.price),
                    image: imgAPI(row.image),
                    category: row.category,
                    stock: {
                        S: row.stock_s || 0,
                        M: row.stock_m || 0,
                        L: row.stock_l || 0,
                        XL: row.stock_xl || 0
                    }
                }));
            
            if (window.products.length > 0) {
                if (typeof renderShop === 'function') renderShop();
            }
        },
        error: function(err) {
            alert("Error de conexión con Google.");
        }
    });
}

cargarProductos();

