// WhatsApp number jahan message bhejna hai
const WHATSAPP_NUMBER = '918218733662'; // <-- Apna WhatsApp number is format me daaliye (91 se start)

document.addEventListener('DOMContentLoaded', function() {
    let cart = [];
    const cartCount = document.querySelector('.cart-count');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.total-amount');
    const cartModal = document.querySelector('.cart-modal');
    const checkoutModal = document.querySelector('.checkout-modal');
    const successModal = document.querySelector('.success-modal');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const closeCart = document.querySelector('.close-cart');
    const closeCheckout = document.querySelector('.close-checkout');
    const closeSuccess = document.querySelector('.close-success');
    const continueShopping = document.querySelector('.continue-shopping');
    const checkoutForm = document.getElementById('checkout-form');
    const summaryItems = document.querySelector('.summary-items');
    const summaryTotal = document.querySelector('.summary-total-amount');

    document.querySelector('.cart-icon').addEventListener('click', openCartModal);
    closeCart.addEventListener('click', closeCartModal);
    closeCheckout.addEventListener('click', closeCheckoutModal);
    closeSuccess.addEventListener('click', closeSuccessModal);
    continueShopping.addEventListener('click', function() {
        closeSuccessModal();
        closeCartModal();
    });
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
    checkoutBtn.addEventListener('click', function() {
        closeCartModal();
        openCheckoutModal();
    });

    checkoutForm.addEventListener('submit', placeOrder);

    function openCartModal() {
        cartModal.style.display = 'block';
        renderCartItems();
    }

    function closeCartModal() {
        cartModal.style.display = 'none';
    }

    function openCheckoutModal() {
        checkoutModal.style.display = 'block';
        renderOrderSummary();
    }

    function closeCheckoutModal() {
        checkoutModal.style.display = 'none';
    }

    function openSuccessModal() {
        successModal.style.display = 'block';
    }

    function closeSuccessModal() {
        successModal.style.display = 'none';
    }

    function addToCart(e) {
        const button = e.target;
        const id = button.getAttribute('data-id');
        const name = button.getAttribute('data-name');
        const price = parseFloat(button.getAttribute('data-price'));

        const existingItem = cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ id, name, price, quantity: 1 });
        }

        updateCartCount();
        showAddToCartFeedback(button);
    }

    function showAddToCartFeedback(button) {
        button.textContent = 'Added!';
        button.style.backgroundColor = '#28a745';
        setTimeout(() => {
            button.textContent = 'Add to Cart';
            button.style.backgroundColor = '#4a6bff';
        }, 1000);
    }

    function updateCartCount() {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }

    function renderCartItems() {
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
            cartTotal.textContent = '0';
            return;
        }

        let total = 0;
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            const cartItemElement = document.createElement('div');
            cartItemElement.classList.add('cart-item');
            cartItemElement.innerHTML = `
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">₹${item.price.toFixed(2)}</div>
                </div>
                <div class="cart-item-quantity">
                    <button class="decrease-quantity" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase-quantity" data-id="${item.id}">+</button>
                </div>
                <div class="cart-item-total">₹${itemTotal.toFixed(2)}</div>
                <div class="remove-item" data-id="${item.id}">&times;</div>
            `;
            cartItemsContainer.appendChild(cartItemElement);
        });

        cartTotal.textContent = total.toFixed(2);

        document.querySelectorAll('.increase-quantity').forEach(btn => {
            btn.addEventListener('click', increaseQuantity);
        });

        document.querySelectorAll('.decrease-quantity').forEach(btn => {
            btn.addEventListener('click', decreaseQuantity);
        });

        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', removeItem);
        });
    }

    function increaseQuantity(e) {
        const id = e.target.getAttribute('data-id');
        const item = cart.find(item => item.id === id);
        if (item) {
            item.quantity += 1;
            updateCartCount();
            renderCartItems();
        }
    }

    function decreaseQuantity(e) {
        const id = e.target.getAttribute('data-id');
        const item = cart.find(item => item.id === id);
        if (item && item.quantity > 1) {
            item.quantity -= 1;
            updateCartCount();
            renderCartItems();
        }
    }

    function removeItem(e) {
        const id = e.target.getAttribute('data-id');
        cart = cart.filter(item => item.id !== id);
        updateCartCount();
        renderCartItems();
    }

    function renderOrderSummary() {
        summaryItems.innerHTML = '';
        let total = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            const summaryItem = document.createElement('div');
            summaryItem.classList.add('summary-item');
            summaryItem.innerHTML = `
                <span>${item.name} x ${item.quantity}</span>
                <span>₹${itemTotal.toFixed(2)}</span>
            `;
            summaryItems.appendChild(summaryItem);
        });

        summaryTotal.textContent = total.toFixed(2);
    }

    // ✅ WhatsApp integration in placeOrder
    function placeOrder(e) {
        e.preventDefault();

        const formData = new FormData(checkoutForm);

        const customer = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            pincode: formData.get('pincode'),
            address: formData.get('address'),
            city: formData.get('city'),
            state: formData.get('state'),
            payment: formData.get('payment')
        };

        let message = `*🛒 Place My This Order Please*%0A%0A`;
        message += `*Customer Name:* ${customer.name}%0A`;
        message += `*Email:* ${customer.email}%0A`;
        message += `*Phone:* ${customer.phone}%0A`;
        message += `*Address:* ${customer.address}%0A`;
        message += `*City:* ${customer.city}%0A`;
        message += `*State* ${customer.state}%0A`;
        message += `*Payment Method:* ${customer.payment}%0A%0A`;
        message += `*Order Items:*%0A`;

        let total = 0;
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            message += `- ${item.name} x ${item.quantity} = ₹${itemTotal.toFixed(2)}%0A`;
        });

        message += `%0A*Total Amount:* ₹${total.toFixed(2)}`;

        // WhatsApp link
        const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
        window.open(url, '_blank');

        // Reset cart and modals
        cart = [];
        updateCartCount();
        closeCheckoutModal();
        openSuccessModal();
    }

    window.addEventListener('click', function(e) {
        if (e.target === cartModal) closeCartModal();
        if (e.target === checkoutModal) closeCheckoutModal();
        if (e.target === successModal) closeSuccessModal();
    });
});

{/* <script> */}
document.getElementById("searchInput").addEventListener("input", function () {
  const searchValue = this.value.toLowerCase();
  const productCards = document.querySelectorAll(".product-card");

  productCards.forEach(card => {
    const productName = card.querySelector("h3").textContent.toLowerCase();
    if (productName.includes(searchValue)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
});

{/* <script> */}
document.querySelectorAll('.toggle-description').forEach(button => {
  button.addEventListener('click', () => {
    const desc = button.previousElementSibling;
    desc.classList.toggle('expanded');
    
    if (desc.classList.contains('expanded')) {
      button.textContent = 'Read Less';
    } else {
      button.textContent = 'Read More';
    }
  });
});

