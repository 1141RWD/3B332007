a// 購物車頁面 JavaScript

// ===== 導覽列功能 =====
const navbarToggle = document.getElementById('navbarToggle');
const navbarMenu = document.getElementById('navbarMenu');

if (navbarToggle) {
  navbarToggle.addEventListener('click', () => {
    navbarToggle.classList.toggle('active');
    navbarMenu.classList.toggle('active');
  });
}

const navbarLinks = document.querySelectorAll('.navbar-link');
navbarLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      navbarToggle.classList.remove('active');
      navbarMenu.classList.remove('active');
    }
  });
});

// ===== 更新購物車徽章 =====
function updateCartBadge() {
  const cart = getCart();
  const cartBadge = document.getElementById('cartBadge');
  
  if (cartBadge) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalItems;
    cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
  }
}

// ===== 滾動效果 =====
let lastScroll = 0;
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 100) {
    navbar.style.boxShadow = '0 4px 20px rgba(255, 107, 53, 0.2)';
  } else {
    navbar.style.boxShadow = '0 4px 16px rgba(255, 107, 53, 0.15)';
  }
  
  lastScroll = currentScroll;
});

// ===== localStorage 工具函數 =====
function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartBadge();
  renderCart();
}

// ===== 計算小計 =====
function calculateItemTotal(item) {
  let total = item.price * item.quantity;
  
  // 加上加購項目的價格
  if (item.options && item.options.extras && item.options.extras.length > 0) {
    item.options.extras.forEach(extra => {
      total += extra.price * item.quantity;
    });
  }
  
  return total;
}

// ===== 計算訂單總計 =====
function calculateOrderTotal() {
  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  
  // 外送費計算
  let deliveryFee = 0;
  if (subtotal > 0 && subtotal < storeInfo.delivery.freeDeliveryOver) {
    deliveryFee = storeInfo.delivery.fee;
  }
  
  const total = subtotal + deliveryFee;
  
  return { subtotal, deliveryFee, total };
}

// ===== 更新商品數量 =====
function updateQuantity(index, change) {
  const cart = getCart();
  
  if (cart[index]) {
    cart[index].quantity += change;
    
    // 如果數量小於 1，移除商品
    if (cart[index].quantity < 1) {
      removeItem(index);
      return;
    }
    
    saveCart(cart);
  }
}

// ===== 移除商品 =====
function removeItem(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  showMessage('商品已移除');
}

// ===== 清空購物車 =====
function clearCart() {
  if (confirm('確定要清空購物車嗎？')) {
    localStorage.removeItem('cart');
    updateCartBadge();
    renderCart();
    showMessage('購物車已清空');
  }
}

// ===== 顯示訊息 =====
function showMessage(message) {
  const messageEl = document.getElementById('successMessage');
  messageEl.textContent = message;
  messageEl.classList.add('show');
  
  setTimeout(() => {
    messageEl.classList.remove('show');
  }, 2000);
}

// ===== 渲染購物車 =====
function renderCart() {
  const cart = getCart();
  const cartContent = document.getElementById('cartContent');
  
  // 如果購物車為空
  if (cart.length === 0) {
    cartContent.innerHTML = `
      <div class="empty-cart fade-in">
        <div class="empty-cart-icon">🛒</div>
        <h2 class="empty-cart-title">購物車是空的</h2>
        <p class="empty-cart-text">
          還沒有選購商品嗎？快去看看我們的美味早餐吧！
        </p>
        <a href="menu.html" class="btn btn-primary">開始點餐</a>
      </div>
    `;
    return;
  }
  
  // 計算總計
  const { subtotal, deliveryFee, total } = calculateOrderTotal();
  
  // 渲染購物車項目
  cartContent.innerHTML = `
    <div class="cart-container">
      <!-- 購物車項目列表 -->
      <div class="cart-items-section fade-in">
        <div class="cart-header">
          <h2 class="cart-title">購物清單 (${cart.length} 項商品)</h2>
          <button class="clear-cart-btn" onclick="clearCart()">🗑️ 清空購物車</button>
        </div>
        
        <div class="cart-items">
          ${cart.map((item, index) => renderCartItem(item, index)).join('')}
        </div>
      </div>
      
      <!-- 訂單摘要 -->
      <div class="order-summary fade-in">
        <h3 class="summary-title">訂單摘要</h3>
        
        <div class="summary-row">
          <span class="summary-label">商品小計</span>
          <span class="summary-value">$${subtotal}</span>
        </div>
        
        <div class="summary-row">
          <span class="summary-label">外送費</span>
          <span class="summary-value">${deliveryFee > 0 ? '$' + deliveryFee : '免費'}</span>
        </div>
        
        ${subtotal > 0 && subtotal < storeInfo.delivery.freeDeliveryOver ? `
          <div class="delivery-note">
            💡 再消費 $${storeInfo.delivery.freeDeliveryOver - subtotal} 即可享免運費
          </div>
        ` : subtotal >= storeInfo.delivery.freeDeliveryOver ? `
          <div class="delivery-note">
            ✓ 已達免運門檻，享免費外送
          </div>
        ` : ''}
        
        <div class="summary-divider"></div>
        
        <div class="summary-total">
          <span>總計</span>
          <span>$${total}</span>
        </div>
        
        <button class="checkout-btn" onclick="checkout()" ${subtotal < storeInfo.delivery.minOrder ? 'disabled' : ''}>
          ${subtotal < storeInfo.delivery.minOrder 
            ? `最低消費 $${storeInfo.delivery.minOrder}` 
            : '💳 前往結帳'}
        </button>
        
        <button class="continue-shopping-btn" onclick="location.href='menu.html'">
          ← 繼續購物
        </button>
      </div>
    </div>
  `;
}

