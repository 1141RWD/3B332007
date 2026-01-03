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
  diningOption: 'takeout',
  tableNumber: null  // 新增：桌號
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
  const diningSelect = document.getElementById('diningOption');
  const pickupTypeSelect = document.getElementById('pickupType');
  const scheduleOptions = document.getElementById('scheduleOptions');
  const tableOptions = document.getElementById('tableOptions');
  const pickupTypeOptions = document.getElementById('pickupTypeOptions');
  const tableSelect = document.getElementById('tableSelect');
  
  // 用餐方式改變時
  diningSelect.addEventListener('change', (e) => {
    orderOptions.diningOption = e.target.value;
    
    if (e.target.value === 'dine-in') {
      // 內用：顯示桌號選擇，隱藏取餐方式和預約時間
      if (tableOptions) {
        tableOptions.style.display = 'block';
      }
      if (pickupTypeOptions) {
        pickupTypeOptions.style.display = 'none';
      }
      if (scheduleOptions) {
        scheduleOptions.style.display = 'none';
      }
      // 重置外帶相關設定
      orderOptions.pickupType = 'now';
      orderOptions.pickupDate = null;
      orderOptions.pickupTime = null;
      if (pickupTypeSelect) {
        pickupTypeSelect.value = 'now';
      }
    } else {
      // 外帶：顯示取餐方式，隱藏桌號
      if (tableOptions) {
        tableOptions.style.display = 'none';
      }
      if (pickupTypeOptions) {
        pickupTypeOptions.style.display = 'block';
      }
      // 根據取餐方式決定是否顯示預約時間
      if (pickupTypeSelect && pickupTypeSelect.value === 'schedule') {
        if (scheduleOptions) {
          scheduleOptions.style.display = 'block';
        }
      } else {
        if (scheduleOptions) {
          scheduleOptions.style.display = 'none';
        }
      }
      // 重置桌號
      orderOptions.tableNumber = null;
      if (tableSelect) {
        tableSelect.value = '';
      }
    }
    
    localStorage.setItem('orderOptions', JSON.stringify(orderOptions));
  });
  
  // 取餐方式改變時（僅外帶模式下有效）
  if (pickupTypeSelect) {
    pickupTypeSelect.addEventListener('change', (e) => {
      orderOptions.pickupType = e.target.value;
      
      if (e.target.value === 'schedule') {
        // 預約取餐：顯示預約時間並生成時間選項
        if (scheduleOptions) {
          scheduleOptions.style.display = 'block';
        }
        generateTimeSlots();
      } else {
        // 立即取餐：隱藏預約時間
        if (scheduleOptions) {
          scheduleOptions.style.display = 'none';
        }
        // 重置預約時間
        orderOptions.pickupDate = null;
        orderOptions.pickupTime = null;
      }
      
      localStorage.setItem('orderOptions', JSON.stringify(orderOptions));
    });
  }
  
  // 桌號選擇
  if (tableSelect) {
    tableSelect.addEventListener('change', (e) => {
      orderOptions.tableNumber = e.target.value;
      localStorage.setItem('orderOptions', JSON.stringify(orderOptions));
    });
  }
  
  // 預約時間相關
  document.getElementById('pickupDate')?.addEventListener('change', (e) => {
    orderOptions.pickupDate = e.target.value;
    localStorage.setItem('orderOptions', JSON.stringify(orderOptions));
  });
  
  document.getElementById('pickupTime')?.addEventListener('change', (e) => {
    orderOptions.pickupTime = e.target.value;
    localStorage.setItem('orderOptions', JSON.stringify(orderOptions));
  });
  
  // 讀取已儲存的設定
  const savedOptions = localStorage.getItem('orderOptions');
  if (savedOptions) {
    try {
      const options = JSON.parse(savedOptions);
      
      // 恢復用餐方式
      if (options.diningOption) {
        diningSelect.value = options.diningOption;
        diningSelect.dispatchEvent(new Event('change'));
        
        // 恢復桌號（如果是內用）
        if (options.diningOption === 'dine-in' && options.tableNumber && tableSelect) {
          tableSelect.value = options.tableNumber;
        }
        
        // 恢復取餐方式（如果是外帶）
        if (options.diningOption === 'takeout' && options.pickupType && pickupTypeSelect) {
          pickupTypeSelect.value = options.pickupType;
          pickupTypeSelect.dispatchEvent(new Event('change'));
        }
      }
    } catch (e) {
      console.error('讀取訂單選項時發生錯誤：', e);
    }
  }
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
const updateCartBadge = () => {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartBadge = document.getElementById('cartBadge');
  const cartCountElements = document.querySelectorAll('.cart-count, .cart-badge');
  
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  
  if (cartBadge) {
    cartBadge.textContent = totalItems;
    cartBadge.style.display = totalItems > 0 ? 'inline-block' : 'none';
  }
  
  // 更新所有購物車徽章元素
  cartCountElements.forEach(element => {
    element.textContent = totalItems;
    element.style.display = totalItems > 0 ? 'inline-block' : 'none';
  });
};

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
    
    // 處理圖片路徑（確保相對路徑正確）
    let imagePath = product.image || 'images/placeholder.jpg';
    // 如果圖片路徑不是以 http 或 / 開頭，確保是相對路徑
    if (!imagePath.startsWith('http') && !imagePath.startsWith('/')) {
      // 確保路徑以 images/ 開頭
      if (!imagePath.startsWith('images/')) {
        imagePath = 'images/' + imagePath;
      }
    }
    
    return `
      <div class="menu-card fade-in" data-product-id="${product.id}">
        <div class="menu-image-wrapper">
          <img src="${imagePath}" alt="${product.name}" class="menu-image" onerror="this.src='images/placeholder.jpg'">
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
// ===== 全域變數：編輯模式 =====
let editingCartIndex = null;

// ===== 開啟商品 Modal（支援編輯模式）=====
window.openProductModal = function(productId, cartIndex = null) {
  currentProduct = products.find(p => p.id === productId);
  if (!currentProduct) return;
  
  editingCartIndex = cartIndex;
  
  // 如果是編輯模式，載入購物車項目的資料
  if (cartIndex !== null) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartItem = cart[cartIndex];
    
    if (cartItem) {
      quantity = cartItem.quantity || 1;
      selectedOptions = cartItem.options ? JSON.parse(JSON.stringify(cartItem.options)) : {
        extras: [],
        sweetness: null,
        ice: null
      };
    } else {
      // 如果找不到項目，重置
      quantity = 1;
      selectedOptions = {
        extras: [],
        sweetness: null,
        ice: null
      };
    }
  } else {
    // 新增模式：重置選項
    quantity = 1;
    selectedOptions = {
      extras: [],
      sweetness: null,
      ice: null
    };
  }
  
  // 填充彈窗內容（添加 DOM 檢查）
  const modalImage = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalDescription = document.getElementById('modalDescription');
  const modalPrice = document.getElementById('modalPrice');
  const quantityValueEl = document.getElementById('quantityValue');
  const productModalEl = document.getElementById('productModal');
  const addToCartBtn = document.getElementById('addToCartBtn');
  const itemNoteEl = document.getElementById('itemNote');
  
  if (modalImage) {
    modalImage.src = currentProduct.image;
    modalImage.alt = currentProduct.name;
  }
  if (modalTitle) {
    modalTitle.textContent = cartIndex !== null ? '✏️ 修改餐點內容' : currentProduct.name;
  }
  if (modalDescription) modalDescription.textContent = currentProduct.description;
  if (modalPrice) modalPrice.textContent = `$${currentProduct.price}`;
  if (quantityValueEl) quantityValueEl.textContent = quantity;
  
  // 更新按鈕文字
  if (addToCartBtn) {
    addToCartBtn.textContent = cartIndex !== null ? '✅ 確認修改' : '🛒 加入購物車';
  }
  
  // 載入備註（如果有）
  if (itemNoteEl && cartIndex !== null) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartItem = cart[cartIndex];
    if (cartItem && cartItem.note) {
      itemNoteEl.value = cartItem.note;
    } else {
      itemNoteEl.value = '';
    }
  } else if (itemNoteEl) {
    itemNoteEl.value = '';
  }
  
  // 生成選項（會自動回填已選選項）
  generateOptions();
  
  // 顯示彈窗
  if (productModalEl) {
    productModalEl.classList.add('active');
    document.body.style.overflow = 'hidden'; // 防止背景滾動
  }
};

// ===== 保留原函數以向後兼容 =====
const openProductModal = (productId) => {
  window.openProductModal(productId, null);
};

// ===== 關閉彈窗 =====
const closeProductModal = () => {
  const productModalEl = document.getElementById('productModal');
  if (productModalEl) {
    productModalEl.classList.remove('active');
    document.body.style.overflow = ''; // 恢復滾動
  }
  // 重置編輯模式
  editingCartIndex = null;
  currentProduct = null;
};

// ===== 生成商品選項 =====
function generateOptions() {
  const optionsContainer = document.getElementById('modalOptions');
  let optionsHTML = '';
  
  // 如果有 extras（加購項目）
  if (currentProduct.extras && currentProduct.extras.length > 0) {
    const currentExtras = selectedOptions.extras || [];
    const currentExtraNames = currentExtras.map(e => e.name);
    
    optionsHTML += `
      <div class="options-section">
        <h3 class="options-title">🍳 加購項目（可多選）</h3>
        <div class="options-grid">
          ${currentProduct.extras.map((extra, index) => {
            const isChecked = currentExtraNames.includes(extra.name);
            return `
            <div class="option-item">
              <input 
                type="checkbox" 
                id="extra-${index}" 
                class="option-input extra-option"
                data-name="${extra.name}"
                data-price="${extra.price}"
                ${isChecked ? 'checked' : ''}
              >
              <label for="extra-${index}" class="option-label">
                ${extra.name}
                <span class="option-price">+$${extra.price}</span>
              </label>
            </div>
          `;
          }).join('')}
        </div>
      </div>
    `;
  }
  
  // 如果有 options（飲料選項）
  if (currentProduct.options) {
    // 甜度選項
    if (currentProduct.options.sweetness) {
      const currentSweetness = selectedOptions.sweetness || currentProduct.options.sweetness[0];
      optionsHTML += `
        <div class="options-section">
          <h3 class="options-title">🍯 甜度</h3>
          <div class="options-grid">
            ${currentProduct.options.sweetness.map((sweet, index) => {
              const isChecked = sweet === currentSweetness;
              return `
              <div class="option-item">
                <input 
                  type="radio" 
                  name="sweetness" 
                  id="sweet-${index}" 
                  class="option-input sweetness-option"
                  data-value="${sweet}"
                  ${isChecked ? 'checked' : ''}
                >
                <label for="sweet-${index}" class="option-label">
                  ${sweet}
                </label>
              </div>
            `;
            }).join('')}
          </div>
        </div>
      `;
    }
    
    // 冰塊選項
    if (currentProduct.options.ice) {
      const currentIce = selectedOptions.ice || currentProduct.options.ice[0];
      optionsHTML += `
        <div class="options-section">
          <h3 class="options-title">🧊 冰塊</h3>
          <div class="options-grid">
            ${currentProduct.options.ice.map((iceOption, index) => {
              const isChecked = iceOption === currentIce;
              return `
              <div class="option-item">
                <input 
                  type="radio" 
                  name="ice" 
                  id="ice-${index}" 
                  class="option-input ice-option"
                  data-value="${iceOption}"
                  ${isChecked ? 'checked' : ''}
                >
                <label for="ice-${index}" class="option-label">
                  ${iceOption}
                </label>
              </div>
            `;
            }).join('')}
          </div>
        </div>
      `;
    }
  }
  
  optionsContainer.innerHTML = optionsHTML;
  
  // 初始化選項（如果還沒有設定）
  if (currentProduct.options) {
    if (currentProduct.options.sweetness && !selectedOptions.sweetness) {
      selectedOptions.sweetness = currentProduct.options.sweetness[0];
    }
    if (currentProduct.options.ice && !selectedOptions.ice) {
      selectedOptions.ice = currentProduct.options.ice[0];
    }
  }
  
  // 編輯模式：確保加購項目的 checkbox 被正確勾選並同步 selectedOptions
  if (editingCartIndex !== null) {
    // 等待 DOM 更新後再設置 checkbox
    setTimeout(() => {
      const extraCheckboxes = document.querySelectorAll('.extra-option');
      const currentExtras = selectedOptions.extras || [];
      const currentExtraNames = currentExtras.map(e => e.name);
      
      // 確保 selectedOptions.extras 陣列存在
      if (!selectedOptions.extras) {
        selectedOptions.extras = [];
      }
      
      // 同步 checkbox 狀態與 selectedOptions
      extraCheckboxes.forEach(checkbox => {
        const extraName = checkbox.dataset.name;
        const extraPrice = parseInt(checkbox.dataset.price) || 0;
        
        // 如果原本已選擇，勾選 checkbox
        if (currentExtraNames.includes(extraName)) {
          checkbox.checked = true;
          // 確保 selectedOptions.extras 中有這個項目
          if (!selectedOptions.extras.find(e => e.name === extraName)) {
            selectedOptions.extras.push({ name: extraName, price: extraPrice });
          }
        } else {
          checkbox.checked = false;
          // 移除不在選擇列表中的項目
          selectedOptions.extras = selectedOptions.extras.filter(e => e.name !== extraName);
        }
      });
    }, 50);
  }
}

// ===== 數量控制 =====
const decreaseBtn = document.getElementById('decreaseBtn');
const increaseBtn = document.getElementById('increaseBtn');
const quantityValue = document.getElementById('quantityValue');

if (decreaseBtn && quantityValue) {
  decreaseBtn.addEventListener('click', () => {
    if (quantity > 1) {
      quantity--;
      quantityValue.textContent = quantity;
    }
  });
}

if (increaseBtn && quantityValue) {
  increaseBtn.addEventListener('click', () => {
    if (quantity < 99) {
      quantity++;
      quantityValue.textContent = quantity;
    }
  });
}

// ===== 選項變更監聽（事件委派） =====
const modalOptions = document.getElementById('modalOptions');
if (modalOptions) {
  modalOptions.addEventListener('change', (e) => {
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
}

// ===== 加入購物車 =====
const addToCartBtn = document.getElementById('addToCartBtn');
if (addToCartBtn) {
  addToCartBtn.addEventListener('click', () => {
    if (!currentProduct) return;
    
    // 移除門市檢查 - 允許使用者先加入購物車，門市選擇延後到結帳頁面
  
  // 取得備註
  const itemNoteEl = document.getElementById('itemNote');
  const note = itemNoteEl ? itemNoteEl.value.trim() : '';
  
  // 準備購物車項目
  const cartItem = {
    id: currentProduct.id,
    name: currentProduct.name,
    price: currentProduct.price,
    image: currentProduct.image,
    category: currentProduct.category,
    quantity: quantity,
    options: JSON.parse(JSON.stringify(selectedOptions)), // 深拷貝
    note: note || undefined // 備註（如果有）
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
  
  // 如果是編輯模式
  if (editingCartIndex !== null && editingCartIndex >= 0 && editingCartIndex < cart.length) {
    // 更新現有項目
    cart[editingCartIndex] = cartItem;
    editingCartIndex = null; // 重置編輯索引
  } else {
    // 新增模式：檢查是否已存在相同商品（含選項和備註）
    const existingIndex = cart.findIndex(item => 
      item.id === cartItem.id &&
      JSON.stringify(item.options) === JSON.stringify(cartItem.options) &&
      (item.note || '') === (cartItem.note || '')
    );
    
    if (existingIndex > -1) {
      // 如果已存在，增加數量
      cart[existingIndex].quantity += quantity;
    } else {
      // 否則新增項目
      cart.push(cartItem);
    }
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
}

// ===== 顯示成功訊息 =====
const showSuccessMessage = () => {
  const btn = document.getElementById('addToCartBtn');
  if (!btn) return;
  
  const originalText = btn.innerHTML;
  const isEditMode = editingCartIndex !== null;
  
  btn.innerHTML = isEditMode ? '✓ 已更新' : '✓ 已加入購物車';
  btn.style.background = 'var(--accent-green)';
  
  // 使用 Toast 通知系統（如果可用）
  if (typeof window.showSuccess === 'function') {
    window.showSuccess(isEditMode ? '商品已更新！' : '商品已加入購物車！');
  }
  
  setTimeout(() => {
    btn.innerHTML = originalText;
    btn.style.background = '';
  }, 2000);
};

// ===== 關閉彈窗事件 =====
const modalClose = document.getElementById('modalClose');
if (modalClose) {
  modalClose.addEventListener('click', closeProductModal);
}

// 點擊彈窗外部關閉
const productModal = document.getElementById('productModal');
if (productModal) {
  productModal.addEventListener('click', (e) => {
    if (e.target.id === 'productModal') {
      closeProductModal();
    }
  });
}

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
  initDiningOption();
  initSearch(); // 初始化搜尋功能
  generateTimeSlots(); // 生成預約時間選項
  
  // 設定當前頁面的導覽連結為 active
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navbarLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });
});