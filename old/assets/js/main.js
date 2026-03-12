// Main JavaScript File

// Notification System
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#28a745' : '#dc3545'};
        color: white;
        border-radius: 5px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add to Cart with AJAX
document.addEventListener('DOMContentLoaded', function () {
    // Handle add to cart buttons
    const addToCartButtons = document.querySelectorAll('.btn-add-cart, #add-to-cart-btn');

    addToCartButtons.forEach(button => {
        // Skip buttons that have a custom handler or are handled by window.handleAddToCartClickFromList
        if (button.hasAttribute('onclick') || button.hasAttribute('data-custom-handler') || button.hasAttribute('data-type-category')) {
            return;
        }

        button.addEventListener('click', function (e) {
            e.preventDefault();
            const productId = this.getAttribute('data-product-id');
            const quantityInput = document.getElementById('product-quantity');
            const quantity = quantityInput ? parseInt(quantityInput.value) : 1;

            // Récupérer les dimensions si disponibles (depuis le modal)
            const lengthInput = document.getElementById('modal-length');
            const widthInput = document.getElementById('modal-width');
            const totalPriceElement = document.getElementById('modal-total-price');

            const length = lengthInput ? parseFloat(lengthInput.value) || 0 : 0;
            const width = widthInput ? parseFloat(widthInput.value) || 0 : 0;

            // Calculer le prix si les dimensions sont fournies
            let calculatedPrice = 0;
            if (length > 0 && width > 0 && totalPriceElement) {
                // Extraire le prix total du texte (format: "1 598,00 MAD")
                const priceText = totalPriceElement.textContent.replace(/[^\d,]/g, '').replace(',', '.');
                calculatedPrice = parseFloat(priceText) || 0;
            }

            if (!productId) return;

            // Disable button during request
            this.disabled = true;
            this.textContent = 'Ajout en cours...';

            // AJAX request
            const formData = new FormData();
            formData.append('product_id', productId);
            formData.append('quantity', quantity);
            if (length > 0 && width > 0) {
                formData.append('length', length);
                formData.append('width', width);
                formData.append('calculated_price', calculatedPrice);
            }

            fetch('api/add_to_cart.php', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        showNotification(data.message, 'success');
                        // Update cart count in header
                        updateCartCount(data.cart_count);
                    } else {
                        showNotification(data.message || 'Erreur lors de l\'ajout au panier', 'error');
                    }
                })
                .catch(error => {
                    showNotification('Erreur lors de l\'ajout au panier', 'error');
                })
                .finally(() => {
                    this.disabled = false;
                    if (this.classList.contains('btn-add-cart')) {
                        this.textContent = 'Ajouter au panier';
                    } else {
                        this.textContent = 'Ajouter au panier';
                    }
                });
        });
    });
});

// Update cart count in header
function updateCartCount(count) {
    const cartBadge = document.getElementById('cart-badge');
    if (cartBadge) {
        cartBadge.textContent = count;
        // Animation pour attirer l'attention
        cartBadge.style.animation = 'none';
        setTimeout(() => {
            cartBadge.style.animation = 'cartPulse 0.5s ease';
        }, 10);
    }

    // Mettre à jour aussi les autres éléments si présents
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(el => {
        el.textContent = `(${count})`;
    });
}

// Form Validation
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;

    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.style.borderColor = '#dc3545';

            field.addEventListener('input', function () {
                this.style.borderColor = '';
            }, { once: true });
        }
    });

    // Email validation
    const emailFields = form.querySelectorAll('input[type="email"]');
    emailFields.forEach(field => {
        if (field.value && !isValidEmail(field.value)) {
            isValid = false;
            field.style.borderColor = '#dc3545';
            showNotification('Email invalide', 'error');
        }
    });

    return isValid;
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Checkout form validation
const checkoutForm = document.getElementById('checkout-form');
if (checkoutForm) {
    checkoutForm.addEventListener('submit', function (e) {
        if (!validateForm('checkout-form')) {
            e.preventDefault();
            showNotification('Veuillez remplir tous les champs requis', 'error');
        }
    });
}

// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mainNav = document.querySelector('.main-nav');

if (mobileMenuToggle && mainNav) {
    mobileMenuToggle.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        mainNav.classList.toggle('active');
    });

    // Fermer le menu en cliquant en dehors
    document.addEventListener('click', function (e) {
        if (mainNav && mobileMenuToggle) {
            if (!mainNav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                mainNav.classList.remove('active');
            }
        }
    });
}