// ===== 渲染單個購物車項目 =====
function renderCartItem(item, index) {
  const itemTotal = calculateItemTotal(item);
  
  // 格式化選項顯示
  let optionsHTML = '';
  
  if (item.options) {
    // 加購項目
    if (item.options.extras && item.options.extras.length > 0) {
      optionsHTML += `
        <span class="cart-item-option">
          🍳 加購：${item.options.extras.map(e => e.name).join('、')}
        </span>
      `;
    }
    
    // 飲料選項
    if (item.options.sweetness) {
      optionsHTML += `
        <span class="cart-item-option">
          🍯 甜度：${item.options.sweetness}
        </span>
      `;
    }
    
    if (item.options.ice) {
      optionsHTML += `
        <span class="cart-item-option">
          🧊 冰塊：${item.options.ice}
        </span>
      `;
    }
  }
  
  return `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-image">
      
      <div class="cart-item-info">
        <div>
          <h3 class="cart-item-name">${item.name}</h3>
          <span class="cart-item-category">${item.category}</span>
        </div>
        
        ${optionsHTML ? `
          <div class="cart-item-options">
            ${optionsHTML}
          </div>
        ` : ''}
      </div>
      
      <div class="cart-item-controls">
        <div class="cart-item-price">$${itemTotal}</div>
        
        <div class="cart-item-quantity">
          <button class="qty-btn" onclick="updateQuantity(${index}, -1)">−</button>
          <span class="qty-value">${item.quantity}</span>
          <button class="qty-btn" onclick="updateQuantity(${index}, 1)">+</button>
        </div>
        
        <button class="remove-item-btn" onclick="removeItem(${index})">
          🗑️ 移除
        </button>
      </div>
    </div>
  `;
}

// ===== 結帳功能 =====
function checkout() {
  const cart = getCart();
  const { total } = calculateOrderTotal();
  
  if (cart.length === 0) {
    alert('購物車是空的！');
    return;
  }
  
  // 檢查是否已登入
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  
  if (!currentUser) {
    if (confirm('請先登入才能結帳。是否前往登入頁面？')) {
      // 儲存當前頁面，登入後返回
      localStorage.setItem('redirectAfterLogin', 'cart.html');
      location.href = 'login.html';
    }
    return;
  }
  
  // 建立訂單
  const order = {
    id: 'ORDER-' + Date.now(),
    userId: currentUser.email,
    items: cart,
    total: total,
    status: '處理中',
    date: new Date().toISOString(),
    deliveryAddress: currentUser.address || '台中市西區美村路一段123號'
  };
  
  // 儲存訂單到訂單歷史
  let orders = JSON.parse(localStorage.getItem('orders')) || [];
  orders.unshift(order); // 加到最前面
  localStorage.setItem('orders', JSON.stringify(orders));
  
  // 清空購物車
  localStorage.removeItem('cart');
  updateCartBadge();
  
  // 顯示成功訊息並跳轉
  alert(`訂單建立成功！\n訂單編號：${order.id}\n總金額：$${total}\n\n感謝您的訂購，我們將盡快為您準備餐點！`);
  location.href = 'profile.html';
}

// ===== 頁面載入時執行 =====
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  renderCart();
  
  // 設定當前頁面的導覽連結為 active
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navbarLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });
});