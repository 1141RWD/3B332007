// 早餐店商品資料庫
const products = [
  // 蛋餅系列
  {
    id: 'egg-crepe-01',
    name: '原味蛋餅',
    price: 30,
    category: '蛋餅',
    image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&h=300&fit=crop',
    description: '經典手工蛋餅皮，香Q有嚼勁，搭配現煎鮮嫩蛋液',
    extras: [
      { name: '加蛋', price: 10 },
      { name: '加起司', price: 15 },
      { name: '加火腿', price: 15 },
      { name: '加培根', price: 20 }
    ]
  },
  {
    id: 'egg-crepe-02',
    name: '玉米蛋餅',
    price: 40,
    category: '蛋餅',
    image: 'https://images.unsplash.com/photo-1619365703203-63f3f3478e1a?w=400&h=300&fit=crop',
    description: '香甜玉米粒混入蛋液，每一口都能吃到玉米',
    extras: [
      { name: '加蛋', price: 10 },
      { name: '加起司', price: 15 },
      { name: '加火腿', price: 15 }
    ]
  },
  {
    id: 'egg-crepe-03',
    name: '起司蛋餅',
    price: 45,
    category: '蛋餅',
    image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=400&h=300&fit=crop',
    description: '雙倍起司拉絲享受，濃郁奶香與蛋餅完美結合',
    extras: [
      { name: '加蛋', price: 10 },
      { name: '再加起司', price: 15 },
      { name: '加培根', price: 20 }
    ]
  },

  // 漢堡系列
  {
    id: 'burger-01',
    name: '豬肉漢堡',
    price: 45,
    category: '漢堡',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    description: '厚切豬肉排現煎，搭配生菜番茄與特製美乃滋',
    extras: [
      { name: '加蛋', price: 10 },
      { name: '加起司', price: 15 },
      { name: '雙層肉', price: 25 }
    ]
  },
  {
    id: 'burger-02',
    name: '雞腿漢堡',
    price: 55,
    category: '漢堡',
    image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&h=300&fit=crop',
    description: '去骨雞腿排醃製入味，外酥內嫩多汁',
    extras: [
      { name: '加蛋', price: 10 },
      { name: '加起司', price: 15 },
      { name: '辣味醬', price: 0 }
    ]
  },

  // 吐司系列
  {
    id: 'toast-01',
    name: '火腿蛋吐司',
    price: 35,
    category: '吐司',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=300&fit=crop',
    description: '經典組合，厚片吐司烤得金黃酥脆',
    extras: [
      { name: '加蛋', price: 10 },
      { name: '加起司', price: 15 },
      { name: '加培根', price: 20 }
    ]
  },
  {
    id: 'toast-02',
    name: '鮪魚蛋吐司',
    price: 40,
    category: '吐司',
    image: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=300&fit=crop',
    description: '自製鮪魚沙拉，搭配新鮮雞蛋與生菜',
    extras: [
      { name: '加蛋', price: 10 },
      { name: '加起司', price: 15 }
    ]
  },
  {
    id: 'toast-03',
    name: '花生厚片',
    price: 30,
    category: '吐司',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop',
    description: '濃郁花生醬塗抹厚片吐司，懷舊經典味',
    extras: [
      { name: '加奶油', price: 5 },
      { name: '加煉乳', price: 10 }
    ]
  },

  // 飲料系列
  {
    id: 'drink-01',
    name: '古早味紅茶',
    price: 20,
    category: '飲料',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop',
    description: '傳統紅茶熬煮，茶香濃郁回甘',
    options: {
      sweetness: ['正常甜', '少糖', '半糖', '微糖', '無糖'],
      ice: ['正常冰', '少冰', '微冰', '去冰', '熱']
    }
  },
  {
    id: 'drink-02',
    name: '奶茶',
    price: 25,
    category: '飲料',
    image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=300&fit=crop',
    description: '香醇紅茶搭配濃郁鮮奶，奶香十足',
    options: {
      sweetness: ['正常甜', '少糖', '半糖', '微糖', '無糖'],
      ice: ['正常冰', '少冰', '微冰', '去冰', '熱']
    }
  },
  {
    id: 'drink-03',
    name: '豆漿',
    price: 20,
    category: '飲料',
    image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=400&h=300&fit=crop',
    description: '每日新鮮現磨豆漿，營養健康',
    options: {
      sweetness: ['原味', '微糖', '無糖'],
      ice: ['熱豆漿', '溫豆漿', '冰豆漿']
    }
  },
  {
    id: 'drink-04',
    name: '柳橙汁',
    price: 30,
    category: '飲料',
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=300&fit=crop',
    description: '100%現榨柳橙汁，維他命C滿滿',
    options: {
      sweetness: ['原味'],
      ice: ['正常冰', '少冰', '去冰']
    }
  },

  // 點心系列
  {
    id: 'snack-01',
    name: '薯餅',
    price: 15,
    category: '點心',
    image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400&h=300&fit=crop',
    description: '金黃酥脆薯餅，內軟外酥',
    extras: []
  },
  {
    id: 'snack-02',
    name: '雞塊（5塊）',
    price: 35,
    category: '點心',
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&h=300&fit=crop',
    description: '酥脆雞塊，搭配番茄醬或甜辣醬',
    extras: [
      { name: '加醬', price: 0 }
    ]
  },
  {
    id: 'snack-03',
    name: '薯條',
    price: 30,
    category: '點心',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop',
    description: '現炸酥脆薯條，份量十足',
    extras: [
      { name: '加起司醬', price: 10 }
    ]
  }
];

