/* ==============================================
   LÓGICA DEL CARRITO + CHECKOUT MERCADO PAGO
   ============================================== */

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. VARIABLES GLOBALES
    let cart = JSON.parse(localStorage.getItem("hijoProdigoCart")) || []; 
    
    const cartDrawer = document.getElementById("cart-drawer");
    const cartOverlay = document.getElementById("cart-overlay");
    const cartItemsContainer = document.getElementById("cart-items-container");
    const cartTotalPrice = document.getElementById("cart-total-price");
    const cartCountHeader = document.getElementById("cart-count-header");
    const cartBadges = document.querySelectorAll(".cart-badge"); 
    
    const openCartBtns = document.querySelectorAll(".cart-wrapper button, #cart-btn button");
    const closeCartBtn = document.getElementById("close-cart-btn");
    const continueBtn = document.getElementById("continue-shopping");
    const checkoutBtn = document.getElementById("checkout-btn"); // Lo traemos acá arriba

    // 2. FUNCIONES DE APERTURA / CIERRE
    function openCart() {
        cartDrawer.classList.add("active");
        cartOverlay.classList.add("active");
        document.body.style.overflow = "hidden"; 
    }

    function closeCart() {
        cartDrawer.classList.remove("active");
        cartOverlay.classList.remove("active");
        document.body.style.overflow = "auto";
    }

    openCartBtns.forEach(btn => btn.addEventListener("click", openCart));
    closeCartBtn.addEventListener("click", closeCart);
    continueBtn.addEventListener("click", closeCart);
    cartOverlay.addEventListener("click", closeCart);

    // 3. RENDERIZAR CARRITO
    function renderCart() {
        cartItemsContainer.innerHTML = ""; 
        let total = 0;
        let totalItems = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `<p class="empty-msg">Tu bolsa está vacía 😔</p>`;
        } else {
            cart.forEach((item, index) => {
                total += item.price * item.quantity;
                totalItems += item.quantity;

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

        cartTotalPrice.textContent = `$ ${total.toLocaleString('es-AR')}`;
        cartCountHeader.textContent = totalItems;
        cartBadges.forEach(badge => badge.textContent = totalItems);

        localStorage.setItem("hijoProdigoCart", JSON.stringify(cart));
    }

    // 4. FUNCIONES GLOBALES (Window)
    window.updateQty = (index, change) => {
        if (cart[index].quantity + change > 0) {
            cart[index].quantity += change;
        }
        renderCart();
    };

    window.removeItem = (index) => {
        cart.splice(index, 1);
        renderCart();
    };

    window.addToCart = (productObj) => {
        const existingItemIndex = cart.findIndex(item => item.id === productObj.id && item.size === productObj.size);

        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += productObj.quantity;
        } else {
            cart.push(productObj);
        }

        renderCart();
        openCart(); 
    };

    renderCart();

    // ==============================================
    // 6. CHECKOUT CON MERCADO PAGO (Integrado Correctamente)
    // ==============================================
    
    // IMPORTANTE: Reemplazá 'TU_PUBLIC_KEY_ACA' por tu clave pública real
    const mp = new MercadoPago('TU_PUBLIC_KEY_ACA', {
        locale: 'es-AR'
    });

    checkoutBtn.addEventListener("click", async () => {
        
        // 1. VALIDACIÓN
        if (cart.length === 0) {
            alert("Tu bolsa está vacía 😔");
            return;
        }

        const originalText = checkoutBtn.textContent;
        checkoutBtn.textContent = "PROCESANDO...";
        checkoutBtn.disabled = true;

        try {
            // 2. PEDIR PREFERENCIA A VERCEL
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ items: cart }), 
            });

            const data = await response.json();

            if (data.id) {
                // 3. ABRIR CHECKOUT
                mp.checkout({
                    preference: {
                        id: data.id
                    },
                    autoOpen: true, 
                });
            } else {
                alert("Hubo un error al generar el pago. Intenta de nuevo.");
            }

        } catch (error) {
            console.error(error);
            alert("Error de conexión. Revisá tu internet.");
        } finally {
            checkoutBtn.textContent = originalText;
            checkoutBtn.disabled = false;
        }
    });

}); // <--- ¡AQUÍ CIERRA TODO EL DOCUMENTO!
                          
