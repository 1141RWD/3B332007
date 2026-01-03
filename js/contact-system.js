// 客服聯絡系統核心邏輯
// 處理前台用戶發問與後台管理員回覆

// ===== 資料結構初始化 =====
function initContactSystem() {
  if (!localStorage.getItem('contact_messages')) {
    localStorage.setItem('contact_messages', JSON.stringify([]));
  }
}

// ===== 取得所有訊息 =====
function getAllContactMessages() {
  return JSON.parse(localStorage.getItem('contact_messages') || '[]');
}

// ===== 取得特定用戶的訊息 =====
function getUserContactMessages(userId) {
  const allMessages = getAllContactMessages();
  return allMessages.filter(msg => msg.userId === userId);
}

// ===== 新增訊息（用戶發問）=====
function addContactMessage(userId, userName, content) {
  const messages = getAllContactMessages();
  
  const newMessage = {
    id: Date.now().toString(),
    userId: userId,
    userName: userName,
    content: content,
    reply: '',
    status: 'pending', // 統一使用小寫
    timestamp: new Date().toISOString()
  };
  
  messages.push(newMessage);
  localStorage.setItem('contact_messages', JSON.stringify(messages));
  
  return newMessage;
}

// ===== 管理員回覆訊息 =====
function replyToMessage(messageId, replyContent) {
  const messages = getAllContactMessages();
  const messageIndex = messages.findIndex(msg => msg.id === messageId);
  
  if (messageIndex !== -1) {
    messages[messageIndex].reply = replyContent;
    messages[messageIndex].status = 'replied'; // 統一使用小寫
    messages[messageIndex].repliedAt = new Date().toISOString();
    
    // 同時更新 contactMessages（如果存在）
    localStorage.setItem('contactMessages', JSON.stringify(messages));
    localStorage.setItem('contact_messages', JSON.stringify(messages));
    return true;
  }
  
  return false;
}

// ===== 取得待處理訊息數量 =====
function getPendingMessagesCount() {
  const messages = getAllContactMessages();
  // 統一使用小寫狀態判斷
  return messages.filter(msg => {
    const status = (msg.status || '').toLowerCase();
    return status === 'pending';
  }).length;
}

// ===== 刪除訊息 =====
function deleteContactMessage(messageId) {
  let messages = getAllContactMessages();
  messages = messages.filter(msg => msg.id !== messageId);
  // 同時更新兩個 localStorage key
  localStorage.setItem('contact_messages', JSON.stringify(messages));
  localStorage.setItem('contactMessages', JSON.stringify(messages));
  return true;
}

// 初始化系統
initContactSystem();