// 營業資訊
const storeInfo = {
  name: '晨光早餐店',
  slogan: '每一天，從美好早餐開始',
  phone: '(04) 2222-3333',
  address: '台中市西區美村路一段123號',
  hours: '週一至週日 06:00 - 14:00',
  delivery: {
    minOrder: 100,
    fee: 30,
    freeDeliveryOver: 300
  }
};

// 門市資料
const stores = [
  {
    id: 'store-01',
    name: '晨光早餐店 - 美村總店',
    area: '台中市',
    district: '西區',
    address: '台中市西區美村路一段123號',
    phone: '(04) 2222-3333',
    hours: '週一至週日 06:00 - 14:00',
    services: ['外送', '預約', '內用', '外帶'],
    features: ['總店', '停車場'],
    latitude: 24.1477,
    longitude: 120.6736
  },
  {
    id: 'store-02',
    name: '晨光早餐店 - 向上店',
    area: '台中市',
    district: '西區',
    address: '台中市西區向上路一段456號',
    phone: '(04) 2333-4444',
    hours: '週一至週日 06:00 - 13:00',
    services: ['外送', '預約', '外帶'],
    features: [],
    latitude: 24.1430,
    longitude: 120.6650
  },
  {
    id: 'store-03',
    name: '晨光早餐店 - 逢甲店',
    area: '台中市',
    district: '西屯區',
    address: '台中市西屯區文華路789號',
    phone: '(04) 2444-5555',
    hours: '週一至週日 06:00 - 14:00',
    services: ['外送', '預約', '內用', '外帶'],
    features: ['24H', '停車場'],
    latitude: 24.1797,
    longitude: 120.6478
  },
  {
    id: 'store-04',
    name: '晨光早餐店 - 一中店',
    area: '台中市',
    district: '北區',
    address: '台中市北區一中街234號',
    phone: '(04) 2555-6666',
    hours: '週一至週日 06:00 - 15:00',
    services: ['預約', '外帶'],
    features: ['學生優惠'],
    latitude: 24.1517,
    longitude: 120.6848
  },
  {
    id: 'store-05',
    name: '晨光早餐店 - 大里店',
    area: '台中市',
    district: '大里區',
    address: '台中市大里區中興路567號',
    phone: '(04) 2666-7777',
    hours: '週一至週日 05:30 - 13:30',
    services: ['外送', '預約', '內用', '外帶'],
    features: [],
    latitude: 24.0990,
    longitude: 120.6770
  },
  {
    id: 'store-06',
    name: '晨光早餐店 - 彰化店',
    area: '彰化縣',
    district: '彰化市',
    address: '彰化縣彰化市中正路890號',
    phone: '(04) 7777-8888',
    hours: '週一至週日 06:00 - 14:00',
    services: ['外送', '預約', '外帶'],
    features: [],
    latitude: 24.0518,
    longitude: 120.5161
  },
  {
    id: 'store-07',
    name: '晨光早餐店 - 員林店',
    area: '彰化縣',
    district: '員林市',
    address: '彰化縣員林市中山路345號',
    phone: '(04) 8888-9999',
    hours: '週一至週日 06:00 - 13:30',
    services: ['預約', '外帶'],
    features: [],
    latitude: 23.9588,
    longitude: 120.5747
  },
  {
    id: 'store-08',
    name: '晨光早餐店 - 南投店',
    area: '南投縣',
    district: '南投市',
    address: '南投縣南投市中興路678號',
    phone: '(049) 2222-1111',
    hours: '週一至週日 06:00 - 14:00',
    services: ['外送', '預約', '內用', '外帶'],
    features: ['停車場'],
    latitude: 23.9096,
    longitude: 120.6836
  }
];

