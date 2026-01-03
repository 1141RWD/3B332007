// admin.html 的客服管理功能（含 Tabs 切換）

// 當前顯示的分頁
let currentContactTab = 'pending';

// ===== 渲染客服訊息管理面板（含 Tabs）=====
function renderAdminContactMessages() {
  const messagesPanel = document.getElementById('adminContactMessagesPanel');
  if (!messagesPanel) return;
  
  const allMessages = getAllContactMessages();
  
  // 分類訊息（統一使用小寫狀態）
  const pendingMessages = allMessages.filter(m => {
    const status = (m.status || '').toLowerCase();
    return status === 'pending';
  });
  const repliedMessages = allMessages.filter(m => {
    const status = (m.status || '').toLowerCase();
    return status === 'replied';
  });
  
  // 排序：按時間倒序
  pendingMessages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  repliedMessages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  messagesPanel.innerHTML = `
    <!-- Tabs 切換 -->
    <div class="contact-tabs" style="display: flex; gap: var(--spacing-md); margin-bottom: var(--spacing-xl); border-bottom: 2px solid var(--medium-gray);">
      <button 
        class="contact-tab ${currentContactTab === 'pending' ? 'active' : ''}" 
        onclick="switchContactTab('pending')"
        style="padding: var(--spacing-md) var(--spacing-lg); background: none; border: none; border-bottom: 3px solid transparent; cursor: pointer; font-size: 1.1rem; font-weight: 600; transition: all 0.3s;"
      >
        ⏳ 待回覆 (${pendingMessages.length})
      </button>
      <button 
        class="contact-tab ${currentContactTab === 'replied' ? 'active' : ''}" 
        onclick="switchContactTab('replied')"
        style="padding: var(--spacing-md) var(--spacing-lg); background: none; border: none; border-bottom: 3px solid transparent; cursor: pointer; font-size: 1.1rem; font-weight: 600; transition: all 0.3s;"
      >
        ✅ 歷史紀錄 (${repliedMessages.length})
      </button>
    </div>
    
    <!-- 待回覆內容 -->
    <div id="pendingTab" style="display: ${currentContactTab === 'pending' ? 'block' : 'none'};">
      ${pendingMessages.length === 0 ? `
        <div style="text-align: center; padding: var(--spacing-xl); background: var(--soft-peach); border-radius: var(--radius-md);">
          <p style="font-size: 1.2rem; color: var(--dark-gray); margin: 0;">🎉 太棒了！目前沒有待處理的訊息</p>
        </div>
      ` : renderMessageCards(pendingMessages, true)}
    </div>
    
    <!-- 歷史紀錄內容 -->
    <div id="repliedTab" style="display: ${currentContactTab === 'replied' ? 'block' : 'none'};">
      ${repliedMessages.length === 0 ? `
        <div style="text-align: center; padding: var(--spacing-xl); background: var(--soft-peach); border-radius: var(--radius-md);">
          <p style="font-size: 1.2rem; color: var(--dark-gray); margin: 0;">📭 尚無歷史紀錄</p>
        </div>
      ` : renderMessageCards(repliedMessages, false)}
    </div>
  `;
  
  // 更新 Tab 樣式
  updateTabStyles();
}

// ===== 切換分頁 =====
function switchContactTab(tab) {
  currentContactTab = tab;
  
  const pendingTab = document.getElementById('pendingTab');
  const repliedTab = document.getElementById('repliedTab');
  
  if (tab === 'pending') {
    pendingTab.style.display = 'block';
    repliedTab.style.display = 'none';
  } else {
    pendingTab.style.display = 'none';
    repliedTab.style.display = 'block';
  }
  
  updateTabStyles();
}

// ===== 更新 Tab 樣式 =====
function updateTabStyles() {
  const tabs = document.querySelectorAll('.contact-tab');
  tabs.forEach(tab => {
    if (tab.classList.contains('active')) {
      tab.style.color = 'var(--primary-orange)';
      tab.style.borderBottomColor = 'var(--primary-orange)';
    } else {
      tab.style.color = 'var(--dark-gray)';
      tab.style.borderBottomColor = 'transparent';
    }
  });
}

