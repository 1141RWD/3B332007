// ===== 購物車管理系統 (Cart Management System) =====
// 現代化 ES6+ 語法，完整的錯誤處理與用戶體驗優化

// ===== 購物車工具函數 =====
const CartUtils = {
  // 從 localStorage 讀取購物車
  loadCart: () => {
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('❌ 讀取購物車失敗:', error);
      return [];
    }
  },

  // 儲存購物車到 localStorage
  saveCart: (cart) => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
      return true;
    } catch (error) {
      console.error('❌ 儲存購物車失敗:', error);
      if (typeof window.showError === 'function') {
        window.showError('購物車儲存失敗，請重試');
      }
      return false;
    }
  },

  // 計算單個商品的總價（含加料）
  calculateItemTotal: (item) => {
    let total = item.price * (item.quantity || 1);
    
    if (item.options && item.options.extras && Array.isArray(item.options.extras)) {
      item.options.extras.forEach(extra => {
        total += (extra.price || 0) * (item.quantity || 1);
      });
    }
    
    return total;
  },

  // 計算購物車總商品數量
  getTotalItems: (cart) => {
    if (!Array.isArray(cart)) return 0;
    return cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  },

  // 計算購物車小計（不含折扣）
  getSubtotal: (cart) => {
    if (!Array.isArray(cart)) return 0;
    return cart.reduce((sum, item) => sum + CartUtils.calculateItemTotal(item), 0);
  },

  // 處理圖片路徑
  getImagePath: (imagePath) => {
    if (!imagePath) return 'images/placeholder.jpg';
    
    // 如果是完整 URL，直接返回
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // 如果是絕對路徑，直接返回
    if (imagePath.startsWith('/')) {
      return imagePath;
    }
    
    // 確保相對路徑以 images/ 開頭
    if (!imagePath.startsWith('images/')) {
      return 'images/' + imagePath;
    }
    
    return imagePath;
  }
};

// ===== 初始化購物車 =====
window.initShoppingCart = function() {
  if (!window.cart) {
    window.cart = [];
  }
  
  window.cart = CartUtils.loadCart();
  window.updateCartCount();
  
  console.log('✅ 購物車已初始化，商品數量：', window.cart.length);
  
  // 如果當前頁面是購物車頁面，自動渲染
  if (document.getElementById('cartItems')) {
    window.renderCartItems();
  }
};

// ===== 更新購物車數量顯示（徽章）=====
window.updateCartCount = function() {
  if (!window.cart) {
    window.cart = CartUtils.loadCart();
  }
  
  const totalItems = CartUtils.getTotalItems(window.cart);
  
  // 更新所有購物車徽章
  const cartBadge = document.getElementById('cartBadge');
  const cartCountElements = document.querySelectorAll('.cart-count, .cart-badge');
  
  if (cartBadge) {
    cartBadge.textContent = totalItems;
    cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
  }
  
  cartCountElements.forEach(element => {
    element.textContent = totalItems;
    element.style.display = totalItems > 0 ? 'inline-block' : 'none';
  });
  
  return totalItems;
};

