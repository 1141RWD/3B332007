// 會員中心頁面 JavaScript

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
  link.addEventListener('click', (e) => {
    // 如果點擊的是下拉選單項目或用戶選單，不關閉導覽列
    if (e.target.closest('.user-menu') || e.target.closest('.user-dropdown') || e.target.closest('.dropdown-item')) {
      return;
    }
    if (window.innerWidth <= 768) {
      navbarToggle.classList.remove('active');
      navbarMenu.classList.remove('active');
    }
  });
});

// ===== 更新購物車徽章 =====
function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
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

// ===== 檢查登入狀態 =====
function checkLoginStatus() {
  let currentUser = null;
  
  if (typeof window.getCurrentUser === 'function') {
    currentUser = window.getCurrentUser();
  } else {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        currentUser = JSON.parse(savedUser);
      } catch (e) {
        console.error('解析用戶資料失敗', e);
      }
    }
  }
  
  if (!currentUser) {
    if (typeof window.showError === 'function') {
      window.showError('請先登入才能訪問會員中心');
    } else if (typeof window.showToast === 'function') {
      window.showToast('請先登入才能訪問會員中心', 'error');
    }
    setTimeout(() => {
      location.href = 'login.html';
    }, 1500);
    return null;
  }
  
  return currentUser;
}

// ===== 取得使用者訂單（過濾當前用戶的訂單）=====
function getUserOrders(userEmail) {
  const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
  
  // 過濾出屬於當前用戶的訂單（支援多種欄位名稱）
  return allOrders.filter(order => {
    return order.userEmail === userEmail || 
           order.customerEmail === userEmail ||
           order.userId === userEmail;
  }).sort((a, b) => {
    // 按時間倒序排列（最新的在前）
    const dateA = new Date(a.createdAt || a.date || 0);
    const dateB = new Date(b.createdAt || b.date || 0);
    return dateB - dateA;
  });
}

