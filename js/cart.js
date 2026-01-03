<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>購物車 - 晨光早餐店</title>
  <link rel="stylesheet" href="css/style.css">
  
  <!-- 必須按順序載入 -->
  <script src="js/data.js"></script>
  <script src="js/utils.js"></script>
  <script src="js/coupon-system.js"></script>
  <script src="js/auth.js"></script>
  <script src="js/shop.js"></script>
  
  <style>
    .cart-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1rem;
      min-height: calc(100vh - 80px);
    }
    
    .cart-header {
      margin-bottom: 2rem;
    }
    
    .cart-header h1 {
      font-size: 2rem;
      color: var(--text-dark);
      margin-bottom: 0.5rem;
    }
    
    .cart-content {
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 2rem;
    }
    
    .cart-items-section {
      background: var(--soft-peach);
      padding: 1.5rem;
      border-radius: var(--radius-lg);
    }
    
    .empty-cart {
      text-align: center;
      padding: 4rem 2rem;
    }
    
    .empty-cart-icon {
      font-size: 5rem;
      margin-bottom: 1rem;
    }
    
    .empty-cart h2 {
      font-size: 1.5rem;
      color: var(--text-dark);
      margin-bottom: 1rem;
    }
    
    .empty-cart p {
      color: var(--dark-gray);
      margin-bottom: 2rem;
    }
    
    .go-shopping-btn {
      background: linear-gradient(135deg, var(--primary-orange), var(--accent-red));
      color: white;
      padding: 1rem 2rem;
      border: none;
      border-radius: var(--radius-md);
      font-size: 1.1rem;
      font-weight: 700;
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
      transition: var(--transition-base);
    }
    
    .go-shopping-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
    }
    
    .cart-summary {
      background: white;
      padding: 2rem;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
      height: fit-content;
      position: sticky;
      top: 20px;
    }
    
    .summary-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-dark);
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid var(--light-gray);
    }
    
    .coupon-section {
      margin-bottom: 1.5rem;
      padding-bottom: 1.5rem;
      border-bottom: 2px solid var(--light-gray);
    }
    
    .coupon-section label {
      display: block;
      font-weight: 600;
      color: var(--text-dark);
      margin-bottom: 0.5rem;
    }
    
    .coupon-select {
      width: 100%;
      padding: 0.8rem;
      border: 2px solid var(--medium-gray);
      border-radius: var(--radius-sm);
      font-size: 1rem;
      cursor: pointer;
      background: white;
    }
    
    .discount-info {
      background: #E8F5E9;
      border: 2px solid #4CAF50;
      border-radius: var(--radius-sm);
      padding: 1rem;
      margin-bottom: 1.5rem;
    }
    
    .discount-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      color: var(--text-dark);
    }
    
    .discount-row.total {
      color: #2E7D32;
      font-weight: 700;
      font-size: 1.1rem;
      margin-bottom: 0;
    }
    
    .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1rem;
      font-size: 1rem;
      color: var(--text-dark);
    }
    
    .summary-total {
      display: flex;
      justify-content: space-between;
      padding-top: 1rem;
      border-top: 2px solid var(--medium-gray);
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--primary-orange);
      margin-bottom: 1.5rem;
    }
    
    .checkout-btn {
      width: 100%;
      background: linear-gradient(135deg, var(--primary-orange), var(--accent-red));
      color: white;
      padding: 1.2rem;
      border: none;
      border-radius: var(--radius-md);
      font-size: 1.2rem;
      font-weight: 700;
      cursor: pointer;
      transition: var(--transition-base);
    }
    
    .checkout-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(255, 107, 53, 0.4);
    }
    
    .continue-shopping {
      display: block;
      text-align: center;
      color: var(--primary-orange);
      text-decoration: none;
      margin-top: 1rem;
      font-weight: 600;
    }
    
    .continue-shopping:hover {
      text-decoration: underline;
    }
    
    @media (max-width: 768px) {
      .cart-content {
        grid-template-columns: 1fr;
      }
      
      .cart-summary {
        position: static;
      }
    }
  </style>
