// 管理後台 JavaScript
// 處理訂單管理、會員管理、商品管理、客服訊息管理

// ===== 導覽列功能 =====
const navbarToggle = document.getElementById('navbarToggle');
const navbarMenu = document.getElementById('navbarMenu');

if (navbarToggle) {
  navbarToggle.addEventListener('click', () => {
    navbarToggle.classList.toggle('active');
    navbarMenu.classList.toggle('active');
  });
}

// ===== 初始化統計數據 =====
function initStats() {
  // 訂單數量
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  const totalOrdersEl = document.getElementById('totalOrders');
  if (totalOrdersEl) totalOrdersEl.textContent = orders.length;
  
  // 會員數量
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const totalMembersEl = document.getElementById('totalMembers');
  if (totalMembersEl) totalMembersEl.textContent = users.length;
  
  // 商品數量
  const totalProductsEl = document.getElementById('totalProducts');
  if (totalProductsEl) totalProductsEl.textContent = products.length;
  
  // 待回覆訊息數量（統一使用小寫狀態）
  const messages = JSON.parse(localStorage.getItem('contactMessages') || localStorage.getItem('contact_messages') || '[]');
  const pendingMessages = messages.filter(m => {
    const status = (m.status || '').toLowerCase();
    return status === 'pending';
  });
  const totalMessagesEl = document.getElementById('totalMessages');
  if (totalMessagesEl) totalMessagesEl.textContent = pendingMessages.length;
}

// ===== 切換分頁 =====
function switchTab(tabName) {
  // 移除所有 active 狀態
  document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  document.querySelectorAll('.admin-panel').forEach(panel => {
    panel.classList.remove('active');
  });
  
  // 添加 active 到當前分頁
  event.target.classList.add('active');
  document.getElementById(tabName + 'Panel').classList.add('active');
  
  // 載入對應資料
  switch(tabName) {
    case 'orders':
      loadOrders();
      break;
    case 'members':
      loadMembers();
      break;
    case 'products':
      loadProducts();
      break;
    case 'coupons':
      loadCoupons();
      break;
    case 'messages':
      loadMessages();
      break;
  }
}

// ===== 訂單管理 =====
function loadOrders() {
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  const tableHtml = `
    <table>
      <thead>
        <tr>
          <th>訂單編號</th>
          <th>顧客</th>
          <th>用餐方式</th>
          <th>金額</th>
          <th>狀態</th>
          <th>時間</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        ${orders.length === 0 ? '<tr><td colspan="7" style="text-align: center; padding: 2rem;">目前沒有訂單</td></tr>' : orders.map(order => `
          <tr>
            <td><strong>${order.id}</strong></td>
            <td>${order.customerName || order.customerEmail}</td>
            <td>${order.diningOption === 'dine-in' ? '🪑 內用' : '🛍️ 外帶'}${order.tableNumber ? ' - ' + order.tableNumber : ''}</td>
            <td>$${order.total}</td>
            <td>
              <span class="status-badge ${getStatusClass(order.status)}">
                ${getStatusText(order.status)}
              </span>
            </td>
            <td>${new Date(order.createdAt).toLocaleString('zh-TW')}</td>
            <td>
              <button class="action-btn btn-view" onclick="viewOrder('${order.id}')">查看</button>
              <button class="action-btn btn-edit" onclick="updateOrderStatus('${order.id}')">狀態</button>
              <button class="action-btn btn-delete" onclick="deleteOrder('${order.id}')">刪除</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
  
  document.getElementById('ordersTable').innerHTML = tableHtml;
}

function getStatusClass(status) {
  const statusMap = {
    'pending': 'status-pending',
    'processing': 'status-pending',
    'completed': 'status-completed',
    'cancelled': 'status-cancelled'
  };
  return statusMap[status] || 'status-pending';
}

function getStatusText(status) {
  const textMap = {
    'pending': '待處理',
    'processing': '製作中',
    'completed': '已完成',
    'cancelled': '已取消'
  };
  return textMap[status] || '待處理';
}

