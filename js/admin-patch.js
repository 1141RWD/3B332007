// ===== ADMIN.JS 緊急修復補丁 =====
// 請將以下代碼添加到 admin.js 的最前面

// ===== 1. Storage 事件監聽（即時更新）=====
window.addEventListener('storage', (e) => {
  if (e.key === 'contact_messages') {
    // 客服訊息有更新
    if (typeof renderAdminContactMessages === 'function') {
      renderAdminContactMessages();
      if (typeof updateAdminStats === 'function') {
        updateAdminStats();
      }
      window.showToast('收到新的客服訊息', 'success');
    }
  }
  
  if (e.key === 'orders') {
    // 訂單有更新
    if (typeof loadOrders === 'function') {
      loadOrders();
    }
  }
});

// ===== 2. 訂單狀態更新（含點數回饋）=====
// 替換原有的 updateOrderStatus 函數
function updateOrderStatus(orderId) {
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  const orderIndex = orders.findIndex(o => o.id === orderId);
  
  if (orderIndex === -1) {
    window.showError('找不到訂單');
    return;
  }
  
  const order = orders[orderIndex];
  const oldStatus = order.status;
  
  // 使用自定義對話框或簡單的 prompt
  const statusOptions = `
請選擇新狀態：
1. 待處理 (pending)
2. 製作中 (processing)
3. 已完成 (completed)
4. 已取消 (cancelled)
  `;
  
  const choice = prompt(statusOptions);
  
  const statusMap = {
    '1': 'pending',
    '2': 'processing',
    '3': 'completed',
    '4': 'cancelled'
  };
  
  if (!statusMap[choice]) {
    return;
  }
  
  const newStatus = statusMap[choice];
  
  // 更新狀態
  orders[orderIndex].status = newStatus;
  orders[orderIndex].updatedAt = new Date().toISOString();
  
  // 如果狀態改為「已完成」，回饋點數
  if (newStatus === 'completed' && oldStatus !== 'completed') {
    const pointsToAdd = Math.floor(order.total); // 1元 = 1點
    
    // 找到用戶並增加點數
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.email === order.customerEmail);
    
    if (userIndex !== -1) {
      if (!users[userIndex].points) {
        users[userIndex].points = 0;
      }
      users[userIndex].points += pointsToAdd;
      localStorage.setItem('users', JSON.stringify(users));
      
      window.showSuccess(`訂單狀態已更新！已回饋 ${pointsToAdd} 點給會員 ${order.customerName}`);
    } else {
      window.showSuccess('訂單狀態已更新！');
    }
  } else {
    window.showSuccess('訂單狀態已更新！');
  }
  
  localStorage.setItem('orders', JSON.stringify(orders));
  
  // 重新載入訂單列表
  if (typeof loadOrders === 'function') {
    loadOrders();
  }
}

// ===== 3. 折價券管理功能 =====

