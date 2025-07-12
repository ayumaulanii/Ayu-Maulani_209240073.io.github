document.addEventListener('DOMContentLoaded', function () {
    const cartIcon = document.getElementById('cart-icon');
    const cartModal = document.getElementById('cart-modal');
    const closeCart = document.getElementById('close-cart');
    const overlay = document.getElementById('overlay');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartCount = document.querySelector('.cart-count');

    if (!cartIcon || !cartModal || !closeCart || !overlay || !cartItemsContainer || !cartTotalElement || !checkoutBtn || !cartCount) {
        alert('Beberapa elemen penting tidak ditemukan di HTML. Pastikan id dan class sesuai.');
        return;
    }

    let cartItems = [];
    let total = 0;

    cartIcon.addEventListener('click', () => {
        cartModal.classList.add('active');
        overlay.classList.add('active');
    });

    closeCart.addEventListener('click', () => {
        cartModal.classList.remove('active');
        overlay.classList.remove('active');
    });

    overlay.addEventListener('click', () => {
        cartModal.classList.remove('active');
        overlay.classList.remove('active');
    });

    function initCart() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            cartItems = JSON.parse(savedCart);
            updateCart();
        }
    }

    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const id = button.dataset.id;
            const name = button.dataset.name;
            const price = parseInt(button.dataset.price);

            if (!id || !name || isNaN(price)) return;

            const existingItem = cartItems.find(item => item.id === id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cartItems.push({ id, name, price, quantity: 1 });
            }

            saveCart();
            updateCart();
            alert(`${name} telah ditambahkan ke keranjang!`);
        });
    });

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }

    function updateCart() {
        cartItemsContainer.innerHTML = '';
        let totalPrice = 0;

        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-message">Keranjang belanja anda kosong.</p>';
        } else {
            cartItems.forEach(item => {
                totalPrice += item.price * item.quantity;
                const cartItemElement = document.createElement('div');
                cartItemElement.className = 'cart-item';
                cartItemElement.innerHTML = `
                    <p><strong>${item.name}</strong> - Rp ${item.price.toLocaleString('id-ID')} x ${item.quantity}</p>
                    <button class="remove-item" data-id="${item.id}">Hapus</button>
                `;
                cartItemsContainer.appendChild(cartItemElement);
            });
        }

        cartTotalElement.textContent = `Rp ${totalPrice.toLocaleString('id-ID')}`;
        total = totalPrice;

        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', () => {
                const id = button.dataset.id;
                cartItems = cartItems.filter(item => item.id !== id);
                saveCart();
                updateCart();
            });
        });

        const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = itemCount;
        cartCount.style.display = itemCount > 0 ? 'flex' : 'none';
    }

    checkoutBtn.addEventListener('click', () => {
        if (cartItems.length === 0) {
            alert('Keranjang kosong.');
        } else {
            alert(`Total: Rp ${total.toLocaleString('id-ID')}`);
            cartItems = [];
            saveCart();
            updateCart();
            cartModal.classList.remove('active');
            overlay.classList.remove('active');
        }
    });

    initCart();
});
