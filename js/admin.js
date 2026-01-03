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
  document.getElementById('totalOrders').textContent = orders.length;
  
  // 會員數量
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  document.getElementById('totalMembers').textContent = users.length;
  
  // 商品數量
  document.getElementById('totalProducts').textContent = products.length;
  
  // 待回覆訊息數量
  const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
  const pendingMessages = messages.filter(m => m.status === 'pending');
  document.getElementById('totalMessages').textContent = pendingMessages.length;
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
    alert('找不到訂單');
    return;
  }
  
  const itemsList = order.items.map(item => {
    let customizations = '';
    if (item.options) {
      if (item.options.extras && item.options.extras.length > 0) {
        customizations += '\n  加料：' + item.options.extras.map(e => `${e.name} +$${e.price}`).join(', ');
      }
      if (item.options.sauceOption) {
        customizations += '\n  醬料：' + item.options.sauceOption;
      }
      if (item.options.spicyLevel) {
        customizations += '\n  辣度：' + item.options.spicyLevel;
      }
    }
    return `• ${item.name} x${item.quantity} - $${calculateItemTotal(item)}${customizations}`;
  }).join('\n');
  
  const orderDetails = `
訂單編號：${order.id}
顧客資訊：${order.customerName || order.customerEmail}
電話：${order.customerPhone || '未提供'}
用餐方式：${order.diningOption === 'dine-in' ? '內用' : '外帶'}
${order.tableNumber ? '桌號：' + order.tableNumber : ''}
${order.pickupTime ? '取餐時間：' + order.pickupTime : ''}
訂單狀態：${getStatusText(order.status)}
下單時間：${new Date(order.createdAt).toLocaleString('zh-TW')}

訂單明細：
${itemsList}

小計：$${order.subtotal}
運費：$${order.deliveryFee || 0}
總計：$${order.total}

備註：${order.note || '無'}
  `;
  
  alert(orderDetails);
}

function updateOrderStatus(orderId) {
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  const orderIndex = orders.findIndex(o => o.id === orderId);
  
  if (orderIndex === -1) {
    alert('找不到訂單');
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
    orders[orderIndex].status = statusMap[newStatus];
    orders[orderIndex].updatedAt = new Date().toISOString();
    localStorage.setItem('orders', JSON.stringify(orders));
    loadOrders();
    alert('訂單狀態已更新！');
  }
}

function deleteOrder(orderId) {
  if (!confirm('確定要刪除此訂單嗎？此操作無法復原。')) {
    return;
  }
  
  let orders = JSON.parse(localStorage.getItem('orders') || '[]');
  orders = orders.filter(o => o.id !== orderId);
  localStorage.setItem('orders', JSON.stringify(orders));
  loadOrders();
  initStats();
  alert('訂單已刪除！');
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
    alert('找不到會員');
    return;
  }
  
  const memberInfo = `
會員資訊

姓名：${user.name}
Email：${user.email}
電話：${user.phone || '未提供'}
生日：${user.birthday || '未提供'}
點數：${user.points || 0} 點
狀態：${user.active !== false ? '正常' : '停權'}
註冊時間：${user.createdAt ? new Date(user.createdAt).toLocaleString('zh-TW') : '未知'}
  `;
  
  alert(memberInfo);
}

function editMemberPoints(email) {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const userIndex = users.findIndex(u => u.email === email);
  
  if (userIndex === -1) {
    alert('找不到會員');
    return;
  }
  
  const currentPoints = users[userIndex].points || 0;
  const newPoints = prompt(`目前點數：${currentPoints}\n請輸入新的點數：`);
  
  if (newPoints !== null && !isNaN(newPoints)) {
    users[userIndex].points = parseInt(newPoints);
    localStorage.setItem('users', JSON.stringify(users));
    loadMembers();
    alert('點數已更新！');
  }
}

function toggleMemberStatus(email) {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const userIndex = users.findIndex(u => u.email === email);
  
  if (userIndex === -1) {
    alert('找不到會員');
    return;
  }
  
  const currentStatus = users[userIndex].active !== false;
  const action = currentStatus ? '停權' : '啟用';
  
  if (!confirm(`確定要${action}此會員嗎？`)) {
    return;
  }
  
  users[userIndex].active = !currentStatus;
  localStorage.setItem('users', JSON.stringify(users));
  loadMembers();
  alert(`會員已${action}！`);
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
    alert('找不到商品');
    return;
  }
  
  let customizationInfo = '';
  if (product.extras) {
    customizationInfo += '\n\n可選加料：\n' + product.extras.map(e => `  • ${e.name} +$${e.price}`).join('\n');
  }
  if (product.sauceOptions) {
    customizationInfo += '\n\n醬料選擇：\n  ' + product.sauceOptions.join(', ');
  }
  
  const productInfo = `
商品資訊

名稱：${product.name}
分類：${product.category}
價格：$${product.price}
描述：${product.description}
標籤：${product.tags ? product.tags.join(', ') : '無'}
狀態：${product.available !== false ? '上架' : '下架'}
${customizationInfo}
  `;
  
  alert(productInfo);
}

