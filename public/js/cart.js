// Gerenciamento avançado do carrinho
class ShoppingCart {
    constructor() {
        this.items = this.loadCart();
        this.init();
    }
    
    init() {
        this.updateCartUI();
        this.setupEventListeners();
    }
    
    loadCart() {
        return JSON.parse(localStorage.getItem('cart')) || [];
    }
    
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
        this.updateCartUI();
    }
    
    addItem(product, quantity = 1) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                ...product,
                quantity: quantity
            });
        }
        
        this.saveCart();
        this.showAddToCartAnimation(product);
    }
    
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
    }
    
    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
            }
        }
    }
    
    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    
    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }
    
    updateCartUI() {
        this.updateCartCount();
        this.updateCartModal();
    }
    
    updateCartCount() {
        const countElements = document.querySelectorAll('.cart-count');
        const totalItems = this.getTotalItems();
        
        countElements.forEach(element => {
            element.textContent = totalItems;
            element.style.display = totalItems > 0 ? 'flex' : 'none';
        });
    }
    
    updateCartModal() {
        // Implementar modal do carrinho
    }
    
    showAddToCartAnimation(product) {
        // Animação de adição ao carrinho
        const button = event?.target;
        if (button) {
            button.classList.add('adding');
            setTimeout(() => button.classList.remove('adding'), 600);
        }
    }
    
    setupEventListeners() {
        // Event listeners para o carrinho
    }
    
    checkout() {
        // Implementar fluxo de checkout
        const total = this.getTotal();
        const message = this.generateWhatsAppMessage();
        const url = `https://wa.me/5531999999999?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    }
    
    generateWhatsAppMessage() {
        let message = "🛒 *PEDIDO - LA BANQUINHA*\n\n";
        
        this.items.forEach(item => {
            message += `• ${item.name} - ${item.quantity}x R$ ${item.price.toFixed(2)}\n`;
        });
        
        message += `\n*Total: R$ ${this.getTotal().toFixed(2)}*`;
        message += `\n\n*Dados de Entrega:*`;
        message += `\nNome: \nEndereço: \nTelefone: \n\nObservações: `;
        
        return message;
    }
    
    clear() {
        this.items = [];
        this.saveCart();
    }
}

// Inicializar carrinho
const cart = new ShoppingCart();

// Exportar para uso global
window.cart = cart;