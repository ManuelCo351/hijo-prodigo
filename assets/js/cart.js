/* ==============================================
   LÓGICA DEL CARRITO - VERSIÓN BLINDADA
   ============================================== */

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. CARGA DE DATOS
    let cart = JSON.parse(localStorage.getItem("hijoProdigoCart")) || [];
    
    // Elementos del DOM
    const cartDrawer = document.getElementById("cart-drawer");
    const cartOverlay = document.getElementById("cart-overlay");
    const cartItemsContainer = document.getElementById("cart-items-container");
    const cartTotalPrice = document.getElementById("cart-total-price");
    const cartCountHeader = document.getElementById("cart-count-header");
    const cartBadges = document.querySelectorAll(".cart-badge");
    const checkoutBtn = document.getElementById("checkout-btn");

    // 2. FUNCIONES DE INTERFAZ
    const openCart = () => {
        cartDrawer.classList.add("active");
        cartOverlay.classList.add("active");
        document.body.style.overflow = "hidden";
    };

    const closeCart = () => {
        cartDrawer.classList.remove("active");
        cartOverlay.classList.remove("active");
        document.body.style.overflow = "auto";
    };

    // Asignar eventos de apertura/cierre
    document.querySelectorAll(".cart-wrapper button, #cart-btn button").forEach(b => b.onclick = openCart);
    if(document.getElementById("close-cart-btn")) document.getElementById("close-cart-btn").onclick = closeCart;
    if(document.getElementById("continue-shopping")) document.getElementById("continue-shopping").onclick = closeCart;
    if(cartOverlay) cartOverlay.onclick = closeCart;

    // 3. RENDERIZADO (La parte que no te cargaba)
    window.renderCart = function() {
        if (!cartItemsContainer) return;
        
        cartItemsContainer.innerHTML = "";
        let total = 0;
        let totalItems = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `<p class="empty-msg">Tu bolsa está vacía 😔</p>`;
        } else {
            cart.forEach((item, index) => {
                total += item.price * item.quantity;
                totalItems += item.quantity;

                cartItemsContainer.innerHTML += `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="item-details">
                        <h4>${item.name}</h4>
                        <span class="item-variant">Talle: ${item.size}</span>
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
                </div>`;
            });
        }

        if(cartTotalPrice) cartTotalPrice.textContent = `$ ${total.toLocaleString('es-AR')}`;
        if(cartCountHeader) cartCountHeader.textContent = totalItems;
        cartBadges.forEach(badge => badge.textContent = totalItems);
        localStorage.setItem("hijoProdigoCart", JSON.stringify(cart));
    };

    // 4. FUNCIONES DE ACCIÓN
    window.updateQty = (index, change) => {
        if (cart[index].quantity + change > 0) cart[index].quantity += change;
        renderCart();
    };

    window.removeItem = (index) => {
        cart.splice(index, 1);
        renderCart();
    };

    window.addToCart = (productObj) => {
        const idx = cart.findIndex(i => i.id === productObj.id && i.size === productObj.size);
        idx > -1 ? cart[idx].quantity += productObj.quantity : cart.push(productObj);
        renderCart();
        openCart();
    };

    // 5. MERCADO PAGO (Protegido por si falla la clave)
    if (typeof MercadoPago !== 'undefined') {
        const mp = new MercadoPago('APP_USR-a094f642-e305-42d6-b03c-3b79e9b9805f', { locale: 'es-AR' });
       
        checkoutBtn.onclick = async () => {
            if (cart.length === 0) return alert("Bolsa vacía");
            checkoutBtn.innerText = "PROCESANDO...";
            try {
                const res = await fetch('/api/checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ items: cart })
                });
                const data = await res.json();
                if (data.id) mp.checkout({ preference: { id: data.id }, autoOpen: true });
            } catch (e) { alert("Error al conectar con Mercado Pago"); }
            checkoutBtn.innerText = "INICIAR COMPRA";
        };
    }

    renderCart(); // Carga inicial
});
                          
