// Sistema de Roteamento SPA (Single Page Application)
class Router {
    constructor() {
        this.routes = {
            '/': 'pages/home.html',
            '/produtos': 'pages/produtos.html',
            '/ofertas': 'pages/ofertas.html',
            '/sobre': 'pages/sobre.html',
            '/contato': 'pages/contato.html'
        };
        
        this.init();
    }
    
    init() {
        // Carregar componentes
        this.loadComponents();
        
        // Configurar navegação
        this.setupNavigation();
        
        // Configurar popstate para navegação do browser
        window.addEventListener('popstate', (e) => {
            this.navigate(window.location.pathname, false);
        });
        
        // Navegação inicial
        this.navigate(window.location.pathname, false);
    }
    
    async loadComponents() {
        try {
            // Carregar header
            const headerResponse = await fetch('components/header.html');
            const headerHTML = await headerResponse.text();
            document.getElementById('header-container').innerHTML = headerHTML;
            
            // Carregar footer
            const footerResponse = await fetch('components/footer.html');
            const footerHTML = await footerResponse.text();
            document.getElementById('footer-container').innerHTML = footerHTML;
            
            // Inicializar componentes após carregamento
            this.initializeComponents();
            
        } catch (error) {
            console.error('Erro ao carregar componentes:', error);
        }
    }
    
    initializeComponents() {
        // Inicializar funcionalidades do header
        this.initializeHeader();
        
        // Inicializar funcionalidades do footer
        this.initializeFooter();
        
        // Inicializar carrinho
        if (window.cart) {
            window.cart.init();
        }
    }
    
    initializeHeader() {
        // Menu mobile
        const menuToggle = document.getElementById('menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (menuToggle && navMenu) {
            menuToggle.addEventListener('click', () => {
                menuToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
                document.body.classList.toggle('menu-open');
            });
        }
        
        // Search functionality
        const searchToggle = document.getElementById('search-toggle');
        const searchClose = document.getElementById('search-close');
        const searchBar = document.getElementById('search-bar');
        
        if (searchToggle && searchBar) {
            searchToggle.addEventListener('click', () => {
                searchBar.classList.add('active');
                document.getElementById('search-input').focus();
            });
            
            searchClose.addEventListener('click', () => {
                searchBar.classList.remove('active');
            });
        }
        
        // Cart functionality
        const cartToggle = document.getElementById('cart-toggle');
        const cartClose = document.getElementById('cart-close');
        const cartSidebar = document.getElementById('cart-sidebar');
        const overlay = document.getElementById('overlay');
        
        if (cartToggle && cartSidebar) {
            cartToggle.addEventListener('click', () => {
                cartSidebar.classList.add('active');
                overlay.classList.add('active');
                document.body.classList.add('cart-open');
            });
            
            cartClose.addEventListener('click', () => {
                cartSidebar.classList.remove('active');
                overlay.classList.remove('active');
                document.body.classList.remove('cart-open');
            });
            
            overlay.addEventListener('click', () => {
                cartSidebar.classList.remove('active');
                overlay.classList.remove('active');
                document.body.classList.remove('cart-open');
            });
        }
    }
    
    initializeFooter() {
        // Adicionar event listeners para links do footer
        document.querySelectorAll('.footer-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                this.navigate(href);
            });
        });
    }
    
    setupNavigation() {
        // Interceptar clicks em links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            
            if (link && link.href && link.href.startsWith(window.location.origin)) {
                e.preventDefault();
                const path = new URL(link.href).pathname;
                this.navigate(path);
            }
        });
        
        // Atualizar links ativos
        this.updateActiveLinks();
    }
    
    async navigate(path, pushState = true) {
        // Normalizar path
        path = path || '/';
        
        // Verificar se a rota existe
        if (!this.routes[path]) {
            path = '/';
        }
        
        // Atualizar histórico se necessário
        if (pushState) {
            window.history.pushState({}, '', path);
        }
        
        // Mostrar loading
        this.showLoading();
        
        try {
            // Carregar conteúdo da página
            const response = await fetch(this.routes[path]);
            const content = await response.text();
            
            // Atualizar conteúdo principal
            document.getElementById('main-content').innerHTML = content;
            
            // Rolar para o topo
            window.scrollTo(0, 0);
            
            // Atualizar links ativos
            this.updateActiveLinks();
            
            // Inicializar scripts específicos da página
            this.initializePageScripts(path);
            
        } catch (error) {
            console.error('Erro ao carregar página:', error);
            this.navigate('/'); // Redirecionar para home em caso de erro
        } finally {
            this.hideLoading();
        }
    }
    
    updateActiveLinks() {
        const currentPath = window.location.pathname;
        
        // Atualizar links de navegação
        document.querySelectorAll('.nav-link').forEach(link => {
            const linkPath = new URL(link.href, window.location.origin).pathname;
            if (linkPath === currentPath) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // Atualizar título da página
        this.updatePageTitle(currentPath);
    }
    
    updatePageTitle(path) {
        const titles = {
            '/': 'La Banquinha Tabacaria | Pods, Juices e Vapor em Contagem',
            '/produtos': 'Produtos | La Banquinha Tabacaria',
            '/ofertas': 'Ofertas Especiais | La Banquinha Tabacaria',
            '/sobre': 'Sobre Nós | La Banquinha Tabacaria',
            '/contato': 'Contato | La Banquinha Tabacaria'
        };
        
        document.title = titles[path] || titles['/'];
    }
    
    initializePageScripts(path) {
        // Inicializar scripts específicos de cada página
        switch (path) {
            case '/produtos':
                if (window.productsPage) {
                    window.productsPage.init();
                }
                break;
            case '/ofertas':
                if (window.offersPage) {
                    window.offersPage.init();
                }
                break;
            case '/contato':
                if (window.contactPage) {
                    window.contactPage.init();
                }
                break;
            default:
                // Scripts para a home
                if (window.homePage) {
                    window.homePage.init();
                }
        }
        
        // Inicializar componentes comuns
        this.initializeCommonComponents();
    }
    
    initializeCommonComponents() {
        // Inicializar animações de scroll
        this.initializeScrollAnimations();
        
        // Inicializar formulários
        this.initializeForms();
    }
    
    initializeScrollAnimations() {
        // Animação para elementos que entram na viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right').forEach(el => {
            observer.observe(el);
        });
    }
    
    initializeForms() {
        // Inicializar todos os formulários
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => {
                this.handleFormSubmit(e, form);
            });
        });
    }
    
    async handleFormSubmit(e, form) {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        try {
            // Mostrar loading
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;
            
            // Simular envio (em produção, enviar para backend)
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Sucesso
            this.showNotification('Mensagem enviada com sucesso!', 'success');
            form.reset();
            
        } catch (error) {
            this.showNotification('Erro ao enviar mensagem. Tente novamente.', 'error');
        } finally {
            // Restaurar botão
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
    
    showLoading() {
        // Implementar loading screen se necessário
        document.body.classList.add('loading');
    }
    
    hideLoading() {
        document.body.classList.remove('loading');
    }
    
    showNotification(message, type = 'info') {
        // Implementar sistema de notificações
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(notification);
        
        // Remover após 5 segundos
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
    
    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
}

// Inicializar router quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.router = new Router();
});