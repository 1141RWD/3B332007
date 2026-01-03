// profile.html 的客服專區功能

// ===== 渲染客服專區 =====
function renderContactSection() {
  const currentUser = getCurrentUser();
  if (!currentUser) return;
  
  const contactSection = document.getElementById('contactSection');
  if (!contactSection) return;
  
  contactSection.innerHTML = `
    <div class="contact-form-card">
      <h3 style="color: var(--primary-orange); margin-bottom: var(--spacing-md); display: flex; align-items: center; gap: var(--spacing-sm);">
        <span style="font-size: 1.5rem;">💬</span>
        <span>聯絡客服</span>
      </h3>
      
      <form id="contactQuestionForm" onsubmit="handleQuestionSubmit(event)">
        <div style="margin-bottom: var(--spacing-md);">
          <label style="display: block; font-weight: 600; margin-bottom: var(--spacing-xs); color: var(--text-dark);">
            您的問題 <span style="color: var(--accent-red);">*</span>
          </label>
          <textarea 
            id="questionContent"
            required
            placeholder="請詳細描述您的問題..."
            style="width: 100%; min-height: 120px; padding: var(--spacing-md); border: 2px solid var(--medium-gray); border-radius: var(--radius-sm); font-family: inherit; font-size: 1rem; resize: vertical;"
          ></textarea>
        </div>
        
        <button type="submit" style="width: 100%; padding: var(--spacing-md); background: linear-gradient(135deg, var(--primary-orange), var(--accent-red)); color: var(--white); border: none; border-radius: var(--radius-full); font-size: 1.1rem; font-weight: 700; cursor: pointer; transition: var(--transition-base);">
          📤 送出問題
        </button>
      </form>
    </div>
    
    <div class="contact-history-card" style="margin-top: var(--spacing-xl);">
      <h3 style="color: var(--primary-orange); margin-bottom: var(--spacing-lg); display: flex; align-items: center; gap: var(--spacing-sm);">
        <span style="font-size: 1.5rem;">📋</span>
        <span>歷史提問記錄</span>
      </h3>
      <div id="contactHistoryList"></div>
    </div>
  `;
  
  renderContactHistory();
}

// ===== 處理問題提交 =====
function handleQuestionSubmit(event) {
  event.preventDefault();
  
  const currentUser = getCurrentUser();
  if (!currentUser) {
    alert('請先登入');
    return;
  }
  
  const content = document.getElementById('questionContent').value.trim();
  
  if (!content) {
    alert('請輸入問題內容');
    return;
  }
  
  // 新增訊息
  addContactMessage(currentUser.email, currentUser.name, content);
  
  // 清空表單
  document.getElementById('questionContent').value = '';
  
  // 顯示成功訊息
  alert('問題已送出！客服人員會盡快回覆。');
  
  // 重新渲染歷史記錄
  renderContactHistory();
}

// ===== 渲染歷史提問記錄 =====
function renderContactHistory() {
  const currentUser = getCurrentUser();
  if (!currentUser) return;
  
  const historyList = document.getElementById('contactHistoryList');
  if (!historyList) return;
  
  const messages = getUserContactMessages(currentUser.email);
  
  // 按時間倒序排列（最新的在前）
  messages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  if (messages.length === 0) {
    historyList.innerHTML = `
      <div style="text-align: center; padding: var(--spacing-xl); color: var(--dark-gray); background: var(--soft-peach); border-radius: var(--radius-md);">
        <p style="font-size: 1.1rem; margin: 0;">📭 您還沒有任何提問記錄</p>
        <p style="font-size: 0.95rem; margin-top: var(--spacing-sm); opacity: 0.8;">有任何問題都可以在上方表單提出喔！</p>
      </div>
    `;
    return;
  }
  
  historyList.innerHTML = messages.map(msg => {
    const isPending = msg.status === 'Pending';
    const statusColor = isPending ? '#FF9800' : '#4CAF50';
    const statusBg = isPending ? '#FFF3E0' : '#E8F5E9';
    const statusText = isPending ? '⏳ 待處理' : '✅ 已回覆';
    
    return `
      <div class="contact-message-card" style="background: var(--white); border-radius: var(--radius-md); padding: var(--spacing-lg); margin-bottom: var(--spacing-md); box-shadow: var(--shadow-sm); border-left: 4px solid ${statusColor};">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: var(--spacing-md);">
          <div style="flex: 1;">
            <div style="font-size: 0.9rem; color: var(--dark-gray); margin-bottom: var(--spacing-xs);">
              ${new Date(msg.timestamp).toLocaleString('zh-TW', { 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit', 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>
          <span style="background: ${statusBg}; color: ${statusColor}; padding: 0.4rem 0.9rem; border-radius: var(--radius-full); font-size: 0.9rem; font-weight: 600; white-space: nowrap;">
            ${statusText}
          </span>
        </div>
        
        <div style="background: var(--soft-peach); padding: var(--spacing-md); border-radius: var(--radius-sm); margin-bottom: ${msg.reply ? 'var(--spacing-md)' : '0'};">
          <div style="font-weight: 600; color: var(--primary-orange); margin-bottom: var(--spacing-xs); font-size: 0.95rem;">
            您的問題：
          </div>
          <div style="color: var(--text-dark); line-height: 1.6;">
            ${msg.content}
          </div>
        </div>
        
        ${msg.reply ? `
          <div style="background: ${statusBg}; padding: var(--spacing-md); border-radius: var(--radius-sm); border: 1px solid ${statusColor};">
            <div style="font-weight: 600; color: ${statusColor}; margin-bottom: var(--spacing-xs); font-size: 0.95rem; display: flex; align-items: center; gap: var(--spacing-xs);">
              <span>💁</span>
              <span>客服回覆：</span>
            </div>
            <div style="color: var(--text-dark); line-height: 1.6; margin-bottom: var(--spacing-xs);">
              ${msg.reply}
            </div>
            ${msg.repliedAt ? `
              <div style="font-size: 0.85rem; color: ${statusColor}; opacity: 0.8;">
                回覆時間：${new Date(msg.repliedAt).toLocaleString('zh-TW')}
              </div>
            ` : ''}
          </div>
        ` : ''}
      </div>
    `;
  }).join('');
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    if (typeof renderContactSection === 'function') {
      renderContactSection();
    }
  }, 500);
});