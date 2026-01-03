// ===== 購物車與點餐系統（更新版：無運費、含付款方式）=====
// 所有函數掛載到 window 確保全域可用

// ===== 全域變數 =====
window.cart = [];
window.currentProduct = null;

// ===== 初始化購物車 =====
window.initShoppingCart = function() {
  const savedCart = localStorage.getItem('cart');
  window.cart = savedCart ? JSON.parse(savedCart) : [];
  window.updateCartCount();
  console.log('✅ 購物車已初始化，商品數量：', window.cart.length);
};

// ===== 更新購物車數量顯示 =====
window.updateCartCount = function() {
  const cartBadge = document.getElementById('cartBadge');
  const cartCountElements = document.querySelectorAll('.cart-count, .cart-badge');
  
  const totalItems = window.cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  
  if (cartBadge) {
    cartBadge.textContent = totalItems;
    cartBadge.style.display = totalItems > 0 ? 'inline-block' : 'none';
  }
  
  cartCountElements.forEach(element => {
    element.textContent = totalItems;
    element.style.display = totalItems > 0 ? 'inline-block' : 'none';
  });
};

// ===== 加入購物車（主函數）=====
window.addToCart = function(productId, skipModal = false) {
  console.log('🛒 加入購物車，商品 ID:', productId);
  
  const product = window.products ? window.products.find(p => p.id === productId) : null;
  
  if (!product) {
    console.error('找不到商品:', productId);
    if (typeof window.showError === 'function') {
      window.showError('找不到商品');
    } else {
      alert('找不到商品');
    }
    return;
  }
  
  if (product.customizable && !skipModal) {
    window.currentProduct = product;
    window.showCustomizationModal(product);
    return;
  }
  
  const cartItem = {
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    quantity: 1,
    addedAt: new Date().toISOString()
  };
  
  const existingIndex = window.cart.findIndex(item => 
    item.id === product.id && !item.options
  );
  
  if (existingIndex > -1) {
    window.cart[existingIndex].quantity += 1;
  } else {
    window.cart.push(cartItem);
  }
  
  localStorage.setItem('cart', JSON.stringify(window.cart));
  window.updateCartCount();
  
  if (typeof window.showSuccess === 'function') {
    window.showSuccess(`✅ ${product.name} 已加入購物車`);
  } else {
    alert(`${product.name} 已加入購物車`);
  }
  
  console.log('✅ 購物車已更新:', window.cart);
};

// ===== 顯示客製化 Modal =====
window.showCustomizationModal = function(product) {
  const modal = document.getElementById('customizationModal');
  if (!modal) {
    console.warn('找不到客製化 Modal，直接加入購物車');
    window.addToCart(product.id, true);
    return;
  }
  
  const modalTitle = modal.querySelector('.modal-title');
  const modalImage = modal.querySelector('.modal-product-image');
  const modalPrice = modal.querySelector('.modal-product-price');
  
  if (modalTitle) modalTitle.textContent = product.name;
  if (modalImage) modalImage.src = product.image;
  if (modalPrice) modalPrice.textContent = `$${product.price}`;
  
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
};

