// Dados dos produtos (em produção, viria de uma API)
const products = [
    {
        id: 1,
        name: "Pod Descartável Elf Bar 6000",
        price: 49.90,
        image: "images/produtos/elf-bar.jpg",
        category: "pods",
        featured: true
    },
    {
        id: 2,
        name: "Juice Importado Sadboy 100ml",
        price: 89.90,
        image: "images/produtos/sadboy-juice.jpg",
        category: "juices",
        featured: true
    },
    {
        id: 3,
        name: "Kit Voopoo Drag X Plus",
        price: 299.90,
        image: "images/produtos/voopoo-kit.jpg",
        category: "mods",
        featured: true
    },
    {
        id: 4,
        name: "Resistências Geekvape Z Series",
        price: 39.90,
        image: "images/produtos/geekvape-coils.jpg",
        category: "acessorios",
        featured: true
    }
];

// Inicialização do site
document.addEventListener('DOMContentLoaded', function() {
    initializeSite();
});

function initializeSite() {
    loadFeaturedProducts();
    setupMobileMenu();
    setupSmoothScroll();
    setupContactForm();
    setupCart();
    setupLazyLoading();
}

// Carregar produtos em destaque
function loadFeaturedProducts() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;
    
    const featuredProducts = products.filter(product => product.featured);
    
    grid.innerHTML = featuredProducts.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">R$ ${product.price.toFixed(2)}</div>
                <div class="product-actions">
                    <button class="btn btn-primary add-to-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i> Adicionar
                    </button>
                    <button class="btn btn-outline" onclick="viewProduct(${product.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Menu mobile
function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Fechar menu ao clicar em um link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// Scroll suave
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Formulário de contato
function setupContactForm() {
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Simular envio (em produção, enviaria para um backend)
            sendToWhatsApp(data);
        });
    }
}

function sendToWhatsApp(data) {
    const message = `Olá! Me chamo ${data.nome}. ${data.mensagem}`;
    const whatsappUrl = `https://wa.me/5531999999999?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Carrinho básico
function setupCart() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartCount();
}

function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = products.find(p => p.id === productId);
    
    if (product) {
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        
        // Feedback visual
        showNotification('Produto adicionado ao carrinho!');
    }
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

function viewProduct(productId) {
    // Em produção, redirecionaria para página do produto
    const product = products.find(p => p.id === productId);
    if (product) {
        alert(`Visualizando: ${product.name}\nPreço: R$ ${product.price.toFixed(2)}`);
    }
}

// Lazy loading para imagens
function setupLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Notificações
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Estilos da notificação
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--card-bg);
        color: var(--text);
        padding: 1rem;
        border-radius: var(--border-radius);
        border-left: 4px solid var(--primary);
        box-shadow: var(--shadow);
        z-index: 1001;
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 300px;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

// Animações on scroll
function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.product-card, .category-card, .offer-card').forEach(el => {
        observer.observe(el);
    });
}

// Otimizações de performance
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        // Recálculos após redimensionamento
    }, 250);
});

// Service Worker para PWA (opcional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
}