// ===== 渲染訊息卡片 =====
function renderMessageCards(messages, isPending) {
  return messages.map(msg => {
    const statusColor = isPending ? '#FF9800' : '#4CAF50';
    const statusBg = isPending ? '#FFF3E0' : '#E8F5E9';
    
    return `
      <div class="admin-message-card" data-message-id="${msg.id}" style="background: var(--white); border-radius: var(--radius-md); padding: var(--spacing-lg); margin-bottom: var(--spacing-lg); box-shadow: var(--shadow-md); border-left: 5px solid ${statusColor}; transition: all 0.3s;">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: var(--spacing-md); padding-bottom: var(--spacing-md); border-bottom: 2px solid var(--light-gray);">
          <div>
            <div style="font-size: 1.1rem; font-weight: 700; color: var(--text-dark); margin-bottom: var(--spacing-xs);">
              👤 ${msg.userName}
            </div>
            <div style="font-size: 0.9rem; color: var(--dark-gray);">
              📧 ${msg.userId}
            </div>
            <div style="font-size: 0.85rem; color: var(--dark-gray); margin-top: var(--spacing-xs);">
              🕒 ${new Date(msg.timestamp).toLocaleString('zh-TW')}
            </div>
          </div>
          <span style="background: ${statusBg}; color: ${statusColor}; padding: 0.5rem 1rem; border-radius: var(--radius-full); font-size: 1rem; font-weight: 700; white-space: nowrap;">
            ${isPending ? '⏳ 待處理' : '✅ 已回覆'}
          </span>
        </div>
        
        <div style="background: var(--soft-peach); padding: var(--spacing-lg); border-radius: var(--radius-sm); margin-bottom: ${msg.reply ? 'var(--spacing-md)' : '0'};">
          <div style="font-weight: 700; color: var(--primary-orange); margin-bottom: var(--spacing-sm); font-size: 1.05rem;">
            📝 用戶問題：
          </div>
          <div style="color: var(--text-dark); line-height: 1.7; font-size: 1.05rem;">
            ${msg.content}
          </div>
        </div>
        
        ${isPending ? `
          <div style="background: #FFF9F0; padding: var(--spacing-lg); border-radius: var(--radius-sm); border: 2px dashed ${statusColor};">
            <label style="display: block; font-weight: 700; color: var(--text-dark); margin-bottom: var(--spacing-sm); font-size: 1.05rem;">
              💁 您的回覆：
            </label>
            <textarea 
              id="reply-${msg.id}"
              placeholder="請輸入您的回覆內容..."
              style="width: 100%; min-height: 100px; padding: var(--spacing-md); border: 2px solid var(--medium-gray); border-radius: var(--radius-sm); font-family: inherit; font-size: 1rem; resize: vertical; margin-bottom: var(--spacing-md);"
            ></textarea>
            <div style="display: flex; gap: var(--spacing-sm);">
              <button 
                onclick="handleAdminReply('${msg.id}')"
                style="flex: 1; padding: var(--spacing-md); background: linear-gradient(135deg, #4CAF50, #45A049); color: var(--white); border: none; border-radius: var(--radius-sm); font-size: 1.05rem; font-weight: 700; cursor: pointer; transition: var(--transition-base);"
                onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(76, 175, 80, 0.3)'"
                onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'"
              >
                ✅ 送出回覆
              </button>
              <button 
                onclick="handleDeleteMessage('${msg.id}')"
                style="padding: var(--spacing-md) var(--spacing-lg); background: var(--accent-red); color: var(--white); border: none; border-radius: var(--radius-sm); font-size: 1.05rem; font-weight: 700; cursor: pointer; transition: var(--transition-base);"
                onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(244, 67, 54, 0.3)'"
                onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'"
              >
                🗑️ 刪除
              </button>
            </div>
          </div>
        ` : `
          <div style="background: ${statusBg}; padding: var(--spacing-lg); border-radius: var(--radius-sm); border: 2px solid ${statusColor};">
            <div style="font-weight: 700; color: ${statusColor}; margin-bottom: var(--spacing-sm); font-size: 1.05rem; display: flex; align-items: center; gap: var(--spacing-xs);">
              <span>💁</span>
              <span>您的回覆：</span>
            </div>
            <div style="color: var(--text-dark); line-height: 1.7; font-size: 1.05rem; margin-bottom: var(--spacing-sm);">
              ${msg.reply}
            </div>
            ${msg.repliedAt ? `
              <div style="font-size: 0.9rem; color: ${statusColor}; font-weight: 600;">
                回覆時間：${new Date(msg.repliedAt).toLocaleString('zh-TW')}
              </div>
            ` : ''}
            <div style="margin-top: var(--spacing-md);">
              <button 
                onclick="handleDeleteMessage('${msg.id}')"
                style="padding: var(--spacing-sm) var(--spacing-md); background: var(--accent-red); color: var(--white); border: none; border-radius: var(--radius-sm); font-size: 0.95rem; font-weight: 600; cursor: pointer; transition: var(--transition-base);"
                onmouseover="this.style.opacity='0.9'"
                onmouseout="this.style.opacity='1'"
              >
                🗑️ 刪除此訊息
              </button>
            </div>
          </div>
        `}
      </div>
    `;
  }).join('');
}

// ===== 處理管理員回覆（含動畫）=====
function handleAdminReply(messageId) {
  const replyTextarea = document.getElementById(`reply-${messageId}`);
  const replyContent = replyTextarea.value.trim();
  
  if (!replyContent) {
    showError('請輸入回覆內容');
    return;
  }
  
  showConfirm('確定要送出回覆嗎？', () => {
    const success = replyToMessage(messageId, replyContent);
    
    if (success) {
      const card = document.querySelector(`[data-message-id="${messageId}"]`);
      if (card) {
        card.style.transition = 'all 0.5s';
        card.style.transform = 'translateX(100%)';
        card.style.opacity = '0';
        
        setTimeout(() => {
          showSuccess('回覆已送出！訊息已移至歷史紀錄');
          renderAdminContactMessages();
          updateAdminStats();
          // 強制更新統計
          if (typeof initStats === 'function') {
            initStats();
          }
        }, 500);
      } else {
        showSuccess('回覆已送出！');
        renderAdminContactMessages();
        updateAdminStats();
        // 強制更新統計
        if (typeof initStats === 'function') {
          initStats();
        }
      }
    } else {
      showError('回覆失敗，請重試');
    }
  });
}

// ===== 處理刪除訊息 =====
function handleDeleteMessage(messageId) {
  showConfirm('確定要刪除此訊息嗎？此操作無法復原。', () => {
    const success = deleteContactMessage(messageId);
    
    if (success) {
      showSuccess('訊息已刪除');
      renderAdminContactMessages();
      updateAdminStats();
    } else {
      showError('刪除失敗，請重試');
    }
  });
}

// ===== 更新統計數據 =====
function updateAdminStats() {
  const pendingCount = getPendingMessagesCount();
  const totalMessagesElement = document.getElementById('totalMessages');
  
  if (totalMessagesElement) {
    totalMessagesElement.textContent = pendingCount;
  }
}