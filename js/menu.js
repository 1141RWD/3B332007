// 線上點餐頁面 JavaScript

// ===== 全域變數 =====
let currentProduct = null;
let quantity = 1;
let selectedOptions = {
  extras: [],
  sweetness: null,
  ice: null
};

// 訂單選項
let orderOptions = {
  storeId: null,
  pickupType: 'now',
  pickupDate: null,
  pickupTime: null,
  diningOption: 'takeout'
};

// 搜尋相關
let searchQuery = '';
let currentCategory = '全部';
let filteredProducts = [];

// ===== 初始化門市選擇 =====
function initStoreSelect() {
  const select = document.getElementById('storeSelect');
  
  // 填充門市選項
  stores.forEach(store => {
    const option = document.createElement('option');
    option.value = store.id;
    option.textContent = store.name;
    select.appendChild(option);
  });
  
  // 檢查是否有已選門市
  const savedStore = localStorage.getItem('selectedStore');
  if (savedStore) {
    try {
      const store = JSON.parse(savedStore);
      select.value = store.id;
      orderOptions.storeId = store.id;
    } catch (e) {
      console.error('解析門市資料失敗', e);
    }
  }
  
  // 監聽變更
  select.addEventListener('change', (e) => {
    orderOptions.storeId = e.target.value;
    if (e.target.value) {
      const store = stores.find(s => s.id === e.target.value);
      localStorage.setItem('selectedStore', JSON.stringify(store));
    }
  });
}

// ===== 初始化取餐方式 =====
function initPickupType() {
  const pickupType = document.getElementById('pickupType');
  const scheduleOptions = document.getElementById('scheduleOptions');
  
  pickupType.addEventListener('change', (e) => {
    orderOptions.pickupType = e.target.value;
    
    if (e.target.value === 'schedule') {
      scheduleOptions.style.display = 'block';
      generateTimeSlots();
    } else {
      scheduleOptions.style.display = 'none';
    }
  });
}

// ===== 生成時間選項 =====
function generateTimeSlots() {
  const select = document.getElementById('pickupTime');
  select.innerHTML = '';
  
  const startHour = 6;
  const endHour = 14;
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let min = 0; min < 60; min += 15) {
      const time = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
      const option = document.createElement('option');
      option.value = time;
      option.textContent = time;
      select.appendChild(option);
    }
  }
}

// ===== 監聽用餐方式 =====
function initDiningOption() {
  document.getElementById('diningOption').addEventListener('change', (e) => {
    orderOptions.diningOption = e.target.value;
  });
  
  document.getElementById('pickupDate')?.addEventListener('change', (e) => {
    orderOptions.pickupDate = e.target.value;
  });
  
  document.getElementById('pickupTime')?.addEventListener('change', (e) => {
    orderOptions.pickupTime = e.target.value;
  });
}

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

// ===== 搜尋功能 =====
function initSearch() {
  const searchInput = document.getElementById('searchInput');
  const clearButton = document.getElementById('clearSearch');
  const searchResultsInfo = document.getElementById('searchResultsInfo');
  
  // 搜尋輸入事件（即時搜尋，防抖處理）
  let searchTimeout;
  searchInput.addEventListener('input', (e) => {
    const value = e.target.value.trim();
    
    // 顯示/隱藏清除按鈕
    clearButton.style.display = value ? 'flex' : 'none';
    
    // 防抖處理（300ms）
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      searchQuery = value.toLowerCase();
      filterAndDisplayProducts();
    }, 300);
  });
  
  // 清除搜尋
  clearButton.addEventListener('click', () => {
    searchInput.value = '';
    searchQuery = '';
    clearButton.style.display = 'none';
    filterAndDisplayProducts();
    searchInput.focus();
  });
  
  // Enter 鍵搜尋
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      searchQuery = searchInput.value.trim().toLowerCase();
      filterAndDisplayProducts();
    }
  });
}