</head>
<body>
  <!-- 導覽列 -->
  <nav class="navbar">
    <div class="navbar-container">
      <a href="index.html" class="navbar-brand">
        <span class="brand-icon">☀️</span>
        <span class="brand-text">晨光早餐店</span>
      </a>
      
      <ul class="navbar-menu">
        <li><a href="index.html">首頁</a></li>
        <li><a href="menu.html">線上點餐</a></li>
        <li><a href="stores.html">門市查詢</a></li>
        <li><a href="contact.html">聯絡我們</a></li>
        <li><a href="cart.html" class="active">🛒 購物車</a></li>
        <li id="loginBtn" style="margin-left: auto;">
          <a href="login.html">🔐 登入 / 註冊</a>
        </li>
      </ul>
    </div>
  </nav>

  <!-- 購物車內容 -->
  <div class="cart-container">
    <div class="cart-header">
      <h1>🛒 購物車</h1>
      <p style="color: var(--dark-gray);">您的購物清單</p>
    </div>

    <div class="cart-content">
      <!-- 購物車商品區 -->
      <div class="cart-items-section">
        <!-- 空購物車訊息 -->
        <div id="emptyCart" class="empty-cart" style="display: none;">
          <div class="empty-cart-icon">🛒</div>
          <h2>您的購物車是空的</h2>
          <p>快去挑選美味的早餐吧！</p>
          <a href="menu.html" class="go-shopping-btn">🍳 開始點餐</a>
        </div>

        <!-- 購物車商品列表 -->
        <div id="cartItems"></div>
      </div>

      <!-- 結帳摘要區 -->
      <div id="cartSummary" class="cart-summary" style="display: none;">
        <h2 class="summary-title">💰 結帳摘要</h2>

        <!-- 折價券選擇 -->
        <div class="coupon-section">
          <label for="couponSelect">🎫 選擇折價券</label>
          <select id="couponSelect" class="coupon-select" onchange="window.calculateTotal()">
            <option value="">載入中...</option>
          </select>
        </div>

        <!-- 折扣資訊（使用折價券時顯示）-->
        <div id="discountInfo" class="discount-info" style="display: none;">
          <div class="discount-row">
            <span>原價</span>
            <span id="originalPrice">$0</span>
          </div>
          <div class="discount-row total">
            <span>💰 折扣</span>
            <span id="discountAmount">-$0</span>
          </div>
        </div>

        <!-- 金額明細 -->
        <div class="summary-row">
          <span>小計</span>
          <span id="cartSubtotal">$0</span>
        </div>
        <div class="summary-row">
          <span>運費</span>
          <span id="cartShipping">$0</span>
        </div>

        <!-- 總計 -->
        <div class="summary-total">
          <span>總計</span>
          <span id="cartTotal">$0</span>
        </div>

        <!-- 結帳按鈕 -->
        <button onclick="window.checkout()" class="checkout-btn">
          🛒 確認結帳
        </button>

        <a href="menu.html" class="continue-shopping">
          ← 繼續購物
        </a>
      </div>
    </div>
  </div>

  <!-- 頁尾 -->
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-section">
        <h3>關於我們</h3>
        <p>晨光早餐店提供新鮮美味的早餐，讓您的每一天都充滿活力！</p>
      </div>
      <div class="footer-section">
        <h3>快速連結</h3>
        <ul>
          <li><a href="index.html">首頁</a></li>
          <li><a href="menu.html">線上點餐</a></li>
          <li><a href="stores.html">門市查詢</a></li>
        </ul>
      </div>
      <div class="footer-section">
        <h3>聯絡資訊</h3>
        <p>📞 電話：(04) 1234-5678</p>
        <p>📧 Email: info@morning-glory.com</p>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2025 晨光早餐店 Morning Glory. All rights reserved.</p>
    </div>
  </footer>

  <!-- 初始化購物車頁面 -->
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      console.log('📄 Cart.html 頁面載入');
      
      // 渲染購物車項目
      if (typeof window.renderCartItems === 'function') {
        window.renderCartItems();
      } else {
        console.error('❌ renderCartItems 函數未定義');
      }
      
      // 載入可用折價券
      if (typeof window.loadAvailableCoupons === 'function') {
        window.loadAvailableCoupons();
      } else {
        console.warn('⚠️ loadAvailableCoupons 函數未定義');
      }
    });
  </script>
</body>
</html>