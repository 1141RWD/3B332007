// 登入/註冊頁面 JavaScript

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

// ===== 表單切換功能 =====
function switchTab(tabName) {
  // 切換按鈕狀態
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.tab === tabName) {
      btn.classList.add('active');
    }
  });
  
  // 切換表單顯示
  document.querySelectorAll('.auth-form').forEach(form => {
    form.classList.remove('active');
    if (form.id === `${tabName}Form`) {
      form.classList.add('active');
    }
  });
}

// 設定切換按鈕事件
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    switchTab(btn.dataset.tab);
  });
});

// ===== 表單驗證函數 =====
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePhone(phone) {
  const re = /^09\d{2}-?\d{3}-?\d{3}$/;
  return re.test(phone.replace(/\s/g, ''));
}

function showError(inputId, errorId, message) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  
  input.classList.add('error');
  error.textContent = message;
  error.classList.add('show');
}

function clearError(inputId, errorId) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  
  input.classList.remove('error');
  error.classList.remove('show');
}

function clearAllErrors(formType) {
  const prefix = formType === 'login' ? 'login' : 'register';
  const inputs = document.querySelectorAll(`#${prefix}Form .form-input`);
  
  inputs.forEach(input => {
    input.classList.remove('error');
  });
  
  const errors = document.querySelectorAll(`#${prefix}Form .error-message`);
  errors.forEach(error => {
    error.classList.remove('show');
  });
}

// ===== 登入表單處理 =====
document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  clearAllErrors('login');
  
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  
  let hasError = false;
  
  // 驗證電子郵件
  if (!email) {
    showError('loginEmail', 'loginEmailError', '請輸入電子郵件');
    hasError = true;
  } else if (!validateEmail(email)) {
    showError('loginEmail', 'loginEmailError', '電子郵件格式不正確');
    hasError = true;
  }
  
  // 驗證密碼
  if (!password) {
    showError('loginPassword', 'loginPasswordError', '請輸入密碼');
    hasError = true;
  }
  
  if (hasError) return;
  
  // 使用 auth.js 的驗證函數
  const result = authenticateUser(email, password);
  
  if (result.success) {
    // 登入成功
    const redirectTo = localStorage.getItem('redirectAfterLogin');
    localStorage.removeItem('redirectAfterLogin');
    
    alert('登入成功！歡迎回來，' + result.user.name + '！');
    
    // 根據角色導向不同頁面
    if (result.role === 'admin') {
      location.href = redirectTo || 'admin.html';
    } else {
      location.href = redirectTo || 'profile.html';
    }
  } else {
    showError('loginPassword', 'loginPasswordError', result.message || '電子郵件或密碼錯誤');
  }
});

// ===== 註冊表單處理 =====
document.getElementById('registerForm').addEventListener('submit', (e) => {
  e.preventDefault();
  clearAllErrors('register');
  
  const name = document.getElementById('registerName').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const phone = document.getElementById('registerPhone').value.trim();
  const password = document.getElementById('registerPassword').value;
  const passwordConfirm = document.getElementById('registerPasswordConfirm').value;
  const agreeTerms = document.getElementById('agreeTerms').checked;
  
  let hasError = false;
  
  // 驗證姓名
  if (!name) {
    showError('registerName', 'registerNameError', '請輸入姓名');
    hasError = true;
  } else if (name.length < 2) {
    showError('registerName', 'registerNameError', '姓名至少需要 2 個字元');
    hasError = true;
  }
  
  // 驗證電子郵件
  if (!email) {
    showError('registerEmail', 'registerEmailError', '請輸入電子郵件');
    hasError = true;
  } else if (!validateEmail(email)) {
    showError('registerEmail', 'registerEmailError', '電子郵件格式不正確');
    hasError = true;
  } else {
    // 檢查電子郵件是否已被註冊
    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.find(u => u.email === email)) {
      showError('registerEmail', 'registerEmailError', '此電子郵件已被註冊');
      hasError = true;
    }
  }
  
  // 驗證手機
  if (!phone) {
    showError('registerPhone', 'registerPhoneError', '請輸入手機號碼');
    hasError = true;
  } else if (!validatePhone(phone)) {
    showError('registerPhone', 'registerPhoneError', '手機號碼格式不正確（例：0912-345-678）');
    hasError = true;
  }
  
  // 驗證密碼
  if (!password) {
    showError('registerPassword', 'registerPasswordError', '請輸入密碼');
    hasError = true;
  } else if (password.length < 6) {
    showError('registerPassword', 'registerPasswordError', '密碼至少需要 6 個字元');
    hasError = true;
  }
  
  // 驗證確認密碼
  if (!passwordConfirm) {
    showError('registerPasswordConfirm', 'registerPasswordConfirmError', '請再次輸入密碼');
    hasError = true;
  } else if (password !== passwordConfirm) {
    showError('registerPasswordConfirm', 'registerPasswordConfirmError', '兩次輸入的密碼不一致');
    hasError = true;
  }
  
  // 驗證同意條款
  if (!agreeTerms) {
    alert('請同意服務條款與隱私政策');
    hasError = true;
  }
  
  if (hasError) return;
  
  // 建立新使用者
  const newUser = {
    id: 'USER-' + Date.now(),
    name: name,
    email: email,
    phone: phone,
    password: password,
    joinDate: new Date().toISOString(),
    points: 0,
    address: ''
  };
  
  // 儲存使用者
  const users = JSON.parse(localStorage.getItem('users')) || [];
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  
  // 自動登入
  localStorage.setItem('currentUser', JSON.stringify(newUser));
  
  alert('註冊成功！歡迎加入晨光早餐店會員！');
  location.href = 'profile.html';
});

// ===== 即時清除錯誤訊息 =====
function setupRealTimeValidation() {
  // 登入表單
  document.getElementById('loginEmail').addEventListener('input', () => {
    clearError('loginEmail', 'loginEmailError');
  });
  
  document.getElementById('loginPassword').addEventListener('input', () => {
    clearError('loginPassword', 'loginPasswordError');
  });
  
  // 註冊表單
  document.getElementById('registerName').addEventListener('input', () => {
    clearError('registerName', 'registerNameError');
  });
  
  document.getElementById('registerEmail').addEventListener('input', () => {
    clearError('registerEmail', 'registerEmailError');
  });
  
  document.getElementById('registerPhone').addEventListener('input', () => {
    clearError('registerPhone', 'registerPhoneError');
  });
  
  document.getElementById('registerPassword').addEventListener('input', () => {
    clearError('registerPassword', 'registerPasswordError');
  });
  
  document.getElementById('registerPasswordConfirm').addEventListener('input', () => {
    clearError('registerPasswordConfirm', 'registerPasswordConfirmError');
  });
}

// ===== 檢查是否已登入 =====
function checkIfLoggedIn() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  
  if (currentUser) {
    // 如果已登入，直接跳轉到會員中心
    if (confirm('您已經登入了，是否前往會員中心？')) {
      location.href = 'profile.html';
    }
  }
}

// ===== 頁面載入時執行 =====
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  setupRealTimeValidation();
  checkIfLoggedIn();
  
  // 設定當前頁面的導覽連結為 active
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navbarLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });
});