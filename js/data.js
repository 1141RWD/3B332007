// 早餐店商品資料庫 - 完整客製化版（共84種商品）

// 通用客製化選項
const commonExtras = {
  egg: { name: '加蛋', price: 10 },
  cheese: { name: '加起司', price: 15 },
  ham: { name: '加火腿', price: 15 },
  bacon: { name: '加培根', price: 20 },
  corn: { name: '加玉米', price: 10 },
  tuna: { name: '加鮪魚', price: 15 },
  vegetable: { name: '加蔬菜', price: 10 },
  pork: { name: '加肉鬆', price: 12 }
};

const sauceOptions = ['番茄醬', '美乃滋', '甜辣醬', '蜂蜜芥末', '黑胡椒醬', '不加醬'];
const spicyLevels = ['不辣', '小辣', '中辣', '大辣', '特辣'];
const cookingStyles = ['正常', '稍微焦一點', '不要太焦'];

const products = [
  // ===== 蛋餅類 (12種) =====
  {
    id: 'egg-crepe-01',
    name: '原味蛋餅',
    price: 30,
    category: '蛋餅',
    image: 'images/egg-crepe/original.jpg',
    description: '經典手工蛋餅皮，香Q有嚼勁，搭配現煎鮮嫩蛋液',
    tags: ['人氣', '經典'],
    extras: [
      commonExtras.egg,
      commonExtras.cheese,
      commonExtras.ham,
      commonExtras.bacon,
      commonExtras.corn,
      commonExtras.tuna
    ],
    sauceOptions: sauceOptions,
    cookingStyle: cookingStyles
  },
  {
    id: 'egg-crepe-02',
    name: '玉米蛋餅',
    price: 40,
    category: '蛋餅',
    image: 'images/egg-crepe/corn.jpg',
    description: '香甜玉米粒混入蛋液，每一口都能吃到玉米',
    tags: ['人氣'],
    extras: [
      commonExtras.egg,
      commonExtras.cheese,
      commonExtras.ham,
      commonExtras.bacon
    ],
    sauceOptions: sauceOptions,
    cookingStyle: cookingStyles
  },
  {
    id: 'egg-crepe-03',
    name: '起司蛋餅',
    price: 45,
    category: '蛋餅',
    image: 'images/egg-crepe/cheese.jpg',
    description: '雙倍起司拉絲享受，濃郁奶香與蛋餅完美結合',
    tags: ['人氣'],
    extras: [
      commonExtras.egg,
      { name: '再加起司', price: 15 },
      commonExtras.ham,
      commonExtras.bacon
    ],
    sauceOptions: sauceOptions,
    cookingStyle: cookingStyles
  },
  {
    id: 'egg-crepe-04',
    name: '鮪魚蛋餅',
    price: 45,
    category: '蛋餅',
    image: 'images/egg-crepe/tuna.jpg',
    description: '新鮮鮪魚沙拉搭配蛋餅，鹹香好滋味',
    tags: ['店長推薦'],
    extras: [
      commonExtras.egg,
      commonExtras.cheese,
      commonExtras.corn
    ],
    sauceOptions: sauceOptions,
    cookingStyle: cookingStyles
  },
  {
    id: 'egg-crepe-05',
    name: '培根蛋餅',
    price: 50,
    category: '蛋餅',
    image: 'images/egg-crepe/bacon.jpg',
    description: '酥脆培根配蛋餅，超級滿足',
    tags: ['人氣'],
    extras: [
      commonExtras.egg,
      commonExtras.cheese,
      { name: '加雙倍培根', price: 30 }
    ],
    sauceOptions: sauceOptions,
    cookingStyle: cookingStyles
  },
  {
    id: 'egg-crepe-06',
    name: '火腿蛋餅',
    price: 45,
    category: '蛋餅',
    image: 'images/egg-crepe/ham.jpg',
    description: '經典火腿搭配，營養豐富',
    extras: [
      commonExtras.egg,
      commonExtras.cheese,
      commonExtras.bacon
    ],
    sauceOptions: sauceOptions,
    cookingStyle: cookingStyles
  },
  {
    id: 'egg-crepe-07',
    name: '蔬菜蛋餅',
    price: 40,
    category: '蛋餅',
    image: 'images/egg-crepe/vegetable.jpg',
    description: '新鮮蔬菜，健康首選',
    tags: ['素食'],
    extras: [
      commonExtras.egg,
      commonExtras.cheese,
      { name: '加雙倍蔬菜', price: 15 }
    ],
    sauceOptions: sauceOptions,
    cookingStyle: cookingStyles
  },
  {
    id: 'egg-crepe-08',
    name: '肉鬆蛋餅',
    price: 45,
    category: '蛋餅',
    image: 'images/egg-crepe/pork-floss.jpg',
    description: '香酥肉鬆，古早味',
    tags: ['經典'],
    extras: [
      commonExtras.egg,
      commonExtras.cheese,
      { name: '加雙倍肉鬆', price: 18 }
    ],
    sauceOptions: sauceOptions,
    cookingStyle: cookingStyles
  },
  {
    id: 'egg-crepe-09',
    name: '總匯蛋餅',
    price: 60,
    category: '蛋餅',
    image: 'images/egg-crepe/special.jpg',
    description: '火腿+培根+起司，超豪華組合',
    tags: ['店長推薦', '人氣'],
    extras: [
      commonExtras.egg,
      { name: '升級雙倍肉量', price: 30 }
    ],
    sauceOptions: sauceOptions,
    cookingStyle: cookingStyles
  },
  {
    id: 'egg-crepe-10',
    name: '蘑菇蛋餅',
    price: 48,
    category: '蛋餅',
    image: 'images/egg-crepe/mushroom.jpg',
    description: '新鮮蘑菇，口感豐富',
    extras: [
      commonExtras.egg,
      commonExtras.cheese,
      { name: '加雙倍蘑菇', price: 15 }
    ],
    sauceOptions: sauceOptions,
    cookingStyle: cookingStyles
  },
  {
    id: 'egg-crepe-11',
    name: '泡菜蛋餅',
    price: 45,
    category: '蛋餅',
    image: 'images/egg-crepe/kimchi.jpg',
    description: '韓式泡菜，酸辣開胃',
    tags: ['辣味', '新品'],
    extras: [
      commonExtras.egg,
      commonExtras.cheese,
      { name: '加雙倍泡菜', price: 15 }
    ],
    sauceOptions: sauceOptions,
    spicyLevel: spicyLevels,
    cookingStyle: cookingStyles
  },
  {
    id: 'egg-crepe-12',
    name: '黑胡椒蛋餅',
    price: 40,
    category: '蛋餅',
    image: 'images/egg-crepe/pepper.jpg',
    description: '黑胡椒香氣十足',
    extras: [
      commonExtras.egg,
      commonExtras.cheese,
      commonExtras.bacon
    ],
    sauceOptions: sauceOptions,
    spicyLevel: ['不辣', '正常', '加辣'],
    cookingStyle: cookingStyles
  },

  // ===== 漢堡類 (10種) =====
  {
    id: 'burger-01',
    name: '豬肉漢堡',
    price: 45,
    category: '漢堡',
    image: 'images/burger/pork.jpg',
    description: 'juicy豬肉排，鮮嫩多汁',
    tags: ['人氣'],
    extras: [
      commonExtras.egg,
      commonExtras.cheese,
      commonExtras.bacon,
      { name: '加生菜', price: 5 },
      { name: '加番茄', price: 5 },
      { name: '加洋蔥', price: 5 }
    ],
    sauceOptions: sauceOptions,
    breadType: ['原味麵包', '全麥麵包', '芝麻麵包']
  },
  {
    id: 'burger-02',
    name: '雞肉漢堡',
    price: 45,
    category: '漢堡',
    image: 'images/burger/chicken.jpg',
    description: '香嫩雞腿排，口感絕佳',
    tags: ['人氣'],
    extras: [
      commonExtras.egg,
      commonExtras.cheese,
      commonExtras.bacon,
      { name: '加生菜', price: 5 },
      { name: '加番茄', price: 5 }
    ],
    sauceOptions: sauceOptions,
    breadType: ['原味麵包', '全麥麵包', '芝麻麵包']
  },
  {
    id: 'burger-03',
    name: '牛肉漢堡',
    price: 65,
    category: '漢堡',
    image: 'images/burger/beef.jpg',
    description: '厚切牛肉，肉汁豐富',
    tags: ['店長推薦'],
    extras: [
      commonExtras.egg,
      commonExtras.cheese,
      commonExtras.bacon,
      { name: '加生菜', price: 5 },
      { name: '加番茄', price: 5 },
      { name: '加洋蔥', price: 5 },
      { name: '加酸黃瓜', price: 8 }
    ],
    sauceOptions: sauceOptions,
    breadType: ['原味麵包', '全麥麵包', '芝麻麵包'],
    pattyDoneness: ['三分熟', '五分熟', '七分熟', '全熟']
  },
  {
    id: 'burger-04',
    name: '魚排漢堡',
    price: 50,
    category: '漢堡',
    image: 'images/burger/fish.jpg',
    description: '酥炸魚排，海洋風味',
    extras: [
      commonExtras.egg,
      commonExtras.cheese,
      { name: '加生菜', price: 5 },
      { name: '加番茄', price: 5 },
      { name: '加塔塔醬', price: 5 }
    ],
    sauceOptions: sauceOptions,
    breadType: ['原味麵包', '全麥麵包', '芝麻麵包']
  },
  {
    id: 'burger-05',
    name: '培根蛋漢堡',
    price: 58,
    category: '漢堡',
    image: 'images/burger/bacon-egg.jpg',
    description: '雙層培根搭配煎蛋',
    tags: ['人氣'],
    extras: [
      commonExtras.cheese,
      { name: '加雙倍培根', price: 30 },
      { name: '加生菜', price: 5 }
    ],
    sauceOptions: sauceOptions,
    eggStyle: ['荷包蛋', '全熟蛋', '半熟蛋（流心）'],
    breadType: ['原味麵包', '全麥麵包', '芝麻麵包']
  },
  {
    id: 'burger-06',
    name: '起司豬肉堡',
    price: 55,
    category: '漢堡',
    image: 'images/burger/cheese-pork.jpg',
    description: '雙層起司融化誘人',
    tags: ['人氣'],
    extras: [
      commonExtras.egg,
      { name: '加三層起司', price: 25 },
      commonExtras.bacon,
      { name: '加生菜', price: 5 }
    ],
    sauceOptions: sauceOptions,
    breadType: ['原味麵包', '全麥麵包', '芝麻麵包']
  },
  {
    id: 'burger-07',
    name: '總匯漢堡',
    price: 75,
    category: '漢堡',
    image: 'images/burger/special.jpg',
    description: '豬肉+雞肉+培根+起司+蛋',
    tags: ['店長推薦', '人氣'],
    extras: [
      { name: '加生菜', price: 5 },
      { name: '加番茄', price: 5 },
      { name: '加洋蔥', price: 5 },
      { name: '升級雙倍肉量', price: 40 }
    ],
    sauceOptions: sauceOptions,
    breadType: ['原味麵包', '全麥麵包', '芝麻麵包']
  },
  {
    id: 'burger-08',
    name: '辣味雞腿堡',
    price: 52,
    category: '漢堡',
    image: 'images/burger/spicy-chicken.jpg',
    description: '香辣雞腿排，刺激味蕾',
    tags: ['辣味', '新品'],
    extras: [
      commonExtras.egg,
      commonExtras.cheese,
      { name: '加生菜', price: 5 },
      { name: '加墨西哥辣椒', price: 8 }
    ],
    sauceOptions: sauceOptions,
    spicyLevel: spicyLevels,
    breadType: ['原味麵包', '全麥麵包', '芝麻麵包']
  },
  {
    id: 'burger-09',
    name: '蔬菜漢堡',
    price: 42,
    category: '漢堡',
    image: 'images/burger/vegetable.jpg',
    description: '健康蔬菜搭配，清爽美味',
    tags: ['素食'],
    extras: [
      commonExtras.egg,
      commonExtras.cheese,
      { name: '加雙倍蔬菜', price: 10 },
      { name: '加酪梨', price: 20 }
    ],
    sauceOptions: sauceOptions,
    breadType: ['原味麵包', '全麥麵包', '芝麻麵包']
  },
  {
    id: 'burger-10',
    name: '鐵板豬排堡',
    price: 58,
    category: '漢堡',
    image: 'images/burger/grilled-pork.jpg',
    description: '鐵板現煎，香氣四溢',
    extras: [
      commonExtras.egg,
      commonExtras.cheese,
      { name: '加生菜', price: 5 },
      { name: '加番茄', price: 5 }
    ],
    sauceOptions: sauceOptions,
    breadType: ['原味麵包', '全麥麵包', '芝麻麵包']
  },

  // ===== 吐司類 (12種) =====
  {
    id: 'toast-01',
    name: '花生吐司',
    price: 25,
    category: '吐司',
    image: 'images/toast/peanut.jpg',
    description: '香濃花生醬，經典美味',
    tags: ['經典'],
    extras: [
      { name: '加奶油', price: 5 },
      { name: '加煉乳', price: 8 }
    ],
    toastLevel: ['淺烤', '正常', '酥脆'],
    spreadAmount: ['正常', '多一點', '少一點']
  },
  {
    id: 'toast-02',
    name: '草莓吐司',
    price: 30,
    category: '吐司',
    image: 'images/toast/strawberry.jpg',
    description: '酸甜草莓醬，清新口感',
    extras: [
      { name: '加奶油', price: 5 },
      { name: '加煉乳', price: 8 }
    ],
    toastLevel: ['淺烤', '正常', '酥脆'],
    spreadAmount: ['正常', '多一點', '少一點']
  },
  {
    id: 'toast-03',
    name: '巧克力吐司',
    price: 30,
    category: '吐司',
    image: 'images/toast/chocolate.jpg',
    description: '濃郁巧克力，甜蜜滿分',
    extras: [
      { name: '加奶油', price: 5 },
      { name: '加棉花糖', price: 10 }
    ],
    toastLevel: ['淺烤', '正常', '酥脆'],
    spreadAmount: ['正常', '多一點', '少一點']
  },
  {
    id: 'toast-04',
    name: '奶酥吐司',
    price: 35,
    category: '吐司',
    image: 'images/toast/butter-crisp.jpg',
    description: '香酥奶酥，口感豐富',
    tags: ['人氣'],
    extras: [
      { name: '加煉乳', price: 8 }
    ],
    toastLevel: ['正常', '酥脆'],
    spreadAmount: ['正常', '多一點']
  },
  {
    id: 'toast-05',
    name: '火腿蛋吐司',
    price: 42,
    category: '吐司',
    image: 'images/toast/ham-egg.jpg',
    description: '經典組合，營養均衡',
    tags: ['人氣'],
    extras: [
      commonExtras.cheese,
      { name: '加雙倍火腿', price: 20 },
      { name: '加生菜', price: 5 },
      { name: '加番茄', price: 5 }
    ],
    sauceOptions: sauceOptions,
    eggStyle: ['煎蛋', '炒蛋'],
    toastLevel: ['淺烤', '正常', '酥脆']
  },
  {
    id: 'toast-06',
    name: '培根蛋吐司',
    price: 48,
    category: '吐司',
    image: 'images/toast/bacon-egg.jpg',
    description: '酥脆培根配煎蛋',
    tags: ['人氣'],
    extras: [
      commonExtras.cheese,
      { name: '加雙倍培根', price: 30 },
      { name: '加生菜', price: 5 }
    ],
    sauceOptions: sauceOptions,
    eggStyle: ['煎蛋', '炒蛋'],
    toastLevel: ['淺烤', '正常', '酥脆']
  },
  {
    id: 'toast-07',
    name: '鮪魚蛋吐司',
    price: 48,
    category: '吐司',
    image: 'images/toast/tuna-egg.jpg',
    description: '鮮美鮪魚，營養滿分',
    extras: [
      commonExtras.cheese,
      { name: '加玉米', price: 10 },
      { name: '加生菜', price: 5 }
    ],
    sauceOptions: sauceOptions,
    eggStyle: ['煎蛋', '炒蛋'],
    toastLevel: ['淺烤', '正常', '酥脆']
  },
  {
    id: 'toast-08',
    name: '起司吐司',
    price: 38,
    category: '吐司',
    image: 'images/toast/cheese.jpg',
    description: '濃郁起司，拉絲誘人',
    tags: ['人氣'],
    extras: [
      { name: '加雙倍起司', price: 20 },
      { name: '加火腿', price: 15 }
    ],
    toastLevel: ['淺烤', '正常', '酥脆']
  },
  {
    id: 'toast-09',
    name: '肉鬆蛋吐司',
    price: 42,
    category: '吐司',
    image: 'images/toast/pork-egg.jpg',
    description: '香酥肉鬆，古早味',
    tags: ['經典'],
    extras: [
      commonExtras.cheese,
      { name: '加雙倍肉鬆', price: 18 }
    ],
    sauceOptions: ['美乃滋', '不加醬'],
    eggStyle: ['煎蛋', '炒蛋'],
    toastLevel: ['淺烤', '正常', '酥脆']
  },
  {
    id: 'toast-10',
    name: '總匯吐司',
    price: 58,
    category: '吐司',
    image: 'images/toast/special.jpg',
    description: '火腿+培根+起司+蛋',
    tags: ['店長推薦'],
    extras: [
      { name: '加生菜', price: 5 },
      { name: '加番茄', price: 5 },
      { name: '升級雙倍肉量', price: 30 }
    ],
    sauceOptions: sauceOptions,
    eggStyle: ['煎蛋', '炒蛋'],
    toastLevel: ['淺烤', '正常', '酥脆']
  },
  {
    id: 'toast-11',
    name: '玉米蛋吐司',
    price: 42,
    category: '吐司',
    image: 'images/toast/corn-egg.jpg',
    description: '香甜玉米粒，營養美味',
    extras: [
      commonExtras.cheese,
      { name: '加雙倍玉米', price: 15 },
      { name: '加火腿', price: 15 }
    ],
    sauceOptions: sauceOptions,
    eggStyle: ['煎蛋', '炒蛋'],
    toastLevel: ['淺烤', '正常', '酥脆']
  },
  {
    id: 'toast-12',
    name: '蜂蜜吐司',
    price: 30,
    category: '吐司',
    image: 'images/toast/honey.jpg',
    description: '天然蜂蜜，香甜可口',
    extras: [
      { name: '加奶油', price: 5 },
      { name: '加雙倍蜂蜜', price: 10 }
    ],
    toastLevel: ['淺烤', '正常', '酥脆']
  },

  // ===== 三明治類 (8種) =====
  {
    id: 'sandwich-01',
    name: '總匯三明治',
    price: 62,
    category: '三明治',
    image: 'images/sandwich/club.jpg',
    description: '豐富配料，層次分明',
    tags: ['店長推薦', '人氣'],
    extras: [
      { name: '加生菜', price: 5 },
      { name: '加番茄', price: 5 },
      { name: '加小黃瓜', price: 5 },
      { name: '升級雙倍肉量', price: 35 }
    ],
    sauceOptions: sauceOptions,
    breadType: ['白吐司', '全麥吐司'],
    cutStyle: ['對切', '不切', '切成四份']
  },
  {
    id: 'sandwich-02',
    name: '火腿起司三明治',
    price: 52,
    category: '三明治',
    image: 'images/sandwich/ham-cheese.jpg',
    description: '經典組合，美味不膩',
    tags: ['人氣'],
    extras: [
      commonExtras.egg,
      { name: '加生菜', price: 5 },
      { name: '加番茄', price: 5 },
      { name: '加雙倍起司', price: 20 }
    ],
    sauceOptions: sauceOptions,
    breadType: ['白吐司', '全麥吐司'],
    cutStyle: ['對切', '不切', '切成四份']
  },
  {
    id: 'sandwich-03',
    name: '鮪魚三明治',
    price: 56,
    category: '三明治',
    image: 'images/sandwich/tuna.jpg',
    description: '新鮮鮪魚沙拉',
    extras: [
      { name: '加蛋', price: 10 },
      { name: '加起司', price: 15 },
      { name: '加玉米', price: 10 },
      { name: '加生菜', price: 5 }
    ],
    sauceOptions: ['美乃滋', '千島醬', '不加醬'],
    breadType: ['白吐司', '全麥吐司'],
    cutStyle: ['對切', '不切', '切成四份']
  },
  {
    id: 'sandwich-04',
    name: '雞肉三明治',
    price: 56,
    category: '三明治',
    image: 'images/sandwich/chicken.jpg',
    description: '嫩雞胸肉，低脂健康',
    extras: [
      commonExtras.cheese,
      { name: '加生菜', price: 5 },
      { name: '加番茄', price: 5 },
      { name: '加小黃瓜', price: 5 }
    ],
    sauceOptions: sauceOptions,
    breadType: ['白吐司', '全麥吐司'],
    cutStyle: ['對切', '不切', '切成四份']
  },
  {
    id: 'sandwich-05',
    name: '培根生菜三明治',
    price: 62,
    category: '三明治',
    image: 'images/sandwich/blt.jpg',
    description: '酥脆培根配新鮮生菜',
    tags: ['人氣'],
    extras: [
      { name: '加蛋', price: 10 },
      { name: '加起司', price: 15 },
      { name: '加番茄', price: 5 },
      { name: '加雙倍培根', price: 30 }
    ],
    sauceOptions: sauceOptions,
    breadType: ['白吐司', '全麥吐司'],
    cutStyle: ['對切', '不切', '切成四份']
  },
  {
    id: 'sandwich-06',
    name: '蔬菜三明治',
    price: 48,
    category: '三明治',
    image: 'images/sandwich/vegetable.jpg',
    description: '健康蔬菜，清爽無負擔',
    tags: ['素食'],
    extras: [
      commonExtras.egg,
      commonExtras.cheese,
      { name: '加酪梨', price: 20 },
      { name: '加雙倍蔬菜', price: 10 }
    ],
    sauceOptions: sauceOptions,
    breadType: ['白吐司', '全麥吐司'],
    cutStyle: ['對切', '不切', '切成四份']
  },
  {
    id: 'sandwich-07',
    name: '起司蛋三明治',
    price: 48,
    category: '三明治',
    image: 'images/sandwich/cheese-egg.jpg',
    description: '濃郁起司加煎蛋',
    extras: [
      { name: '加雙倍起司', price: 20 },
      { name: '加火腿', price: 15 },
      { name: '加生菜', price: 5 }
    ],
    sauceOptions: sauceOptions,
    eggStyle: ['煎蛋', '炒蛋'],
    breadType: ['白吐司', '全麥吐司'],
    cutStyle: ['對切', '不切', '切成四份']
  },
  {
    id: 'sandwich-08',
    name: '豬排三明治',
    price: 68,
    category: '三明治',
    image: 'images/sandwich/pork-cutlet.jpg',
    description: '厚切豬排，份量十足',
    tags: ['店長推薦'],
    extras: [
      commonExtras.cheese,
      { name: '加蛋', price: 10 },
      { name: '加生菜', price: 5 },
      { name: '加番茄', price: 5 },
      { name: '加高麗菜絲', price: 8 }
    ],
    sauceOptions: sauceOptions,
    breadType: ['白吐司', '全麥吐司'],
    cutStyle: ['對切', '不切', '切成四份']
  },

  // ===== 飯糰類 (6種) =====
  {
    id: 'rice-ball-01',
    name: '傳統飯糰',
    price: 35,
    category: '飯糰',
    image: 'images/rice-ball/traditional.jpg',
    description: '古早味飯糰，滿滿回憶',
    tags: ['經典'],
    extras: [
      { name: '加油條', price: 5 },
      { name: '加菜脯', price: 5 },
      { name: '加肉鬆', price: 12 },
      { name: '加蛋', price: 10 }
    ],
    riceType: ['白米', '紫米', '糙米'],
    wrapStyle: ['海苔包', '飯在外']
  },
  {
    id: 'rice-ball-02',
    name: '肉鬆飯糰',
    price: 40,
    category: '飯糰',
    image: 'images/rice-ball/pork-floss.jpg',
    description: '香酥肉鬆，鹹香美味',
    tags: ['人氣'],
    extras: [
      { name: '加油條', price: 5 },
      { name: '加菜脯', price: 5 },
      { name: '加雙倍肉鬆', price: 18 },
      { name: '加蛋', price: 10 }
    ],
    riceType: ['白米', '紫米', '糙米'],
    wrapStyle: ['海苔包', '飯在外']
  },
  {
    id: 'rice-ball-03',
    name: '鮪魚飯糰',
    price: 45,
    category: '飯糰',
    image: 'images/rice-ball/tuna.jpg',
    description: '新鮮鮪魚，營養豐富',
    extras: [
      { name: '加油條', price: 5 },
      { name: '加玉米', price: 10 },
      { name: '加蛋', price: 10 },
      { name: '加起司', price: 15 }
    ],
    riceType: ['白米', '紫米', '糙米'],
    wrapStyle: ['海苔包', '飯在外']
  },
  {
    id: 'rice-ball-04',
    name: '肉鬆蛋飯糰',
    price: 48,
    category: '飯糰',
    image: 'images/rice-ball/pork-egg.jpg',
    description: '肉鬆加煎蛋，雙重美味',
    tags: ['人氣'],
    extras: [
      { name: '加油條', price: 5 },
      { name: '加菜脯', price: 5 },
      { name: '加雙倍肉鬆', price: 18 },
      { name: '加起司', price: 15 }
    ],
    riceType: ['白米', '紫米', '糙米'],
    wrapStyle: ['海苔包', '飯在外']
  },
  {
    id: 'rice-ball-05',
    name: '素食飯糰',
    price: 38,
    category: '飯糰',
    image: 'images/rice-ball/vegetable.jpg',
    description: '健康素食，清爽美味',
    tags: ['素食'],
    extras: [
      { name: '加油條', price: 5 },
      { name: '加蛋', price: 10 },
      { name: '加起司', price: 15 },
      { name: '加雙倍蔬菜', price: 10 }
    ],
    riceType: ['白米', '紫米', '糙米'],
    wrapStyle: ['海苔包', '飯在外']
  },
  {
    id: 'rice-ball-06',
    name: '韓式泡菜飯糰',
    price: 48,
    category: '飯糰',
    image: 'images/rice-ball/kimchi.jpg',
    description: '韓式泡菜，酸辣開胃',
    tags: ['辣味', '新品'],
    extras: [
      { name: '加油條', price: 5 },
      { name: '加雙倍泡菜', price: 15 },
      { name: '加蛋', price: 10 },
      { name: '加起司', price: 15 }
    ],
    riceType: ['白米', '紫米', '糙米'],
    wrapStyle: ['海苔包', '飯在外'],
    spicyLevel: spicyLevels
  },

  // ===== 鐵板麵類 (6種) =====
  {
    id: 'noodle-01',
    name: '黑胡椒鐵板麵',
    price: 65,
    category: '鐵板麵',
    image: 'images/noodle/black-pepper.jpg',
    description: '香濃黑胡椒，口感絕佳',
    tags: ['人氣'],
    extras: [
      { name: '加蛋', price: 10 },
      { name: '加起司', price: 15 },
      { name: '加肉量', price: 20 },
      { name: '加蔬菜', price: 10 }
    ],
    noodleType: ['油麵', '烏龍麵', '寬麵', '義大利麵'],
    spicyLevel: ['不辣', '正常', '加辣', '特辣'],
    sideDish: ['不加', '加荷包蛋', '加玉米', '加高麗菜']
  },
  {
    id: 'noodle-02',
    name: '蘑菇鐵板麵',
    price: 65,
    category: '鐵板麵',
    image: 'images/noodle/mushroom.jpg',
    description: '新鮮蘑菇，香氣四溢',
    extras: [
      { name: '加蛋', price: 10 },
      { name: '加起司', price: 15 },
      { name: '加雙倍蘑菇', price: 20 },
      { name: '加蔬菜', price: 10 }
    ],
    noodleType: ['油麵', '烏龍麵', '寬麵', '義大利麵'],
    sideDish: ['不加', '加荷包蛋', '加玉米', '加高麗菜']
  },
  {
    id: 'noodle-03',
    name: '培根鐵板麵',
    price: 70,
    category: '鐵板麵',
    image: 'images/noodle/bacon.jpg',
    description: '酥脆培根，濃郁美味',
    tags: ['人氣'],
    extras: [
      { name: '加蛋', price: 10 },
      { name: '加起司', price: 15 },
      { name: '加雙倍培根', price: 30 },
      { name: '加蔬菜', price: 10 }
    ],
    noodleType: ['油麵', '烏龍麵', '寬麵', '義大利麵'],
    sideDish: ['不加', '加荷包蛋', '加玉米', '加高麗菜']
  },
  {
    id: 'noodle-04',
    name: '雞肉鐵板麵',
    price: 70,
    category: '鐵板麵',
    image: 'images/noodle/chicken.jpg',
    description: '嫩雞肉塊，營養滿分',
    extras: [
      { name: '加蛋', price: 10 },
      { name: '加起司', price: 15 },
      { name: '加雙倍雞肉', price: 30 },
      { name: '加蔬菜', price: 10 }
    ],
    noodleType: ['油麵', '烏龍麵', '寬麵', '義大利麵'],
    sideDish: ['不加', '加荷包蛋', '加玉米', '加高麗菜']
  },
  {
    id: 'noodle-05',
    name: '泡菜鐵板麵',
    price: 65,
    category: '鐵板麵',
    image: 'images/noodle/kimchi.jpg',
    description: '韓式泡菜，酸辣過癮',
    tags: ['辣味'],
    extras: [
      { name: '加蛋', price: 10 },
      { name: '加起司', price: 15 },
      { name: '加雙倍泡菜', price: 20 },
      { name: '加肉量', price: 20 }
    ],
    noodleType: ['油麵', '烏龍麵', '寬麵', '義大利麵'],
    spicyLevel: spicyLevels,
    sideDish: ['不加', '加荷包蛋', '加玉米', '加高麗菜']
  },
  {
    id: 'noodle-06',
    name: '海鮮鐵板麵',
    price: 80,
    category: '鐵板麵',
    image: 'images/noodle/seafood.jpg',
    description: '多種海鮮，鮮美可口',
    tags: ['店長推薦'],
    extras: [
      { name: '加蛋', price: 10 },
      { name: '加起司', price: 15 },
      { name: '加雙倍海鮮', price: 40 },
      { name: '加蔬菜', price: 10 }
    ],
    noodleType: ['油麵', '烏龍麵', '寬麵', '義大利麵'],
    spicyLevel: ['不辣', '正常', '加辣'],
    sideDish: ['不加', '加荷包蛋', '加玉米', '加高麗菜']
  },

  // ===== 飲料類 (18種) =====
  {
    id: 'drink-01',
    name: '紅茶',
    price: 20,
    category: '飲料',
    image: 'images/drink/black-tea.jpg',
    description: '古早味紅茶，解渴首選',
    tags: ['經典'],
    options: {
      sweetness: ['正常糖', '少糖', '半糖', '微糖', '無糖'],
      ice: ['正常冰', '少冰', '微冰', '去冰', '溫', '熱'],
      size: ['中杯', '大杯(+$5)']
    }
  },
  {
    id: 'drink-02',
    name: '奶茶',
    price: 25,
    category: '飲料',
    image: 'images/drink/milk-tea.jpg',
    description: '香濃奶茶，滑順好喝',
    tags: ['人氣'],
    options: {
      sweetness: ['正常糖', '少糖', '半糖', '微糖', '無糖'],
      ice: ['正常冰', '少冰', '微冰', '去冰', '溫', '熱'],
      size: ['中杯', '大杯(+$5)']
    }
  },
  {
    id: 'drink-03',
    name: '豆漿',
    price: 20,
    category: '飲料',
    image: 'images/drink/soy-milk.jpg',
    description: '每日新鮮現磨豆漿，營養健康',
    tags: ['人氣'],
    options: {
      sweetness: ['原味', '微糖', '無糖'],
      temperature: ['熱豆漿', '溫豆漿', '冰豆漿'],
      size: ['中杯', '大杯(+$5)']
    }
  },
  {
    id: 'drink-04',
    name: '咖啡',
    price: 30,
    category: '飲料',
    image: 'images/drink/coffee.jpg',
    description: '現煮咖啡，提神醒腦',
    tags: ['人氣'],
    options: {
      sweetness: ['正常糖', '少糖', '微糖', '無糖'],
      type: ['美式', '拿鐵(+$10)'],
      ice: ['熱咖啡', '冰咖啡'],
      size: ['中杯', '大杯(+$5)']
    }
  },
  {
    id: 'drink-05',
    name: '綠茶',
    price: 20,
    category: '飲料',
    image: 'images/drink/green-tea.jpg',
    description: '清新綠茶，回甘順口',
    options: {
      sweetness: ['正常糖', '少糖', '半糖', '微糖', '無糖'],
      ice: ['正常冰', '少冰', '微冰', '去冰', '溫', '熱'],
      size: ['中杯', '大杯(+$5)']
    }
  },
  {
    id: 'drink-06',
    name: '冬瓜茶',
    price: 20,
    category: '飲料',
    image: 'images/drink/winter-melon.jpg',
    description: '古早味冬瓜茶',
    tags: ['經典'],
    options: {
      sweetness: ['正常糖', '少糖', '半糖', '微糖'],
      ice: ['正常冰', '少冰', '微冰', '去冰', '溫', '熱'],
      size: ['中杯', '大杯(+$5)']
    }
  },
  {
    id: 'drink-07',
    name: '檸檬綠茶',
    price: 30,
    category: '飲料',
    image: 'images/drink/lemon-tea.jpg',
    description: '酸甜檸檬，清爽解膩',
    tags: ['人氣'],
    options: {
      sweetness: ['正常糖', '少糖', '半糖', '微糖'],
      ice: ['正常冰', '少冰', '微冰', '去冰'],
      lemonAmount: ['正常', '多檸檬(+$5)', '少檸檬'],
      size: ['中杯', '大杯(+$5)']
    }
  },
  {
    id: 'drink-08',
    name: '柳橙汁',
    price: 35,
    category: '飲料',
    image: 'images/drink/orange-juice.jpg',
    description: '100%現榨柳橙汁，維他命C滿滿',
    options: {
      sweetness: ['原味'],
      ice: ['正常冰', '少冰', '去冰'],
      size: ['中杯', '大杯(+$10)']
    }
  },
  {
    id: 'drink-09',
    name: '蘋果汁',
    price: 35,
    category: '飲料',
    image: 'images/drink/apple-juice.jpg',
    description: '新鮮蘋果，香甜可口',
    options: {
      ice: ['正常冰', '少冰', '微冰'],
      size: ['中杯', '大杯(+$10)']
    }
  },
  {
    id: 'drink-10',
    name: '可可',
    price: 30,
    category: '飲料',
    image: 'images/drink/cocoa.jpg',
    description: '濃郁可可，香醇滑順',
    options: {
      sweetness: ['正常糖', '少糖', '微糖'],
      temperature: ['熱可可', '冰可可'],
      size: ['中杯', '大杯(+$5)']
    }
  },
  {
    id: 'drink-11',
    name: '鮮奶茶',
    price: 35,
    category: '飲料',
    image: 'images/drink/fresh-milk-tea.jpg',
    description: '鮮奶調製，香濃美味',
    tags: ['人氣'],
    options: {
      sweetness: ['正常糖', '少糖', '半糖', '微糖'],
      ice: ['正常冰', '少冰', '微冰', '去冰', '溫', '熱'],
      size: ['中杯', '大杯(+$5)']
    }
  },
  {
    id: 'drink-12',
    name: '珍珠奶茶',
    price: 40,
    category: '飲料',
    image: 'images/drink/bubble-tea.jpg',
    description: 'Q彈珍珠，經典必喝',
    tags: ['人氣'],
    options: {
      sweetness: ['正常糖', '少糖', '半糖', '微糖'],
      ice: ['正常冰', '少冰', '微冰', '去冰'],
      pearls: ['正常珍珠', '多珍珠(+$5)', '少珍珠', '不加珍珠(-$5)'],
      size: ['中杯', '大杯(+$5)']
    }
  },
  {
    id: 'drink-13',
    name: '烏龍茶',
    price: 25,
    category: '飲料',
    image: 'images/drink/oolong-tea.jpg',
    description: '清香烏龍，回甘無窮',
    options: {
      sweetness: ['正常糖', '少糖', '半糖', '微糖', '無糖'],
      ice: ['正常冰', '少冰', '微冰', '去冰', '溫', '熱'],
      size: ['中杯', '大杯(+$5)']
    }
  },
  {
    id: 'drink-14',
    name: '蜂蜜檸檬',
    price: 35,
    category: '飲料',
    image: 'images/drink/honey-lemon.jpg',
    description: '天然蜂蜜加檸檬',
    options: {
      ice: ['正常冰', '少冰', '微冰', '去冰', '溫', '熱'],
      honeyAmount: ['正常', '多蜂蜜(+$5)', '少蜂蜜'],
      size: ['中杯', '大杯(+$5)']
    }
  },
  {
    id: 'drink-15',
    name: '紅茶拿鐵',
    price: 40,
    category: '飲料',
    image: 'images/drink/black-tea-latte.jpg',
    description: '紅茶加鮮奶，雙重享受',
    tags: ['新品'],
    options: {
      sweetness: ['正常糖', '少糖', '微糖'],
      ice: ['熱飲', '冰飲'],
      size: ['中杯', '大杯(+$5)']
    }
  },
  {
    id: 'drink-16',
    name: '抹茶拿鐵',
    price: 45,
    category: '飲料',
    image: 'images/drink/matcha-latte.jpg',
    description: '濃郁抹茶，日式風味',
    tags: ['新品'],
    options: {
      sweetness: ['正常糖', '少糖', '微糖'],
      ice: ['熱飲', '冰飲'],
      matchaLevel: ['正常', '濃抹茶(+$5)'],
      size: ['中杯', '大杯(+$5)']
    }
  },
  {
    id: 'drink-17',
    name: '多多綠茶',
    price: 35,
    category: '飲料',
    image: 'images/drink/yakult-tea.jpg',
    description: '養樂多加綠茶，酸甜好喝',
    tags: ['人氣'],
    options: {
      sweetness: ['正常糖', '少糖', '半糖'],
      ice: ['正常冰', '少冰', '微冰'],
      yakultAmount: ['1瓶', '2瓶(+$10)'],
      size: ['中杯', '大杯(+$5)']
    }
  },
  {
    id: 'drink-18',
    name: '冰淇淋紅茶',
    price: 45,
    category: '飲料',
    image: 'images/drink/ice-cream-tea.jpg',
    description: '紅茶加冰淇淋，夏日首選',
    tags: ['季節限定'],
    options: {
      sweetness: ['正常糖', '少糖'],
      flavor: ['香草', '巧克力', '草莓']
    }
  },

  // ===== 點心類 (12種) =====
  {
    id: 'snack-01',
    name: '薯餅',
    price: 15,
    category: '點心',
    image: 'images/snack/hash-brown.jpg',
    description: '金黃酥脆薯餅，內軟外酥',
    tags: ['人氣'],
    extras: [
      { name: '加起司', price: 10 },
      { name: '加培根碎', price: 15 }
    ],
    dippingSauce: ['番茄醬', '不加醬']
  },
  {
    id: 'snack-02',
    name: '薯條',
    price: 30,
    category: '點心',
    image: 'images/snack/fries.jpg',
    description: '現炸酥脆薯條，份量十足',
    tags: ['人氣'],
    extras: [
      { name: '加起司醬', price: 10 },
      { name: '升級大份(+50%)', price: 15 }
    ],
    dippingSauce: ['番茄醬', '美乃滋', '甜辣醬', '不加醬'],
    seasoning: ['原味', '海鹽', '起司粉', '梅子粉']
  },
  {
    id: 'snack-03',
    name: '雞塊（5塊）',
    price: 35,
    category: '點心',
    image: 'images/snack/chicken-nuggets.jpg',
    description: '酥脆雞塊，搭配番茄醬或甜辣醬',
    tags: ['人氣'],
    extras: [
      { name: '加5塊', price: 30 },
      { name: '加10塊', price: 55 }
    ],
    dippingSauce: ['番茄醬', '甜辣醬', '蜂蜜芥末', '不加醬']
  },
  {
    id: 'snack-04',
    name: '雞米花',
    price: 38,
    category: '點心',
    image: 'images/snack/popcorn-chicken.jpg',
    description: '一口一個，停不下來',
    extras: [
      { name: '升級大份(+50%)', price: 18 }
    ],
    dippingSauce: ['番茄醬', '甜辣醬', '胡椒鹽', '不加醬'],
    spicyLevel: ['不辣', '微辣', '中辣', '重辣']
  },
  {
    id: 'snack-05',
    name: '洋蔥圈',
    price: 35,
    category: '點心',
    image: 'images/snack/onion-rings.jpg',
    description: '香酥洋蔥，美味可口',
    extras: [
      { name: '升級大份(+50%)', price: 15 }
    ],
    dippingSauce: ['番茄醬', '美乃滋', '千島醬', '不加醬']
  },
  {
    id: 'snack-06',
    name: '起司條',
    price: 40,
    category: '點心',
    image: 'images/snack/mozzarella-sticks.jpg',
    description: '濃郁起司，拉絲誘人',
    tags: ['人氣'],
    extras: [
      { name: '加5條', price: 35 }
    ],
    dippingSauce: ['番茄醬', '蜂蜜芥末', '不加醬']
  },
  {
    id: 'snack-07',
    name: '魚條',
    price: 35,
    category: '點心',
    image: 'images/snack/fish-fingers.jpg',
    description: '新鮮魚肉，營養美味',
    extras: [
      { name: '加5條', price: 30 }
    ],
    dippingSauce: ['塔塔醬', '檸檬汁', '番茄醬', '不加醬']
  },
  {
    id: 'snack-08',
    name: '雞翅',
    price: 45,
    category: '點心',
    image: 'images/snack/chicken-wings.jpg',
    description: '多汁雞翅，香嫩美味',
    tags: ['人氣'],
    extras: [
      { name: '加3隻', price: 40 }
    ],
    flavor: ['原味', '蒜味', '辣味', '蜜汁'],
    dippingSauce: ['不加醬', '甜辣醬', '蜂蜜芥末']
  },
  {
    id: 'snack-09',
    name: '熱狗',
    price: 25,
    category: '點心',
    image: 'images/snack/hot-dog.jpg',
    description: '經典熱狗，懷舊滋味',
    tags: ['經典'],
    extras: [
      { name: '加起司', price: 10 },
      { name: '加酸菜', price: 5 }
    ],
    dippingSauce: ['番茄醬', '黃芥末', '美乃滋', '不加醬']
  },
  {
    id: 'snack-10',
    name: '炸春捲',
    price: 30,
    category: '點心',
    image: 'images/snack/spring-rolls.jpg',
    description: '酥脆外皮，香濃內餡',
    extras: [
      { name: '加3條', price: 25 }
    ],
    dippingSauce: ['甜辣醬', '梅子醬', '不加醬']
  },
  {
    id: 'snack-11',
    name: '地瓜球',
    price: 30,
    category: '點心',
    image: 'images/snack/sweet-potato-balls.jpg',
    description: 'Q彈地瓜球，香甜美味',
    tags: ['人氣'],
    extras: [
      { name: '升級大份(+50%)', price: 15 }
    ],
    dippingSauce: ['煉乳', '梅子粉', '不加醬']
  },
  {
    id: 'snack-12',
    name: '銀絲卷',
    price: 25,
    category: '點心',
    image: 'images/snack/steamed-rolls.jpg',
    description: '鬆軟銀絲卷，古早味',
    tags: ['經典'],
    extras: [
      { name: '加煉乳', price: 5 },
      { name: '加花生醬', price: 8 }
    ],
    servingStyle: ['原味', '炸酥']
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