// 最新消息資料
const newsItems = [
  {
    id: 'news-01',
    title: '🎉 會員日雙倍點數回饋',
    category: '優惠活動',
    date: '2025-01-15',
    image: 'https://images.unsplash.com/photo-1533920379810-6bedac961555?w=800&h=400&fit=crop',
    summary: '每週三會員日，消費享雙倍點數回饋！',
    content: '親愛的晨光會員，我們推出全新會員日活動！每週三於任一門市消費，即可享有雙倍點數回饋。點數可兌換超值優惠券，快來累積您的專屬優惠！',
    tags: ['會員優惠', '點數']
  },
  {
    id: 'news-02',
    title: '🆕 冬季限定餐點上市',
    category: '新品上市',
    date: '2025-01-10',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=400&fit=crop',
    summary: '暖心新品！招牌熱湯系列溫暖登場',
    content: '冬季限定！晨光推出三款暖心熱湯：玉米巧達濃湯、番茄蔬菜湯、南瓜濃湯。搭配套餐更優惠，溫暖您的每個早晨。',
    tags: ['新品', '季節限定']
  },
  {
    id: 'news-03',
    title: '📱 APP預約享95折',
    category: '系統更新',
    date: '2025-01-05',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=400&fit=crop',
    summary: '行動預約更便利，預約取餐享優惠',
    content: '現在透過晨光早餐店網站預約取餐，即可享有95折優惠！選擇您想要的取餐時間，到店直接取餐，省時又省錢。',
    tags: ['預約', '優惠']
  },
  {
    id: 'news-04',
    title: '🏪 南投新門市開幕',
    category: '門市消息',
    date: '2025-01-01',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop',
    summary: '南投店盛大開幕，開幕優惠中！',
    content: '晨光早餐店南投店於1/1盛大開幕！開幕期間單筆消費滿200元即贈50元優惠券，數量有限，送完為止。歡迎南投的朋友來品嚐美味早餐！',
    tags: ['新門市', '開幕優惠']
  }
];

// 優惠券資料
const coupons = [
  {
    id: 'coupon-01',
    name: '$50 折價券',
    discount: 50,
    type: 'fixed',
    minSpend: 200,
    points: 200,
    expiryDays: 30,
    description: '單筆消費滿 $200 可折抵 $50'
  },
  {
    id: 'coupon-02',
    name: '$100 折價券',
    discount: 100,
    type: 'fixed',
    minSpend: 500,
    points: 400,
    expiryDays: 30,
    description: '單筆消費滿 $500 可折抵 $100'
  },
  {
    id: 'coupon-03',
    name: '9折優惠券',
    discount: 10,
    type: 'percent',
    minSpend: 100,
    points: 100,
    expiryDays: 30,
    description: '全品項9折，無消費門檻'
  },
  {
    id: 'coupon-04',
    name: '免費薯餅券',
    discount: 0,
    type: 'item',
    minSpend: 150,
    points: 150,
    expiryDays: 30,
    description: '消費滿 $150 可免費兌換薯餅一份',
    itemId: 'snack-01'
  }
];

// 匯出資料（若使用模組化）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { products, storeInfo, stores, newsItems, coupons };
}