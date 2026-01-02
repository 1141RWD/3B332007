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
  link.addEventListener('click', () => {
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
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  
  if (!currentUser) {
    alert('請先登入才能訪問會員中心');
    location.href = 'login.html';
    return null;
  }
  
  return currentUser;
}

// ===== 取得使用者訂單 =====
function getUserOrders(userId) {
  const allOrders = JSON.parse(localStorage.getItem('orders')) || [];
  return allOrders.filter(order => order.userId === userId);
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
}

// ===== 渲染訂單列表 =====
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
      ${orders.map(order => `
        <div class="order-card">
          <div class="order-header">
            <div>
              <div class="order-id">訂單編號：${order.id}</div>
              <div class="order-date">下單時間：${formatDate(order.date)}</div>
            </div>
            <span class="order-status ${order.status === '處理中' ? 'processing' : order.status === '已完成' ? 'completed' : 'cancelled'}">
              ${order.status}
            </span>
          </div>
          
          <div class="order-items">
            ${order.items.map(item => `
              <div class="order-item">
                <span>${item.name} x ${item.quantity}</span>
                <span>$${item.price * item.quantity}</span>
              </div>
            `).join('')}
          </div>
          
          <div class="order-footer">
            <span>配送地址：${order.deliveryAddress}</span>
            <div class="order-total">總計 $${order.total}</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
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
          <div style="text-align: center; padding: 3rem;">
            <div style="font-size: 5rem; margin-bottom: 1rem;">⭐</div>
            <div style="font-size: 3rem; font-weight: 700; color: var(--primary-orange); margin-bottom: 1rem;">
              ${user.points || 0} 點
            </div>
            <p style="color: var(--dark-gray); margin-bottom: 2rem;">
              每消費 $100 可獲得 1 點<br>
              累積點數可兌換專屬優惠
            </p>
            <div style="background: var(--soft-peach); padding: 1.5rem; border-radius: var(--radius-sm); max-width: 500px; margin: 0 auto;">
              <h3 style="font-family: var(--font-display); color: var(--text-dark); margin-bottom: 1rem;">點數兌換說明</h3>
              <p style="color: var(--dark-gray); line-height: 1.8;">
                ⭐ 100 點 = 全品項 9 折優惠券<br>
                ⭐ 200 點 = $50 折價券<br>
                ⭐ 500 點 = $150 折價券<br>
                ⭐ 1000 點 = 神秘驚喜禮
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  `;
  
  // 設定個人資料表單提交事件
  setupProfileFormSubmit(user);
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
      
      alert('個人資料已更新！');
      renderProfile(); // 重新渲染
    });
  }
}

// ===== 登出功能 =====
function logout() {
  if (confirm('確定要登出嗎？')) {
    localStorage.removeItem('currentUser');
    alert('已登出，期待下次再見！');
    location.href = 'index.html';
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