// ===== 篩選並顯示商品 =====
function filterAndDisplayProducts() {
  const searchResultsInfo = document.getElementById('searchResultsInfo');
  
  // 根據分類篩選
  let categoryFiltered = products;
  if (currentCategory !== '全部') {
    categoryFiltered = products.filter(p => p.category === currentCategory);
  }
  
  // 根據搜尋關鍵字篩選
  if (searchQuery) {
    filteredProducts = categoryFiltered.filter(product => {
      const nameMatch = product.name.toLowerCase().includes(searchQuery);
      const descMatch = product.description.toLowerCase().includes(searchQuery);
      const categoryMatch = product.category.toLowerCase().includes(searchQuery);
      
      // 檢查標籤
      const tagsMatch = product.tags && product.tags.some(tag => 
        tag.toLowerCase().includes(searchQuery)
      );
      
      return nameMatch || descMatch || categoryMatch || tagsMatch;
    });
    
    // 顯示搜尋結果資訊
    if (filteredProducts.length > 0) {
      searchResultsInfo.textContent = `找到 ${filteredProducts.length} 項商品`;
      searchResultsInfo.className = 'search-results-info';
    } else {
      searchResultsInfo.textContent = `找不到「${searchQuery}」相關商品，請嘗試其他關鍵字`;
      searchResultsInfo.className = 'search-results-info no-results';
    }
  } else {
    filteredProducts = categoryFiltered;
    searchResultsInfo.textContent = '';
  }
  
  // 顯示商品（傳入篩選後的商品）
  displayProductsFromArray(filteredProducts);
}

// ===== 顯示商品列表（從陣列） =====
function displayProductsFromArray(productsArray) {
  const menuGrid = document.getElementById('menuGrid');
  
  if (productsArray.length === 0) {
    menuGrid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <h3>找不到相關商品</h3>
        <p>請嘗試其他關鍵字或選擇其他分類</p>
      </div>
    `;
    return;
  }
  
  menuGrid.innerHTML = productsArray.map(product => {
    // 產生標籤 HTML
    const tagsHTML = product.tags && product.tags.length > 0
      ? `<div class="menu-tags">
          ${product.tags.map(tag => `<span class="menu-tag">${tag}</span>`).join('')}
         </div>`
      : '';
    
    return `
      <div class="menu-card fade-in" data-product-id="${product.id}">
        <div class="menu-image-wrapper">
          <img src="${product.image}" alt="${product.name}" class="menu-image" onerror="this.src='images/placeholder.jpg'">
          <span class="menu-category-badge">${product.category}</span>
        </div>
        <div class="menu-content">
          ${tagsHTML}
          <h3 class="menu-name">${product.name}</h3>
          <p class="menu-description">${product.description}</p>
          <div class="menu-price-section">
            <div>
              <div class="menu-price">$${product.price}</div>
              <div class="menu-price-label">起</div>
            </div>
          </div>
          <button class="menu-add-btn" onclick="openProductModal('${product.id}')">
            🛒 選購
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// ===== 顯示商品列表 =====
function displayProducts(category = '全部') {
  currentCategory = category;
  searchQuery = ''; // 重置搜尋
  
  // 清除搜尋框
  const searchInput = document.getElementById('searchInput');
  const clearButton = document.getElementById('clearSearch');
  const searchResultsInfo = document.getElementById('searchResultsInfo');
  
  if (searchInput) searchInput.value = '';
  if (clearButton) clearButton.style.display = 'none';
  if (searchResultsInfo) searchResultsInfo.textContent = '';
  
  filterAndDisplayProducts();
}

// ===== 分類篩選功能 =====
function setupCategoryFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // 移除所有按鈕的 active 類別
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // 為當前按鈕添加 active 類別
      button.classList.add('active');
      
      // 顯示對應分類的商品
      const category = button.dataset.category;
      displayProducts(category);
    });
  });
}

