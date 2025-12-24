/* ==========================================================================
   BASE DE DATOS DE PRODUCTOS (Hijo Pródigo Ind.)
   --------------------------------------------------------------------------
   Instrucciones para el Cliente:
   1. Cada bloque entre llaves { } es un producto.
   2. Para agregar uno nuevo, copiá un bloque entero y pegalo al final, 
      antes del corchete de cierre ].
   3. Asegurate de poner una coma (,) después de cada llave de cierre }, 
      menos en el último producto.
   ========================================================================== */

const productos = [
    {
        id: 1,
        nombre: "Remera 'Prodigal' Oversize",
        precio: 28000,
        // Categorías disponibles: 'remeras', 'hoodies', 'accesorios', 'pantalones'
        categoria: "remeras", 
        // Nombre exacto de la foto en la carpeta assets/img/
        imagen: "Assets/img/remera-blanca.jpg", 
        nuevo: true, // Si ponés true, sale la etiqueta "NUEVO"
        cuotas: "3 cuotas sin interés"
    },
    {
        id: 2,
        nombre: "Hoodie 'Eden' Heavyweight",
        precio: 52000,
        categoria: "hoodies",
        imagen: "Assets/img/hoodie-negro.jpg",
        nuevo: true,
        cuotas: "3 y 6 cuotas sin interés"
    },
    {
        id: 3,
        nombre: "Gorra Trucker HP Logo",
        precio: 15000,
        categoria: "accesorios",
        imagen: "Assets/img/gorra.jpg",
        nuevo: false, // false = no muestra etiqueta
        cuotas: "3 cuotas sin interés"
    },
    {
        id: 4,
        nombre: "Remera 'Siembra' Black",
        precio: 28000,
        categoria: "remeras",
        imagen: "Assets/img/remera-negra.jpg",
        nuevo: false,
        cuotas: "3 cuotas sin interés"
    },
    {
        id: 5,
        nombre: "Buzo Crewneck 'Fe'",
        precio: 45000,
        categoria: "hoodies",
        imagen: "Assets/img/buzo-gris.jpg",
        nuevo: true,
        cuotas: "3 y 6 cuotas sin interés"
    },
    {
        id: 6,
        nombre: "Piluso 'Holy' Reversible",
        precio: 12000,
        categoria: "accesorios",
        imagen: "Assets/img/piluso.jpg",
        nuevo: false,
        cuotas: null // Si no querés mostrar cuotas, poné null
    },
    {
        id: 7,
        nombre: " prueba 7",
        precio: 52000,
        categoria: "hoodies",
        imagen: "Assets/img/hoodie-negro.jpg",
        nuevo: true,
        cuotas: "3 y 6 cuotas sin interés"
    }
];

// NO BORRAR ESTA LÍNEA FINAL (Es necesaria para que funcione la web)
 window.productos = productos; 

