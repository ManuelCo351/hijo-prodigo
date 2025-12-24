/* ==============================================
   LÓGICA DE LA PÁGINA DE DETALLE
   ============================================== */

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. OBTENER EL ID DE LA URL
    // Si la URL es product.html?id=1, esto nos da el "1"
    const params = new URLSearchParams(window.location.search);
    const productId = parseInt(params.get("id"));

    // 2. BUSCAR EL PRODUCTO EN LA "BASE DE DATOS"
    // (La variable 'productos' viene cargada desde products.js)
    const product = productos.find(p => p.id === productId);

    // 3. SI EL PRODUCTO EXISTE, LLENAMOS LA PÁGINA
    if (product) {
        // Título y Breadcrumb
        document.title = `${product.nombre} | Hijo Pródigo`;
        document.getElementById("bread-name").textContent = product.nombre;
        document.getElementById("bread-category").textContent = product.categoria;
        document.getElementById("product-title").textContent = product.nombre;

        // Precio (Usamos el formateador de moneda de app.js o lo redefinimos acá)
        const formatPrice = (price) => {
            return new Intl.NumberFormat('es-AR', {
                style: 'currency', currency: 'ARS', minimumFractionDigits: 0
            }).format(price);
        };
        document.getElementById("product-price").textContent = formatPrice(product.precio);

        // Cuotas
        const installmentsEl = document.getElementById("product-installments");
        if (product.cuotas) {
            installmentsEl.textContent = product.cuotas;
        } else {
            installmentsEl.style.display = "none";
        }

        // Imagen
        document.getElementById("main-img").src = product.imagen;

    } else {
        // SI NO EXISTE (Ej: ID incorrecto), REDIRECCIONAR O MOSTRAR ERROR
        document.querySelector(".product-detail").innerHTML = "<h2>Producto no encontrado 😔</h2><a href='index.html'>Volver al inicio</a>";
    }

    // 4. LÓGICA DE SELECCIÓN DE TALLE
    const sizeBtns = document.querySelectorAll(".size-btn");
    let selectedSize = null;

    sizeBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            // Sacar clase selected a todos
            sizeBtns.forEach(b => b.classList.remove("selected"));
            // Poner clase al clickeado
            btn.classList.add("selected");
            selectedSize = btn.textContent;
        });
    });

    // 5. LÓGICA DEL BOTÓN "AGREGAR AL CARRITO" (Simulación)
    const addBtn = document.querySelector(".btn-add-cart");
    
    addBtn.addEventListener("click", () => {
        if (!selectedSize) {
            alert("⚠️ Por favor, seleccioná un talle primero.");
            return;
        }

        // Efecto visual de carga
        addBtn.textContent = "AGREGANDO...";
        addBtn.style.background = "#5d6d45"; // Verde oliva

        setTimeout(() => {
            addBtn.textContent = "¡AGREGADO! 🛒";
            
            // Actualizar numerito del carrito (Simulado visualmente)
            const cartBadge = document.querySelector(".cart-badge");
            let currentCount = parseInt(cartBadge.textContent);
            cartBadge.textContent = currentCount + 1;

            // Volver el botón a la normalidad
            setTimeout(() => {
                addBtn.textContent = "AGREGAR AL CARRITO";
                addBtn.style.background = "#000";
            }, 2000);
        }, 800);
    });
});