// ===== 渲染購物車項目（美化卡片版）=====
window.renderCartItems = function() {
  const cartItemsContainer = document.getElementById('cartItems');
  const emptyCartMessage = document.getElementById('emptyCart');
  const cartSummary = document.getElementById('cartSummary');
  const mobileFooter = document.getElementById('mobileCheckoutFooter');
  const cartItemsCount = document.getElementById('cartItemsCount');
  
  if (!cartItemsContainer) {
    console.warn('⚠️ 找不到 cartItems 容器，可能不在購物車頁面');
    return;
  }
  
  // 重新載入購物車（確保數據最新）
  window.cart = CartUtils.loadCart();
  
  // 空購物車處理 - 優化空狀態顯示
  if (window.cart.length === 0) {
    // 隱藏列表和結帳區塊
    if (cartItemsContainer) cartItemsContainer.innerHTML = '';
    if (cartSummary) cartSummary.style.display = 'none';
    if (mobileFooter) mobileFooter.style.display = 'none';
    
    // 顯示空狀態容器
    if (emptyCartMessage) {
      emptyCartMessage.style.display = 'flex';
      emptyCartMessage.style.flexDirection = 'column';
      emptyCartMessage.style.alignItems = 'center';
      emptyCartMessage.style.justifyContent = 'center';
      emptyCartMessage.style.minHeight = '400px';
    }
    
    // 更新徽章
    window.updateCartCount();
    return;
  }
  
  // 顯示購物車內容
  if (emptyCartMessage) emptyCartMessage.style.display = 'none';
  if (cartSummary) cartSummary.style.display = 'block';
  if (mobileFooter) mobileFooter.style.display = 'block';
  
  // 更新商品數量標題
  if (cartItemsCount) {
    const totalItems = CartUtils.getTotalItems(window.cart);
    cartItemsCount.textContent = `您的餐點 (${totalItems} 項)`;
  }
  
  // 渲染卡片式商品列表
  cartItemsContainer.innerHTML = window.cart.map((item, index) => {
    const itemTotal = CartUtils.calculateItemTotal(item);
    const imagePath = CartUtils.getImagePath(item.image);
    
    // 生成加料 HTML
    let extrasHTML = '';
    if (item.options && item.options.extras && Array.isArray(item.options.extras) && item.options.extras.length > 0) {
      extrasHTML = '<div class="cart-item-extras">';
      item.options.extras.forEach(extra => {
        extrasHTML += `<span class="cart-item-extra">+ ${extra.name} (+$${extra.price || 0})</span>`;
      });
      extrasHTML += '</div>';
    }
    
    // 生成客製化選項 HTML
    let optionsHTML = '';
    if (item.options) {
      const options = [];
      if (item.options.sweetness) options.push(`糖度：${item.options.sweetness}`);
      if (item.options.ice) options.push(`冰塊：${item.options.ice}`);
      if (item.options.sauceOption) options.push(`醬料：${item.options.sauceOption}`);
      if (item.options.spicyLevel) options.push(`辣度：${item.options.spicyLevel}`);
      
      if (options.length > 0) {
        optionsHTML = `<div class="cart-item-options">${options.join(' | ')}</div>`;
      }
    }
    
    return `
      <div class="cart-item" data-item-index="${index}">
        <img src="${imagePath}" 
             alt="${item.name}" 
             class="cart-item-image" 
             onerror="this.src='images/placeholder.jpg'; this.onerror=null;">
        
        <div class="cart-item-details">
          <div class="cart-item-name">${item.name || '未命名商品'}</div>
          ${item.note ? `<div style="font-size: 0.85rem; color: var(--dark-gray); margin-top: 0.25rem;">備註：${item.note}</div>` : ''}
          <div class="cart-item-price">單價 $${item.price || 0}</div>
          ${optionsHTML}
          ${extrasHTML}
          
          <!-- 數量控制器 -->
          <div class="quantity-control">
            <button onclick="window.updateItemQuantity(${index}, -1)" 
                    class="quantity-btn" 
                    title="減少數量"
                    aria-label="減少數量">−</button>
            <span class="quantity-display">${item.quantity || 1}</span>
            <button onclick="window.updateItemQuantity(${index}, 1)" 
                    class="quantity-btn" 
                    title="增加數量"
                    aria-label="增加數量">+</button>
          </div>
        </div>
        
        <div class="cart-item-actions">
          <div class="cart-item-total">$${itemTotal}</div>
          <div class="cart-item-buttons">
            <button onclick="window.editCartItem(${index})" 
                    class="edit-btn" 
                    title="編輯商品"
                    aria-label="編輯 ${item.name}">
              ✏️ 編輯
            </button>
            <button onclick="window.removeFromCart(${index})" 
                    class="remove-btn" 
                    title="移除商品"
                    aria-label="移除 ${item.name}">
              🗑️ 刪除
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  // 重新計算總金額
  window.calculateTotal();
};

// ===== 更新商品數量（數量增減器）=====
window.updateItemQuantity = function(index, change) {
  if (!window.cart) {
    window.cart = CartUtils.loadCart();
  }
  
  if (index < 0 || index >= window.cart.length) {
    console.error('❌ 無效的商品索引:', index);
    if (typeof window.showError === 'function') {
      window.showError('操作失敗：找不到該商品');
    }
    return;
  }
  
  const item = window.cart[index];
  const newQuantity = (item.quantity || 1) + change;
  
  // 如果減到 0，詢問是否刪除
  if (newQuantity <= 0) {
    const productName = item.name || '此商品';
    
    const doRemove = () => {
      window.cart.splice(index, 1);
      CartUtils.saveCart(window.cart);
      window.renderCartItems();
      window.updateCartCount();
      
      if (typeof window.showSuccess === 'function') {
        window.showSuccess('商品已移除');
      }
    };
    
    if (typeof window.showConfirm === 'function') {
      window.showConfirm(
        `確定要從購物車移除「${productName}」嗎？`,
        doRemove
      );
    } else {
      if (confirm(`確定要從購物車移除「${productName}」嗎？`)) {
        doRemove();
      }
    }
    return;
  }
  
  // 更新數量（限制最大數量為 99）
  const finalQuantity = Math.min(newQuantity, 99);
  window.cart[index].quantity = finalQuantity;
  
  if (!CartUtils.saveCart(window.cart)) {
    return; // 儲存失敗，不繼續執行
  }
  
  window.renderCartItems();
  window.updateCartCount();
  
  // 即時觸發計算並更新 DOM
  if (typeof window.calculateTotal === 'function') {
    window.calculateTotal();
  }
  
  // 顯示成功提示（僅在數量變化時）
  if (typeof window.showSuccess === 'function' && change !== 0) {
    const action = change > 0 ? '增加' : '減少';
    window.showSuccess(`已${action} ${item.name} 數量`);
  }
};

// ===== 移除商品 =====
window.removeFromCart = function(index) {
  if (!window.cart) {
    window.cart = CartUtils.loadCart();
  }
  
  if (index < 0 || index >= window.cart.length) {
    console.error('❌ 無效的商品索引:', index);
    if (typeof window.showError === 'function') {
      window.showError('操作失敗：找不到該商品');
    }
    return;
  }
  
  const productName = window.cart[index].name || '此商品';
  
  const doDelete = () => {
    window.cart.splice(index, 1);
    
    if (!CartUtils.saveCart(window.cart)) {
      return; // 儲存失敗，不繼續執行
    }
    
    window.renderCartItems();
    window.updateCartCount();
    
    if (typeof window.showSuccess === 'function') {
      window.showSuccess('商品已移除');
    }
  };
  
  if (typeof window.showConfirm === 'function') {
    window.showConfirm(`確定要移除「${productName}」嗎？`, doDelete);
  } else {
    if (confirm(`確定要移除「${productName}」嗎？`)) {
      doDelete();
    }
  }
};

// ===== 載入可用折價券 =====
window.loadAvailableCoupons = function() {
  const couponSelect = document.getElementById('couponSelect');
  if (!couponSelect) return;
  
  // 取得當前用戶
  const currentUser = typeof window.getCurrentUser === 'function' 
    ? window.getCurrentUser() 
    : JSON.parse(localStorage.getItem('currentUser') || 'null');
  
  if (!currentUser) {
    couponSelect.innerHTML = '<option value="">請先登入</option>';
    return;
  }
  
  // 取得用戶擁有的折價券
  const ownedCoupons = currentUser.ownedCoupons || [];
  const ownedCouponCodes = ownedCoupons.map(c => c.code || c);
  
  // 取得所有折價券
  const allCoupons = typeof getAllCoupons === 'function' 
    ? getAllCoupons() 
    : JSON.parse(localStorage.getItem('coupons') || '[]');
  
  // 計算購物車小計（用於驗證最低消費）
  const cart = CartUtils.loadCart();
  const cartSubtotal = CartUtils.getSubtotal(cart);
  
  // 過濾：只顯示用戶擁有的券 + 全站免費券（pointCost === 0）
  // 排除已過期或未達低消的券
  const availableCoupons = allCoupons.filter(c => {
    if (!c.active) return false;
    const pointCost = c.pointCost || 0;
    
    // 必須是用戶擁有的券或全站免費券
    const isOwned = ownedCouponCodes.includes(c.code);
    if (pointCost > 0 && !isOwned) return false;
    
    // 檢查最低消費（未達低消的券設為 disabled，但不隱藏）
    const minAmount = c.minAmount || 0;
    if (cartSubtotal < minAmount) {
      // 未達低消，但保留在列表中（會設為 disabled）
      return true;
    }
    
    return true;
  });
  
  // 生成選項
  if (availableCoupons.length === 0) {
    couponSelect.innerHTML = '<option value="">暫無可用折價券</option>';
  } else {
    couponSelect.innerHTML = '<option value="">不使用折價券</option>' + 
      availableCoupons.map(coupon => {
        const discountText = coupon.type === 'percent' 
          ? `${Math.round((1 - coupon.discount) * 100)}% OFF` 
          : `折 $${coupon.discount}`;
        const minAmount = coupon.minAmount || 0;
        const minAmountText = minAmount > 0 ? ` (滿 $${minAmount})` : '';
        
        // 檢查是否未達低消
        const isDisabled = cartSubtotal < minAmount;
        const disabledAttr = isDisabled ? ' disabled' : '';
        const disabledText = isDisabled ? ' [未達低消]' : '';
        
        return `<option value="${coupon.code}"${disabledAttr}>${coupon.title} - ${discountText}${minAmountText}${disabledText}</option>`;
      }).join('');
  }
};

// ===== 計算總金額（含折價券，無運費）=====
window.calculateTotal = function() {
  if (!window.cart) {
    window.cart = CartUtils.loadCart();
  }
  
  // 計算小計
  const subtotal = CartUtils.getSubtotal(window.cart);
  
  // 折價券折扣
  let discount = 0;
  let discountInfo = null;
  const couponSelect = document.getElementById('couponSelect');
  
  if (couponSelect && couponSelect.value) {
    try {
      const couponCode = couponSelect.value;
      const coupons = JSON.parse(localStorage.getItem('coupons') || '[]');
      const coupon = coupons.find(c => c.code === couponCode && c.active !== false);
      
      if (coupon) {
        // 檢查最低消費金額
        if (subtotal >= (coupon.minAmount || 0)) {
          if (coupon.type === 'percent') {
            // 百分比折扣
            discount = Math.round(subtotal * (1 - coupon.discount));
          } else if (coupon.type === 'fixed') {
            // 固定金額折扣
            discount = coupon.discount;
          }
          
          // 檢查最大折扣金額
          if (coupon.maxDiscount && discount > coupon.maxDiscount) {
            discount = coupon.maxDiscount;
          }
          
          discountInfo = {
            originalPrice: subtotal,
            discount: discount,
            coupon: coupon
          };
        } else {
          // 未達最低消費
          if (typeof window.showError === 'function') {
            window.showError(`此折價券需消費滿 $${coupon.minAmount} 才能使用`);
          }
          couponSelect.value = '';
          discount = 0;
        }
      }
    } catch (error) {
      console.error('❌ 折價券處理失敗:', error);
      discount = 0;
    }
  }
  
  // 總金額 = 小計 - 折扣（無運費）
  const finalTotal = Math.max(0, subtotal - discount);
  
  // 更新桌面版顯示
  const subtotalElement = document.getElementById('cartSubtotal');
  const discountElement = document.getElementById('discountAmount');
  const totalElement = document.getElementById('cartTotal');
  const discountInfoDiv = document.getElementById('discountInfo');
  const originalPriceElement = document.getElementById('originalPrice');
  
  // 小計（商品總價，含加料）
  if (subtotalElement) {
    subtotalElement.textContent = '$' + subtotal;
  }
  
  // 折扣（負數顯示）
  if (discountElement) {
    if (discount > 0) {
      discountElement.textContent = '-$' + discount;
      discountElement.style.color = 'var(--accent-green)';
    } else {
      discountElement.textContent = '$0';
      discountElement.style.color = 'inherit';
    }
  }
  
  // 總計（小計 - 折扣）
  if (totalElement) {
    totalElement.textContent = '$' + finalTotal;
  }
  
  // 顯示/隱藏折扣資訊
  if (discount > 0 && discountInfo) {
    if (discountInfoDiv) discountInfoDiv.style.display = 'block';
    if (discountElement) discountElement.textContent = '-$' + discount;
    if (originalPriceElement) originalPriceElement.textContent = '$' + discountInfo.originalPrice;
  } else {
    if (discountInfoDiv) discountInfoDiv.style.display = 'none';
  }
  
  // 更新手機版底部總金額
  const mobileTotal = document.getElementById('mobileCartTotal');
  if (mobileTotal) {
    mobileTotal.textContent = '$' + finalTotal;
  }
  
  return {
    subtotal,
    discount,
    total: finalTotal
  };
};

// ===== 清空購物車 =====
window.clearCart = function() {
  if (!window.cart || window.cart.length === 0) {
    return;
  }
  
  const doClear = () => {
    window.cart = [];
    CartUtils.saveCart(window.cart);
    window.updateCartCount();
    window.renderCartItems();
    
    if (typeof window.showSuccess === 'function') {
      window.showSuccess('購物車已清空');
    }
  };
  
  if (typeof window.showConfirm === 'function') {
    window.showConfirm('確定要清空購物車嗎？', doClear);
  } else {
    if (confirm('確定要清空購物車嗎？')) {
      doClear();
    }
  }
};

// ===== 編輯購物車商品 =====
window.editCartItem = function(index) {
  if (!window.cart) {
    window.cart = CartUtils.loadCart();
  }
  
  if (index < 0 || index >= window.cart.length) {
    if (typeof window.showError === 'function') {
      window.showError('找不到該商品');
    }
    return;
  }
  
  const item = window.cart[index];
  window.editingCartIndex = index;
  
  // 使用 SweetAlert2 風格的 Modal
  showEditCartModal(item);
};

// ===== 顯示編輯購物車 Modal =====
function showEditCartModal(item) {
  // 創建 Modal 遮罩
  const overlay = document.createElement('div');
  overlay.className = 'edit-cart-modal-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.3s ease;
  `;
  
  // 創建 Modal 內容
  const modal = document.createElement('div');
  modal.className = 'edit-cart-modal';
  modal.style.cssText = `
    background: white;
    border-radius: 16px;
    max-width: 500px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    animation: slideUp 0.3s ease;
    position: relative;
  `;
  
  modal.innerHTML = `
    <div style="padding: 1.5rem; border-bottom: 2px solid #f0f0f0;">
      <h2 style="margin: 0; font-size: 1.5rem; font-weight: 700; color: #333;">✏️ 編輯商品</h2>
      <button class="edit-cart-modal-close" style="position: absolute; top: 1.5rem; right: 1.5rem; background: none; border: none; font-size: 2rem; color: #999; cursor: pointer; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: all 0.2s;" onclick="closeEditCartModal()">&times;</button>
    </div>
    <div style="padding: 1.5rem;">
      <div style="margin-bottom: 1.5rem;">
        <label style="display: block; font-weight: 600; color: #333; margin-bottom: 0.8rem; font-size: 1.05rem;">商品名稱</label>
        <div style="padding: 0.8rem; background: #f5f5f5; border-radius: 8px; color: #666;">${item.name || '未命名商品'}</div>
      </div>
      <div style="margin-bottom: 1.5rem;">
        <label style="display: block; font-weight: 600; color: #333; margin-bottom: 0.8rem; font-size: 1.05rem;">數量</label>
        <div style="display: flex; align-items: center; gap: 1rem;">
          <button onclick="decreaseEditQuantity()" style="width: 40px; height: 40px; border: 2px solid #e0e0e0; background: white; border-radius: 8px; font-size: 1.5rem; cursor: pointer; transition: all 0.2s;">−</button>
          <input type="number" id="editCartQuantity" value="${item.quantity || 1}" min="1" max="99" style="flex: 1; padding: 0.8rem; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1rem; text-align: center;">
          <button onclick="increaseEditQuantity()" style="width: 40px; height: 40px; border: 2px solid #e0e0e0; background: white; border-radius: 8px; font-size: 1.5rem; cursor: pointer; transition: all 0.2s;">+</button>
        </div>
      </div>
      <div style="margin-bottom: 1.5rem;">
        <label style="display: block; font-weight: 600; color: #333; margin-bottom: 0.8rem; font-size: 1.05rem;">備註</label>
        <textarea id="editCartNote" placeholder="有什麼特殊需求嗎？（選填）" rows="3" style="width: 100%; padding: 0.8rem; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1rem; font-family: inherit; resize: vertical;">${item.note || ''}</textarea>
      </div>
    </div>
    <div style="padding: 1.5rem; border-top: 2px solid #f0f0f0; display: flex; justify-content: flex-end; gap: 1rem;">
      <button onclick="closeEditCartModal()" style="padding: 0.8rem 1.5rem; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; background: #f0f0f0; color: #333; transition: all 0.2s;">取消</button>
      <button onclick="saveEditCartItem()" style="padding: 0.8rem 1.5rem; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; background: linear-gradient(135deg, #FF9F43, #FFB74D); color: white; box-shadow: 0 4px 12px rgba(255, 159, 67, 0.3); transition: all 0.2s;">💾 儲存變更</button>
    </div>
  `;
  
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';
  
  // 點擊遮罩關閉
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeEditCartModal();
    }
  });
  
  // 儲存 overlay 引用
  window.currentEditCartOverlay = overlay;
}

