/* ==============================================
   LÓGICA DE LA PÁGINA DE DETALLE (Integrada al Carrito)
   ============================================== */

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. OBTENER EL ID DE LA URL
    // Busca el número después de ?id= en la dirección web
    const params = new URLSearchParams(window.location.search);
    const productId = parseInt(params.get("id"));

    // 2. BUSCAR EL PRODUCTO EN LA BASE DE DATOS
    // (La variable 'productos' viene de products.js)
    const product = productos.find(p => p.id === productId);

    // Variables para guardar la selección del usuario
    let selectedSize = null;
    let selectedQuantity = 1;

    // 3. SI EL PRODUCTO EXISTE, LLENAMOS LA PÁGINA
    if (product) {
        // Títulos y Breadcrumbs
        document.title = `${product.nombre} | Hijo Pródigo`;
        document.getElementById("bread-name").textContent = product.nombre;
        document.getElementById("bread-category").textContent = product.categoria;
        document.getElementById("product-title").textContent = product.nombre;

        // Formato de Precio
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
        const mainImg = document.getElementById("main-img");
        mainImg.src = product.imagen;
        mainImg.alt = product.nombre;

    } else {
        // Si el ID no existe, mostramos error
        document.querySelector(".product-detail").innerHTML = "<div style='text-align:center; padding:50px;'><h2>Producto no encontrado 😔</h2><a href='index.html' class='btn-outline-dark'>Volver al inicio</a></div>";
        return; // Cortamos la ejecución acá
    }

    // 4. LÓGICA DE SELECCIÓN DE TALLE
    const sizeBtns = document.querySelectorAll(".size-btn");

    sizeBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            // Sacar clase 'selected' a todos
            sizeBtns.forEach(b => b.classList.remove("selected"));
            // Poner clase al clickeado
            btn.classList.add("selected");
            // Guardar el valor (S, M, L, etc.)
            selectedSize = btn.textContent;
        });
    });

    // 5. LÓGICA DE CANTIDAD (+ y -)
    const qtyInput = document.querySelector(".quantity-selector input");
    const minusBtn = document.querySelector(".quantity-selector button:first-child");
    const plusBtn = document.querySelector(".quantity-selector button:last-child");

    minusBtn.addEventListener("click", () => {
        if (selectedQuantity > 1) {
            selectedQuantity--;
            qtyInput.value = selectedQuantity;
        }
    });

    plusBtn.addEventListener("click", () => {
        selectedQuantity++;
        qtyInput.value = selectedQuantity;
    });

    // 6. LÓGICA REAL: AGREGAR AL CARRITO
    const addBtn = document.querySelector(".btn-add-cart");
    
    addBtn.addEventListener("click", () => {
        // Validación: ¿Eligió talle?
        if (!selectedSize) {
            alert("⚠️ Por favor, seleccioná un talle primero.");
            // Efecto visual de error en los botones de talle
            document.querySelector(".size-options").style.animation = "shake 0.5s";
            setTimeout(() => document.querySelector(".size-options").style.animation = "", 500);
            return;
        }

        // Creamos el objeto para mandar al carrito
        const itemParaElCarrito = {
            id: product.id,
            name: product.nombre,
            price: product.precio,
            image: product.imagen,
            size: selectedSize,
            quantity: selectedQuantity
        };

        // LLAMADA A CART.JS
        if (window.addToCart) {
            // Feedback Visual en el botón
            const originalText = addBtn.textContent;
            addBtn.textContent = "AGREGANDO...";
            addBtn.style.background = "#5d6d45"; // Verde

            setTimeout(() => {
                // Agregar realmente
                window.addToCart(itemParaElCarrito);
                
                // Volver botón a la normalidad
                addBtn.textContent = "¡AGREGADO! 🛒";
                
                setTimeout(() => {
                    addBtn.textContent = originalText;
                    addBtn.style.background = "#000";
                }, 2000);
            }, 600); // Pequeño delay para que se sienta el proceso
        } else {
            console.error("Error: cart.js no está cargado correctamente.");
        }
    });
});

/* Animación opcional para cuando se olvida el talle */
const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
}
`;
document.head.appendChild(styleSheet);

