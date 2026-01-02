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

// 匯出資料（若使用模組化）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { products, storeInfo };
}