// ===== 關閉客製化 Modal =====
window.closeCustomizationModal = function() {
  const modal = document.getElementById('customizationModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
  window.currentProduct = null;
};

// ===== 確認客製化並加入購物車 =====
window.confirmCustomization = function() {
  if (!window.currentProduct) {
    console.error('沒有選擇商品');
    return;
  }
  
  const sweetness = document.querySelector('input[name="sweetness"]:checked');
  const ice = document.querySelector('input[name="ice"]:checked');
  const extras = Array.from(document.querySelectorAll('input[name="extras"]:checked'));
  
  const cartItem = {
    id: window.currentProduct.id,
    name: window.currentProduct.name,
    price: window.currentProduct.price,
    image: window.currentProduct.image,
    quantity: 1,
    options: {
      sweetness: sweetness ? sweetness.value : '正常糖',
      ice: ice ? ice.value : '正常冰',
      extras: extras.map(e => ({
        name: e.value,
        price: parseInt(e.dataset.price) || 0
      }))
    },
    addedAt: new Date().toISOString()
  };
  
  window.cart.push(cartItem);
  localStorage.setItem('cart', JSON.stringify(window.cart));
  window.updateCartCount();
  window.closeCustomizationModal();
  
  if (typeof window.showSuccess === 'function') {
    window.showSuccess(`✅ ${window.currentProduct.name} 已加入購物車`);
  } else {
    alert(`${window.currentProduct.name} 已加入購物車`);
  }
  
  console.log('✅ 購物車已更新（含客製化）:', window.cart);
};

// ===== 渲染購物車項目（美化卡片版）=====
window.renderCartItems = function() {
  const cartItemsContainer = document.getElementById('cartItems');
  const emptyCartMessage = document.getElementById('emptyCart');
  const cartSummary = document.getElementById('cartSummary');
  const mobileFooter = document.getElementById('mobileCheckoutFooter');
  const cartItemsCount = document.getElementById('cartItemsCount');
  
  if (!cartItemsContainer) {
    console.error('找不到 cartItems 容器');
    return;
  }
  
  window.cart = JSON.parse(localStorage.getItem('cart') || '[]');
  
  if (window.cart.length === 0) {
    if (emptyCartMessage) emptyCartMessage.style.display = 'block';
    if (cartSummary) cartSummary.style.display = 'none';
    if (mobileFooter) mobileFooter.style.display = 'none';
    cartItemsContainer.innerHTML = '';
    return;
  }
  
  if (emptyCartMessage) emptyCartMessage.style.display = 'none';
  if (cartSummary) cartSummary.style.display = 'block';
  if (mobileFooter) mobileFooter.style.display = 'block';
  
  // 更新商品數量標題
  if (cartItemsCount) {
    const totalItems = window.cart.reduce((sum, item) => sum + item.quantity, 0);
    cartItemsCount.textContent = `您的餐點 (${totalItems} 項)`;
  }
  
  // 渲染卡片式商品列表
  cartItemsContainer.innerHTML = window.cart.map((item, index) => {
    let itemTotal = item.price * item.quantity;
    
    // 計算加料金額
    let extrasHTML = '';
    if (item.options && item.options.extras && item.options.extras.length > 0) {
      extrasHTML = '<div class="cart-item-extras">';
      item.options.extras.forEach(extra => {
        itemTotal += extra.price * item.quantity;
        extrasHTML += `<span class="cart-item-extra">+ ${extra.name} (+$${extra.price})</span>`;
      });
      extrasHTML += '</div>';
    }
    
    // 顯示客製化選項
    let optionsHTML = '';
    if (item.options) {
      optionsHTML = `
        <div class="cart-item-options">
          ${item.options.sweetness || ''} ${item.options.ice || ''}
        </div>
      `;
    }
    
    return `
      <div class="cart-item">
        <img src="${item.image || 'images/default.jpg'}" alt="${item.name}" class="cart-item-image">
        
        <div class="cart-item-details">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">單價 $${item.price}</div>
          ${optionsHTML}
          ${extrasHTML}
          
          <!-- 數量控制器 -->
          <div class="quantity-control">
            <button onclick="window.updateItemQuantity(${index}, -1)" class="quantity-btn" title="減少數量">−</button>
            <span class="quantity-display">${item.quantity}</span>
            <button onclick="window.updateItemQuantity(${index}, 1)" class="quantity-btn" title="增加數量">+</button>
          </div>
        </div>
        
        <div class="cart-item-actions">
          <div class="cart-item-total">$${itemTotal}</div>
          <button onclick="window.removeFromCart(${index})" class="remove-btn" title="移除商品">
            🗑️ 刪除
          </button>
        </div>
      </div>
    `;
  }).join('');
  
  window.calculateTotal();
};

// ===== 更新商品數量（數量增減器）=====
window.updateItemQuantity = function(index, change) {
  if (index < 0 || index >= window.cart.length) {
    console.error('無效的商品索引:', index);
    return;
  }
  
  const newQuantity = window.cart[index].quantity + change;
  
  // 如果減到 0，詢問是否刪除
  if (newQuantity <= 0) {
    const productName = window.cart[index].name;
    
    if (typeof window.showConfirm === 'function') {
      window.showConfirm(
        `確定要從購物車移除「${productName}」嗎？`,
        () => {
          window.cart.splice(index, 1);
          localStorage.setItem('cart', JSON.stringify(window.cart));
          window.renderCartItems();
          window.updateCartCount();
          if (typeof window.showSuccess === 'function') {
            window.showSuccess('商品已移除');
          }
        }
      );
    } else {
      if (confirm(`確定要從購物車移除「${productName}」嗎？`)) {
        window.cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(window.cart));
        window.renderCartItems();
        window.updateCartCount();
        alert('商品已移除');
      }
    }
    return;
  }
  
  // 更新數量
  window.cart[index].quantity = newQuantity;
  localStorage.setItem('cart', JSON.stringify(window.cart));
  window.renderCartItems();
  window.updateCartCount();
};