// Image Slider for Product Page (Simple)
function initProductSlider() {
    const thumbnails = document.querySelectorAll('.product-thumbnails img');
    const mainImage = document.getElementById('main-image');

    if (thumbnails.length > 0 && mainImage) {
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', function () {
                // Remove active class from all thumbnails
                thumbnails.forEach(t => t.classList.remove('active'));
                // Add active class to clicked thumbnail
                this.classList.add('active');
                // Update main image
                mainImage.src = this.src;
            });
        });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    initProductSlider();
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    .dimensions-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    }
    
    .dimensions-modal .modal-content {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        width: 90%;
        max-width: 500px;
        position: relative;
    }
`;
document.head.appendChild(style);

// Dimension Modal Logic (Shared)
window.currentProductId = null;
window.currentUnitPrice = null;
window.currentProductColors = [];
window.currentMaxWidthCm = null;
window.currentMaxHeightCm = null;
window.currentIsSurMesure = false;

window.selectModalColor = function (element, colorName) {
    document.querySelectorAll('#modal-colors-list .modal-color-option').forEach(opt => {
        opt.style.borderColor = 'var(--border-color)';
        opt.style.background = 'var(--light-color)';
    });
    element.style.borderColor = 'var(--primary-color)';
    element.style.background = 'rgba(139,69,19,0.1)';

    const selectedColorInput = document.getElementById('modal-selected-color');
    if (selectedColorInput) {
        selectedColorInput.value = colorName;
    }
};

window.openDimensionsModal = function (productId, unitPrice, productColors, maxWidthCm, maxHeightCm, isSurMesure) {
    const modal = document.getElementById('dimensions-modal');
    if (!modal) return;

    window.currentProductId = productId || window.currentProductId;
    window.currentUnitPrice = unitPrice || window.currentUnitPrice || window.unitPrice;

    // Store in DOM for robustness
    if (productId) modal.setAttribute('data-product-id', productId);
    if (unitPrice) modal.setAttribute('data-unit-price', unitPrice);
    if (maxWidthCm) modal.setAttribute('data-max-width', maxWidthCm);
    if (maxHeightCm) modal.setAttribute('data-max-height', maxHeightCm);
    modal.setAttribute('data-is-sur-mesure', isSurMesure);

    // Debug
    // alert('Opening Modal: ID=' + productId + ', Price=' + unitPrice);

    window.currentProductColors = productColors || window.currentProductColors || [];
    window.currentMaxWidthCm = maxWidthCm ? parseFloat(maxWidthCm) : (window.currentMaxWidthCm || null);
    window.currentMaxHeightCm = maxHeightCm ? parseFloat(maxHeightCm) : (window.currentMaxHeightCm || null);
    window.currentIsSurMesure = isSurMesure !== undefined ? !!isSurMesure : !!window.currentIsSurMesure;

    const unitPriceElement = document.getElementById('modal-unit-price');
    if (unitPriceElement) {
        unitPriceElement.textContent = formatPrice(unitPrice) + ' / m²';
    }

    const maxInfo = document.getElementById('modal-max-dimensions-info');
    if (maxInfo) {
        if (window.currentIsSurMesure && (window.currentMaxWidthCm || window.currentMaxHeightCm)) {
            const parts = [];
            if (window.currentMaxWidthCm) parts.push(window.currentMaxWidthCm + ' cm');
            if (window.currentMaxHeightCm) parts.push(window.currentMaxHeightCm + ' cm');
            maxInfo.textContent = 'Dimensions maximales pour ce modèle : ' +
                (window.currentMaxWidthCm && window.currentMaxHeightCm
                    ? window.currentMaxWidthCm + ' cm × ' + window.currentMaxHeightCm + ' cm'
                    : parts.join(' × '));
            maxInfo.style.display = 'inline';
        } else {
            maxInfo.textContent = '';
            maxInfo.style.display = 'none';
        }
    }

    const colorSelector = document.getElementById('modal-color-selector');
    const colorsList = document.getElementById('modal-colors-list');
    const selectedColorInput = document.getElementById('modal-selected-color');

    if (window.currentProductColors && window.currentProductColors.length > 0) {
        if (colorSelector) colorSelector.style.display = 'block';
        if (colorsList) {
            colorsList.innerHTML = '';
            window.currentProductColors.forEach((colorItem, index) => {
                const colorName = colorItem.name || '';
                const colorImage = colorItem.image || '';
                const isFirst = index === 0;

                const colorOption = document.createElement('div');
                colorOption.className = 'modal-color-option';
                colorOption.style.cssText = 'cursor: pointer; padding: 0.5rem 1rem; border: 2px solid var(--border-color); border-radius: 8px; background: var(--light-color); transition: all 0.3s; ' + (isFirst ? 'border-color: var(--primary-color); background: rgba(139,69,19,0.1);' : '');
                colorOption.setAttribute('data-color-name', colorName);
                colorOption.onclick = function () { window.selectModalColor(this, colorName); };

                if (colorImage) {
                    const img = document.createElement('img');
                    img.src = colorImage;
                    img.alt = colorName;
                    img.style.cssText = 'width: 40px; height: 40px; object-fit: cover; border-radius: 6px; margin-right: 0.5rem; display: inline-block; vertical-align: middle;';
                    img.onerror = function () { this.style.display = 'none'; };
                    colorOption.appendChild(img);
                }

                const span = document.createElement('span');
                span.style.cssText = 'font-weight: 600; color: var(--text-dark);';
                span.textContent = colorName;
                colorOption.appendChild(span);
                colorsList.appendChild(colorOption);
            });
            if (window.currentProductColors.length > 0 && selectedColorInput) {
                selectedColorInput.value = window.currentProductColors[0].name || '';
            }
        }
    } else {
        if (colorSelector) colorSelector.style.display = 'none';
        if (selectedColorInput) selectedColorInput.value = '';
    }

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    const lengthInput = document.getElementById('modal-length');
    const widthInput = document.getElementById('modal-width');
    const priceCalc = document.getElementById('modal-price-calculation');
    const confirmBtn = document.getElementById('confirm-add-to-cart');

    if (lengthInput) lengthInput.value = '';
    if (widthInput) widthInput.value = '';
    if (priceCalc) priceCalc.style.display = 'none';
    if (confirmBtn) confirmBtn.disabled = true;
};

window.closeDimensionsModal = function () {
    const modal = document.getElementById('dimensions-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
};

window.calculateModalPrice = function () {
    const length = parseFloat(document.getElementById('modal-length').value) || 0;
    const width = parseFloat(document.getElementById('modal-width').value) || 0;
    const priceCalculation = document.getElementById('modal-price-calculation');
    const dimensionsDisplay = document.getElementById('modal-dimensions-display');
    const surfaceArea = document.getElementById('modal-surface-area');
    const totalPrice = document.getElementById('modal-total-price');
    const confirmBtn = document.getElementById('confirm-add-to-cart');

    const modal = document.getElementById('dimensions-modal');
    const storedUnitPrice = modal ? parseFloat(modal.getAttribute('data-unit-price')) : 0;
    const finalUnitPrice = window.currentUnitPrice || window.unitPrice || storedUnitPrice || 0;

    const storedMaxWidth = modal ? parseFloat(modal.getAttribute('data-max-width')) : 0;
    const storedMaxHeight = modal ? parseFloat(modal.getAttribute('data-max-height')) : 0;
    const isSurMesure = window.currentIsSurMesure || (modal && modal.getAttribute('data-is-sur-mesure') === 'true');

    if (length > 0 && width > 0 && finalUnitPrice > 0) {
        if (isSurMesure && (window.currentMaxWidthCm || window.currentMaxHeightCm || storedMaxWidth || storedMaxHeight)) {
            const maxW = window.currentMaxWidthCm || storedMaxWidth;
            const maxH = window.currentMaxHeightCm || storedMaxHeight;

            if (maxW && length > maxW) {
                showNotification('La longueur maximale pour ce modèle est de ' + maxW + ' cm.', 'error');
                if (confirmBtn) confirmBtn.disabled = true;
                return;
            }
            if (maxH && width > maxH) {
                showNotification('La largeur maximale pour ce modèle est de ' + maxH + ' cm.', 'error');
                if (confirmBtn) confirmBtn.disabled = true;
                return;
            }
        }
        const surfaceM2 = (length * width) / 10000;
        const total = surfaceM2 * window.currentUnitPrice;

        if (dimensionsDisplay) dimensionsDisplay.textContent = Math.round(length) + ' cm × ' + Math.round(width) + ' cm';
        if (surfaceArea) surfaceArea.textContent = surfaceM2.toFixed(2).replace('.', ',') + ' m²';
        if (totalPrice) totalPrice.textContent = formatPrice(total);
        if (priceCalculation) priceCalculation.style.display = 'block';
        if (confirmBtn) confirmBtn.disabled = false;
    } else {
        if (priceCalculation) priceCalculation.style.display = 'none';
        if (confirmBtn) confirmBtn.disabled = true;
    }
};

function formatPriceFromJs(price) {
    return price.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' MAD';
}

// Fallback if formatPrice from PHP is not available in JS scope (it shouldn't be anyway)
if (typeof formatPrice !== 'function') {
    window.formatPrice = formatPriceFromJs;
}

window.handleAddToCartClickFromList = function (e, button) {
    e.preventDefault();
    e.stopPropagation();

    const productId = button.getAttribute('data-product-id');
    const typeCategory = button.getAttribute('data-type-category') || '';
    const unitPrice = parseFloat(button.getAttribute('data-unit-price')) || 0;
    const productColorsJson = button.getAttribute('data-product-colors') || '[]';
    const maxWidthCm = button.getAttribute('data-max-width') || '';
    const maxHeightCm = button.getAttribute('data-max-height') || '';

    let productColors = [];
    try {
        productColors = JSON.parse(productColorsJson);
    } catch (e) { }

    const lowerType = typeCategory.toLowerCase();
    const isAuthentique = lowerType === 'authentique' || lowerType === 'authentic';
    const isFixe = lowerType === 'fixe' || lowerType === 'fix';
    const isSurMesure = lowerType === 'sur_mesure' || lowerType === 'sur mesure';

    if (isAuthentique || isFixe) {
        addToCartDirectly(productId, productColors.length > 0 ? productColors[0].name : '');
    } else {
        window.openDimensionsModal(productId, unitPrice, productColors, maxWidthCm, maxHeightCm, isSurMesure);
    }
    return false;
};

window.handleAddToCartClick = function (e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }

    if (window.isAuthentique === true || window.isAuthentique === 'true') {
        addToCartDirectly(window.currentProductId, (window.currentProductColors && window.currentProductColors.length > 0) ? window.currentProductColors[0].name : '');
    } else {
        window.openDimensionsModal();
    }
    return false;
};

function addToCartDirectly(productId, color) {
    if (!productId) return;

    const formData = new FormData();
    formData.append('product_id', productId);
    formData.append('quantity', 1);
    if (color) formData.append('color', color);

    fetch('api/add_to_cart.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification(data.message, 'success');
                updateCartCount(data.cart_count);
            } else {
                showNotification(data.message || 'Erreur lors de l\'ajout au panier', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('Erreur lors de l\'ajout au panier', 'error');
        });
}

document.addEventListener('DOMContentLoaded', function () {
    const confirmBtn = document.getElementById('confirm-add-to-cart');
    if (confirmBtn && !confirmBtn.hasAttribute('data-custom-handler')) {
        confirmBtn.addEventListener('click', function () {
            const length = parseFloat(document.getElementById('modal-length').value) || 0;
            const width = parseFloat(document.getElementById('modal-width').value) || 0;
            const modal = document.getElementById('dimensions-modal');
            const productId = window.currentProductId || (modal ? modal.getAttribute('data-product-id') : null);
            const unitPrice = window.currentUnitPrice || window.unitPrice || (modal ? parseFloat(modal.getAttribute('data-unit-price')) : 0);
            const selectedColorInput = document.getElementById('modal-selected-color');
            const selectedColor = selectedColorInput ? selectedColorInput.value : '';

            const colorSelector = document.getElementById('modal-color-selector');
            if (colorSelector && colorSelector.style.display !== 'none' && !selectedColor) {
                showNotification('Veuillez sélectionner une couleur', 'error');
                return;
            }

            if (length <= 0 || width <= 0) {
                showNotification('Veuillez entrer des dimensions valides', 'error');
                return;
            }

            if (window.currentIsSurMesure && (window.currentMaxWidthCm || window.currentMaxHeightCm)) {
                if (window.currentMaxWidthCm && length > window.currentMaxWidthCm) {
                    showNotification('La longueur maximale pour ce modèle est de ' + window.currentMaxWidthCm + ' cm.', 'error');
                    return;
                }
                if (window.currentMaxHeightCm && width > window.currentMaxHeightCm) {
                    showNotification('La largeur maximale pour ce modèle est de ' + window.currentMaxHeightCm + ' cm.', 'error');
                    return;
                }
            }

            if (!productId || !unitPrice) return;

            const surfaceM2 = (length * width) / 10000;
            const calculatedPrice = surfaceM2 * unitPrice;

            const btn = this;
            btn.disabled = true;
            btn.textContent = 'Ajout en cours...';

            const quantityInput = document.getElementById('product-quantity');
            const quantity = quantityInput ? parseInt(quantityInput.value) : 1;

            const formData = new FormData();
            formData.append('product_id', productId);
            formData.append('quantity', quantity);
            formData.append('length', length);
            formData.append('width', width);
            formData.append('calculated_price', calculatedPrice);
            if (selectedColor) formData.append('color', selectedColor);

            fetch('api/add_to_cart.php', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        showNotification(data.message, 'success');
                        updateCartCount(data.cart_count);
                        window.closeDimensionsModal();
                    } else {
                        showNotification(data.message || 'Erreur lors de l\'ajout au panier', 'error');
                    }
                })
                .catch(error => {
                    showNotification('Erreur lors de l\'ajout au panier', 'error');
                })
                .finally(() => {
                    btn.disabled = false;
                    btn.textContent = 'Ajouter au panier';
                });
        });
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            window.closeDimensionsModal();
        }
    });
});