// ===== 開啟商品詳情彈窗 =====
function openProductModal(productId) {
  currentProduct = products.find(p => p.id === productId);
  if (!currentProduct) return;
  
  // 重置選項
  quantity = 1;
  selectedOptions = {
    extras: [],
    sweetness: null,
    ice: null
  };
  
  // 填充彈窗內容
  document.getElementById('modalImage').src = currentProduct.image;
  document.getElementById('modalImage').alt = currentProduct.name;
  document.getElementById('modalTitle').textContent = currentProduct.name;
  document.getElementById('modalDescription').textContent = currentProduct.description;
  document.getElementById('modalPrice').textContent = `$${currentProduct.price}`;
  document.getElementById('quantityValue').textContent = quantity;
  
  // 生成選項
  generateOptions();
  
  // 顯示彈窗
  document.getElementById('productModal').classList.add('active');
  document.body.style.overflow = 'hidden'; // 防止背景滾動
}

// ===== 關閉彈窗 =====
function closeProductModal() {
  document.getElementById('productModal').classList.remove('active');
  document.body.style.overflow = ''; // 恢復滾動
}

// ===== 生成商品選項 =====
function generateOptions() {
  const optionsContainer = document.getElementById('modalOptions');
  let optionsHTML = '';
  
  // 如果有 extras（加購項目）
  if (currentProduct.extras && currentProduct.extras.length > 0) {
    optionsHTML += `
      <div class="options-section">
        <h3 class="options-title">🍳 加購項目（可多選）</h3>
        <div class="options-grid">
          ${currentProduct.extras.map((extra, index) => `
            <div class="option-item">
              <input 
                type="checkbox" 
                id="extra-${index}" 
                class="option-input extra-option"
                data-name="${extra.name}"
                data-price="${extra.price}"
              >
              <label for="extra-${index}" class="option-label">
                ${extra.name}
                <span class="option-price">+$${extra.price}</span>
              </label>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
  
  // 如果有 options（飲料選項）
  if (currentProduct.options) {
    // 甜度選項
    if (currentProduct.options.sweetness) {
      optionsHTML += `
        <div class="options-section">
          <h3 class="options-title">🍯 甜度</h3>
          <div class="options-grid">
            ${currentProduct.options.sweetness.map((sweet, index) => `
              <div class="option-item">
                <input 
                  type="radio" 
                  name="sweetness" 
                  id="sweet-${index}" 
                  class="option-input sweetness-option"
                  data-value="${sweet}"
                  ${index === 0 ? 'checked' : ''}
                >
                <label for="sweet-${index}" class="option-label">
                  ${sweet}
                </label>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
    
    // 冰塊選項
    if (currentProduct.options.ice) {
      optionsHTML += `
        <div class="options-section">
          <h3 class="options-title">🧊 冰塊</h3>
          <div class="options-grid">
            ${currentProduct.options.ice.map((iceOption, index) => `
              <div class="option-item">
                <input 
                  type="radio" 
                  name="ice" 
                  id="ice-${index}" 
                  class="option-input ice-option"
                  data-value="${iceOption}"
                  ${index === 0 ? 'checked' : ''}
                >
                <label for="ice-${index}" class="option-label">
                  ${iceOption}
                </label>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
  }
  
  optionsContainer.innerHTML = optionsHTML;
  
  // 初始化預設選項（飲料）
  if (currentProduct.options) {
    if (currentProduct.options.sweetness) {
      selectedOptions.sweetness = currentProduct.options.sweetness[0];
    }
    if (currentProduct.options.ice) {
      selectedOptions.ice = currentProduct.options.ice[0];
    }
  }
}

// ===== 數量控制 =====
document.getElementById('decreaseBtn').addEventListener('click', () => {
  if (quantity > 1) {
    quantity--;
    document.getElementById('quantityValue').textContent = quantity;
  }
});

document.getElementById('increaseBtn').addEventListener('click', () => {
  if (quantity < 99) {
    quantity++;
    document.getElementById('quantityValue').textContent = quantity;
  }
});

// ===== 選項變更監聽（事件委派） =====
document.getElementById('modalOptions').addEventListener('change', (e) => {
  // 加購項目
  if (e.target.classList.contains('extra-option')) {
    const extraName = e.target.dataset.name;
    const extraPrice = parseInt(e.target.dataset.price);
    
    if (e.target.checked) {
      selectedOptions.extras.push({ name: extraName, price: extraPrice });
    } else {
      selectedOptions.extras = selectedOptions.extras.filter(
        extra => extra.name !== extraName
      );
    }
  }
  
  // 甜度選項
  if (e.target.classList.contains('sweetness-option')) {
    selectedOptions.sweetness = e.target.dataset.value;
  }
  
  // 冰塊選項
  if (e.target.classList.contains('ice-option')) {
    selectedOptions.ice = e.target.dataset.value;
  }
});

// ===== 加入購物車 =====
document.getElementById('addToCartBtn').addEventListener('click', () => {
  if (!currentProduct) return;
  
  // 檢查是否選擇門市
  if (!orderOptions.storeId) {
    alert('請先選擇門市！');
    return;
  }
  
  // 準備購物車項目
  const cartItem = {
    id: currentProduct.id,
    name: currentProduct.name,
    price: currentProduct.price,
    image: currentProduct.image,
    category: currentProduct.category,
    quantity: quantity,
    options: JSON.parse(JSON.stringify(selectedOptions)) // 深拷貝
  };
  
  // 計算總價（含加購項目）
  let itemTotal = currentProduct.price;
  if (selectedOptions.extras && selectedOptions.extras.length > 0) {
    selectedOptions.extras.forEach(extra => {
      itemTotal += extra.price;
    });
  }
  cartItem.totalPrice = itemTotal;
  
  // 取得現有購物車
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  // 檢查是否已存在相同商品（含選項）
  const existingIndex = cart.findIndex(item => 
    item.id === cartItem.id &&
    JSON.stringify(item.options) === JSON.stringify(cartItem.options)
  );
  
  if (existingIndex > -1) {
    // 如果已存在，增加數量
    cart[existingIndex].quantity += quantity;
  } else {
    // 否則新增項目
    cart.push(cartItem);
  }
  
  // 儲存購物車
  localStorage.setItem('cart', JSON.stringify(cart));
  
  // 儲存訂單選項
  localStorage.setItem('orderOptions', JSON.stringify(orderOptions));
  
  // 更新徽章
  updateCartBadge();
  
  // 顯示成功訊息
  showSuccessMessage();
  
  // 關閉彈窗
  setTimeout(() => {
    closeProductModal();
  }, 800);
});

// ===== 顯示成功訊息 =====
function showSuccessMessage() {
  const btn = document.getElementById('addToCartBtn');
  const originalText = btn.innerHTML;
  
  btn.innerHTML = '✓ 已加入購物車';
  btn.style.background = 'var(--accent-green)';
  
  setTimeout(() => {
    btn.innerHTML = originalText;
    btn.style.background = '';
  }, 2000);
}

// ===== 關閉彈窗事件 =====
document.getElementById('modalClose').addEventListener('click', closeProductModal);

// 點擊彈窗外部關閉
document.getElementById('productModal').addEventListener('click', (e) => {
  if (e.target.id === 'productModal') {
    closeProductModal();
  }
});

// ESC 鍵關閉彈窗
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeProductModal();
  }
});

// ===== 頁面載入時執行 =====
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  displayProducts();
  setupCategoryFilter();
  initStoreSelect();
  initPickupType();
  initDiningOption();
  initSearch(); // 初始化搜尋功能
  
  // 設定當前頁面的導覽連結為 active
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navbarLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });
});