// ===== 移除商品 =====
window.removeFromCart = function(index) {
  if (index < 0 || index >= window.cart.length) {
    console.error('無效的商品索引:', index);
    return;
  }
  
  const productName = window.cart[index].name;
  
  const doDelete = () => {
    window.cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(window.cart));
    window.renderCartItems();
    window.updateCartCount();
    
    if (typeof window.showSuccess === 'function') {
      window.showSuccess('商品已移除');
    }
  };
  
  if (typeof window.showConfirm === 'function') {
    window.showConfirm(`確定要移除「${productName}」嗎？`, doDelete);
  } else {
    if (confirm(`確定要移除「${productName}」嗎？`)) {
      doDelete();
    }
  }
};

// ===== 計算總金額（含折價券，無運費）=====
window.calculateTotal = function() {
  let subtotal = 0;
  
  window.cart.forEach(item => {
    let itemTotal = item.price * item.quantity;
    
    if (item.options && item.options.extras) {
      item.options.extras.forEach(extra => {
        itemTotal += extra.price * item.quantity;
      });
    }
    
    subtotal += itemTotal;
  });
  
  // 折價券折扣
  let discount = 0;
  const couponSelect = document.getElementById('couponSelect');
  
  if (couponSelect && couponSelect.value) {
    const couponCode = couponSelect.value;
    const coupons = JSON.parse(localStorage.getItem('coupons') || '[]');
    const coupon = coupons.find(c => c.code === couponCode && c.active);
    
    if (coupon) {
      if (subtotal >= coupon.minAmount) {
        if (coupon.type === 'percent') {
          discount = Math.round(subtotal * (1 - coupon.discount));
        } else if (coupon.type === 'fixed') {
          discount = coupon.discount;
        }
        
        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
          discount = coupon.maxDiscount;
        }
      }
    }
  }
  
  // 總金額 = 小計 - 折扣（無運費）
  const finalTotal = subtotal - discount;
  
  // 更新桌面版顯示
  const subtotalElement = document.getElementById('cartSubtotal');
  const discountElement = document.getElementById('discountAmount');
  const totalElement = document.getElementById('cartTotal');
  const discountInfo = document.getElementById('discountInfo');
  
  if (subtotalElement) subtotalElement.textContent = '$' + subtotal;
  if (totalElement) totalElement.textContent = '$' + finalTotal;
  
  if (discount > 0) {
    if (discountInfo) discountInfo.style.display = 'block';
    if (discountElement) discountElement.textContent = '-$' + discount;
    const originalPrice = document.getElementById('originalPrice');
    if (originalPrice) originalPrice.textContent = '$' + subtotal;
  } else {
    if (discountInfo) discountInfo.style.display = 'none';
  }
  
  // 更新手機版底部總金額
  const mobileTotal = document.getElementById('mobileCartTotal');
  if (mobileTotal) {
    mobileTotal.textContent = '$' + finalTotal;
  }
};

// ===== 載入可用折價券 =====
window.loadAvailableCoupons = function() {
  const couponSelect = document.getElementById('couponSelect');
  if (!couponSelect) return;
  
  const currentUser = typeof window.getCurrentUser === 'function' 
    ? window.getCurrentUser() 
    : JSON.parse(localStorage.getItem('currentUser') || 'null');
  
  if (!currentUser) {
    couponSelect.innerHTML = '<option value="">請先登入以使用折價券</option>';
    couponSelect.disabled = true;
    return;
  }
  
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => u.email === currentUser.email);
  
  if (!user || !user.coupons) {
    couponSelect.innerHTML = '<option value="">沒有可用的折價券</option>';
    return;
  }
  
  const allCoupons = JSON.parse(localStorage.getItem('coupons') || '[]');
  
  const availableCoupons = user.coupons
    .filter(uc => !uc.used)
    .map(uc => allCoupons.find(c => c.code === uc.code && c.active))
    .filter(c => c !== null && c !== undefined);
  
  couponSelect.innerHTML = '<option value="">不使用折價券</option>';
  
  availableCoupons.forEach(coupon => {
    const option = document.createElement('option');
    option.value = coupon.code;
    const discountText = coupon.type === 'percent' 
      ? `${Math.round((1 - coupon.discount) * 100)}% OFF` 
      : `折 $${coupon.discount}`;
    option.textContent = `${coupon.title} - ${discountText}`;
    couponSelect.appendChild(option);
  });
};

