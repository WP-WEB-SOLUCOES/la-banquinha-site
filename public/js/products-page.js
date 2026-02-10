// public/js/products-page.js

window.productsPage = {
    apiBaseUrl: '/api', // Usa o Proxy do Node.js
    
    currentPage: 1,
    itemsPerPage: 12,
    allProducts: [],
    filters: { category: [], brand: [], maxPrice: 5000 },

    init: function() {
        console.log("🚀 Lógica de Produtos Iniciada!");
        this.loadProducts();
        // Pequeno delay para garantir que o HTML já existe antes de ligar os eventos
        setTimeout(() => this.initializeEvents(), 500);
    },
    
    loadProducts: async function() {
        this.showLoading(true);
        console.log("📡 Buscando produtos em: " + this.apiBaseUrl + "/products/");

        try {
            const response = await fetch(`${this.apiBaseUrl}/products/`);
            const data = await response.json();

            if (data.products) {
                this.allProducts = data.products.map(p => this.mapData(p));
                this.generateDynamicFilters();
                this.updateDisplay();
            }
        } catch (error) {
            console.error("Erro API:", error);
            const grid = document.getElementById('products-grid');
            if(grid) grid.innerHTML = '<div class="error-msg">Erro ao conectar com o servidor.</div>';
        } finally {
            this.showLoading(false);
        }
    },

    mapData: function(apiItem) {
        const variety = apiItem.varieties?.[0] || { price: 0 };
        let imageId = null;
        if (apiItem.primary_images?.length) imageId = apiItem.primary_images[0].id;
        else if (variety.images?.length) imageId = variety.images[0].id;

        const imageUrl = imageId 
            ? `${this.apiBaseUrl}/products/imagem/${imageId}` 
            : 'images/placeholder.jpg'; // Imagem padrão se falhar

        return {
            id: apiItem._id,
            name: apiItem.basename,
            price: variety.price,
            image: imageUrl,
            category: apiItem.category?.name || 'Geral',
            brand: apiItem.mark?.name || 'Outros',
            inStock: apiItem.status === 'disponivel',
            isNew: apiItem.is_new_arrival,
            isSale: false
        };
    },

    generateDynamicFilters: function() {
        if (!this.allProducts.length) return;
        const categories = new Set(this.allProducts.map(p => p.category).filter(Boolean));
        const brands = new Set(this.allProducts.map(p => p.brand).filter(Boolean));
        
        const render = (id, list, name) => {
            const el = document.getElementById(id);
            if(el) el.innerHTML = Array.from(list).sort().map(item => 
                `<label class="filter-option"><input type="checkbox" name="${name}" value="${item}"><span class="checkmark"></span>${item}</label>`
            ).join('');
        };
        render('category-filters-container', categories, 'category');
        render('brand-filters-container', brands, 'brand');
    },

    updateDisplay: function() {
        const grid = document.getElementById('products-grid');
        if (!grid) return;
        
        // Aplica filtros (código mantido)
        const results = this.allProducts.filter(p => {
            if (this.filters.category.length > 0 && !this.filters.category.includes(p.category)) return false;
            if (this.filters.brand.length > 0 && !this.filters.brand.includes(p.brand)) return false;
            if (p.price > this.filters.maxPrice) return false;
            return true;
        });

        // Atualiza contador
        const countEl = document.getElementById('products-count');
        if(countEl) countEl.innerHTML = `<i class="fas fa-check-circle" style="color: var(--accent-color)"></i> ${results.length} produtos`;

        // Se não tiver produtos
        if (results.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 60px; color: #666;">
                    <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 20px; opacity: 0.5;"></i>
                    <h3>Nenhum produto encontrado</h3>
                    <p>Tente ajustar o preço ou os filtros.</p>
                </div>`;
            return;
        }

        // Gera os cards novos
        grid.innerHTML = results.map(p => {
            // Badges Inteligentes
            let badge = '';
            if(!p.inStock) badge = '<span class="card-badge bg-out">Esgotado</span>';
            else if(p.isSale) badge = '<span class="card-badge bg-sale">Oferta</span>';
            else if(p.isNew) badge = '<span class="card-badge bg-new">Novo</span>';

            // Formatação de Preço
            let priceHtml = `<div class="price-value">R$ ${p.price.toFixed(2)}</div>`;
            if(p.isSale && p.originalPrice > p.price) {
                priceHtml = `
                    <div style="display:flex; flex-direction:column; align-items:flex-end; line-height:1.2;">
                        <span class="old-price">R$ ${p.originalPrice.toFixed(2)}</span>
                        <span class="price-value" style="color: var(--accent-red)">R$ ${p.price.toFixed(2)}</span>
                    </div>
                `;
            }

            return `
            <div class="product-card">
                <div class="product-image-wrapper">
                    ${badge}
                    <img src="${p.image}" alt="${p.name}" class="product-image" loading="lazy"
                         onerror="this.src='https://via.placeholder.com/300x300/ffffff/000000?text=Sem+Foto'">
                </div>
                
                <div class="product-info">
                    <div class="product-category">${p.brand}</div>
                    <h3 class="product-title" title="${p.name}">${p.name}</h3>
                    
                    <div class="price-box">
                        ${priceHtml}
                    </div>

                    <button class="btn-neon" 
                            ${!p.inStock ? 'disabled style="opacity:0.5; background:#333; color:#888;"' : ''}
                            onclick="window.cart?.addItem('${p.id}')">
                        ${!p.inStock ? 'Indisponível' : '<i class="fas fa-shopping-bag"></i> Comprar'}
                    </button>
                </div>
            </div>
            `;
        }).join('');
    },

    initializeEvents: function() {
        document.getElementById('apply-filters')?.addEventListener('click', () => {
             this.filters.category = Array.from(document.querySelectorAll('input[name="category"]:checked')).map(cb => cb.value);
             this.filters.brand = Array.from(document.querySelectorAll('input[name="brand"]:checked')).map(cb => cb.value);
             this.updateDisplay();
        });
    },

    showLoading: function(show) {
        const grid = document.getElementById('products-grid');
        if (grid && show) grid.innerHTML = '<div style="padding:40px; text-align:center">Carregando produtos...</div>';
    }
};