function editProduct(productId) {
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    alert('找不到商品');
    return;
  }
  
  const newName = prompt('商品名稱：', product.name);
  if (!newName) return;
  
  const newPrice = prompt('商品價格：', product.price);
  if (!newPrice || isNaN(newPrice)) return;
  
  const newDescription = prompt('商品描述：', product.description);
  if (!newDescription) return;
  
  // 更新商品資訊
  product.name = newName;
  product.price = parseInt(newPrice);
  product.description = newDescription;
  
  // 注意：這裡的更新只在記憶體中，重新整理後會恢復
  // 如果需要永久保存，需要將 products 存到 localStorage
  loadProducts();
  alert('商品資訊已更新！\n注意：重新整理頁面後會恢復原始資料');
}

function toggleProductStatus(productId) {
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    alert('找不到商品');
    return;
  }
  
  const currentStatus = product.available !== false;
  const action = currentStatus ? '下架' : '上架';
  
  if (!confirm(`確定要${action}「${product.name}」嗎？`)) {
    return;
  }
  
  product.available = !currentStatus;
  loadProducts();
  alert(`商品已${action}！`);
}

function addNewProduct() {
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
  alert('商品已新增！\n注意：重新整理頁面後會消失，如需永久保存請修改 data.js 檔案');
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
    alert('找不到訊息');
    return;
  }
  
  const messageDetails = `
客服訊息

編號：${message.id}
會員：${message.userName}
Email：${message.userEmail}
電話：${message.phone || '未提供'}
主旨：${message.subject}
狀態：${message.status === 'pending' ? '待回覆' : '已回覆'}
提交時間：${new Date(message.createdAt).toLocaleString('zh-TW')}

訊息內容：
${message.message}

${message.status === 'replied' ? `
回覆時間：${new Date(message.repliedAt).toLocaleString('zh-TW')}
回覆內容：
${message.reply}
` : ''}
  `;
  
  alert(messageDetails);
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
  if (!confirm('確定要刪除此訊息嗎？')) {
    return;
  }
  
  let messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
  messages = messages.filter(m => m.id !== messageId);
  localStorage.setItem('contactMessages', JSON.stringify(messages));
  loadMessages();
  initStats();
  alert('訊息已刪除！');
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
            <th>狀態</th>
            <th>主打</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          ${coupons.length === 0 ? 
            '<tr><td colspan="7" style="text-align: center; padding: 2rem;">尚無折價券</td></tr>' :
            coupons.map(coupon => `
              <tr>
                <td><strong>${coupon.code}</strong></td>
                <td>${coupon.title}</td>
                <td>${coupon.type === 'percent' ? `${Math.round((1-coupon.discount)*100)}% OFF` : `折 $${coupon.discount}`}</td>
                <td>滿 $${coupon.minAmount}</td>
                <td>
                  <span class="status-badge ${coupon.active ? 'status-completed' : 'status-cancelled'}">
                    ${coupon.active ? '啟用' : '停用'}
                  </span>
                </td>
                <td>
                  ${coupon.featured ? '<span style="color: var(--accent-red); font-weight: 700;">⭐ 主打</span>' : '-'}
                </td>
                <td>
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
  document.getElementById('addCouponForm').style.display = 'none';
  // 清空表單
  document.getElementById('couponCode').value = '';
  document.getElementById('couponTitle').value = '';
  document.getElementById('couponDiscount').value = '';
  document.getElementById('couponMinAmount').value = '';
  document.getElementById('couponMaxDiscount').value = '';
  document.getElementById('couponDescription').value = '';
  document.getElementById('couponFeatured').checked = false;
}

function submitCoupon() {
  const code = document.getElementById('couponCode').value.trim();
  const title = document.getElementById('couponTitle').value.trim();
  const type = document.getElementById('couponType').value;
  const discount = document.getElementById('couponDiscount').value;
  const minAmount = document.getElementById('couponMinAmount').value || 0;
  const maxDiscount = document.getElementById('couponMaxDiscount').value || null;
  const description = document.getElementById('couponDescription').value.trim();
  const featured = document.getElementById('couponFeatured').checked;
  
  if (!code || !title || !discount) {
    showError('請填寫必填欄位');
    return;
  }
  
  const result = addCoupon({
    code, title, type, discount, minAmount, maxDiscount, description, featured
  });
  
  if (result.success) {
    showSuccess('折價券新增成功！');
    hideAddCouponForm();
    renderCouponsPanel();
  } else {
    showError(result.message);
  }
}

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