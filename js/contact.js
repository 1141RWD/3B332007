// 聯絡我們頁面 JavaScript

// ===== 導覽列功能 =====
const navbarToggle = document.getElementById('navbarToggle');
const navbarMenu = document.getElementById('navbarMenu');

if (navbarToggle) {
  navbarToggle.addEventListener('click', () => {
    navbarToggle.classList.toggle('active');
    navbarMenu.classList.toggle('active');
  });
}

// ===== 更新購物車徽章 =====
function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const cartBadge = document.getElementById('cartBadge');
  
  if (cartBadge) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalItems;
    cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
  }
}

// ===== 頁面載入時初始化 =====
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  
  // 如果已登入，自動填入使用者資訊
  const currentUser = getCurrentUser();
  if (currentUser) {
    document.getElementById('userName').value = currentUser.name || '';
    document.getElementById('userEmail').value = currentUser.email || '';
    document.getElementById('userPhone').value = currentUser.phone || '';
  }
  
  // 表單提交處理
  const contactForm = document.getElementById('contactForm');
  contactForm.addEventListener('submit', handleSubmit);
});

// ===== 處理表單提交 =====
function handleSubmit(event) {
  event.preventDefault();
  
  const submitBtn = event.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  
  // 取得表單資料
  const formData = {
    id: 'msg-' + Date.now(),
    userName: document.getElementById('userName').value.trim(),
    userEmail: document.getElementById('userEmail').value.trim(),
    phone: document.getElementById('userPhone').value.trim() || null,
    subject: document.getElementById('subject').value,
    message: document.getElementById('message').value.trim(),
    status: 'pending',
    createdAt: new Date().toISOString(),
    reply: null,
    repliedAt: null,
    repliedBy: null
  };
  
  // 驗證資料
  if (!formData.userName || !formData.userEmail || !formData.subject || !formData.message) {
    alert('請填寫所有必填欄位！');
    return;
  }
  
  // 驗證 Email 格式
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.userEmail)) {
    alert('請輸入有效的 Email 地址！');
    return;
  }
  
  // 顯示載入狀態
  submitBtn.disabled = true;
  submitBtn.textContent = '📤 送出中...';
  
  // 儲存訊息
  try {
    const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
    messages.push(formData);
    localStorage.setItem('contactMessages', JSON.stringify(messages));
    
    // 顯示成功訊息
    const successMessage = document.getElementById('successMessage');
    successMessage.classList.add('show');
    
    // 重置表單
    document.getElementById('contactForm').reset();
    
    // 如果已登入，重新填入使用者資訊
    const currentUser = getCurrentUser();
    if (currentUser) {
      document.getElementById('userName').value = currentUser.name || '';
      document.getElementById('userEmail').value = currentUser.email || '';
      document.getElementById('userPhone').value = currentUser.phone || '';
    }
    
    // 3秒後隱藏成功訊息
    setTimeout(() => {
      successMessage.classList.remove('show');
    }, 5000);
    
    // 恢復按鈕狀態
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
    
    // 滾動到成功訊息
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
  } catch (error) {
    console.error('儲存訊息時發生錯誤：', error);
    alert('送出訊息時發生錯誤，請稍後再試。');
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
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