function viewOrder(orderId) {
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  const order = orders.find(o => o.id === orderId);
  
  if (!order) {
    if (typeof window.showError === 'function') {
      window.showError('找不到訂單');
    }
    return;
  }
  
  const itemsList = order.items.map(item => {
    let customizations = [];
    if (item.options) {
      if (item.options.extras && item.options.extras.length > 0) {
        customizations.push('加料：' + item.options.extras.map(e => `${e.name} (+$${e.price})`).join(', '));
      }
      if (item.options.sauceOption) {
        customizations.push('醬料：' + item.options.sauceOption);
      }
      if (item.options.spicyLevel) {
        customizations.push('辣度：' + item.options.spicyLevel);
      }
      if (item.options.sweetness) {
        customizations.push('糖度：' + item.options.sweetness);
      }
      if (item.options.ice) {
        customizations.push('冰塊：' + item.options.ice);
      }
    }
    // 顯示備註
    if (item.note) {
      customizations.push('備註：' + item.note);
    }
    return {
      name: item.name,
      quantity: item.quantity,
      price: calculateItemTotal(item),
      customizations: customizations
    };
  });
  
  const orderDetailsHTML = `
    <div style="max-width: 100%; overflow-x: auto;">
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 1rem;">
        <tr>
          <td style="padding: 0.5rem; font-weight: 600; width: 120px;">訂單編號</td>
          <td style="padding: 0.5rem;">${order.id}</td>
        </tr>
        <tr>
          <td style="padding: 0.5rem; font-weight: 600;">顧客資訊</td>
          <td style="padding: 0.5rem;">${order.customerName || order.customerEmail}</td>
        </tr>
        <tr>
          <td style="padding: 0.5rem; font-weight: 600;">電話</td>
          <td style="padding: 0.5rem;">${order.customerPhone || '未提供'}</td>
        </tr>
        <tr>
          <td style="padding: 0.5rem; font-weight: 600;">用餐方式</td>
          <td style="padding: 0.5rem;">${order.diningOption === 'dine-in' ? '內用' : '外帶'}</td>
        </tr>
        ${order.tableNumber ? `<tr><td style="padding: 0.5rem; font-weight: 600;">桌號</td><td style="padding: 0.5rem;">${order.tableNumber}</td></tr>` : ''}
        ${order.pickupTime ? `<tr><td style="padding: 0.5rem; font-weight: 600;">取餐時間</td><td style="padding: 0.5rem;">${order.pickupTime}</td></tr>` : ''}
        <tr>
          <td style="padding: 0.5rem; font-weight: 600;">訂單狀態</td>
          <td style="padding: 0.5rem;">${getStatusText(order.status)}</td>
        </tr>
        <tr>
          <td style="padding: 0.5rem; font-weight: 600;">下單時間</td>
          <td style="padding: 0.5rem;">${new Date(order.createdAt).toLocaleString('zh-TW')}</td>
        </tr>
      </table>
      
      <div style="margin: 1.5rem 0;">
        <h3 style="font-size: 1.1rem; margin-bottom: 0.75rem; color: #333;">訂單明細</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #f5f5f5;">
              <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #ddd;">商品</th>
              <th style="padding: 0.75rem; text-align: center; border-bottom: 2px solid #ddd;">數量</th>
              <th style="padding: 0.75rem; text-align: right; border-bottom: 2px solid #ddd;">金額</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList.map(item => `
              <tr>
                <td style="padding: 0.75rem; border-bottom: 1px solid #eee;">
                  <div style="font-weight: 600;">${item.name}</div>
                  ${item.customizations.length > 0 ? `<div style="font-size: 0.85rem; color: #666; margin-top: 0.25rem;">${item.customizations.join(' | ')}</div>` : ''}
                </td>
                <td style="padding: 0.75rem; text-align: center; border-bottom: 1px solid #eee;">x${item.quantity}</td>
                <td style="padding: 0.75rem; text-align: right; border-bottom: 1px solid #eee;">$${item.price}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 1rem;">
        <tr>
          <td style="padding: 0.5rem; font-weight: 600; text-align: right;">小計</td>
          <td style="padding: 0.5rem; text-align: right; width: 100px;">$${order.subtotal}</td>
        </tr>
        ${order.discount > 0 ? `
        <tr>
          <td style="padding: 0.5rem; font-weight: 600; text-align: right; color: var(--accent-green);">折扣優惠</td>
          <td style="padding: 0.5rem; text-align: right; color: var(--accent-green);">-$${order.discount}</td>
        </tr>
        ${order.couponCode ? `
        <tr>
          <td style="padding: 0.25rem; font-size: 0.85rem; text-align: right; color: var(--dark-gray);">使用優惠券</td>
          <td style="padding: 0.25rem; font-size: 0.85rem; text-align: right; color: var(--dark-gray);">${order.couponCode}</td>
        </tr>
        ` : ''}
        ` : ''}
        <tr style="border-top: 2px solid #333;">
          <td style="padding: 0.75rem; font-weight: 700; text-align: right; font-size: 1.1rem;">總計</td>
          <td style="padding: 0.75rem; text-align: right; font-weight: 700; font-size: 1.1rem; color: var(--primary-orange);">$${order.total}</td>
        </tr>
      </table>
      
      ${order.note ? `<div style="margin-top: 1rem; padding: 0.75rem; background: #FFF3E0; border-radius: 8px;"><strong>訂單備註：</strong>${order.note}</div>` : ''}
    </div>
  `;
  
  if (typeof window.showAdminModal === 'function') {
    window.showAdminModal({
      title: '訂單詳情',
      body: orderDetailsHTML,
      showCancel: false,
      onConfirm: () => {
        window.closeAdminModal();
      }
    });
  } else {
    alert('訂單詳情請查看控制台');
    console.log(order);
  }
}

function updateOrderStatus(orderId) {
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  const order = orders.find(o => o.id === orderId);
  
  if (!order) {
    if (typeof window.showError === 'function') {
      window.showError('找不到訂單');
    }
    return;
  }
  
  // 顯示狀態選擇 Modal
  if (typeof window.showAdminModal === 'function') {
    window.showAdminModal({
      title: '更新訂單狀態',
      body: `
        <div class="admin-modal-form-group">
          <label class="admin-modal-form-label">選擇新狀態</label>
          <select id="newOrderStatus" class="admin-modal-form-select">
            <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>待處理</option>
            <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>製作中</option>
            <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>已完成</option>
            <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>已取消</option>
          </select>
        </div>
      `,
      footer: `
        <button class="admin-modal-btn admin-modal-btn-cancel" onclick="window.closeAdminModal()">取消</button>
        <button class="admin-modal-btn admin-modal-btn-confirm" onclick="confirmUpdateOrderStatus('${orderId}')">確認更新</button>
      `
    });
  } else {
    console.error('showAdminModal 函數未定義');
  }
}

// ===== 確認更新訂單狀態 =====
window.confirmUpdateOrderStatus = function(orderId) {
  const newStatus = document.getElementById('newOrderStatus').value;
  
  if (!newStatus) {
    if (typeof window.showError === 'function') {
      window.showError('請選擇狀態');
    }
    return;
  }
  
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  const orderIndex = orders.findIndex(o => o.id === orderId);
  
  if (orderIndex === -1) {
    if (typeof window.showError === 'function') {
      window.showError('找不到訂單');
    }
    window.closeAdminModal();
    return;
  }
  
  const order = orders[orderIndex];
  const oldStatus = order.status;
  
  orders[orderIndex].status = newStatus;
  orders[orderIndex].updatedAt = new Date().toISOString();
  localStorage.setItem('orders', JSON.stringify(orders));
  
  // 點數回饋邏輯：當訂單狀態變更為「已完成」時
  if (newStatus === 'completed' && oldStatus !== 'completed') {
    const userEmail = order.userEmail || order.customerEmail;
    if (userEmail) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex(u => u.email === userEmail);
      
      if (userIndex > -1) {
        // 計算獲得點數：每100元1點
        const pointsEarned = Math.floor(order.total / 100);
        
        if (pointsEarned > 0) {
          users[userIndex].points = (users[userIndex].points || 0) + pointsEarned;
          localStorage.setItem('users', JSON.stringify(users));
          
          // 更新 currentUser（如果當前登入的是該用戶）
          const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
          if (currentUser && currentUser.email === userEmail) {
            currentUser.points = users[userIndex].points;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
          }
          
          if (typeof window.showSuccess === 'function') {
            window.showSuccess(`訂單已完成，會員獲得 ${pointsEarned} 點！`);
          }
        }
      }
    }
  }
  
  window.closeAdminModal();
  loadOrders();
  
  if (typeof window.showSuccess === 'function' && newStatus !== 'completed') {
    window.showSuccess('訂單狀態已更新');
  }
}

function deleteOrder(orderId) {
  if (typeof window.showAdminModal === 'function') {
    window.showAdminModal({
      title: '確認刪除',
      body: `
        <div style="text-align: center; padding: 1rem;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
          <p style="font-size: 1.1rem; color: #333; margin-bottom: 0.5rem;">確定要刪除此訂單嗎？</p>
          <p style="color: #999; font-size: 0.95rem;">此操作無法復原</p>
        </div>
      `,
      footer: `
        <button class="admin-modal-btn admin-modal-btn-cancel" onclick="window.closeAdminModal()">取消</button>
        <button class="admin-modal-btn admin-modal-btn-danger" onclick="confirmDeleteOrder('${orderId}')">確認刪除</button>
      `
    });
  } else {
    if (confirm('確定要刪除此訂單嗎？此操作無法復原。')) {
      confirmDeleteOrder(orderId);
    }
  }
}

// ===== 確認刪除訂單 =====
window.confirmDeleteOrder = function(orderId) {
  let orders = JSON.parse(localStorage.getItem('orders') || '[]');
  orders = orders.filter(o => o.id !== orderId);
  localStorage.setItem('orders', JSON.stringify(orders));
  
  window.closeAdminModal();
  loadOrders();
  initStats();
  
  if (typeof window.showSuccess === 'function') {
    window.showSuccess('訂單已刪除');
  }
}

// ===== 會員管理 =====
function loadMembers() {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const tableHtml = `
    <table>
      <thead>
        <tr>
          <th>姓名</th>
          <th>Email</th>
          <th>電話</th>
          <th>點數</th>
          <th>狀態</th>
          <th>註冊時間</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        ${users.length === 0 ? '<tr><td colspan="7" style="text-align: center; padding: 2rem;">目前沒有會員</td></tr>' : users.map(user => `
          <tr>
            <td><strong>${user.name}</strong></td>
            <td>${user.email}</td>
            <td>${user.phone || '未提供'}</td>
            <td>${user.points || 0} 點</td>
            <td>
              <span class="status-badge ${user.active !== false ? 'status-completed' : 'status-cancelled'}">
                ${user.active !== false ? '正常' : '停權'}
              </span>
            </td>
            <td>${user.createdAt ? new Date(user.createdAt).toLocaleDateString('zh-TW') : '未知'}</td>
            <td>
              <button class="action-btn btn-view" onclick="viewMember('${user.email}')">查看</button>
              <button class="action-btn btn-edit" onclick="editMemberPoints('${user.email}')">點數</button>
              <button class="action-btn ${user.active !== false ? 'btn-delete' : 'btn-edit'}" 
                onclick="toggleMemberStatus('${user.email}')">
                ${user.active !== false ? '停權' : '啟用'}
              </button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
  
  document.getElementById('membersTable').innerHTML = tableHtml;
}

function viewMember(email) {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => u.email === email);
  
  if (!user) {
    if (typeof window.showError === 'function') {
      window.showError('找不到會員');
    }
    return;
  }
  
  const memberInfoHTML = `
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 0.75rem; font-weight: 600; width: 120px; border-bottom: 1px solid #eee;">姓名</td>
        <td style="padding: 0.75rem; border-bottom: 1px solid #eee;">${user.name}</td>
      </tr>
      <tr>
        <td style="padding: 0.75rem; font-weight: 600; border-bottom: 1px solid #eee;">Email</td>
        <td style="padding: 0.75rem; border-bottom: 1px solid #eee;">${user.email}</td>
      </tr>
      <tr>
        <td style="padding: 0.75rem; font-weight: 600; border-bottom: 1px solid #eee;">電話</td>
        <td style="padding: 0.75rem; border-bottom: 1px solid #eee;">${user.phone || '未提供'}</td>
      </tr>
      <tr>
        <td style="padding: 0.75rem; font-weight: 600; border-bottom: 1px solid #eee;">生日</td>
        <td style="padding: 0.75rem; border-bottom: 1px solid #eee;">${user.birthday || '未提供'}</td>
      </tr>
      <tr>
        <td style="padding: 0.75rem; font-weight: 600; border-bottom: 1px solid #eee;">點數</td>
        <td style="padding: 0.75rem; border-bottom: 1px solid #eee;">${user.points || 0} 點</td>
      </tr>
      <tr>
        <td style="padding: 0.75rem; font-weight: 600; border-bottom: 1px solid #eee;">權限</td>
        <td style="padding: 0.75rem; border-bottom: 1px solid #eee;">
          <span style="padding: 0.25rem 0.75rem; border-radius: 4px; background: ${user.role === 'admin' ? '#FFE0B2' : '#E3F2FD'}; color: ${user.role === 'admin' ? '#E65100' : '#1565C0'};">
            ${user.role === 'admin' ? '管理員' : '一般會員'}
          </span>
        </td>
      </tr>
      <tr>
        <td style="padding: 0.75rem; font-weight: 600; border-bottom: 1px solid #eee;">狀態</td>
        <td style="padding: 0.75rem; border-bottom: 1px solid #eee;">
          <span style="padding: 0.25rem 0.75rem; border-radius: 4px; background: ${user.active !== false ? '#C8E6C9' : '#FFCDD2'}; color: ${user.active !== false ? '#2E7D32' : '#C62828'};">
            ${user.active !== false ? '正常' : '停權'}
          </span>
        </td>
      </tr>
      <tr>
        <td style="padding: 0.75rem; font-weight: 600;">註冊時間</td>
        <td style="padding: 0.75rem;">${user.createdAt ? new Date(user.createdAt).toLocaleString('zh-TW') : '未知'}</td>
      </tr>
    </table>
  `;
  
  if (typeof window.showAdminModal === 'function') {
    window.showAdminModal({
      title: '會員資訊',
      body: memberInfoHTML,
      showCancel: false,
      onConfirm: () => {
        window.closeAdminModal();
      }
    });
  } else {
    alert('會員資訊請查看控制台');
    console.log(user);
  }
}

function editMemberPoints(email) {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const userIndex = users.findIndex(u => u.email === email);
  
  if (userIndex === -1) {
    if (typeof window.showError === 'function') {
      window.showError('找不到會員');
    }
    return;
  }
  
  const currentPoints = users[userIndex].points || 0;
  
  if (typeof window.showAdminModal === 'function') {
    window.showAdminModal({
      title: '編輯會員點數',
      body: `
        <div class="admin-modal-form-group">
          <label class="admin-modal-form-label">目前點數</label>
          <div style="padding: 0.8rem; background: #f5f5f5; border-radius: 8px; color: #666;">
            ${currentPoints} 點
          </div>
        </div>
        <div class="admin-modal-form-group">
          <label class="admin-modal-form-label">新點數</label>
          <input type="number" 
                 id="newMemberPoints" 
                 class="admin-modal-form-input" 
                 value="${currentPoints}" 
                 min="0" 
                 required>
        </div>
      `,
      footer: `
        <button class="admin-modal-btn admin-modal-btn-cancel" onclick="window.closeAdminModal()">取消</button>
        <button class="admin-modal-btn admin-modal-btn-confirm" onclick="confirmEditMemberPoints('${email}')">確認更新</button>
      `
    });
  } else {
    const newPoints = prompt(`目前點數：${currentPoints}\n請輸入新的點數：`);
  if (newPoints !== null && !isNaN(newPoints)) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex(u => u.email === email);
      if (userIndex > -1) {
    users[userIndex].points = parseInt(newPoints);
    localStorage.setItem('users', JSON.stringify(users));
    loadMembers();
        if (typeof window.showSuccess === 'function') {
          window.showSuccess('點數已更新');
        }
      }
    }
  }
}

// ===== 確認編輯會員點數 =====
window.confirmEditMemberPoints = function(email) {
  const newPointsInput = document.getElementById('newMemberPoints');
  const newPoints = parseInt(newPointsInput.value);
  
  if (isNaN(newPoints) || newPoints < 0) {
    if (typeof window.showError === 'function') {
      window.showError('請輸入有效的點數');
    }
    return;
  }
  
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const userIndex = users.findIndex(u => u.email === email);
  
  if (userIndex === -1) {
    if (typeof window.showError === 'function') {
      window.showError('找不到會員');
    }
    window.closeAdminModal();
    return;
  }
  
  users[userIndex].points = newPoints;
  localStorage.setItem('users', JSON.stringify(users));
  
  window.closeAdminModal();
  loadMembers();
  
  if (typeof window.showSuccess === 'function') {
    window.showSuccess('點數已更新');
  }
}

// ===== 切換會員權限（升級/降級管理員）=====
window.toggleMemberRole = function(email) {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const userIndex = users.findIndex(u => u.email === email);
  
  if (userIndex === -1) {
    if (typeof window.showError === 'function') {
      window.showError('找不到會員');
    }
    return;
  }
  
  const user = users[userIndex];
  const currentRole = user.role || 'user';
  const newRole = currentRole === 'admin' ? 'user' : 'admin';
  const action = newRole === 'admin' ? '升級為管理員' : '降級為一般會員';
  
  if (typeof window.showAdminModal === 'function') {
    window.showAdminModal({
      title: `確認${action}`,
      body: `
        <div style="text-align: center; padding: 1rem;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">${newRole === 'admin' ? '👑' : '👤'}</div>
          <p style="font-size: 1.1rem; color: #333; margin-bottom: 0.5rem;">確定要將「${user.name}」${action}嗎？</p>
          <p style="color: #666; font-size: 0.95rem;">目前權限：${currentRole === 'admin' ? '管理員' : '一般會員'}</p>
        </div>
      `,
      footer: `
        <button class="admin-modal-btn admin-modal-btn-cancel" onclick="window.closeAdminModal()">取消</button>
        <button class="admin-modal-btn admin-modal-btn-confirm" onclick="confirmToggleMemberRole('${email}')">確認${action}</button>
      `
    });
  } else {
    if (confirm(`確定要將「${user.name}」${action}嗎？`)) {
      confirmToggleMemberRole(email);
    }
  }
};

// ===== 確認切換會員權限 =====
window.confirmToggleMemberRole = function(email) {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const userIndex = users.findIndex(u => u.email === email);
  
  if (userIndex === -1) {
    if (typeof window.showError === 'function') {
      window.showError('找不到會員');
    }
    window.closeAdminModal();
    return;
  }
  
  const user = users[userIndex];
  const currentRole = user.role || 'user';
  user.role = currentRole === 'admin' ? 'user' : 'admin';
  
  localStorage.setItem('users', JSON.stringify(users));
  window.closeAdminModal();
  loadMembers();
  
  if (typeof window.showSuccess === 'function') {
    window.showSuccess(`會員權限已${user.role === 'admin' ? '升級為管理員' : '降級為一般會員'}`);
  }
};

function toggleMemberStatus(email) {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const userIndex = users.findIndex(u => u.email === email);
  
  if (userIndex === -1) {
    if (typeof window.showError === 'function') {
      window.showError('找不到會員');
    }
    return;
  }
  
  const currentStatus = users[userIndex].active !== false;
  const action = currentStatus ? '停權' : '啟用';
  const user = users[userIndex];
  
  if (typeof window.showAdminModal === 'function') {
    window.showAdminModal({
      title: `確認${action}會員`,
      body: `
        <div style="text-align: center; padding: 1rem;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">${currentStatus ? '⚠️' : '✅'}</div>
          <p style="font-size: 1.1rem; color: #333; margin-bottom: 0.5rem;">確定要${action}此會員嗎？</p>
          <p style="color: #666; font-size: 0.95rem;">會員：${user.name || email}</p>
        </div>
      `,
      footer: `
        <button class="admin-modal-btn admin-modal-btn-cancel" onclick="window.closeAdminModal()">取消</button>
        <button class="admin-modal-btn ${currentStatus ? 'admin-modal-btn-danger' : 'admin-modal-btn-confirm'}" onclick="confirmToggleMemberStatus('${email}')">確認${action}</button>
      `
    });
  } else {
    if (confirm(`確定要${action}此會員嗎？`)) {
      confirmToggleMemberStatus(email);
    }
  }
}

// ===== 確認切換會員狀態 =====
window.confirmToggleMemberStatus = function(email) {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const userIndex = users.findIndex(u => u.email === email);
  
  if (userIndex === -1) {
    if (typeof window.showError === 'function') {
      window.showError('找不到會員');
    }
    window.closeAdminModal();
    return;
  }
  
  const currentStatus = users[userIndex].active !== false;
  const action = currentStatus ? '停權' : '啟用';
  
  users[userIndex].active = !currentStatus;
  localStorage.setItem('users', JSON.stringify(users));
  
  window.closeAdminModal();
  loadMembers();
  
  if (typeof window.showSuccess === 'function') {
    window.showSuccess(`會員已${action}`);
  }
}

// ===== 商品管理 =====
function loadProducts() {
  const tableHtml = `
    <table>
      <thead>
        <tr>
          <th>圖片</th>
          <th>名稱</th>
          <th>分類</th>
          <th>價格</th>
          <th>標籤</th>
          <th>狀態</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        ${products.map((product, index) => `
          <tr>
            <td>
              <img src="${product.image}" alt="${product.name}" 
                style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;"
                onerror="this.src='images/placeholder.jpg'">
            </td>
            <td><strong>${product.name}</strong></td>
            <td>${product.category}</td>
            <td>$${product.price}</td>
            <td>${product.tags ? product.tags.join(', ') : '-'}</td>
            <td>
              <span class="status-badge ${product.available !== false ? 'status-completed' : 'status-cancelled'}">
                ${product.available !== false ? '上架' : '下架'}
              </span>
            </td>
            <td>
              <button class="action-btn btn-view" onclick="viewProduct('${product.id}')">查看</button>
              <button class="action-btn btn-edit" onclick="editProduct('${product.id}')">編輯</button>
              <button class="action-btn ${product.available !== false ? 'btn-delete' : 'btn-edit'}" 
                onclick="toggleProductStatus('${product.id}')">
                ${product.available !== false ? '下架' : '上架'}
              </button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
  
  document.getElementById('productsTable').innerHTML = tableHtml;
}

function viewProduct(productId) {
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    if (typeof window.showError === 'function') {
      window.showError('找不到商品');
    }
    return;
  }
  
  let extrasHTML = '';
  if (product.extras && product.extras.length > 0) {
    extrasHTML = `
      <tr>
        <td style="padding: 0.75rem; font-weight: 600; border-bottom: 1px solid #eee;">可選加料</td>
        <td style="padding: 0.75rem; border-bottom: 1px solid #eee;">
          <ul style="margin: 0; padding-left: 1.5rem;">
            ${product.extras.map(e => `<li>${e.name} (+$${e.price})</li>`).join('')}
          </ul>
        </td>
      </tr>
    `;
  }
  
  let sauceHTML = '';
  if (product.sauceOptions && product.sauceOptions.length > 0) {
    sauceHTML = `
      <tr>
        <td style="padding: 0.75rem; font-weight: 600; border-bottom: 1px solid #eee;">醬料選擇</td>
        <td style="padding: 0.75rem; border-bottom: 1px solid #eee;">${product.sauceOptions.join(', ')}</td>
      </tr>
    `;
  }
  
  const productInfoHTML = `
    <div style="max-width: 100%;">
      ${product.image ? `<img src="${product.image}" alt="${product.name}" style="width: 100%; max-width: 300px; border-radius: 8px; margin-bottom: 1rem; object-fit: cover;">` : ''}
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 0.75rem; font-weight: 600; width: 120px; border-bottom: 1px solid #eee;">名稱</td>
          <td style="padding: 0.75rem; border-bottom: 1px solid #eee;">${product.name}</td>
        </tr>
        <tr>
          <td style="padding: 0.75rem; font-weight: 600; border-bottom: 1px solid #eee;">分類</td>
          <td style="padding: 0.75rem; border-bottom: 1px solid #eee;">${product.category}</td>
        </tr>
        <tr>
          <td style="padding: 0.75rem; font-weight: 600; border-bottom: 1px solid #eee;">價格</td>
          <td style="padding: 0.75rem; border-bottom: 1px solid #eee;">$${product.price}</td>
        </tr>
        <tr>
          <td style="padding: 0.75rem; font-weight: 600; border-bottom: 1px solid #eee;">描述</td>
          <td style="padding: 0.75rem; border-bottom: 1px solid #eee;">${product.description}</td>
        </tr>
        <tr>
          <td style="padding: 0.75rem; font-weight: 600; border-bottom: 1px solid #eee;">標籤</td>
          <td style="padding: 0.75rem; border-bottom: 1px solid #eee;">${product.tags ? product.tags.join(', ') : '無'}</td>
        </tr>
        <tr>
          <td style="padding: 0.75rem; font-weight: 600; border-bottom: 1px solid #eee;">狀態</td>
          <td style="padding: 0.75rem; border-bottom: 1px solid #eee;">
            <span style="padding: 0.25rem 0.75rem; border-radius: 4px; background: ${product.available !== false ? '#C8E6C9' : '#FFCDD2'}; color: ${product.available !== false ? '#2E7D32' : '#C62828'};">
              ${product.available !== false ? '上架' : '下架'}
            </span>
          </td>
        </tr>
        ${extrasHTML}
        ${sauceHTML}
      </table>
    </div>
  `;
  
  if (typeof window.showAdminModal === 'function') {
    window.showAdminModal({
      title: '商品資訊',
      body: productInfoHTML,
      showCancel: false,
      onConfirm: () => {
        window.closeAdminModal();
      }
    });
  } else {
    alert('商品資訊請查看控制台');
    console.log(product);
  }
}

function editProduct(productId) {
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    if (typeof window.showError === 'function') {
      window.showError('找不到商品');
    }
    return;
  }
  
  if (typeof window.showAdminModal === 'function') {
    window.showAdminModal({
      title: '編輯商品',
      body: `
        <div class="admin-modal-form-group">
          <label class="admin-modal-form-label">商品名稱</label>
          <input type="text" 
                 id="editProductName" 
                 class="admin-modal-form-input" 
                 value="${product.name}" 
                 required>
        </div>
        <div class="admin-modal-form-group">
          <label class="admin-modal-form-label">商品價格</label>
          <input type="number" 
                 id="editProductPrice" 
                 class="admin-modal-form-input" 
                 value="${product.price}" 
                 min="0" 
                 required>
        </div>
        <div class="admin-modal-form-group">
          <label class="admin-modal-form-label">商品描述</label>
          <textarea id="editProductDescription" 
                    class="admin-modal-form-textarea" 
                    required>${product.description || ''}</textarea>
        </div>
        <div style="padding: 0.8rem; background: #FFF3E0; border-radius: 8px; color: #E65100; font-size: 0.9rem; margin-top: 1rem;">
          ⚠️ 注意：重新整理頁面後會恢復原始資料
        </div>
      `,
      footer: `
        <button class="admin-modal-btn admin-modal-btn-cancel" onclick="window.closeAdminModal()">取消</button>
        <button class="admin-modal-btn admin-modal-btn-confirm" onclick="confirmEditProduct('${productId}')">確認更新</button>
      `
    });
  } else {
  const newName = prompt('商品名稱：', product.name);
  if (!newName) return;
  const newPrice = prompt('商品價格：', product.price);
  if (!newPrice || isNaN(newPrice)) return;
  const newDescription = prompt('商品描述：', product.description);
  if (!newDescription) return;
  product.name = newName;
  product.price = parseInt(newPrice);
  product.description = newDescription;
    loadProducts();
    if (typeof window.showSuccess === 'function') {
      window.showSuccess('商品資訊已更新');
    }
  }
}

// ===== 確認編輯商品 =====
window.confirmEditProduct = function(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) {
    if (typeof window.showError === 'function') {
      window.showError('找不到商品');
    }
    window.closeAdminModal();
    return;
  }
  
  const newName = document.getElementById('editProductName').value.trim();
  const newPrice = parseInt(document.getElementById('editProductPrice').value);
  const newDescription = document.getElementById('editProductDescription').value.trim();
  
  if (!newName || isNaN(newPrice) || newPrice < 0 || !newDescription) {
    if (typeof window.showError === 'function') {
      window.showError('請填寫所有欄位');
    }
    return;
  }
  
  product.name = newName;
  product.price = newPrice;
  product.description = newDescription;
  
  window.closeAdminModal();
  loadProducts();
  
  if (typeof window.showSuccess === 'function') {
    window.showSuccess('商品資訊已更新');
  }
}

function toggleProductStatus(productId) {
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    if (typeof window.showError === 'function') {
      window.showError('找不到商品');
    }
    return;
  }
  
  const currentStatus = product.available !== false;
  const action = currentStatus ? '下架' : '上架';
  
  if (typeof window.showAdminModal === 'function') {
    window.showAdminModal({
      title: `確認${action}商品`,
      body: `
        <div style="text-align: center; padding: 1rem;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">${currentStatus ? '⚠️' : '✅'}</div>
          <p style="font-size: 1.1rem; color: #333; margin-bottom: 0.5rem;">確定要${action}「${product.name}」嗎？</p>
        </div>
      `,
      footer: `
        <button class="admin-modal-btn admin-modal-btn-cancel" onclick="window.closeAdminModal()">取消</button>
        <button class="admin-modal-btn ${currentStatus ? 'admin-modal-btn-danger' : 'admin-modal-btn-confirm'}" onclick="confirmToggleProductStatus('${productId}')">確認${action}</button>
      `
    });
  } else {
    if (confirm(`確定要${action}「${product.name}」嗎？`)) {
      confirmToggleProductStatus(productId);
    }
  }
}

// ===== 確認切換商品狀態 =====
window.confirmToggleProductStatus = function(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) {
    if (typeof window.showError === 'function') {
      window.showError('找不到商品');
    }
    window.closeAdminModal();
    return;
  }
  
  const currentStatus = product.available !== false;
  const action = currentStatus ? '下架' : '上架';
  
  product.available = !currentStatus;
  
  window.closeAdminModal();
  loadProducts();
  
  if (typeof window.showSuccess === 'function') {
    window.showSuccess(`商品已${action}`);
  }
}

function addNewProduct() {
  if (typeof window.showAdminModal === 'function') {
    window.showAdminModal({
      title: '新增商品',
      body: `
        <div class="admin-modal-form-group">
          <label class="admin-modal-form-label">商品名稱</label>
          <input type="text" 
                 id="newProductName" 
                 class="admin-modal-form-input" 
                 placeholder="請輸入商品名稱" 
                 required>
        </div>
        <div class="admin-modal-form-group">
          <label class="admin-modal-form-label">商品分類</label>
          <select id="newProductCategory" class="admin-modal-form-select" required>
            <option value="">請選擇分類</option>
            <option value="蛋餅">蛋餅</option>
            <option value="漢堡">漢堡</option>
            <option value="吐司">吐司</option>
            <option value="三明治">三明治</option>
            <option value="飯糰">飯糰</option>
            <option value="鐵板麵">鐵板麵</option>
            <option value="飲料">飲料</option>
            <option value="點心">點心</option>
          </select>
        </div>
        <div class="admin-modal-form-group">
          <label class="admin-modal-form-label">商品價格</label>
          <input type="number" 
                 id="newProductPrice" 
                 class="admin-modal-form-input" 
                 placeholder="請輸入價格" 
                 min="0" 
                 required>
        </div>
        <div class="admin-modal-form-group">
          <label class="admin-modal-form-label">商品描述</label>
          <textarea id="newProductDescription" 
                    class="admin-modal-form-textarea" 
                    placeholder="請輸入商品描述" 
                    required></textarea>
        </div>
        <div class="admin-modal-form-group">
          <label class="admin-modal-form-label">商品圖片</label>
          <input type="file" 
                 id="productImageInput" 
                 accept="image/*" 
                 style="padding: 0.5rem; border: 2px solid var(--medium-gray); border-radius: 8px; width: 100%; font-size: 0.95rem;">
          <div style="font-size: 0.85rem; color: var(--dark-gray); margin-top: 0.5rem;">
            💡 提示：若未上傳圖片，將使用預設圖片
          </div>
          <div id="imagePreview" style="margin-top: 0.75rem; display: none;">
            <img id="previewImg" src="" alt="預覽" style="max-width: 200px; max-height: 200px; border-radius: 8px; border: 2px solid var(--medium-gray);">
          </div>
        </div>
        <div style="padding: 0.8rem; background: #FFF3E0; border-radius: 8px; color: #E65100; font-size: 0.9rem; margin-top: 1rem;">
          ⚠️ 注意：重新整理頁面後會消失，如需永久保存請修改 data.js 檔案
        </div>
      `,
      footer: `
        <button class="admin-modal-btn admin-modal-btn-cancel" onclick="window.closeAdminModal()">取消</button>
        <button class="admin-modal-btn admin-modal-btn-confirm" onclick="confirmAddProduct()">確認新增</button>
      `
    });
  } else {
  const name = prompt('請輸入商品名稱：');
  if (!name) return;
  const category = prompt('請輸入商品分類：\n蛋餅/漢堡/吐司/三明治/飯糰/鐵板麵/飲料/點心');
  if (!category) return;
  const price = prompt('請輸入商品價格：');
  if (!price || isNaN(price)) {
    alert('價格必須是數字！');
    return;
  }
  const description = prompt('請輸入商品描述：');
  if (!description) return;
  const newProduct = {
    id: 'custom-' + Date.now(),
    name: name,
    category: category,
    price: parseInt(price),
      description: description,
      image: 'images/placeholder.jpg',
      tags: ['新品'],
      available: true
    };
    products.push(newProduct);
    loadProducts();
    if (typeof window.showSuccess === 'function') {
      window.showSuccess('商品已新增');
    }
  }
}

// ===== 確認新增商品 =====
window.confirmAddProduct = function() {
  const name = document.getElementById('newProductName').value.trim();
  const category = document.getElementById('newProductCategory').value;
  const price = parseInt(document.getElementById('newProductPrice').value);
  const description = document.getElementById('newProductDescription').value.trim();
  
  if (!name || !category || isNaN(price) || price < 0 || !description) {
    if (typeof window.showError === 'function') {
      window.showError('請填寫所有欄位');
    }
    return;
  }
  
  const newProduct = {
    id: 'custom-' + Date.now(),
    name: name,
    category: category,
    price: price,
    description: description,
    image: 'images/placeholder.jpg',
    tags: ['新品'],
    available: true
  };
  
  products.push(newProduct);
  
  window.closeAdminModal();
  loadProducts();
  
  if (typeof window.showSuccess === 'function') {
    window.showSuccess('商品已新增');
  }
}

// ===== 客服訊息管理 =====
function loadMessages() {
  const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
  const tableHtml = `
    <table>
      <thead>
        <tr>
          <th>編號</th>
          <th>會員</th>
          <th>主旨</th>
          <th>狀態</th>
          <th>提交時間</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        ${messages.length === 0 ? '<tr><td colspan="6" style="text-align: center; padding: 2rem;">目前沒有訊息</td></tr>' : messages.map(msg => `
          <tr>
            <td><strong>${msg.id}</strong></td>
            <td>${msg.userName}<br><small>${msg.userEmail}</small></td>
            <td>${msg.subject}</td>
            <td>
              <span class="status-badge ${msg.status === 'pending' ? 'status-pending' : 'status-completed'}">
                ${msg.status === 'pending' ? '⏳ 待回覆' : '✅ 已回覆'}
              </span>
            </td>
            <td>${new Date(msg.createdAt).toLocaleString('zh-TW')}</td>
            <td>
              <button class="action-btn btn-view" onclick="viewMessage('${msg.id}')">查看</button>
              ${msg.status === 'pending' ? 
                `<button class="action-btn btn-edit" onclick="replyMessage('${msg.id}')">回覆</button>` : 
                `<button class="action-btn btn-view" onclick="viewReply('${msg.id}')">查看回覆</button>`
              }
              <button class="action-btn btn-delete" onclick="deleteMessage('${msg.id}')">刪除</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
  
  document.getElementById('messagesTable').innerHTML = tableHtml;
}

function viewMessage(messageId) {
  const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
  const message = messages.find(m => m.id === messageId);
  
  if (!message) {
    if (typeof window.showError === 'function') {
      window.showError('找不到訊息');
    }
    return;
  }
  
  const replySection = message.status === 'replied' ? `
    <tr>
      <td style="padding: 0.75rem; font-weight: 600; border-bottom: 1px solid #eee;">回覆時間</td>
      <td style="padding: 0.75rem; border-bottom: 1px solid #eee;">${new Date(message.repliedAt).toLocaleString('zh-TW')}</td>
    </tr>
    <tr>
      <td style="padding: 0.75rem; font-weight: 600; border-bottom: 1px solid #eee;">回覆內容</td>
      <td style="padding: 0.75rem; border-bottom: 1px solid #eee; white-space: pre-wrap;">${message.reply || ''}</td>
    </tr>
  ` : '';
  
  const messageDetailsHTML = `
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 0.75rem; font-weight: 600; width: 120px; border-bottom: 1px solid #eee;">編號</td>
        <td style="padding: 0.75rem; border-bottom: 1px solid #eee;">${message.id}</td>
      </tr>
      <tr>
        <td style="padding: 0.75rem; font-weight: 600; border-bottom: 1px solid #eee;">會員</td>
        <td style="padding: 0.75rem; border-bottom: 1px solid #eee;">${message.userName}</td>
      </tr>
      <tr>
        <td style="padding: 0.75rem; font-weight: 600; border-bottom: 1px solid #eee;">Email</td>
        <td style="padding: 0.75rem; border-bottom: 1px solid #eee;">${message.userEmail}</td>
      </tr>
      <tr>
        <td style="padding: 0.75rem; font-weight: 600; border-bottom: 1px solid #eee;">電話</td>
        <td style="padding: 0.75rem; border-bottom: 1px solid #eee;">${message.phone || '未提供'}</td>
      </tr>
      <tr>
        <td style="padding: 0.75rem; font-weight: 600; border-bottom: 1px solid #eee;">主旨</td>
        <td style="padding: 0.75rem; border-bottom: 1px solid #eee;">${message.subject}</td>
      </tr>
      <tr>
        <td style="padding: 0.75rem; font-weight: 600; border-bottom: 1px solid #eee;">狀態</td>
        <td style="padding: 0.75rem; border-bottom: 1px solid #eee;">
          <span style="padding: 0.25rem 0.75rem; border-radius: 4px; background: ${message.status === 'pending' ? '#FFF3E0' : '#C8E6C9'}; color: ${message.status === 'pending' ? '#E65100' : '#2E7D32'};">
            ${message.status === 'pending' ? '待回覆' : '已回覆'}
          </span>
        </td>
      </tr>
      <tr>
        <td style="padding: 0.75rem; font-weight: 600; border-bottom: 1px solid #eee;">提交時間</td>
        <td style="padding: 0.75rem; border-bottom: 1px solid #eee;">${new Date(message.createdAt).toLocaleString('zh-TW')}</td>
      </tr>
      <tr>
        <td style="padding: 0.75rem; font-weight: 600; border-bottom: 1px solid #eee; vertical-align: top;">訊息內容</td>
        <td style="padding: 0.75rem; border-bottom: 1px solid #eee; white-space: pre-wrap;">${message.message || message.content || ''}</td>
      </tr>
      ${replySection}
    </table>
  `;
  
  if (typeof window.showAdminModal === 'function') {
    window.showAdminModal({
      title: '客服訊息詳情',
      body: messageDetailsHTML,
      showCancel: false,
      onConfirm: () => {
        window.closeAdminModal();
      }
    });
  } else {
    alert('訊息詳情請查看控制台');
    console.log(message);
  }
}

function replyMessage(messageId) {
  const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
  const messageIndex = messages.findIndex(m => m.id === messageId);
  
  if (messageIndex === -1) {
    alert('找不到訊息');
    return;
  }
  
  const message = messages[messageIndex];
  const replyText = prompt(`回覆給 ${message.userName}：\n\n原訊息：${message.message}\n\n請輸入回覆內容：`);
  
  if (!replyText) return;
  
  messages[messageIndex].status = 'replied';
  messages[messageIndex].reply = replyText;
  messages[messageIndex].repliedAt = new Date().toISOString();
  messages[messageIndex].repliedBy = getCurrentUser().name;
  
  localStorage.setItem('contactMessages', JSON.stringify(messages));
  loadMessages();
  initStats();
  alert('回覆已發送！');
}

function viewReply(messageId) {
  const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
  const message = messages.find(m => m.id === messageId);
  
  if (!message || !message.reply) {
    alert('找不到回覆');
    return;
  }
  
  const replyInfo = `
回覆資訊

原訊息：${message.message}

回覆時間：${new Date(message.repliedAt).toLocaleString('zh-TW')}
回覆人員：${message.repliedBy}

回覆內容：
${message.reply}
  `;
  
  alert(replyInfo);
}

function deleteMessage(messageId) {
  if (typeof window.showAdminModal === 'function') {
    window.showAdminModal({
      title: '確認刪除',
      body: `
        <div style="text-align: center; padding: 1rem;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
          <p style="font-size: 1.1rem; color: #333; margin-bottom: 0.5rem;">確定要刪除此訊息嗎？</p>
          <p style="color: #999; font-size: 0.95rem;">此操作無法復原</p>
        </div>
      `,
      footer: `
        <button class="admin-modal-btn admin-modal-btn-cancel" onclick="window.closeAdminModal()">取消</button>
        <button class="admin-modal-btn admin-modal-btn-danger" onclick="confirmDeleteMessage('${messageId}')">確認刪除</button>
      `
    });
  } else {
    if (confirm('確定要刪除此訊息嗎？')) {
      confirmDeleteMessage(messageId);
    }
  }
}

// ===== 確認刪除訊息 =====
window.confirmDeleteMessage = function(messageId) {
  let messages = JSON.parse(localStorage.getItem('contactMessages') || localStorage.getItem('contact_messages') || '[]');
  messages = messages.filter(m => m.id !== messageId);
  localStorage.setItem('contactMessages', JSON.stringify(messages));
  localStorage.setItem('contact_messages', JSON.stringify(messages));
  
  window.closeAdminModal();
  loadMessages();
  initStats();
  
  if (typeof window.showSuccess === 'function') {
    window.showSuccess('訊息已刪除');
  }
}

// ===== 輔助函數 =====
function calculateItemTotal(item) {
  let total = item.price * item.quantity;
  
  if (item.options && item.options.extras && item.options.extras.length > 0) {
    item.options.extras.forEach(extra => {
      total += extra.price * item.quantity;
    });
  }
  
  return total;
}

// ===== 頁面載入時初始化 =====
document.addEventListener('DOMContentLoaded', () => {
  // 檢查管理員權限
  if (!requireAdmin()) {
    return; // 如果沒有權限，直接返回
  }
  
  initStats();
  loadOrders();
});

// ===== 覆蓋原本的 loadMessages 函數 =====
function loadMessages() {
  renderAdminContactMessages();
}

// ===== 頁面載入時檢查權限 =====
document.addEventListener('DOMContentLoaded', () => {

// ===== 檢查管理員權限 =====
function checkAdminPermission() {
  const savedUser = localStorage.getItem('currentUser');
  if (!savedUser) {
    alert('請先登入管理員帳號');
    window.location.href = 'login.html';
    return false;
  }
  
  try {
    const user = JSON.parse(savedUser);
    if (user.role !== 'admin') {
      alert('您沒有權限訪問此頁面');
      window.location.href = 'index.html';
      return false;
    }
    return true;
  } catch (e) {
    console.error('權限驗證失敗', e);
    window.location.href = 'login.html';
    return false;
  }
}});

// ===== 頁面載入時初始化 =====
document.addEventListener('DOMContentLoaded', () => {
  // 先檢查權限
  if (!checkAdminPermission()) {
    return;
  }
  
  // 權限檢查通過，初始化後台
  initStats();
  loadOrders();
});

// ===== 添加到 admin.js 的新功能 =====

// 1. Storage 事件監聽（訊息即時同步）
window.addEventListener('storage', (e) => {
  if (e.key === 'contact_messages') {
    // 客服訊息有更新，重新載入
    if (typeof renderAdminContactMessages === 'function') {
      renderAdminContactMessages();
      updateAdminStats();
      showToast('收到新的客服訊息', 'success');
    }
  }
});

// 2. 更新訂單狀態（含點數回饋）
function updateOrderStatusWithPoints(orderId) {
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  const orderIndex = orders.findIndex(o => o.id === orderId);
  
  if (orderIndex === -1) {
    showError('找不到訂單');
    return;
  }
  
  const newStatus = prompt('請選擇新狀態：\n1. 待處理 (pending)\n2. 製作中 (processing)\n3. 已完成 (completed)\n4. 已取消 (cancelled)');
  
  const statusMap = {
    '1': 'pending',
    '2': 'processing',
    '3': 'completed',
    '4': 'cancelled'
  };
  
  if (statusMap[newStatus]) {
    const oldStatus = orders[orderIndex].status;
    const newStatusValue = statusMap[newStatus];
    
    orders[orderIndex].status = newStatusValue;
    orders[orderIndex].updatedAt = new Date().toISOString();
    
    // 如果狀態改為「已完成」，回饋點數
    if (newStatusValue === 'completed' && oldStatus !== 'completed') {
      const order = orders[orderIndex];
      const pointsToAdd = Math.floor(order.total); // 1元 = 1點
      
      // 找到用戶並增加點數
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex(u => u.email === order.customerEmail);
      
      if (userIndex !== -1) {
        if (!users[userIndex].points) users[userIndex].points = 0;
        users[userIndex].points += pointsToAdd;
        localStorage.setItem('users', JSON.stringify(users));
        
        showSuccess(`訂單狀態已更新！已回饋 ${pointsToAdd} 點給會員`);
      } else {
        showSuccess('訂單狀態已更新！');
      }
    } else {
      showSuccess('訂單狀態已更新！');
    }
    
    localStorage.setItem('orders', JSON.stringify(orders));
    loadOrders();
  }
}

// 3. 折價券管理功能
function renderCouponsPanel() {
  const panel = document.getElementById('couponsPanel');
  if (!panel) return;
  
  const coupons = getAllCoupons();
  
  panel.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-lg);">
      <h2 style="margin: 0;">🎫 折價券管理</h2>
      <button class="action-btn add-btn" onclick="showAddCouponForm()">
        ➕ 新增折價券
      </button>
    </div>
    
    <div id="addCouponForm" style="display: none; background: var(--soft-peach); padding: var(--spacing-lg); border-radius: var(--radius-md); margin-bottom: var(--spacing-lg);">
      <h3 style="margin-top: 0;">新增折價券</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md);">
        <div>
          <label style="display: block; font-weight: 600; margin-bottom: var(--spacing-xs);">代碼 *</label>
          <input type="text" id="couponCode" placeholder="例：OPEN88" style="width: 100%; padding: var(--spacing-sm); border: 2px solid var(--medium-gray); border-radius: var(--radius-sm);">
        </div>
        <div>
          <label style="display: block; font-weight: 600; margin-bottom: var(--spacing-xs);">標題 *</label>
          <input type="text" id="couponTitle" placeholder="例：開幕88折" style="width: 100%; padding: var(--spacing-sm); border: 2px solid var(--medium-gray); border-radius: var(--radius-sm);">
        </div>
        <div>
          <label style="display: block; font-weight: 600; margin-bottom: var(--spacing-xs);">類型 *</label>
          <select id="couponType" style="width: 100%; padding: var(--spacing-sm); border: 2px solid var(--medium-gray); border-radius: var(--radius-sm);">
            <option value="percent">百分比折扣</option>
            <option value="fixed">固定金額</option>
          </select>
        </div>
        <div>
          <label style="display: block; font-weight: 600; margin-bottom: var(--spacing-xs);">折扣 *</label>
          <input type="number" id="couponDiscount" placeholder="百分比: 0.88 / 固定: 100" step="0.01" style="width: 100%; padding: var(--spacing-sm); border: 2px solid var(--medium-gray); border-radius: var(--radius-sm);">
        </div>
        <div>
          <label style="display: block; font-weight: 600; margin-bottom: var(--spacing-xs);">最低消費</label>
          <input type="number" id="couponMinAmount" placeholder="0" style="width: 100%; padding: var(--spacing-sm); border: 2px solid var(--medium-gray); border-radius: var(--radius-sm);">
        </div>
        <div>
          <label style="display: block; font-weight: 600; margin-bottom: var(--spacing-xs);">兌換點數</label>
          <input type="number" id="couponPointCost" placeholder="0 (設為 0 即為全站發送)" min="0" style="width: 100%; padding: var(--spacing-sm); border: 2px solid var(--medium-gray); border-radius: var(--radius-sm);">
          <div style="font-size: 0.85rem; color: var(--dark-gray); margin-top: 0.25rem;">💡 設為 0 代表全站免費券，> 0 代表需用點數兌換</div>
        </div>
        <div>
          <label style="display: block; font-weight: 600; margin-bottom: var(--spacing-xs);">最大折扣（選填）</label>
          <input type="number" id="couponMaxDiscount" placeholder="不限制" style="width: 100%; padding: var(--spacing-sm); border: 2px solid var(--medium-gray); border-radius: var(--radius-sm);">
        </div>
      </div>
      <div style="margin-top: var(--spacing-md);">
        <label style="display: block; font-weight: 600; margin-bottom: var(--spacing-xs);">說明</label>
        <textarea id="couponDescription" placeholder="折價券說明" style="width: 100%; padding: var(--spacing-sm); border: 2px solid var(--medium-gray); border-radius: var(--radius-sm); min-height: 80px;"></textarea>
      </div>
      <div style="margin-top: var(--spacing-md);">
        <label style="display: flex; align-items: center; gap: var(--spacing-xs); cursor: pointer;">
          <input type="checkbox" id="couponFeatured">
          <span>設為主打折價券（將顯示在全站公告）</span>
        </label>
      </div>
      <div style="display: flex; gap: var(--spacing-sm); margin-top: var(--spacing-lg);">
        <button class="action-btn add-btn" onclick="submitCoupon()">確認新增</button>
        <button class="action-btn btn-delete" onclick="hideAddCouponForm()">取消</button>
      </div>
    </div>
    
    <div class="data-table">
      <table>
        <thead>
          <tr>
            <th>代碼</th>
            <th>標題</th>
            <th>折扣</th>
            <th>條件</th>
            <th>所需點數</th>
            <th>狀態</th>
            <th>主打</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          ${coupons.length === 0 ? 
            '<tr><td colspan="8" style="text-align: center; padding: 2rem;">尚無折價券</td></tr>' :
            coupons.map(coupon => `
              <tr>
                <td><strong>${coupon.code}</strong></td>
                <td>${coupon.title}</td>
                <td>${coupon.type === 'percent' ? `${Math.round((1-coupon.discount)*100)}% OFF` : `折 $${coupon.discount}`}</td>
                <td>滿 $${coupon.minAmount}</td>
                <td>${coupon.pointCost || 0} 點</td>
                <td>
                  <span class="status-badge ${coupon.active ? 'status-completed' : 'status-cancelled'}">
                    ${coupon.active ? '啟用' : '停用'}
                  </span>
                </td>
                <td>
                  ${coupon.featured ? '<span style="color: var(--accent-red); font-weight: 700;">⭐ 主打</span>' : '-'}
                </td>
                <td>
                  <button class="action-btn btn-edit" onclick="editCoupon('${coupon.code}')">編輯</button>
                  <button class="action-btn btn-edit" onclick="toggleCouponFeatured('${coupon.code}')">
                    ${coupon.featured ? '取消主打' : '設為主打'}
                  </button>
                  <button class="action-btn btn-edit" onclick="toggleCouponStatus('${coupon.code}')">
                    ${coupon.active ? '停用' : '啟用'}
                  </button>
                  <button class="action-btn btn-delete" onclick="removeCoupon('${coupon.code}')">刪除</button>
                </td>
              </tr>
            `).join('')
          }
        </tbody>
      </table>
    </div>
  `;
}

function showAddCouponForm() {
  document.getElementById('addCouponForm').style.display = 'block';
}

function hideAddCouponForm() {
  const form = document.getElementById('addCouponForm');
  if (form) {
    form.style.display = 'none';
  // 清空表單
    const codeInput = document.getElementById('couponCode');
    const titleInput = document.getElementById('couponTitle');
    const discountInput = document.getElementById('couponDiscount');
    const minAmountInput = document.getElementById('couponMinAmount');
    const pointCostInput = document.getElementById('couponPointCost');
    const maxDiscountInput = document.getElementById('couponMaxDiscount');
    const descriptionInput = document.getElementById('couponDescription');
    const featuredInput = document.getElementById('couponFeatured');
    
    if (codeInput) codeInput.value = '';
    if (titleInput) titleInput.value = '';
    if (discountInput) discountInput.value = '';
    if (minAmountInput) minAmountInput.value = '';
    if (pointCostInput) pointCostInput.value = '';
    if (maxDiscountInput) maxDiscountInput.value = '';
    if (descriptionInput) descriptionInput.value = '';
    if (featuredInput) featuredInput.checked = false;
  }
}

function submitCoupon() {
  const code = document.getElementById('couponCode').value.trim();
  const title = document.getElementById('couponTitle').value.trim();
  const type = document.getElementById('couponType').value;
  const discount = document.getElementById('couponDiscount').value;
  const minAmount = document.getElementById('couponMinAmount').value || 0;
  const pointCost = document.getElementById('couponPointCost').value || 0;
  const maxDiscount = document.getElementById('couponMaxDiscount').value || null;
  const description = document.getElementById('couponDescription').value.trim();
  const featured = document.getElementById('couponFeatured').checked;
  
  if (!code || !title || !discount) {
    if (typeof window.showError === 'function') {
      window.showError('請填寫必填欄位');
    }
    return;
  }
  
  const result = addCoupon({
    code, title, type, discount, minAmount, pointCost, maxDiscount, description, featured
  });
  
  if (result.success) {
    if (typeof window.showSuccess === 'function') {
      window.showSuccess('折價券新增成功！');
    }
    hideAddCouponForm();
    renderCouponsPanel();
  } else {
    if (typeof window.showError === 'function') {
      window.showError(result.message);
    }
  }
}

// ===== 編輯折價券 =====
function editCoupon(code) {
  const coupons = getAllCoupons();
  const coupon = coupons.find(c => c.code === code);
  
  if (!coupon) {
    if (typeof window.showError === 'function') {
      window.showError('找不到折價券');
    }
    return;
  }
  
  if (typeof window.showAdminModal === 'function') {
    window.showAdminModal({
      title: '編輯折價券',
      body: `
        <div class="admin-modal-form-group">
          <label class="admin-modal-form-label">代碼</label>
          <input type="text" id="editCouponCode" class="admin-modal-form-input" value="${coupon.code}" readonly>
        </div>
        <div class="admin-modal-form-group">
          <label class="admin-modal-form-label">標題</label>
          <input type="text" id="editCouponTitle" class="admin-modal-form-input" value="${coupon.title}" required>
        </div>
        <div class="admin-modal-form-group">
          <label class="admin-modal-form-label">類型</label>
          <select id="editCouponType" class="admin-modal-form-select" required>
            <option value="percent" ${coupon.type === 'percent' ? 'selected' : ''}>百分比折扣</option>
            <option value="fixed" ${coupon.type === 'fixed' ? 'selected' : ''}>固定金額</option>
          </select>
        </div>
        <div class="admin-modal-form-group">
          <label class="admin-modal-form-label">折扣</label>
          <input type="number" id="editCouponDiscount" class="admin-modal-form-input" value="${coupon.discount}" step="0.01" required>
        </div>
        <div class="admin-modal-form-group">
          <label class="admin-modal-form-label">最低消費</label>
          <input type="number" id="editCouponMinAmount" class="admin-modal-form-input" value="${coupon.minAmount || 0}" min="0">
        </div>
        <div class="admin-modal-form-group">
          <label class="admin-modal-form-label">兌換點數</label>
          <input type="number" id="editCouponPointCost" class="admin-modal-form-input" value="${coupon.pointCost || 0}" min="0">
          <div style="font-size: 0.85rem; color: var(--dark-gray); margin-top: 0.25rem;">💡 設為 0 代表全站免費券</div>
        </div>
        <div class="admin-modal-form-group">
          <label class="admin-modal-form-label">最大折扣（選填）</label>
          <input type="number" id="editCouponMaxDiscount" class="admin-modal-form-input" value="${coupon.maxDiscount || ''}" min="0">
        </div>
        <div class="admin-modal-form-group">
          <label class="admin-modal-form-label">說明</label>
          <textarea id="editCouponDescription" class="admin-modal-form-textarea">${coupon.description || ''}</textarea>
        </div>
      `,
      footer: `
        <button class="admin-modal-btn admin-modal-btn-cancel" onclick="window.closeAdminModal()">取消</button>
        <button class="admin-modal-btn admin-modal-btn-confirm" onclick="confirmEditCoupon('${code}')">確認更新</button>
      `
    });
  }
}

// ===== 確認編輯折價券 =====
window.confirmEditCoupon = function(code) {
  const title = document.getElementById('editCouponTitle').value.trim();
  const type = document.getElementById('editCouponType').value;
  const discount = parseFloat(document.getElementById('editCouponDiscount').value);
  const minAmount = parseInt(document.getElementById('editCouponMinAmount').value) || 0;
  const pointCost = parseInt(document.getElementById('editCouponPointCost').value) || 0;
  const maxDiscount = document.getElementById('editCouponMaxDiscount').value ? parseInt(document.getElementById('editCouponMaxDiscount').value) : null;
  const description = document.getElementById('editCouponDescription').value.trim();
  
  if (!title || isNaN(discount)) {
    if (typeof window.showError === 'function') {
      window.showError('請填寫所有必填欄位');
    }
    return;
  }
  
  const result = updateCoupon(code, {
    title, type, discount, minAmount, pointCost, maxDiscount, description
  });
  
  if (result.success) {
    window.closeAdminModal();
    renderCouponsPanel();
    if (typeof window.showSuccess === 'function') {
      window.showSuccess('折價券已更新');
    }
  } else {
    if (typeof window.showError === 'function') {
      window.showError(result.message);
    }
  }
};

function toggleCouponFeatured(code) {
  setFeaturedCoupon(code);
  showSuccess('主打折價券已更新');
  renderCouponsPanel();
}

function toggleCouponStatus(code) {
  const coupons = getAllCoupons();
  const coupon = coupons.find(c => c.code === code);
  
  if (coupon) {
    updateCoupon(code, { active: !coupon.active });
    showSuccess(`折價券已${coupon.active ? '停用' : '啟用'}`);
    renderCouponsPanel();
  }
}

function removeCoupon(code) {
  showConfirm('確定要刪除此折價券嗎？', () => {
    deleteCoupon(code);
    showSuccess('折價券已刪除');
    renderCouponsPanel();
  });
}

// 載入折價券面板
function loadCoupons() {
  renderCouponsPanel();
}

// ===== 圖片預覽功能 =====
// 使用事件委派處理動態生成的圖片上傳輸入
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setupImagePreview();
  });
} else {
  setupImagePreview();
}

function setupImagePreview() {
  // 監聽圖片上傳（事件委派）
  document.addEventListener('change', (e) => {
    if (e.target.id === 'productImageInput' && e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = function(e) {
        const previewDiv = document.getElementById('imagePreview');
        const previewImg = document.getElementById('previewImg');
        
        if (previewDiv && previewImg) {
          previewImg.src = e.target.result;
          previewDiv.style.display = 'block';
        }
      };
      
      reader.readAsDataURL(file);
    }
  });
}