// ===== 格式化日期 =====
function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}/${month}/${day} ${hours}:${minutes}`;
}

// ===== 切換分頁 =====
function switchSection(sectionName) {
  // 切換選單
  document.querySelectorAll('.profile-menu-link').forEach(link => {
    link.classList.remove('active');
    if (link.dataset.section === sectionName) {
      link.classList.add('active');
    }
  });
  
  // 切換內容
  document.querySelectorAll('.profile-section').forEach(section => {
    section.classList.remove('active');
    if (section.id === `${sectionName}Section`) {
      section.classList.add('active');
    }
  });
  
  // 如果是點數或折價券頁面，重新渲染
  if (sectionName === 'points') {
    const user = checkLoginStatus();
    if (user) {
      setTimeout(() => {
        renderCouponExchange(user);
      }, 100);
    }
  } else if (sectionName === 'coupons') {
    const user = checkLoginStatus();
    if (user) {
      setTimeout(() => {
        renderMyCoupons(user);
      }, 100);
    }
  }
}

// ===== 渲染訂單列表（優化版）=====
function renderOrders(orders) {
  if (orders.length === 0) {
    return `
      <div class="empty-state">
        <div class="empty-icon">📦</div>
        <h3>尚無訂單記錄</h3>
        <p>快去選購美味早餐吧！</p>
        <a href="menu.html" class="btn btn-primary" style="margin-top: 1rem;">立即點餐</a>
      </div>
    `;
  }
  
  return `
    <div class="orders-list">
      ${orders.map(order => {
        const orderDate = order.createdAt || order.date || new Date().toISOString();
        const statusText = getStatusText(order.status);
        const statusClass = getStatusClass(order.status);
        
        return `
        <div class="order-card">
          <div class="order-header">
            <div>
              <div class="order-id">訂單編號：${order.id}</div>
              <div class="order-date">下單時間：${formatDate(orderDate)}</div>
              ${order.store ? `<div style="color: var(--dark-gray); font-size: 0.9rem; margin-top: 0.3rem;">📍 ${order.store}</div>` : ''}
            </div>
            <span class="order-status ${statusClass}">
              ${statusText}
            </span>
          </div>
          
          <div class="order-items">
            ${(order.items || []).map(item => {
              const itemTotal = (item.price || 0) * (item.quantity || 1);
              let extrasText = '';
              
              if (item.options && item.options.extras && Array.isArray(item.options.extras)) {
                extrasText = item.options.extras.map(e => e.name).join(', ');
              }
              
              return `
              <div class="order-item">
                <div>
                  <span>${item.name || '未命名商品'} x ${item.quantity || 1}</span>
                  ${extrasText ? `<div style="font-size: 0.85rem; color: var(--dark-gray); margin-top: 0.2rem;">加料：${extrasText}</div>` : ''}
                  ${item.options?.sweetness ? `<div style="font-size: 0.85rem; color: var(--dark-gray);">糖度：${item.options.sweetness}</div>` : ''}
                  ${item.options?.ice ? `<div style="font-size: 0.85rem; color: var(--dark-gray);">冰塊：${item.options.ice}</div>` : ''}
                  ${item.note ? `<div style="font-size: 0.85rem; color: var(--primary-orange); margin-top: 0.2rem; font-weight: 600;">📝 備註：${item.note}</div>` : ''}
                </div>
                <span>$${itemTotal}</span>
              </div>
            `;
            }).join('')}
          </div>
          
          <div class="order-footer">
            <div>
              ${order.diningOption === 'dine-in' ? `<span>🍽️ 內用${order.tableNumber ? ' - ' + order.tableNumber : ''}</span>` : '<span>📦 外帶</span>'}
              ${order.paymentMethod ? `<span style="margin-left: 1rem;">💳 ${getPaymentMethodText(order.paymentMethod)}</span>` : ''}
            </div>
            <div class="order-total">總計 $${order.total || order.subtotal || 0}</div>
          </div>
        </div>
      `;
      }).join('')}
    </div>
  `;
}

// ===== 獲取狀態文字 =====
function getStatusText(status) {
  const statusMap = {
    'pending': '待處理',
    'processing': '製作中',
    'completed': '已完成',
    'cancelled': '已取消',
    '處理中': '處理中',
    '已完成': '已完成',
    '已取消': '已取消'
  };
  return statusMap[status] || status || '待處理';
}

// ===== 獲取狀態樣式類別 =====
function getStatusClass(status) {
  if (status === 'pending' || status === '處理中') return 'processing';
  if (status === 'completed' || status === '已完成') return 'completed';
  if (status === 'cancelled' || status === '已取消') return 'cancelled';
  return 'processing';
}

// ===== 獲取付款方式文字 =====
function getPaymentMethodText(method) {
  const methodMap = {
    'cash': '現金',
    'card': '信用卡',
    'line': 'LINE Pay',
    'mobile': '行動支付'
  };
  return methodMap[method] || method || '現金';
}

// ===== 渲染個人資料表單 =====
function renderProfileForm(user) {
  return `
    <form class="profile-form" id="profileForm">
      <div class="form-group">
        <label class="form-label" for="userName">姓名</label>
        <input 
          type="text" 
          id="userName" 
          class="form-input"
          value="${user.name}"
          required
        >
      </div>
      
      <div class="form-group">
        <label class="form-label" for="userEmail">電子郵件</label>
        <input 
          type="email" 
          id="userEmail" 
          class="form-input"
          value="${user.email}"
          disabled
        >
        <small style="color: var(--dark-gray); font-size: 0.85rem;">電子郵件無法修改</small>
      </div>
      
      <div class="form-group">
        <label class="form-label" for="userPhone">手機號碼</label>
        <input 
          type="tel" 
          id="userPhone" 
          class="form-input"
          value="${user.phone}"
          required
        >
      </div>
      
      <div class="form-group">
        <label class="form-label" for="userAddress">配送地址</label>
        <input 
          type="text" 
          id="userAddress" 
          class="form-input"
          value="${user.address || ''}"
          placeholder="請輸入配送地址"
        >
      </div>
      
      <button type="submit" class="save-btn">💾 儲存變更</button>
    </form>
  `;
}

// ===== 渲染會員中心 =====
function renderProfile() {
  const user = checkLoginStatus();
  if (!user) return;
  
  // 使用 user.email 過濾訂單
  const orders = getUserOrders(user.email);
  const profileContent = document.getElementById('profileContent');
  
  profileContent.innerHTML = `
    <div class="profile-container">
      <!-- 側邊欄 -->
      <aside class="profile-sidebar fade-in">
        <div class="profile-avatar">👤</div>
        <div class="profile-name">${user.name}</div>
        <div class="profile-email">${user.email}</div>
        
        <div class="profile-stats">
          <div class="stat-item">
            <div class="stat-value">${orders.length}</div>
            <div class="stat-label">訂單數</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${user.points || 0}</div>
            <div class="stat-label">點數</div>
          </div>
        </div>
        
        <ul class="profile-menu">
          <li class="profile-menu-item">
            <a href="#" class="profile-menu-link active" data-section="orders" onclick="switchSection('orders'); return false;">
              📦 訂單記錄
            </a>
          </li>
          <li class="profile-menu-item">
            <a href="#" class="profile-menu-link" data-section="profile" onclick="switchSection('profile'); return false;">
              👤 個人資料
            </a>
          </li>
          <li class="profile-menu-item">
            <a href="#" class="profile-menu-link" data-section="points" onclick="switchSection('points'); return false;">
              ⭐ 會員點數
            </a>
          </li>
          <li class="profile-menu-item">
            <a href="#" class="profile-menu-link" data-section="coupons" onclick="switchSection('coupons'); return false;">
              🎟️ 我的折價券
            </a>
          </li>
        </ul>
        
        <button class="logout-btn" onclick="logout()">🚪 登出</button>
      </aside>
      
      <!-- 主要內容 -->
      <div class="profile-main fade-in">
        <!-- 訂單記錄 -->
        <section class="profile-section active" id="ordersSection">
          <div class="section-header">
            <h2 class="section-title-main">📦 訂單記錄</h2>
          </div>
          ${renderOrders(orders)}
        </section>
        
        <!-- 個人資料 -->
        <section class="profile-section" id="profileSection">
          <div class="section-header">
            <h2 class="section-title-main">👤 個人資料</h2>
          </div>
          ${renderProfileForm(user)}
        </section>
        
        <!-- 會員點數 -->
        <section class="profile-section" id="pointsSection">
          <div class="section-header">
            <h2 class="section-title-main">⭐ 會員點數</h2>
          </div>
          <div style="text-align: center; padding: 2rem;">
            <div style="font-size: 5rem; margin-bottom: 1rem;">⭐</div>
            <div style="font-size: 3rem; font-weight: 700; color: var(--primary-orange); margin-bottom: 1rem;">
              ${user.points || 0} 點
            </div>
            <p style="color: var(--dark-gray); margin-bottom: 2rem;">
              每消費 $100 可獲得 1 點<br>
              累積點數可兌換專屬優惠
            </p>
          </div>
          
          <!-- 點數兌換專區 -->
          <div style="margin-top: 2rem; padding: 1.5rem; background: var(--soft-peach); border-radius: var(--radius-md);">
            <h3 style="margin-top: 0; margin-bottom: 1rem; color: var(--text-dark);">🎁 點數兌換專區</h3>
            <div id="couponExchangeList" style="display: grid; gap: 1rem;">
              <!-- 由 JavaScript 動態生成 -->
            </div>
          </div>
        </section>
        
        <!-- 我的折價券 -->
        <section class="profile-section" id="couponsSection">
          <div class="section-header">
            <h2 class="section-title-main">🎟️ 我的折價券</h2>
          </div>
          <div id="myCouponsList" style="display: grid; gap: 1rem;">
            <!-- 由 JavaScript 動態生成 -->
          </div>
        </section>
      </div>
    </div>
  `;
  
  // 設定個人資料表單提交事件
  setupProfileFormSubmit(user);
  
  // 初始化點數兌換和我的折價券
  setTimeout(() => {
    renderCouponExchange(user);
    renderMyCoupons(user);
  }, 100);
}

// ===== 設定個人資料表單提交 =====
function setupProfileFormSubmit(user) {
  const form = document.getElementById('profileForm');
  
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const updatedUser = {
        ...user,
        name: document.getElementById('userName').value.trim(),
        phone: document.getElementById('userPhone').value.trim(),
        address: document.getElementById('userAddress').value.trim()
      };
      
      // 更新使用者資料
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const userIndex = users.findIndex(u => u.email === user.email);
      
      if (userIndex > -1) {
        users[userIndex] = updatedUser;
        localStorage.setItem('users', JSON.stringify(users));
      }
      
      // 更新當前使用者
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      if (typeof window.showSuccess === 'function') {
        window.showSuccess('個人資料已更新！');
      } else if (typeof window.showToast === 'function') {
        window.showToast('個人資料已更新！', 'success');
      }
      renderProfile(); // 重新渲染
    });
  }
}

// ===== 登出功能 =====
function logout() {
  if (typeof window.showConfirm === 'function') {
    window.showConfirm('確定要登出嗎？', () => {
      localStorage.removeItem('currentUser');
      if (typeof window.showSuccess === 'function') {
        window.showSuccess('已登出，期待下次再見！');
      } else if (typeof window.showToast === 'function') {
        window.showToast('已登出，期待下次再見！', 'success');
      }
      setTimeout(() => {
        location.href = 'index.html';
      }, 1000);
    });
  } else {
    if (confirm('確定要登出嗎？')) {
      localStorage.removeItem('currentUser');
      if (typeof window.showToast === 'function') {
        window.showToast('已登出，期待下次再見！', 'success');
      }
      setTimeout(() => {
        location.href = 'index.html';
      }, 1000);
    }
  }
}

// ===== 頁面載入時執行 =====
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  renderProfile();
  
  // 設定當前頁面的導覽連結為 active
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navbarLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });
});

// ===== 顯示聯絡我們對話記錄 =====
function displayContactMessages() {
  const currentUser = getCurrentUser();
  if (!currentUser) return;
  
  const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
  const userMessages = messages.filter(m => m.userEmail === currentUser.email);
  
  // 在頁面上創建聯絡記錄區塊（如果還沒有的話）
  let contactSection = document.getElementById('contactMessagesSection');
  
  if (!contactSection && userMessages.length > 0) {
    // 創建區塊
    const container = document.querySelector('.profile-container');
    if (container) {
      contactSection = document.createElement('div');
      contactSection.id = 'contactMessagesSection';
      contactSection.className = 'profile-section active';
      contactSection.style.marginTop = '2rem';
      contactSection.innerHTML = `
        <div class="section-header">
          <h2 class="section-title-main">💬 我的聯絡記錄</h2>
        </div>
        <div id="contactMessagesList"></div>
      `;
      container.appendChild(contactSection);
    }
  }
  
  const messagesList = document.getElementById('contactMessagesList');
  if (!messagesList) return;
  
  if (userMessages.length === 0) {
    messagesList.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: var(--dark-gray);">
        <p>您還沒有任何聯絡記錄</p>
        <a href="contact.html" style="color: var(--primary-orange); text-decoration: underline;">前往聯絡我們</a>
      </div>
    `;
    return;
  }
  
  messagesList.innerHTML = userMessages.map(msg => `
    <div style="background: var(--white); border-radius: var(--radius-md); padding: var(--spacing-lg); margin-bottom: var(--spacing-md); box-shadow: var(--shadow-sm); border-left: 4px solid ${msg.status === 'replied' ? '#4CAF50' : '#FF9800'};">
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: var(--spacing-sm);">
        <div>
          <h3 style="margin: 0 0 var(--spacing-xs) 0; color: var(--text-dark);">${msg.subject}</h3>
          <small style="color: var(--dark-gray);">${new Date(msg.createdAt).toLocaleString('zh-TW')}</small>
        </div>
        <span style="background: ${msg.status === 'replied' ? '#4CAF50' : '#FF9800'}; color: var(--white); padding: 0.3rem 0.8rem; border-radius: var(--radius-full); font-size: 0.85rem; font-weight: 600;">
          ${msg.status === 'replied' ? '✅ 已回覆' : '⏳ 待回覆'}
        </span>
      </div>
      <div style="background: var(--soft-peach); padding: var(--spacing-md); border-radius: var(--radius-sm); margin-bottom: var(--spacing-md);">
        <strong style="color: var(--primary-orange); display: block; margin-bottom: var(--spacing-xs);">您的訊息：</strong>
        <p style="margin: 0; color: var(--text-dark);">${msg.message}</p>
      </div>
      ${msg.status === 'replied' ? `
        <div style="background: #E8F5E9; padding: var(--spacing-md); border-radius: var(--radius-sm);">
          <strong style="color: #2E7D32; display: block; margin-bottom: var(--spacing-xs);">客服回覆：</strong>
          <p style="margin: 0 0 var(--spacing-xs) 0; color: var(--text-dark);">${msg.reply}</p>
          <small style="color: #2E7D32;">回覆時間：${new Date(msg.repliedAt).toLocaleString('zh-TW')}</small>
        </div>
      ` : ''}
    </div>
  `).join('');
}

