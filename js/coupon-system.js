// ===== 折價券系統 =====

// 初始化折價券資料
function initCoupons() {
  if (!localStorage.getItem('coupons')) {
    const defaultCoupons = [
      {
        code: 'OPEN88',
        discount: 0.88,
        type: 'percent',
        title: '開幕88折',
        description: '全館商品88折優惠',
        active: true,
        featured: true,
        minAmount: 0,
        maxDiscount: null,
        pointCost: 0, // 免費券
        createdAt: new Date().toISOString()
      },
      {
        code: 'NEW100',
        discount: 100,
        type: 'fixed',
        title: '新會員100元折扣',
        description: '滿500元可用',
        active: true,
        featured: false,
        minAmount: 500,
        maxDiscount: null,
        pointCost: 0, // 免費券
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem('coupons', JSON.stringify(defaultCoupons));
  }
}

// 取得所有折價券
function getAllCoupons() {
  return JSON.parse(localStorage.getItem('coupons') || '[]');
}

// 取得啟用的折價券
function getActiveCoupons() {
  const coupons = getAllCoupons();
  return coupons.filter(c => c.active);
}

// 取得主打折價券
function getFeaturedCoupon() {
  const coupons = getAllCoupons();
  return coupons.find(c => c.active && c.featured);
}

// 新增折價券
function addCoupon(couponData) {
  const coupons = getAllCoupons();
  
  // 檢查代碼是否已存在
  if (coupons.find(c => c.code === couponData.code)) {
    return { success: false, message: '折價券代碼已存在' };
  }
  
  const newCoupon = {
    code: couponData.code.toUpperCase(),
    discount: parseFloat(couponData.discount),
    type: couponData.type,
    title: couponData.title,
    description: couponData.description || '',
    active: true,
    featured: couponData.featured || false,
    minAmount: parseInt(couponData.minAmount) || 0,
    maxDiscount: couponData.maxDiscount ? parseInt(couponData.maxDiscount) : null,
    pointCost: parseInt(couponData.pointCost) || 0, // 兌換所需點數（0 代表免費/公開）
    usageLimit: couponData.usageLimit ? parseInt(couponData.usageLimit) : 0, // 每人限用次數（0 代表無限制）
    createdAt: new Date().toISOString()
  };
  
  coupons.push(newCoupon);
  localStorage.setItem('coupons', JSON.stringify(coupons));
  
  return { success: true, coupon: newCoupon };
}

// 更新折價券
function updateCoupon(code, updates) {
  const coupons = getAllCoupons();
  const index = coupons.findIndex(c => c.code === code);
  
  if (index === -1) {
    return { success: false, message: '找不到折價券' };
  }
  
  coupons[index] = { ...coupons[index], ...updates };
  localStorage.setItem('coupons', JSON.stringify(coupons));
  
  return { success: true, coupon: coupons[index] };
}

// 刪除折價券
function deleteCoupon(code) {
  let coupons = getAllCoupons();
  coupons = coupons.filter(c => c.code !== code);
  localStorage.setItem('coupons', JSON.stringify(coupons));
  
  return { success: true };
}

// 設定主打折價券
function setFeaturedCoupon(code) {
  const coupons = getAllCoupons();
  
  coupons.forEach(c => {
    c.featured = (c.code === code);
  });
  
  localStorage.setItem('coupons', JSON.stringify(coupons));
  return { success: true };
}

// 驗證折價券
function validateCoupon(code, orderAmount, userId = null) {
  const coupons = getAllCoupons();
  const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase());
  
  if (!coupon) {
    return { valid: false, message: '折價券不存在' };
  }
  
  if (!coupon.active) {
    return { valid: false, message: '折價券已停用' };
  }
  
  if (orderAmount < (coupon.minAmount || 0)) {
    return { valid: false, message: `需滿 $${coupon.minAmount} 才能使用` };
  }
  
  // 檢查使用次數限制
  if (userId && coupon.usageLimit) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === userId);
    
    if (user) {
      // 初始化 usedCoupons
      if (!user.usedCoupons) {
        user.usedCoupons = {};
      }
      
      const usedCount = user.usedCoupons[coupon.code] || 0;
      if (usedCount >= coupon.usageLimit) {
        return { valid: false, message: `此折價券已達使用上限（${coupon.usageLimit}次）` };
      }
    }
  }
  
  return { valid: true, coupon: coupon };
}