// ===== 結帳（含付款方式、無運費）=====
window.checkout = function() {
  console.log('🛒 開始結帳流程');
  
  const currentUser = typeof window.getCurrentUser === 'function' 
    ? window.getCurrentUser() 
    : JSON.parse(localStorage.getItem('currentUser') || 'null');
  
  if (!currentUser) {
    if (typeof window.showError === 'function') {
      window.showError('請先登入');
    } else {
      alert('請先登入');
    }
    localStorage.setItem('redirectAfterLogin', 'cart.html');
    setTimeout(() => window.location.href = 'login.html', 1500);
    return;
  }
  
  if (window.cart.length === 0) {
    if (typeof window.showError === 'function') {
      window.showError('購物車是空的');
    } else {
      alert('購物車是空的');
    }
    return;
  }
  
  // 獲取付款方式
  const paymentMethodInput = document.querySelector('input[name="paymentMethod"]:checked');
  const paymentMethod = paymentMethodInput ? paymentMethodInput.value : 'cash';
  
  console.log('💳 選擇的付款方式:', paymentMethod);
  
  const orderOptions = JSON.parse(localStorage.getItem('orderOptions') || '{}');
  
  if (!orderOptions.store) {
    if (typeof window.showError === 'function') {
      window.showError('請選擇取餐門市');
    } else {
      alert('請選擇取餐門市');
    }
    window.location.href = 'menu.html';
    return;
  }
  
  // 計算金額（無運費）
  let subtotal = 0;
  window.cart.forEach(item => {
    let itemTotal = item.price * item.quantity;
    if (item.options && item.options.extras) {
      item.options.extras.forEach(extra => {
        itemTotal += extra.price * item.quantity;
      });
    }
    subtotal += itemTotal;
  });
  
  // 折價券
  let discount = 0;
  let couponCode = null;
  const couponSelect = document.getElementById('couponSelect');
  
  if (couponSelect && couponSelect.value) {
    couponCode = couponSelect.value;
    const coupons = JSON.parse(localStorage.getItem('coupons') || '[]');
    const coupon = coupons.find(c => c.code === couponCode);
    
    if (coupon) {
      if (coupon.type === 'percent') {
        discount = Math.round(subtotal * (1 - coupon.discount));
      } else {
        discount = coupon.discount;
      }
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    }
  }
  
  // 總金額 = 小計 - 折扣（無運費）
  const finalTotal = subtotal - discount;
  
  // 建立訂單（含付款方式）
  const order = {
    id: 'ORD-' + Date.now(),
    customerEmail: currentUser.email,
    customerName: currentUser.name,
    items: window.cart,
    store: orderOptions.store,
    diningOption: orderOptions.diningOption,
    tableNumber: orderOptions.tableNumber || null,
    pickupType: orderOptions.pickupType || 'now',
    pickupDate: orderOptions.pickupDate || null,
    pickupTime: orderOptions.pickupTime || null,
    subtotal: subtotal,
    discount: discount,
    couponCode: couponCode,
    total: finalTotal,
    paymentMethod: paymentMethod, // 新增：付款方式
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  console.log('📦 訂單資料:', order);
  
  // 儲存訂單
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  orders.push(order);
  localStorage.setItem('orders', JSON.stringify(orders));
  
  // 標記折價券為已使用
  if (couponCode) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    
    if (userIndex !== -1 && users[userIndex].coupons) {
      const couponIndex = users[userIndex].coupons.findIndex(
        c => c.code === couponCode && !c.used
      );
      
      if (couponIndex !== -1) {
        users[userIndex].coupons[couponIndex].used = true;
        users[userIndex].coupons[couponIndex].usedAt = new Date().toISOString();
        users[userIndex].coupons[couponIndex].orderId = order.id;
        localStorage.setItem('users', JSON.stringify(users));
      }
    }
  }
  
  // 清空購物車
  window.cart = [];
  localStorage.setItem('cart', '[]');
  
  if (typeof window.showSuccess === 'function') {
    window.showSuccess('✅ 訂單已成功送出！');
  } else {
    alert('訂單已成功送出！');
  }
  
  setTimeout(() => {
    window.location.href = 'checkout.html?orderId=' + order.id;
  }, 1000);
};

// ===== 更新導覽列用戶顯示 =====
window.updateNavbarUser = function() {
  const navbarUserLink = document.getElementById('navbarUserLink');
  if (!navbarUserLink) return;
  
  const currentUser = typeof window.getCurrentUser === 'function' 
    ? window.getCurrentUser() 
    : JSON.parse(localStorage.getItem('currentUser') || 'null');
  
  if (currentUser) {
    navbarUserLink.textContent = `👤 ${currentUser.name}`;
    navbarUserLink.href = 'profile.html';
  } else {
    navbarUserLink.textContent = '🔐 登入 / 註冊';
    navbarUserLink.href = 'login.html';
  }
};

// ===== 頁面載入時初始化 =====
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', window.initShoppingCart);
} else {
  window.initShoppingCart();
}

console.log('✅ Shop.js loaded - 更新版購物車系統（無運費、含付款方式）');