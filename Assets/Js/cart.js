/* ==============================================
   LÓGICA DEL CARRITO DE COMPRAS
   ============================================== */

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. VARIABLES GLOBALES
    let cart = JSON.parse(localStorage.getItem("hijoProdigoCart")) || []; // Carga del navegador o inicia vacío
    
    const cartDrawer = document.getElementById("cart-drawer");
    const cartOverlay = document.getElementById("cart-overlay");
    const cartItemsContainer = document.getElementById("cart-items-container");
    const cartTotalPrice = document.getElementById("cart-total-price");
    const cartCountHeader = document.getElementById("cart-count-header");
    const cartBadges = document.querySelectorAll(".cart-badge"); // Los numeritos rojos en el header
    
    // Botones para abrir/cerrar
    const openCartBtns = document.querySelectorAll(".cart-wrapper button, #cart-btn button"); // Selectores del icono bolsa
    const closeCartBtn = document.getElementById("close-cart-btn");
    const continueBtn = document.getElementById("continue-shopping");

    // 2. FUNCIONES DE APERTURA / CIERRE
    function openCart() {
        cartDrawer.classList.add("active");
        cartOverlay.classList.add("active");
        document.body.style.overflow = "hidden"; // Bloquea el scroll de la página
    }

    function closeCart() {
        cartDrawer.classList.remove("active");
        cartOverlay.classList.remove("active");
        document.body.style.overflow = "auto";
    }

    // Event Listeners para abrir
    openCartBtns.forEach(btn => btn.addEventListener("click", openCart));
    // Event Listeners para cerrar
    closeCartBtn.addEventListener("click", closeCart);
    continueBtn.addEventListener("click", closeCart);
    cartOverlay.addEventListener("click", closeCart);

    // 3. RENDERIZAR CARRITO (Dibujar los productos)
    function renderCart() {
        cartItemsContainer.innerHTML = ""; // Limpiar
        let total = 0;
        let totalItems = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `<p class="empty-msg">Tu bolsa está vacía 😔</p>`;
        } else {
            cart.forEach((item, index) => {
                total += item.price * item.quantity;
                totalItems += item.quantity;

                // HTML de cada item
                const itemHTML = `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="item-details">
                        <div>
                            <h4>${item.name}</h4>
                            <span class="item-variant">Talle: ${item.size}</span>
                        </div>
                        <div class="item-controls">
                            <div class="qty-control">
                                <button onclick="updateQty(${index}, -1)">-</button>
                                <span>${item.quantity}</span>
                                <button onclick="updateQty(${index}, 1)">+</button>
                            </div>
                            <button class="remove-btn" onclick="removeItem(${index})">Eliminar</button>
                        </div>
                    </div>
                    <div style="font-weight: 600;">$${(item.price * item.quantity).toLocaleString('es-AR')}</div>
                </div>
                `;
                cartItemsContainer.innerHTML += itemHTML;
            });
        }

        // Actualizar Totales
        cartTotalPrice.textContent = `$ ${total.toLocaleString('es-AR')}`;
        cartCountHeader.textContent = totalItems;
        cartBadges.forEach(badge => badge.textContent = totalItems);

        // Guardar en LocalStorage (Memoria del navegador)
        localStorage.setItem("hijoProdigoCart", JSON.stringify(cart));
    }

    // 4. FUNCIONES GLOBALES (Para poder usarlas desde el HTML onclick)
    
    // Actualizar Cantidad
    window.updateQty = (index, change) => {
        if (cart[index].quantity + change > 0) {
            cart[index].quantity += change;
        }
        renderCart();
    };

    // Eliminar Item
    window.removeItem = (index) => {
        cart.splice(index, 1);
        renderCart();
    };

    // 5. FUNCIÓN EXPORTABLE: AGREGAR AL CARRITO
    // Esta función la llamaremos desde product.html
    window.addToCart = (productObj) => {
        // Verificar si ya existe el mismo producto con mismo talle
        const existingItemIndex = cart.findIndex(item => item.id === productObj.id && item.size === productObj.size);

        if (existingItemIndex > -1) {
            // Si ya existe, sumamos cantidad
            cart[existingItemIndex].quantity += productObj.quantity;
        } else {
            // Si no, lo agregamos nuevo
            cart.push(productObj);
        }

        renderCart();
        openCart(); // Abrimos el carrito para confirmar
    };

    // INICIALIZAR
    renderCart();
});
    // ==============================================
    // 6. CHECKOUT CON MERCADO PAGO (Integración Pro)
    // ==============================================
    
    // INICIALIZAR SDK (Usá tu PUBLIC KEY acá, esa sí se puede mostrar)
    const mp = new MercadoPago('TU_PUBLIC_KEY_ACA', {
        locale: 'es-AR'
    });

    const checkoutBtn = document.getElementById("checkout-btn");

    checkoutBtn.addEventListener("click", async () => {
        
        // 1. VALIDACIÓN
        if (cart.length === 0) {
            alert("Tu bolsa está vacía 😔");
            return;
        }

        // Feedback visual (Cargando...)
        const originalText = checkoutBtn.textContent;
        checkoutBtn.textContent = "PROCESANDO...";
        checkoutBtn.disabled = true;

        try {
            // 2. PEDIR PREFERENCIA AL BACKEND (Nuestra API en Vercel)
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ items: cart }), // Mandamos el carrito
            });

            const data = await response.json();

            if (data.id) {
                // 3. ABRIR CHECKOUT DE MERCADO PAGO
                mp.checkout({
                    preference: {
                        id: data.id
                    },
                    autoOpen: true, // Se abre solito
                });
            } else {
                alert("Hubo un error al generar el pago. Intenta de nuevo.");
            }

        } catch (error) {
            console.error(error);
            alert("Error de conexión. Revisá tu internet.");
        } finally {
            // Volver botón a la normalidad
            checkoutBtn.textContent = originalText;
            checkoutBtn.disabled = false;
        }
    });