// 頁面載入時顯示聯絡記錄
if (typeof displayContactMessages === 'function') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(displayContactMessages, 500);
  });
}

// ===== 渲染點數兌換專區 =====
function renderCouponExchange(user) {
  const exchangeList = document.getElementById('couponExchangeList');
  if (!exchangeList) return;
  
  // 取得可兌換的折價券（pointCost > 0 且 active === true）
  let exchangeableCoupons = [];
  if (typeof window.getExchangeableCoupons === 'function') {
    exchangeableCoupons = window.getExchangeableCoupons();
  } else {
    // 備用方案：直接從 localStorage 讀取
    const allCoupons = JSON.parse(localStorage.getItem('coupons') || '[]');
    exchangeableCoupons = allCoupons.filter(c => {
      const pointCost = c.pointCost || 0;
      return c.active && pointCost > 0;
    });
  }
  
  // 不過濾已擁有的券，允許重複兌換（囤貨模式）
  const ownedCoupons = user.ownedCoupons || [];
  
  if (exchangeableCoupons.length === 0) {
    exchangeList.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: var(--dark-gray);">
        <p>目前沒有可兌換的折價券</p>
      </div>
    `;
    return;
  }
  
  exchangeList.innerHTML = exchangeableCoupons.map(coupon => {
    const pointCost = coupon.pointCost || 0;
    const canAfford = (user.points || 0) >= pointCost;
    const discountText = coupon.type === 'percent' 
      ? `${(coupon.discount * 100).toFixed(0)}折` 
      : `折抵 $${coupon.discount}`;
    const minAmountText = coupon.minAmount > 0 ? `滿 $${coupon.minAmount} 可用` : '無低消限制';
    
    // 計算持有數量
    const ownedCount = ownedCoupons.filter(code => code === coupon.code).length;
    const ownedCountText = ownedCount > 0 ? ` (目前持有 ${ownedCount} 張)` : '';
    
    return `
      <div style="background: var(--white); border-radius: var(--radius-md); padding: 1.5rem; box-shadow: var(--shadow-sm); border-left: 4px solid var(--primary-orange);">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
          <div>
            <h4 style="margin: 0 0 0.5rem 0; color: var(--text-dark);">${coupon.title || coupon.code}${ownedCountText}</h4>
            <p style="margin: 0; color: var(--dark-gray); font-size: 0.9rem;">${coupon.description || ''}</p>
            <div style="margin-top: 0.5rem; font-size: 0.85rem; color: var(--primary-orange);">
              💰 ${discountText} | ${minAmountText}
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 1.2rem; font-weight: 700; color: var(--primary-orange);">
              ${pointCost} 點
            </div>
          </div>
        </div>
        <button 
          class="btn btn-primary" 
          onclick="window.exchangeCoupon('${coupon.code}')"
          style="width: 100%; ${!canAfford ? 'opacity: 0.5; cursor: not-allowed;' : ''}"
          ${!canAfford ? 'disabled' : ''}
        >
          ${canAfford ? '🎁 立即兌換' : '❌ 點數不足'}
        </button>
      </div>
    `;
  }).join('');
}

// ===== 渲染我的折價券 =====
function renderMyCoupons(user) {
  const myCouponsList = document.getElementById('myCouponsList');
  if (!myCouponsList) return;
  
  // 取得使用者擁有的折價券
  const ownedCoupons = user.ownedCoupons || [];
  
  // 取得所有全站免費券（pointCost === 0 且 active === true）
  const allCoupons = JSON.parse(localStorage.getItem('coupons') || '[]');
  const freeCoupons = allCoupons.filter(c => {
    const pointCost = c.pointCost || 0;
    return c.active && pointCost === 0;
  });
  
  // 合併：使用者擁有的券 + 全站免費券（去重）
  const allMyCoupons = [];
  const couponCodes = new Set();
  
  // 取得使用者的已使用次數記錄
  const usedCoupons = user.usedCoupons || {};
  
  // 先加入使用者擁有的券
  ownedCoupons.forEach(code => {
    const coupon = allCoupons.find(c => c.code === code);
    if (coupon && coupon.active) {
      // 檢查是否已用完
      const usedCount = usedCoupons[coupon.code] || 0;
      const limit = coupon.usageLimit || 0;
      
      // 若有限用次數且已達上限，則過濾掉
      if (limit > 0 && usedCount >= limit) {
        return; // 跳過此券
      }
      
      allMyCoupons.push(coupon);
      couponCodes.add(code);
    }
  });
  
  // 再加入全站免費券（如果還沒加入）
  freeCoupons.forEach(coupon => {
    if (!couponCodes.has(coupon.code)) {
      // 檢查是否已用完
      const usedCount = usedCoupons[coupon.code] || 0;
      const limit = coupon.usageLimit || 0;
      
      // 若有限用次數且已達上限，則過濾掉
      if (limit > 0 && usedCount >= limit) {
        return; // 跳過此券
      }
      
      allMyCoupons.push(coupon);
      couponCodes.add(coupon.code);
    }
  });
  
  if (allMyCoupons.length === 0) {
    myCouponsList.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: var(--dark-gray);">
        <div style="font-size: 3rem; margin-bottom: 1rem;">🎟️</div>
        <p>您還沒有折價券</p>
        <p style="font-size: 0.9rem; margin-top: 0.5rem;">快去點數兌換專區兌換吧！</p>
      </div>
    `;
    return;
  }
  
  myCouponsList.innerHTML = allMyCoupons.map(coupon => {
    const discountText = coupon.type === 'percent' 
      ? `${(coupon.discount * 100).toFixed(0)}折` 
      : `折抵 $${coupon.discount}`;
    const minAmountText = coupon.minAmount > 0 ? `滿 $${coupon.minAmount} 可用` : '無低消限制';
    const isFree = (coupon.pointCost || 0) === 0;
    
    // 取得使用次數資訊
    const usedCount = usedCoupons[coupon.code] || 0;
    const limit = coupon.usageLimit || 0;
    let usageLimitText = '';
    if (limit > 0) {
      usageLimitText = `已用 ${usedCount} / 限 ${limit} 次`;
    } else {
      usageLimitText = '不限次數';
    }
    
    // 最高折抵資訊
    const maxDiscountText = coupon.maxDiscount 
      ? `(最高折抵 $${coupon.maxDiscount})` 
      : '';
    
    return `
      <div style="background: var(--white); border-radius: var(--radius-md); padding: 1.5rem; box-shadow: var(--shadow-sm); border-left: 4px solid ${isFree ? '#4CAF50' : 'var(--primary-orange)'};">
        <div style="display: flex; justify-content: space-between; align-items: start;">
          <div style="flex: 1;">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
              <h4 style="margin: 0; color: var(--text-dark);">${coupon.title || coupon.code}</h4>
              ${isFree ? '<span style="background: #4CAF50; color: white; padding: 0.2rem 0.5rem; border-radius: var(--radius-full); font-size: 0.75rem;">免費券</span>' : ''}
            </div>
            <p style="margin: 0 0 0.5rem 0; color: var(--dark-gray); font-size: 0.9rem;">${coupon.description || ''}</p>
            <div style="font-size: 0.85rem; color: var(--primary-orange); margin-bottom: 0.25rem;">
              💰 ${discountText} ${maxDiscountText}
            </div>
            <div style="font-size: 0.8rem; color: var(--dark-gray); margin-bottom: 0.25rem;">
              📋 ${minAmountText}
            </div>
            <div style="font-size: 0.8rem; color: var(--dark-gray);">
              🔢 ${usageLimitText}
            </div>
          </div>
          <div style="text-align: right; margin-left: 1rem;">
            <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary-orange);">
              ${coupon.code}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ===== 兌換折價券 =====
window.exchangeCoupon = function(couponCode) {
  const user = checkLoginStatus();
  if (!user) return;
  
  // 取得折價券資訊
  const allCoupons = JSON.parse(localStorage.getItem('coupons') || '[]');
  const coupon = allCoupons.find(c => c.code === couponCode);
  
  if (!coupon) {
    if (typeof window.showError === 'function') {
      window.showError('找不到折價券');
    }
    return;
  }
  
  const pointCost = coupon.pointCost || 0;
  const userPoints = user.points || 0;
  
  // 檢查點數是否足夠
  if (userPoints < pointCost) {
    if (typeof window.showError === 'function') {
      window.showError(`點數不足，需要 ${pointCost} 點`);
    } else if (typeof window.showToast === 'function') {
      window.showToast(`點數不足，需要 ${pointCost} 點`, 'error');
    }
    return;
  }
  
  // 取得當前持有數量（用於顯示）
  const ownedCoupons = user.ownedCoupons || [];
  const currentCount = ownedCoupons.filter(code => code === couponCode).length;
  
  // 確認兌換（允許重複兌換）
  if (typeof window.showConfirm === 'function') {
    window.showConfirm(
      `確定要用 ${pointCost} 點兌換「${coupon.title || couponCode}」嗎？${currentCount > 0 ? `\n目前持有 ${currentCount} 張，兌換後將有 ${currentCount + 1} 張` : ''}`,
      () => {
        // 扣除點數
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.email === user.email);
        
        if (userIndex > -1) {
          users[userIndex].points = (users[userIndex].points || 0) - pointCost;
          
          // 加入折價券（允許重複，直接 push）
          if (!users[userIndex].ownedCoupons) {
            users[userIndex].ownedCoupons = [];
          }
          users[userIndex].ownedCoupons.push(couponCode);
          
          localStorage.setItem('users', JSON.stringify(users));
          
          // 更新 currentUser
          user.points = users[userIndex].points;
          user.ownedCoupons = users[userIndex].ownedCoupons;
          localStorage.setItem('currentUser', JSON.stringify(user));
          
          // 計算新的持有數量
          const newCount = user.ownedCoupons.filter(code => code === couponCode).length;
          
          // 只重新渲染兌換列表（更新持有數量顯示）和我的折價券
          renderCouponExchange(user);
          renderMyCoupons(user);
          
          // 更新點數顯示
          const statValue = document.querySelector('.stat-value');
          if (statValue) {
            statValue.textContent = user.points || 0;
          }
          
          if (typeof window.showSuccess === 'function') {
            window.showSuccess(`兌換成功！目前持有 ${newCount} 張「${coupon.title || couponCode}」`);
          } else if (typeof window.showToast === 'function') {
            window.showToast(`兌換成功！目前持有 ${newCount} 張「${coupon.title || couponCode}」`, 'success');
          }
        }
      }
    );
  } else {
    if (confirm(`確定要用 ${pointCost} 點兌換「${coupon.title || couponCode}」嗎？${currentCount > 0 ? `\n目前持有 ${currentCount} 張，兌換後將有 ${currentCount + 1} 張` : ''}`)) {
      // 扣除點數
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex(u => u.email === user.email);
      
      if (userIndex > -1) {
        users[userIndex].points = (users[userIndex].points || 0) - pointCost;
        
        // 加入折價券（允許重複，直接 push）
        if (!users[userIndex].ownedCoupons) {
          users[userIndex].ownedCoupons = [];
        }
        users[userIndex].ownedCoupons.push(couponCode);
        
        localStorage.setItem('users', JSON.stringify(users));
        
        // 更新 currentUser
        user.points = users[userIndex].points;
        user.ownedCoupons = users[userIndex].ownedCoupons;
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // 計算新的持有數量
        const newCount = user.ownedCoupons.filter(code => code === couponCode).length;
        
        // 只重新渲染兌換列表（更新持有數量顯示）和我的折價券
        renderCouponExchange(user);
        renderMyCoupons(user);
        
        // 更新點數顯示
        const statValue = document.querySelector('.stat-value');
        if (statValue) {
          statValue.textContent = user.points || 0;
        }
        
        if (typeof window.showSuccess === 'function') {
          window.showSuccess(`兌換成功！目前持有 ${newCount} 張「${coupon.title || couponCode}」`);
        } else if (typeof window.showToast === 'function') {
          window.showToast(`兌換成功！目前持有 ${newCount} 張「${coupon.title || couponCode}」`, 'success');
        }
      }
    }
  }
};