// 計算折扣金額
function calculateDiscount(coupon, orderAmount) {
  let discount = 0;
  
  if (coupon.type === 'percent') {
    // 百分比折扣
    discount = Math.round(orderAmount * (1 - coupon.discount));
  } else if (coupon.type === 'fixed') {
    // 固定金額折扣
    discount = coupon.discount;
  }
  
  // 檢查最大折扣限制
  if (coupon.maxDiscount && discount > coupon.maxDiscount) {
    discount = coupon.maxDiscount;
  }
  
  return discount;
}

// 使用者領取折價券
function claimCoupon(userId, couponCode) {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const userIndex = users.findIndex(u => u.email === userId);
  
  if (userIndex === -1) {
    return { success: false, message: '找不到用戶' };
  }
  
  // 驗證折價券是否存在且啟用
  const result = validateCoupon(couponCode, 0);
  if (!result.valid && !result.coupon) {
    return { success: false, message: result.message };
  }
  
  // 初始化使用者的折價券陣列
  if (!users[userIndex].coupons) {
    users[userIndex].coupons = [];
  }
  
  // 檢查是否已領取
  const alreadyClaimed = users[userIndex].coupons.find(
    c => c.code === couponCode.toUpperCase()
  );
  
  if (alreadyClaimed) {
    return { success: false, message: '您已領取過此折價券' };
  }
  
  // 加入折價券
  users[userIndex].coupons.push({
    code: couponCode.toUpperCase(),
    claimedAt: new Date().toISOString(),
    used: false,
    usedAt: null
  });
  
  localStorage.setItem('users', JSON.stringify(users));
  
  return { success: true, message: '領取成功！' };
}

// 標記折價券為已使用
function useCoupon(userId, couponCode) {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const userIndex = users.findIndex(u => u.email === userId);
  
  if (userIndex === -1) return false;
  
  if (!users[userIndex].coupons) return false;
  
  const couponIndex = users[userIndex].coupons.findIndex(
    c => c.code === couponCode.toUpperCase() && !c.used
  );
  
  if (couponIndex === -1) return false;
  
  users[userIndex].coupons[couponIndex].used = true;
  users[userIndex].coupons[couponIndex].usedAt = new Date().toISOString();
  
  localStorage.setItem('users', JSON.stringify(users));
  
  return true;
}

// 取得使用者可用的折價券
function getUserAvailableCoupons(userId) {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => u.email === userId);
  
  if (!user || !user.coupons) return [];
  
  const allCoupons = getAllCoupons();
  
  return user.coupons
    .filter(uc => !uc.used)
    .map(uc => {
      const coupon = allCoupons.find(c => c.code === uc.code);
      return coupon ? { ...coupon, claimedAt: uc.claimedAt } : null;
    })
    .filter(c => c !== null && c.active);
}

// ===== 取得所有可用折價券（公開券 + 可兌換券）=====
window.getAvailableCoupons = function(userPoints = 0) {
  const allCoupons = getAllCoupons();
  const activeCoupons = allCoupons.filter(c => c.active);
  
  // 公開券（pointCost === 0）和可兌換券（pointCost > 0 且用戶點數足夠）
  return activeCoupons.filter(c => {
    const pointCost = c.pointCost || 0;
    return pointCost === 0 || (pointCost > 0 && userPoints >= pointCost);
  });
};

// ===== 取得可兌換的折價券（pointCost > 0 且 active）=====
window.getExchangeableCoupons = function() {
  const allCoupons = getAllCoupons();
  return allCoupons.filter(c => {
    const pointCost = c.pointCost || 0;
    return c.active && pointCost > 0;
  });
};

// ===== 驗證折價券（檢查是否過期或未達低消）=====
window.validateCoupon = function(code, cartTotal) {
  const coupons = getAllCoupons();
  const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase());
  
  if (!coupon) {
    return { valid: false, message: '折價券不存在' };
  }
  
  if (!coupon.active) {
    return { valid: false, message: '折價券已停用' };
  }
  
  if (cartTotal < (coupon.minAmount || 0)) {
    return { valid: false, message: `需滿 $${coupon.minAmount} 才能使用` };
  }
  
  return { valid: true, coupon: coupon };
};

// ===== 計算折扣金額 =====
window.calculateDiscount = function(coupon, cartTotal) {
  let discount = 0;
  
  if (coupon.type === 'percent') {
    // 百分比折扣
    discount = Math.round(cartTotal * (1 - coupon.discount));
  } else if (coupon.type === 'fixed') {
    // 固定金額折扣
    discount = coupon.discount;
  }
  
  // 檢查最大折扣限制
  if (coupon.maxDiscount && discount > coupon.maxDiscount) {
    discount = coupon.maxDiscount;
  }
  
  return discount;
};

// 初始化系統
initCoupons();