// ===== 關閉編輯購物車 Modal =====
window.closeEditCartModal = function() {
  if (window.currentEditCartOverlay) {
    window.currentEditCartOverlay.remove();
    window.currentEditCartOverlay = null;
    document.body.style.overflow = 'auto';
  }
  window.editingCartIndex = null;
};

// ===== 減少數量 =====
window.decreaseEditQuantity = function() {
  const input = document.getElementById('editCartQuantity');
  if (input) {
    const current = parseInt(input.value) || 1;
    if (current > 1) {
      input.value = current - 1;
    }
  }
};

// ===== 增加數量 =====
window.increaseEditQuantity = function() {
  const input = document.getElementById('editCartQuantity');
  if (input) {
    const current = parseInt(input.value) || 1;
    if (current < 99) {
      input.value = current + 1;
    }
  }
};

// ===== 儲存編輯變更 =====
window.saveEditCartItem = function() {
  if (window.editingCartIndex === null || window.editingCartIndex === undefined) {
    return;
  }
  
  if (!window.cart) {
    window.cart = CartUtils.loadCart();
  }
  
  const index = window.editingCartIndex;
  if (index < 0 || index >= window.cart.length) {
    return;
  }
  
  const quantityInput = document.getElementById('editCartQuantity');
  const noteInput = document.getElementById('editCartNote');
  
  if (!quantityInput) {
    return;
  }
  
  const newQuantity = parseInt(quantityInput.value) || 1;
  const newNote = noteInput ? noteInput.value.trim() : '';
  
  if (newQuantity < 1 || newQuantity > 99) {
    if (typeof window.showError === 'function') {
      window.showError('數量必須在 1-99 之間');
    }
    return;
  }
  
  // 更新商品
  window.cart[index].quantity = newQuantity;
  if (newNote) {
    window.cart[index].note = newNote;
  } else {
    delete window.cart[index].note;
  }
  
  // 儲存到 localStorage
  if (!CartUtils.saveCart(window.cart)) {
    return;
  }
  
  // 重新渲染購物車
        window.renderCartItems();
  window.closeEditCartModal();
  
  if (typeof window.showSuccess === 'function') {
    window.showSuccess('商品已更新');
  }
};

