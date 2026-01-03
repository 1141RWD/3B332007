// 全局認證系統
// 處理登入、登出、權限檢查等功能

// ===== 全域變數 =====
let currentUser = null;

// ===== 管理者帳號 =====
const ADMIN_ACCOUNTS = [
  {
    email: 'admin@morning-glory.com',
    password: 'admin123',
    role: 'admin',
    name: '系統管理員'
  }
];

// ===== 初始化認證系統 =====
function initAuth() {
  // 檢查是否已登入
  const savedUser = localStorage.getItem('currentUser');
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    updateAuthUI();
  }
  
  // 更新所有頁面的認證 UI
  updateAuthUI();
}

// ===== 更新認證 UI =====
function updateAuthUI() {
  const loginBtn = document.getElementById('loginBtn');
  
  if (!loginBtn) return;
  
  if (currentUser) {
    // 已登入狀態
    if (currentUser.role === 'admin') {
      // 管理員：只顯示管理後台和登出
      loginBtn.innerHTML = `
        <div class="user-menu" style="margin-left: auto;">
          <button class="user-menu-btn" onclick="toggleUserMenu()">
            <span class="user-avatar">👨‍💼</span>
            <span class="user-name">${currentUser.name || '管理員'}</span>
            <span class="dropdown-arrow">▼</span>
          </button>
          <div class="user-dropdown" id="userDropdown">
            <a href="admin.html" class="dropdown-item">🔧 管理後台</a>
            <a href="#" class="dropdown-item" onclick="logout(); return false;">🚪 登出</a>
          </div>
        </div>
      `;
    } else {
      // 一般用戶：顯示會員中心和登出（不顯示購物車）
      loginBtn.innerHTML = `
        <div class="user-menu" style="margin-left: auto;">
          <button class="user-menu-btn" onclick="toggleUserMenu()">
            <span class="user-avatar">👤</span>
            <span class="user-name">${currentUser.name || currentUser.email}</span>
            <span class="dropdown-arrow">▼</span>
          </button>
          <div class="user-dropdown" id="userDropdown">
            <a href="profile.html" class="dropdown-item">👤 會員中心</a>
            <a href="#" class="dropdown-item" onclick="logout(); return false;">🚪 登出</a>
          </div>
        </div>
      `;
    }
    
    // 隱藏不需要的導覽列項目
    hideNavItemsForRole(currentUser.role);
  } else {
    // 未登入狀態
    loginBtn.innerHTML = '<a href="login.html">🔐 登入 / 註冊</a>';
    loginBtn.style.marginLeft = 'auto';
  }
}

// ===== 根據角色隱藏導覽列項目 =====
function hideNavItemsForRole(role) {
  const navbarMenu = document.getElementById('navbarMenu');
  if (!navbarMenu) return;
  
  const navLinks = navbarMenu.querySelectorAll('li');
  
  navLinks.forEach(link => {
    const linkText = link.textContent.trim();
    
    if (role === 'admin') {
      // 管理員：隱藏線上點餐、購物車、會員中心、聯絡我們
      const href = link.querySelector('a')?.getAttribute('href');
      if (href === 'menu.html' || 
          href === 'cart.html' ||
          linkText.includes('線上點餐') ||
          linkText.includes('購物車') || 
          linkText.includes('會員中心') || 
          linkText.includes('聯絡我們')) {
        link.style.display = 'none';
      }
    } else {
      // 一般用戶：隱藏標題列的會員中心連結（保留在下拉選單）
      const href = link.querySelector('a')?.getAttribute('href');
      if (href === 'profile.html' && !link.querySelector('#loginBtn')) {
        link.style.display = 'none';
      }
    }
  });
}

// ===== 切換使用者選單 =====
function toggleUserMenu() {
  const dropdown = document.getElementById('userDropdown');
  if (dropdown) {
    dropdown.classList.toggle('show');
  }
}

// 點擊其他地方關閉選單
document.addEventListener('click', (e) => {
  const userMenu = document.querySelector('.user-menu');
  const dropdown = document.getElementById('userDropdown');
  
  if (userMenu && dropdown && !userMenu.contains(e.target)) {
    dropdown.classList.remove('show');
  }
});

// ===== 登出功能 =====
function logout() {
  if (confirm('確定要登出嗎？')) {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateAuthUI();
    
    // 顯示通知
    alert('已成功登出！');
    
    // 如果在需要登入的頁面，導向首頁
    const protectedPages = ['profile.html', 'admin.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage)) {
      window.location.href = 'index.html';
    }
  }
}

// ===== 登入驗證 =====
function authenticateUser(email, password) {
  // 先檢查是否為管理員
  const admin = ADMIN_ACCOUNTS.find(a => a.email === email && a.password === password);
  if (admin) {
    currentUser = {
      email: admin.email,
      name: admin.name,
      role: 'admin',
      loginTime: new Date().toISOString()
    };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    return { success: true, role: 'admin', user: currentUser };
  }
  
  // 檢查一般會員
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    currentUser = {
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: 'user',
      points: user.points || 0,
      loginTime: new Date().toISOString()
    };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    return { success: true, role: 'user', user: currentUser };
  }
  
  return { success: false, message: '帳號或密碼錯誤' };
}

// ===== 檢查是否已登入 =====
function isLoggedIn() {
  return currentUser !== null;
}

// ===== 檢查是否為管理員 =====
function isAdmin() {
  // 先確保 currentUser 已載入
  if (!currentUser) {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      currentUser = JSON.parse(savedUser);
    }
  }
  return currentUser && currentUser.role === 'admin';
}

// ===== 要求登入 =====
function requireLogin() {
  // 先確保 currentUser 已載入
  if (!currentUser) {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      currentUser = JSON.parse(savedUser);
    }
  }
  
  if (!currentUser) {
    alert('請先登入才能使用此功能');
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

// ===== 要求管理員權限 =====
function requireAdmin() {
  // 先確保 currentUser 已載入
  if (!currentUser) {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      currentUser = JSON.parse(savedUser);
    }
  }
  
  if (!currentUser || currentUser.role !== 'admin') {
    alert('您沒有權限訪問此頁面');
    window.location.href = 'index.html';
    return false;
  }
  return true;
}

// ===== 取得當前使用者 =====
function getCurrentUser() {
  return currentUser;
}

// ===== 頁面載入時初始化 =====
document.addEventListener('DOMContentLoaded', () => {
  initAuth();
});