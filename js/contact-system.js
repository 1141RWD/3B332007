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
    status: 'Pending',
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
    messages[messageIndex].status = 'Replied';
    messages[messageIndex].repliedAt = new Date().toISOString();
    
    localStorage.setItem('contact_messages', JSON.stringify(messages));
    return true;
  }
  
  return false;
}

// ===== 取得待處理訊息數量 =====
function getPendingMessagesCount() {
  const messages = getAllContactMessages();
  return messages.filter(msg => msg.status === 'Pending').length;
}

// ===== 刪除訊息 =====
function deleteContactMessage(messageId) {
  let messages = getAllContactMessages();
  messages = messages.filter(msg => msg.id !== messageId);
  localStorage.setItem('contact_messages', JSON.stringify(messages));
  return true;
}

// 初始化系統
initContactSystem();