// ===== 獲取購物車摘要資訊 =====
window.getCartSummary = function() {
  if (!window.cart) {
    window.cart = CartUtils.loadCart();
  }
  
  const totalItems = CartUtils.getTotalItems(window.cart);
  const subtotal = CartUtils.getSubtotal(window.cart);
  
  return {
    itemCount: totalItems,
    productCount: window.cart.length,
    subtotal: subtotal,
    isEmpty: window.cart.length === 0
  };
};

// ===== 頁面載入時自動初始化 =====
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.initShoppingCart();
  });
      } else {
  // DOM 已經載入完成
  window.initShoppingCart();
}

// ===== 監聽 localStorage 變化（多分頁同步）=====
window.addEventListener('storage', (e) => {
  if (e.key === 'cart') {
    console.log('🔄 購物車數據已更新（來自其他分頁）');
    window.initShoppingCart();
    
    // 如果在購物車頁面，重新渲染
    if (document.getElementById('cartItems')) {
      window.renderCartItems();
    }
  }
});

// ===== 導出工具函數（供其他模組使用）=====
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CartUtils,
    initShoppingCart: window.initShoppingCart,
    updateCartCount: window.updateCartCount,
    renderCartItems: window.renderCartItems,
    updateItemQuantity: window.updateItemQuantity,
    removeFromCart: window.removeFromCart,
    calculateTotal: window.calculateTotal,
    clearCart: window.clearCart,
    getCartSummary: window.getCartSummary
  };
}
