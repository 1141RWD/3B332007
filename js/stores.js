// 門市查詢頁面 JavaScript

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

// ===== 全域變數 =====
let currentFilters = {
  area: '全部',
  services: [],
  searchText: ''
};
let selectedStore = null;

// ===== 渲染門市列表 =====
function renderStores() {
  const storesList = document.getElementById('storesList');
  
  // 篩選門市
  let filteredStores = stores;
  
  // 區域篩選
  if (currentFilters.area !== '全部') {
    filteredStores = filteredStores.filter(store => store.area === currentFilters.area);
  }
  
  // 服務篩選
  if (currentFilters.services.length > 0) {
    filteredStores = filteredStores.filter(store => {
      return currentFilters.services.every(service => {
        if (service === '24H') {
          return store.features.includes('24H');
        }
        return store.services.includes(service);
      });
    });
  }
  
  // 搜尋篩選
  if (currentFilters.searchText) {
    const searchLower = currentFilters.searchText.toLowerCase();
    filteredStores = filteredStores.filter(store => 
      store.name.toLowerCase().includes(searchLower) ||
      store.address.toLowerCase().includes(searchLower) ||
      store.district.toLowerCase().includes(searchLower)
    );
  }
  
  // 渲染結果
  if (filteredStores.length === 0) {
    storesList.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <h3>找不到符合條件的門市</h3>
        <p>請調整篩選條件</p>
      </div>
    `;
    return;
  }
  
  storesList.innerHTML = filteredStores.map(store => `
    <div class="store-card ${selectedStore && selectedStore.id === store.id ? 'selected' : ''}" 
         onclick="selectStore('${store.id}')"
         data-store-id="${store.id}">
      <div class="store-header">
        <div class="store-name">${store.name}</div>
        ${store.features.includes('總店') ? '<span class="store-badge">總店</span>' : ''}
        ${store.features.includes('24H') ? '<span class="store-badge" style="background: var(--accent-green)">24H</span>' : ''}
      </div>
      
      <div class="store-info">
        <div class="store-info-item">
          <span>📍</span>
          <span>${store.address}</span>
        </div>
        <div class="store-info-item">
          <span>📞</span>
          <span>${store.phone}</span>
        </div>
        <div class="store-info-item">
          <span>⏰</span>
          <span>${store.hours}</span>
        </div>
        <div class="store-info-item">
          <span>🎯</span>
          <span>${store.services.join('、')}</span>
        </div>
      </div>
      
      ${store.features.includes('停車場') ? '<div class="store-info-item" style="margin-top: 0.5rem;"><span>🅿️</span><span>設有停車場</span></div>' : ''}
    </div>
  `).join('');
}

// ===== 選擇門市 =====
function selectStore(storeId) {
  selectedStore = stores.find(s => s.id === storeId);
  
  if (!selectedStore) return;
  
  // 更新列表樣式
  document.querySelectorAll('.store-card').forEach(card => {
    card.classList.remove('selected');
  });
  
  const selectedCard = document.querySelector(`[data-store-id="${storeId}"]`);
  if (selectedCard) {
    selectedCard.classList.add('selected');
  }
  
  // 顯示門市詳情
  showStoreDetail();
  
  // 儲存選擇的門市（用於點餐時選擇）
  localStorage.setItem('selectedStore', JSON.stringify(selectedStore));
}

// ===== 顯示門市詳情 =====
function showStoreDetail() {
  if (!selectedStore) return;
  
  const detailCard = document.getElementById('storeDetailCard');
  
  detailCard.innerHTML = `
    <h3 class="detail-title">${selectedStore.name}</h3>
    
    <div class="detail-info">
      <div class="detail-item">
        <span class="detail-icon">📍</span>
        <div class="detail-content">
          <div class="detail-label">地址</div>
          <div class="detail-text">${selectedStore.address}</div>
        </div>
      </div>
      
      <div class="detail-item">
        <span class="detail-icon">📞</span>
        <div class="detail-content">
          <div class="detail-label">電話</div>
          <div class="detail-text">${selectedStore.phone}</div>
        </div>
      </div>
      
      <div class="detail-item">
        <span class="detail-icon">⏰</span>
        <div class="detail-content">
          <div class="detail-label">營業時間</div>
          <div class="detail-text">${selectedStore.hours}</div>
        </div>
      </div>
      
      <div class="detail-item">
        <span class="detail-icon">🎯</span>
        <div class="detail-content">
          <div class="detail-label">提供服務</div>
          <div class="detail-text">${selectedStore.services.join('、')}</div>
        </div>
      </div>
      
      ${selectedStore.features.length > 0 ? `
        <div class="detail-item">
          <span class="detail-icon">✨</span>
          <div class="detail-content">
            <div class="detail-label">門市特色</div>
            <div class="detail-text">${selectedStore.features.join('、')}</div>
          </div>
        </div>
      ` : ''}
    </div>
    
    <div class="action-buttons">
      <button class="action-btn btn-primary-action" onclick="orderAtStore()">
        🍳 前往點餐
      </button>
      <button class="action-btn btn-secondary-action" onclick="callStore()">
        📞 撥打電話
      </button>
    </div>
  `;
  
  detailCard.classList.add('show');
}

// ===== 前往點餐 =====
function orderAtStore() {
  if (!selectedStore) return;
  
  // 儲存選擇的門市
  localStorage.setItem('selectedStore', JSON.stringify(selectedStore));
  
  // 跳轉到點餐頁面
  location.href = 'menu.html';
}

// ===== 撥打電話 =====
function callStore() {
  if (!selectedStore) return;
  
  const phoneNumber = selectedStore.phone.replace(/[()-\s]/g, '');
  window.location.href = `tel:${phoneNumber}`;
}

// ===== 區域篩選 =====
function setupAreaFilter() {
  const filterButtons = document.querySelectorAll('#areaFilter .filter-chip');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // 移除所有按鈕的 active
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // 添加當前按鈕的 active
      button.classList.add('active');
      
      // 更新篩選條件
      currentFilters.area = button.dataset.area;
      
      // 重新渲染
      renderStores();
    });
  });
}

// ===== 服務篩選 =====
function setupServiceFilter() {
  const filterButtons = document.querySelectorAll('#serviceFilter .filter-chip');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // 切換 active 狀態
      button.classList.toggle('active');
      
      const service = button.dataset.service;
      
      if (button.classList.contains('active')) {
        // 添加到篩選條件
        if (!currentFilters.services.includes(service)) {
          currentFilters.services.push(service);
        }
      } else {
        // 從篩選條件移除
        currentFilters.services = currentFilters.services.filter(s => s !== service);
      }
      
      // 重新渲染
      renderStores();
    });
  });
}

// ===== 搜尋功能 =====
function setupSearch() {
  const searchInput = document.getElementById('searchInput');
  
  let searchTimeout;
  
  searchInput.addEventListener('input', (e) => {
    // 清除之前的 timeout
    clearTimeout(searchTimeout);
    
    // 設定新的 timeout（防抖）
    searchTimeout = setTimeout(() => {
      currentFilters.searchText = e.target.value.trim();
      renderStores();
    }, 300);
  });
}

// ===== 頁面載入時執行 =====
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  renderStores();
  setupAreaFilter();
  setupServiceFilter();
  setupSearch();
  
  // 檢查是否有已選擇的門市
  const savedStore = localStorage.getItem('selectedStore');
  if (savedStore) {
    try {
      const store = JSON.parse(savedStore);
      selectStore(store.id);
    } catch (e) {
      console.error('解析門市資料失敗', e);
    }
  }
  
  // 設定當前頁面的導覽連結為 active
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navbarLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });
});