// 載入折價券列表
function loadCoupons() {
  const coupons = JSON.parse(localStorage.getItem('coupons') || '[]');
  const panel = document.getElementById('couponsContent');
  
  if (!panel) {
    console.warn('找不到 couponsContent 元素');
    return;
  }
  
  panel.innerHTML = `
    <div style="margin-bottom: var(--spacing-lg); display: flex; justify-content: space-between; align-items: center;">
      <h3 style="margin: 0;">折價券列表</h3>
      <button class="action-btn add-btn" onclick="showAddCouponDialog()" style="background: linear-gradient(135deg, #4CAF50, #45A049); color: white; padding: var(--spacing-sm) var(--spacing-lg); border: none; border-radius: var(--radius-sm); cursor: pointer; font-weight: 600;">
        ➕ 新增折價券
      </button>
    </div>
    
    <div class="data-table" style="background: var(--white); border-radius: var(--radius-md); overflow: hidden; box-shadow: var(--shadow-sm);">
      <table style="width: 100%; border-collapse: collapse;">
        <thead style="background: var(--soft-peach);">
          <tr>
            <th style="padding: var(--spacing-md); text-align: left; font-weight: 700; color: var(--text-dark);">代碼</th>
            <th style="padding: var(--spacing-md); text-align: left;">標題</th>
            <th style="padding: var(--spacing-md); text-align: left;">折扣</th>
            <th style="padding: var(--spacing-md); text-align: left;">條件</th>
            <th style="padding: var(--spacing-md); text-align: center;">狀態</th>
            <th style="padding: var(--spacing-md); text-align: center;">主打</th>
            <th style="padding: var(--spacing-md); text-align: center;">操作</th>
          </tr>
        </thead>
        <tbody>
          ${coupons.length === 0 ? `
            <tr>
              <td colspan="7" style="padding: 2rem; text-align: center; color: var(--dark-gray);">
                尚無折價券
              </td>
            </tr>
          ` : coupons.map(c => {
            const discountText = c.type === 'percent' 
              ? `${Math.round((1 - c.discount) * 100)}% OFF` 
              : `折 $${c.discount}`;
            
            return `
              <tr style="border-bottom: 1px solid var(--light-gray);">
                <td style="padding: var(--spacing-md);"><strong style="color: var(--primary-orange);">${c.code}</strong></td>
                <td style="padding: var(--spacing-md);">${c.title}</td>
                <td style="padding: var(--spacing-md);"><span style="background: var(--soft-peach); padding: 0.3rem 0.6rem; border-radius: var(--radius-sm); font-weight: 600;">${discountText}</span></td>
                <td style="padding: var(--spacing-md);">滿 $${c.minAmount}</td>
                <td style="padding: var(--spacing-md); text-align: center;">
                  <span style="padding: 0.3rem 0.8rem; border-radius: var(--radius-full); font-size: 0.9rem; font-weight: 600; ${c.active ? 'background: #E8F5E9; color: #2E7D32;' : 'background: #FFEBEE; color: #C62828;'}">
                    ${c.active ? '啟用' : '停用'}
                  </span>
                </td>
                <td style="padding: var(--spacing-md); text-align: center; font-size: 1.5rem;">
                  ${c.featured ? '⭐' : '-'}
                </td>
                <td style="padding: var(--spacing-md); text-align: center;">
                  <button onclick="toggleFeatured('${c.code}')" style="background: var(--primary-yellow); color: var(--text-dark); border: none; padding: 0.4rem 0.8rem; border-radius: var(--radius-sm); cursor: pointer; margin: 0 0.2rem; font-size: 0.85rem;">
                    ${c.featured ? '取消主打' : '設為主打'}
                  </button>
                  <button onclick="toggleCouponActive('${c.code}')" style="background: #2196F3; color: white; border: none; padding: 0.4rem 0.8rem; border-radius: var(--radius-sm); cursor: pointer; margin: 0 0.2rem; font-size: 0.85rem;">
                    ${c.active ? '停用' : '啟用'}
                  </button>
                  <button onclick="deleteCoupon('${c.code}')" style="background: var(--accent-red); color: white; border: none; padding: 0.4rem 0.8rem; border-radius: var(--radius-sm); cursor: pointer; margin: 0 0.2rem; font-size: 0.85rem;">
                    刪除
                  </button>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// 顯示新增折價券對話框
function showAddCouponDialog() {
  const code = prompt('折價券代碼（例：OPEN88）：');
  if (!code || !code.trim()) return;
  
  const title = prompt('標題（例：開幕88折）：');
  if (!title || !title.trim()) return;
  
  const typeChoice = confirm('點「確定」選擇百分比折扣\n點「取消」選擇固定金額');
  const type = typeChoice ? 'percent' : 'fixed';
  
  const discountPrompt = type === 'percent' 
    ? '折扣（例：0.88 表示88折）：' 
    : '折扣金額（例：100 表示折100元）：';
  
  const discount = parseFloat(prompt(discountPrompt));
  if (isNaN(discount)) return;
  
  const minAmount = parseInt(prompt('最低消費（預設0）：') || '0');
  const description = prompt('說明（選填）：') || title;
  
  // 新增折價券
  const coupons = JSON.parse(localStorage.getItem('coupons') || '[]');
  
  // 檢查代碼是否已存在
  if (coupons.find(c => c.code.toUpperCase() === code.toUpperCase())) {
    window.showError('此代碼已存在');
    return;
  }
  
  const newCoupon = {
    code: code.toUpperCase(),
    title,
    type,
    discount,
    minAmount,
    maxDiscount: null,
    description,
    active: true,
    featured: false,
    createdAt: new Date().toISOString()
  };
  
  coupons.push(newCoupon);
  localStorage.setItem('coupons', JSON.stringify(coupons));
  
  window.showSuccess('折價券新增成功！');
  loadCoupons();
}

// 切換主打狀態
function toggleFeatured(code) {
  const coupons = JSON.parse(localStorage.getItem('coupons') || '[]');
  
  // 先將所有折價券的 featured 設為 false
  coupons.forEach(c => {
    c.featured = false;
  });
  
  // 將指定的折價券設為 featured
  const coupon = coupons.find(c => c.code === code);
  if (coupon) {
    coupon.featured = true;
    localStorage.setItem('coupons', JSON.stringify(coupons));
    window.showSuccess(`${coupon.title} 已設為主打折價券`);
    loadCoupons();
    
    // 重新顯示公告
    const banner = document.getElementById('announcementBanner');
    if (banner) banner.remove();
    if (typeof window.showAnnouncement === 'function') {
      window.showAnnouncement();
    }
  }
}

// 切換啟用狀態
function toggleCouponActive(code) {
  const coupons = JSON.parse(localStorage.getItem('coupons') || '[]');
  const coupon = coupons.find(c => c.code === code);
  
  if (coupon) {
    coupon.active = !coupon.active;
    localStorage.setItem('coupons', JSON.stringify(coupons));
    window.showSuccess(`折價券已${coupon.active ? '啟用' : '停用'}`);
    loadCoupons();
  }
}

// 刪除折價券
function deleteCoupon(code) {
  window.showConfirm('確定要刪除此折價券嗎？', () => {
    let coupons = JSON.parse(localStorage.getItem('coupons') || '[]');
    coupons = coupons.filter(c => c.code !== code);
    localStorage.setItem('coupons', JSON.stringify(coupons));
    window.showSuccess('折價券已刪除');
    loadCoupons();
  });
}

console.log('✅ Admin.js 補丁已載入');