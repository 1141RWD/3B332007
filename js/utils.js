// ===== 全域工具函數 =====
// 所有函數定義在 window 下，確保全域可用

// ===== Toast 通知系統 =====
window.showToast = function(message, type = 'success') {
  // 創建 Toast 容器（如果不存在）
  let toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toastContainer';
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
  
  // 創建 Toast 元素
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  // 設定圖示
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
  
  // 設定內容
  toast.innerHTML = `
    <div class="toast-icon">${icon}</div>
    <div class="toast-message">${message}</div>
    <button class="toast-close" onclick="window.closeToast(this)">&times;</button>
  `;
  
  // 加入容器
  toastContainer.appendChild(toast);
  
  // 觸發動畫
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  // 3秒後自動移除
  setTimeout(() => {
    window.closeToast(toast);
  }, 3000);
  
  return toast;
};

window.closeToast = function(element) {
  const toast = element.classList ? element : element.parentElement;
  toast.classList.remove('show');
  
  setTimeout(() => {
    toast.remove();
  }, 300);
};

// 便利函數
window.showSuccess = function(message) {
  return window.showToast(message, 'success');
};

window.showError = function(message) {
  return window.showToast(message, 'error');
};

window.showInfo = function(message) {
  return window.showToast(message, 'info');
};

// ===== 確認對話框 =====
window.showConfirm = function(message, onConfirm, onCancel) {
  // 創建遮罩
  const overlay = document.createElement('div');
  overlay.className = 'confirm-overlay';
  
  // 創建對話框
  const dialog = document.createElement('div');
  dialog.className = 'confirm-dialog';
  dialog.innerHTML = `
    <div class="confirm-icon">❓</div>
    <div class="confirm-message">${message}</div>
    <div class="confirm-buttons">
      <button class="confirm-btn confirm-btn-cancel">取消</button>
      <button class="confirm-btn confirm-btn-confirm">確定</button>
    </div>
  `;
  
  overlay.appendChild(dialog);
  document.body.appendChild(overlay);
  
  // 觸發動畫
  setTimeout(() => {
    overlay.classList.add('show');
  }, 10);
  
  // 綁定事件
  const cancelBtn = dialog.querySelector('.confirm-btn-cancel');
  const confirmBtn = dialog.querySelector('.confirm-btn-confirm');
  
  cancelBtn.onclick = () => {
    window.closeConfirm(overlay);
    if (onCancel) onCancel();
  };
  
  confirmBtn.onclick = () => {
    window.closeConfirm(overlay);
    if (onConfirm) onConfirm();
  };
  
  // 點擊遮罩關閉
  overlay.onclick = (e) => {
    if (e.target === overlay) {
      window.closeConfirm(overlay);
      if (onCancel) onCancel();
    }
  };
};

window.closeConfirm = function(overlay) {
  overlay.classList.remove('show');
  setTimeout(() => {
    overlay.remove();
  }, 300);
};

// ===== 管理員權限檢查 =====
window.checkAdminPermission = function() {
  // 先嘗試從 localStorage 載入用戶
  let currentUser = null;
  const savedUser = localStorage.getItem('currentUser');
  
  if (savedUser) {
    try {
      currentUser = JSON.parse(savedUser);
    } catch (e) {
      console.error('解析用戶資料失敗', e);
    }
  }
  
  if (!currentUser || currentUser.role !== 'admin') {
    window.showError('您沒有權限訪問此頁面');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1500);
    return false;
  }
  
  return true;
};

// ===== 檢查登入狀態 =====
window.checkLogin = function() {
  const savedUser = localStorage.getItem('currentUser');
  if (!savedUser) {
    window.showError('請先登入');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1500);
    return false;
  }
  return true;
};

// ===== 取得當前用戶 =====
window.getCurrentUser = function() {
  const savedUser = localStorage.getItem('currentUser');
  if (savedUser) {
    try {
      return JSON.parse(savedUser);
    } catch (e) {
      console.error('解析用戶資料失敗', e);
      return null;
    }
  }
  return null;
};

// ===== 格式化日期時間 =====
window.formatDateTime = function(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// ===== 格式化金額 =====
window.formatPrice = function(price) {
  return '$' + Math.round(price).toLocaleString('zh-TW');
};

// ===== Loading 遮罩 =====
window.showLoading = function(message = '處理中...') {
  let loading = document.getElementById('loadingOverlay');
  if (!loading) {
    loading = document.createElement('div');
    loading.id = 'loadingOverlay';
    loading.className = 'loading-overlay';
    loading.innerHTML = `
      <div class="loading-spinner"></div>
      <div class="loading-message">${message}</div>
    `;
    document.body.appendChild(loading);
  } else {
    loading.querySelector('.loading-message').textContent = message;
  }
  
  setTimeout(() => {
    loading.classList.add('show');
  }, 10);
};

window.hideLoading = function() {
  const loading = document.getElementById('loadingOverlay');
  if (loading) {
    loading.classList.remove('show');
    setTimeout(() => {
      loading.remove();
    }, 300);
  }
};

// ===== 顯示全站公告 =====
window.showAnnouncement = function() {
  // 檢查是否有主打折價券
  const coupons = JSON.parse(localStorage.getItem('coupons') || '[]');
  const featured = coupons.find(c => c.active && c.featured);
  
  if (!featured) return;
  
  // 檢查是否已有公告
  let banner = document.getElementById('announcementBanner');
  if (banner) return;
  
  // 創建公告
  banner = document.createElement('div');
  banner.id = 'announcementBanner';
  banner.className = 'announcement-banner';
  banner.innerHTML = `
    <div class="announcement-content">
      🎉 ${featured.title}！輸入優惠碼「<strong>${featured.code}</strong>」享優惠！
    </div>
    <button class="announcement-close" onclick="this.parentElement.remove()">&times;</button>
  `;
  
  // 插入到 body 最前面
  document.body.insertBefore(banner, document.body.firstChild);
};

// ===== 頁面載入完成後執行 =====
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.showAnnouncement();
  });
} else {
  window.showAnnouncement();
}

console.log('✅ Utils.js loaded - All utility functions are available globally');