import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  onSnapshot, 
  query, 
  where,
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';

/**
 * =========================================================================
 * 1. REAL WEBSITE CATEGORIES & PRODUCTS (Direct Database Dataset)
 * =========================================================================
 */
export const INITIAL_REAL_CATEGORIES = [
  {
    id: "koikeya-snacks",
    title: "Koikeya Snacks",
    name: "Koikeya Snacks",
    img: "/images/koikeya_karamucho_hot_chili_chips.png",
    image: "/images/koikeya_karamucho_hot_chili_chips.png",
    itemCount: 4,
    description: "Authentic spicy and umami Japanese potato chips & crunchy corn snacks"
  },
  {
    id: "milka-chocolates",
    title: "Milka Chocolates",
    name: "Milka Chocolates",
    img: "/images/Milka Oreo Lavender Kitchen Still Life.png",
    image: "/images/Milka Oreo Lavender Kitchen Still Life.png",
    itemCount: 4,
    description: "100% Alpine milk chocolate bars and hazelnut treats imported from Germany"
  },
  {
    id: "haribo-candies",
    title: "Haribo Gummies",
    name: "Haribo Gummies",
    img: "/images/Haribo Vampire Gummy Candy Bag.png",
    image: "/images/Haribo Vampire Gummy Candy Bag.png",
    itemCount: 2,
    description: "Iconic fruit gummies, sour bats, and licorice candies from Germany"
  },
  {
    id: "maoam-chews",
    title: "MAOAM Kracher",
    name: "MAOAM Kracher",
    img: "/images/MAOAM Kracher Candy Showcase.png",
    image: "/images/MAOAM Kracher Candy Showcase.png",
    itemCount: 2,
    description: "Effervescent chewy candy with sour fizzy center and fruit coating"
  },
  {
    id: "ramune-beverages",
    title: "Ramune Marble Soda",
    name: "Ramune Marble Soda",
    img: "/images/ramune_banner.jpg",
    image: "/images/ramune_banner.jpg",
    itemCount: 4,
    description: "Refreshing Japanese Codd-neck marble sodas in fruit flavors"
  }
];

export const INITIAL_REAL_PRODUCTS = [
  {
    id: "koikeya-karamucho-hot-chili-chips",
    title: "Koikeya Karamucho Hot Chili Potato Chips (Large)",
    name: "Koikeya Karamucho Hot Chili Potato Chips (Large)",
    categoryId: "koikeya-snacks",
    categoryName: "Koikeya Snacks",
    brand: "Koikeya (湖池屋)",
    origin: "🇯🇵 Japan",
    retailPrice: 4.49,
    price: 4.49,
    originalPrice: 5.99,
    wholesalePrice: 2.45,
    b2bPrice: 2.45,
    caseQty: 24,
    moq: 1,
    stock: 320,
    inStock: true,
    rating: 5.0,
    reviewsCount: 128,
    img: "/images/koikeya_karamucho_hot_chili_chips.png",
    image: "/images/koikeya_karamucho_hot_chili_chips.png",
    gallery: [
      "/images/koikeya_karamucho_hot_chili_chips.png",
      "/images/koikeya_karamucho_hot_chili_snack.png",
      "/images/Pure Potato Black Pepper Chips.png"
    ],
    shortDesc: "Japan's #1 iconic hot chili potato chips with savory garlic & umami kick",
    fullDesc: "The undisputed legend of Japanese spicy snacks since 1984! Koikeya Karamucho Hot Chili Potato Chips feature a proprietary blend of roasted red chilies, garlic, onion, and rich savory umami seasoning on crispy, golden-fried potato chips. Large size bag for maximum satisfaction.",
    description: "The undisputed legend of Japanese spicy snacks since 1984! Koikeya Karamucho Hot Chili Potato Chips feature a proprietary blend of roasted red chilies, garlic, onion, and rich savory umami seasoning on crispy, golden-fried potato chips. Large size bag for maximum satisfaction.",
    flavors: ["Hot Chili Large", "Mild Chili", "Extra Spicy"],
    overview: {
      origin: "🇯🇵 Japan",
      netWeight: "115g (Large Size)",
      brand: "Koikeya (湖池屋)",
      flavor: "Hot Chili with Roasted Garlic & Umami",
      shelfLife: "8 Months",
      storage: "Store in a cool, dry place away from direct sunlight"
    },
    bullets: [
      "Japan's #1 best-selling spicy potato chip brand since 1984",
      "Generous large bag size with thick, crispy golden potato chips",
      "Proprietary umami chili blend with roasted garlic and onion"
    ]
  },
  {
    id: "koikeya-karamucho-corn-snacks",
    title: "Koikeya Karamucho Hot Chili Corn Snacks",
    name: "Koikeya Karamucho Hot Chili Corn Snacks",
    categoryId: "koikeya-snacks",
    categoryName: "Koikeya Snacks",
    brand: "Koikeya (湖池屋)",
    origin: "🇯🇵 Japan",
    retailPrice: 3.79,
    price: 3.79,
    originalPrice: 4.99,
    wholesalePrice: 1.95,
    b2bPrice: 1.95,
    caseQty: 30,
    moq: 1,
    stock: 275,
    inStock: true,
    rating: 4.9,
    reviewsCount: 94,
    img: "/images/koikeya_karamucho_hot_chili_snack.png",
    image: "/images/koikeya_karamucho_hot_chili_snack.png",
    gallery: [
      "/images/koikeya_karamucho_hot_chili_snack.png",
      "/images/koikeya_karamucho_hot_chili_chips.png"
    ],
    shortDesc: "Crunchy puffed corn snack sticks coated in bold spicy chili seasoning",
    fullDesc: "A fan-favorite Japanese texture sensation! These crunchy puffed corn sticks are loaded with Koikeya's signature Karamucho spicy chili seasoning. Delivering a delightful crunch followed by a mouthwatering kick of chili, savory spices, and sweet corn base.",
    description: "Crunchy puffed corn snack sticks coated in signature Karamucho bold spicy chili seasoning.",
    flavors: ["Hot Chili Sticks", "Spicy Corn", "Crunchy Fiery"],
    overview: {
      origin: "🇯🇵 Japan",
      netWeight: "2.2 oz (65g)",
      brand: "Koikeya (湖池屋)",
      flavor: "Hot Chili Puffed Corn Sticks",
      shelfLife: "8 Months",
      storage: "Store in a cool, dry place away from direct sunlight"
    },
    bullets: [
      "Crispy and airy puffed corn snack stick texture",
      "Coated generously in savory Karamucho red chili spices",
      "Direct import with certified Japanese freshness packaging"
    ]
  },
  {
    id: "koikeya-pure-potato-black-pepper",
    title: "Koikeya Pure Potato Black Pepper & Rock Salt Chips",
    name: "Koikeya Pure Potato Black Pepper & Rock Salt Chips",
    categoryId: "koikeya-snacks",
    categoryName: "Koikeya Snacks",
    brand: "Koikeya (湖池屋)",
    origin: "🇯🇵 Japan",
    retailPrice: 4.29,
    price: 4.29,
    originalPrice: 5.29,
    wholesalePrice: 2.30,
    b2bPrice: 2.30,
    caseQty: 24,
    moq: 1,
    stock: 210,
    inStock: true,
    rating: 4.9,
    reviewsCount: 88,
    img: "/images/Pure Potato Black Pepper Chips.png",
    image: "/images/Pure Potato Black Pepper Chips.png",
    gallery: [
      "/images/Pure Potato Black Pepper Chips.png",
      "/images/koikeya_karamucho_hot_chili_chips.png"
    ],
    shortDesc: "Extra thick sliced freshly cooked potato chips with cracked black pepper",
    fullDesc: "Crafted from 100% Japanese domestic potatoes cut into luxurious extra-thick slices (じゃがいも心地 Gokochi). Freshly cooked to achieve an elegant crispy crunch, generously dusted with aromatic freshly cracked black pepper and rock salt.",
    description: "Thick-cut Japanese Hokkaido potatoes dusted with coarse ground aromatic black pepper and pristine rock salt.",
    flavors: ["Black Pepper & Salt", "Mild Pepper", "Extra Crisp"],
    overview: {
      origin: "🇯🇵 Japan",
      netWeight: "50g",
      brand: "Koikeya (湖池屋)",
      flavor: "Aromatic Cracked Black Pepper & Rock Salt",
      shelfLife: "6 Months",
      storage: "Store in a cool, dry place away from direct sunlight"
    },
    bullets: [
      "Made with 100% domestic Japanese selected potatoes",
      "Extra-thick slice cut for an exceptionally satisfying crunch",
      "Gourmet seasoning with coarsely ground black pepper and sea salt"
    ]
  },
  {
    id: "milka-cookies-hazelnuts",
    title: "Milka Cookies & Hazelnuts Chocolate Bar",
    name: "Milka Cookies & Hazelnuts Chocolate Bar",
    categoryId: "milka-chocolates",
    categoryName: "Milka Chocolates",
    brand: "Milka",
    origin: "🇩🇪 Germany",
    retailPrice: 4.29,
    price: 4.29,
    originalPrice: 5.49,
    wholesalePrice: 2.10,
    b2bPrice: 2.10,
    caseQty: 24,
    moq: 1,
    stock: 350,
    inStock: true,
    rating: 4.9,
    reviewsCount: 105,
    img: "/images/Milka Cookies and Hazelnuts Still Life.png",
    image: "/images/Milka Cookies and Hazelnuts Still Life.png",
    gallery: [
      "/images/Milka Cookies and Hazelnuts Still Life.png",
      "/images/Milka Oreo Lavender Kitchen Still Life.png",
      "/images/Milka Strawberry Chocolate Still Life.png"
    ],
    shortDesc: "Smooth Alpine chocolate packed with crunchy cookies & whole hazelnuts",
    fullDesc: "A delightful combination of delicate Alpine milk chocolate with crisp chocolate cookie pieces and crunchy roasted hazelnuts. Packed with rich cocoa aroma and irresistible texture.",
    description: "Velvety smooth 100% Alpine milk chocolate studded with crunchy biscuit cookie pieces and chopped roasted hazelnuts.",
    flavors: ["Cookies & Hazelnut", "Whole Hazelnut", "Crushed Praline"],
    overview: {
      origin: "🇨🇭 Europe / Germany",
      netWeight: "100g",
      brand: "Milka",
      flavor: "Roasted Hazelnuts & Crispy Cookies",
      shelfLife: "12 Months",
      storage: "Store in a cool, dry place"
    },
    bullets: [
      "Roasted European hazelnuts and crumbly cookie chunks",
      "Melt-in-your-mouth Alpine milk chocolate blend",
      "Perfect treat for chocolate and nut connoisseurs"
    ]
  },
  {
    id: "milka-oreo-crunch",
    title: "Milka Oreo Alpine Milk Chocolate Bar",
    name: "Milka Oreo Alpine Milk Chocolate Bar",
    categoryId: "milka-chocolates",
    categoryName: "Milka Chocolates",
    brand: "Milka",
    origin: "🇩🇪 Germany",
    retailPrice: 3.99,
    price: 3.99,
    originalPrice: 4.99,
    wholesalePrice: 1.85,
    b2bPrice: 1.85,
    caseQty: 24,
    moq: 1,
    stock: 410,
    inStock: true,
    rating: 5.0,
    reviewsCount: 142,
    img: "/images/Milka Oreo Lavender Kitchen Still Life.png",
    image: "/images/Milka Oreo Lavender Kitchen Still Life.png",
    gallery: [
      "/images/Milka Oreo Lavender Kitchen Still Life.png",
      "/images/Milka Cookies and Hazelnuts Still Life.png"
    ],
    shortDesc: "Rich 100% Alpine milk chocolate loaded with crunchy Oreo cookie chunks",
    fullDesc: "Iconic European Milka chocolate made with 100% Alpine milk, encasing a creamy vanilla milk filling and crunchy Oreo cookie bits. The ultimate chocolate indulgence.",
    description: "Alpine milk chocolate layered with sweet vanilla cream filling and crunchy chocolate Oreo cookie pieces.",
    flavors: ["Classic Oreo", "White Oreo", "Mini Oreo"],
    overview: {
      origin: "🇨🇭 Europe / Germany",
      netWeight: "100g",
      brand: "Milka",
      flavor: "Alpine Milk Chocolate & Oreo Bits",
      shelfLife: "12 Months",
      storage: "Store in a cool, dry place"
    },
    bullets: [
      "Crafted with 100% Alpine milk from European farms",
      "Creamy vanilla creme filling with crunchy Oreo cookie pieces",
      "Imported authentic European confectionery"
    ]
  },
  {
    id: "milka-strawberry",
    title: "Milka Strawberry Yogurt Chocolate Bar",
    name: "Milka Strawberry Yogurt Chocolate Bar",
    categoryId: "milka-chocolates",
    categoryName: "Milka Chocolates",
    brand: "Milka",
    origin: "🇩🇪 Germany",
    retailPrice: 3.99,
    price: 3.99,
    originalPrice: 4.99,
    wholesalePrice: 1.85,
    b2bPrice: 1.85,
    caseQty: 24,
    moq: 1,
    stock: 290,
    inStock: true,
    rating: 4.9,
    reviewsCount: 86,
    img: "/images/Milka Strawberry Chocolate Still Life.png",
    image: "/images/Milka Strawberry Chocolate Still Life.png",
    gallery: [
      "/images/Milka Strawberry Chocolate Still Life.png",
      "/images/Milka White Chocolate Dream Still Life.png"
    ],
    shortDesc: "Silky Alpine chocolate with sweet strawberry fruit cream filling",
    fullDesc: "Mouthwatering Milka Alpine milk chocolate filled with refreshing strawberry yogurt cream and crisp fruit crunch bits. Sweet, creamy, and irresistibly fruity.",
    description: "Smooth Alpine milk chocolate enriched with tangy, fragrant strawberry cream filling.",
    flavors: ["Strawberry Cream", "Raspberry Cream", "Wild Berries"],
    overview: {
      origin: "🇨🇭 Europe / Germany",
      netWeight: "100g",
      brand: "Milka",
      flavor: "Strawberry Fruit Cream & Alpine Milk",
      shelfLife: "10 Months",
      storage: "Store in a cool, dry place"
    },
    bullets: [
      "Luscious strawberry and yogurt cream layer",
      "Real strawberry fruit pieces inside smooth chocolate",
      "Imported premium European favorite"
    ]
  },
  {
    id: "haribo-vampire-gummies",
    title: "Haribo Vampire Fruit & Licorice Gummy Bag",
    name: "Haribo Vampire Fruit & Licorice Gummy Bag",
    categoryId: "haribo-candies",
    categoryName: "Haribo Gummies",
    brand: "Haribo",
    origin: "🇩🇪 Germany",
    retailPrice: 3.49,
    price: 3.49,
    originalPrice: 4.49,
    wholesalePrice: 1.85,
    b2bPrice: 1.85,
    caseQty: 30,
    moq: 1,
    stock: 380,
    inStock: true,
    rating: 4.9,
    reviewsCount: 92,
    img: "/images/Haribo Vampire Gummy Candy Bag.png",
    image: "/images/Haribo Vampire Gummy Candy Bag.png",
    gallery: [
      "/images/Haribo Vampire Gummy Candy Bag.png"
    ],
    shortDesc: "Iconic fruit gummies and spicy licorice bats from Germany",
    fullDesc: "Legendary European bat gummies with a soft dark spicy licorice body and vibrant fruity gummy wings.",
    description: "Legendary European bat gummies with a soft dark spicy licorice body and vibrant fruity gummy wings.",
    flavors: ["Fruit & Licorice Bats", "Sour Bats", "Giant Bats"],
    overview: {
      origin: "🇩🇪 Germany",
      netWeight: "175g",
      brand: "Haribo",
      flavor: "Fruit Gummies & Spicy Soft Licorice",
      shelfLife: "12 Months",
      storage: "Store in a cool dry place"
    },
    bullets: [
      "Unique blend of savory licorice and tart fruit flavors",
      "Chewy European recipe texture",
      "Germany's seasonal cult-favorite gummy snack"
    ]
  },
  {
    id: "maoam-kracher-blue-chews",
    title: "MAOAM Kracher Blue Raspberry Sour Chews",
    name: "MAOAM Kracher Blue Raspberry Sour Chews",
    categoryId: "maoam-chews",
    categoryName: "MAOAM Kracher",
    brand: "MAOAM",
    origin: "🇩🇪 Germany",
    retailPrice: 3.29,
    price: 3.29,
    originalPrice: 4.29,
    wholesalePrice: 1.75,
    b2bPrice: 1.75,
    caseQty: 30,
    moq: 1,
    stock: 330,
    inStock: true,
    rating: 4.8,
    reviewsCount: 78,
    img: "/images/MAOAM Kracher Candy Showcase.png",
    image: "/images/MAOAM Kracher Candy Showcase.png",
    gallery: [
      "/images/MAOAM Kracher Candy Showcase.png"
    ],
    shortDesc: "Crisp candy shell with chewy center and sour fizzy core",
    fullDesc: "Crunchy outer sugar shell bursting into chewy blue raspberry candy with an effervescent sour fizzy center.",
    description: "Crunchy outer sugar shell bursting into chewy blue raspberry candy with an effervescent sour fizzy center.",
    flavors: ["Blue Raspberry Fizz", "Sour Apple", "Wild Cherry"],
    overview: {
      origin: "🇩🇪 Germany",
      netWeight: "200g",
      brand: "MAOAM",
      flavor: "Sour Blue Raspberry Fizz",
      shelfLife: "14 Months",
      storage: "Store away from heat and moisture"
    },
    bullets: [
      "Effervescent fizzy sherbet core inside each chew",
      "Crispy outer crunch followed by soft fruit chew",
      "Imported German favorite confectionery"
    ]
  },
  {
    id: "ramune-original",
    title: "Sangaria Ramune Original Japanese Soda",
    name: "Sangaria Ramune Original Japanese Soda",
    categoryId: "ramune-beverages",
    categoryName: "Ramune Marble Soda",
    brand: "Sangaria",
    origin: "🇯🇵 Japan",
    retailPrice: 2.99,
    price: 2.99,
    originalPrice: 3.99,
    wholesalePrice: 1.65,
    b2bPrice: 1.65,
    caseQty: 30,
    moq: 1,
    stock: 450,
    inStock: true,
    rating: 4.9,
    reviewsCount: 128,
    img: "/images/ramune_banner.jpg",
    image: "/images/ramune_banner.jpg",
    gallery: [
      "/images/ramune_banner.jpg",
      "/images/ramune_poster.jpeg"
    ],
    shortDesc: "Iconic Japanese carbonated lemon-lime marble soda",
    fullDesc: "Authentic Japanese Ramune soda featuring the iconic glass bottle and marble seal stopper. Original classic crisp refreshment.",
    description: "Iconic Japanese carbonated lemon-lime marble soda sealed with a glass marble stopper in traditional glass bottle.",
    flavors: ["Original Citrus", "White Peach", "Sweet Melon", "Wild Strawberry"],
    overview: {
      origin: "🇯🇵 Japan",
      netWeight: "200ml Glass Bottle",
      brand: "Sangaria",
      flavor: "Classic Japanese Marble Soda",
      shelfLife: "12 Months",
      storage: "Best served chilled. Store upright in a cool place"
    },
    bullets: [
      "Authentic Japanese Codd-neck glass bottle with marble stopper",
      "Pop-the-marble opening ritual loved worldwide",
      "Light, crisp, refreshing Japanese citrus flavor"
    ]
  },
  {
    id: "ramune-peach",
    title: "Sangaria Ramune Ripe White Peach Soda",
    name: "Sangaria Ramune Ripe White Peach Soda",
    categoryId: "ramune-beverages",
    categoryName: "Ramune Marble Soda",
    brand: "Sangaria",
    origin: "🇯🇵 Japan",
    retailPrice: 2.99,
    price: 2.99,
    originalPrice: 3.99,
    wholesalePrice: 1.65,
    b2bPrice: 1.65,
    caseQty: 30,
    moq: 1,
    stock: 320,
    inStock: true,
    rating: 4.8,
    reviewsCount: 94,
    img: "/images/ramune_banner.jpg",
    image: "/images/ramune_banner.jpg",
    gallery: [
      "/images/ramune_banner.jpg"
    ],
    shortDesc: "Sweet Japanese white peach flavor infused with crisp fizz",
    fullDesc: "Fragrant and sweet white peach Japanese Ramune soda in a classic Codd-neck glass bottle.",
    description: "Sweet, fragrant Japanese white peach flavor paired with crisp effervescence in the iconic marble bottle.",
    flavors: ["Ripe White Peach", "Original", "Melon"],
    overview: {
      origin: "🇯🇵 Japan",
      netWeight: "200ml Glass Bottle",
      brand: "Sangaria",
      flavor: "Sweet Japanese White Peach",
      shelfLife: "12 Months",
      storage: "Store chilled away from sunlight"
    },
    bullets: [
      "Fragrant real fruit notes of juicy Japanese white peach",
      "Marble pop action in authentic Codd bottle",
      "Delicious party beverage and unique gift"
    ]
  },
  {
    id: "ramune-melon",
    title: "Hata Ramune Sweet Melon Soda",
    name: "Hata Ramune Sweet Melon Soda",
    categoryId: "ramune-beverages",
    categoryName: "Ramune Marble Soda",
    brand: "Hata",
    origin: "🇯🇵 Japan",
    retailPrice: 2.99,
    price: 2.99,
    originalPrice: 3.99,
    wholesalePrice: 1.65,
    b2bPrice: 1.65,
    caseQty: 30,
    moq: 1,
    stock: 280,
    inStock: true,
    rating: 4.9,
    reviewsCount: 110,
    img: "/images/ramune_banner.jpg",
    image: "/images/ramune_banner.jpg",
    gallery: [
      "/images/ramune_banner.jpg",
      "/images/ramune_poster.jpeg"
    ],
    shortDesc: "Famous Hokkaido cantaloupe melon flavored marble soda",
    fullDesc: "Famous Japanese cantaloupe melon Ramune soda. Refreshing, vibrant green, and irresistibly fizzy.",
    description: "Vibrant emerald green Japanese cantaloupe melon soda with popping marble stopper.",
    flavors: ["Sweet Melon", "Original", "White Peach"],
    overview: {
      origin: "🇯🇵 Japan",
      netWeight: "200ml Glass Bottle",
      brand: "Hata",
      flavor: "Hokkaido Sweet Cantaloupe Melon",
      shelfLife: "12 Months",
      storage: "Serve ice cold"
    },
    bullets: [
      "Sweet aroma reminiscent of Japanese melon cream sodas",
      "Bright emerald green presentation",
      "Classic glass bottle with seal marble"
    ]
  },
  {
    id: "ramune-strawberry",
    title: "Sangaria Ramune Wild Strawberry Soda",
    name: "Sangaria Ramune Wild Strawberry Soda",
    categoryId: "ramune-beverages",
    categoryName: "Ramune Marble Soda",
    brand: "Sangaria",
    origin: "🇯🇵 Japan",
    retailPrice: 2.99,
    price: 2.99,
    originalPrice: 3.99,
    wholesalePrice: 1.65,
    b2bPrice: 1.65,
    caseQty: 30,
    moq: 1,
    stock: 310,
    inStock: true,
    rating: 4.8,
    reviewsCount: 84,
    img: "/images/ramune_banner.jpg",
    image: "/images/ramune_banner.jpg",
    gallery: [
      "/images/ramune_banner.jpg"
    ],
    shortDesc: "Sweet wild strawberry fizzy soda loved across Japan",
    fullDesc: "Sweet wild strawberry fizzy soda loved across Japan, packaged in traditional glass bottle with marble pop stopper.",
    description: "Sweet wild strawberry fizzy soda loved across Japan, packaged in traditional glass bottle.",
    flavors: ["Wild Strawberry", "Original", "Peach"],
    overview: {
      origin: "🇯🇵 Japan",
      netWeight: "200ml Glass Bottle",
      brand: "Sangaria",
      flavor: "Japanese Wild Strawberry",
      shelfLife: "12 Months",
      storage: "Serve chilled"
    },
    bullets: [
      "Fragrant berry aroma in bubbly carbonation",
      "Classic marble pop bottle loved by kids and collectors",
      "Japanese authentic candy beverage"
    ]
  }
];

export const INITIAL_RETAIL_ORDERS = [
  {
    id: "ORD-R-1092",
    customer: "Jessica Taylor",
    email: "jessica.taylor@gmail.com",
    phone: "832-555-4821",
    type: "Retail (B2C)",
    items: "2x Sangaria Ramune Peach, 1x Milka Oreo",
    amount: 9.47,
    status: "Delivered",
    date: "2026-10-17 11:20"
  },
  {
    id: "ORD-R-1091",
    customer: "Marcus Rodriguez",
    email: "marcus.r@gmail.com",
    phone: "713-555-0199",
    type: "Retail (B2C)",
    items: "1x Koikeya Karamucho Hot Chili, 2x Ramune Melon",
    amount: 10.47,
    status: "Shipped",
    date: "2026-10-16 16:45"
  },
  {
    id: "ORD-R-1090",
    customer: "Amanda Chen",
    email: "amanda.chen@yahoo.com",
    phone: "832-555-3312",
    type: "Retail (B2C)",
    items: "2x Haribo Vampire Gummies, 1x MAOAM Kracher",
    amount: 10.27,
    status: "Processing",
    date: "2026-10-16 09:15"
  }
];

export const INITIAL_WHOLESALE_ORDERS = [
  {
    id: "ORD-W-504",
    storeName: "Harwin Gas & Snack Depot",
    contact: "Samir Patel",
    email: "samir@harwingas.com",
    phone: "713-555-0144",
    type: "Wholesale (B2B)",
    cases: "10 Cases (300 Units)",
    items: "5 Cases Sangaria Ramune Variety, 5 Cases Koikeya Karamucho Large",
    amount: 615.00,
    status: "Processing",
    date: "2026-10-17 14:10"
  },
  {
    id: "ORD-W-503",
    storeName: "Houston Exotic Munchies LLC",
    contact: "David Kim",
    email: "david@houstonmunchies.com",
    phone: "832-555-0192",
    type: "Wholesale (B2B)",
    cases: "8 Cases (192 Units)",
    items: "4 Cases Milka Cookies & Hazelnut, 4 Cases Lay's Nori Seaweed",
    amount: 412.80,
    status: "Shipped",
    date: "2026-10-15 10:30"
  },
  {
    id: "ORD-W-502",
    storeName: "Bella Vista Supermarket",
    contact: "Carlos Gomez",
    email: "carlos@bellavistamarket.com",
    phone: "832-555-8910",
    type: "Wholesale (B2B)",
    cases: "15 Cases (450 Units)",
    items: "10 Cases Ramune Original & Melon, 5 Cases MAOAM Kracher",
    amount: 757.50,
    status: "Delivered",
    date: "2026-10-14 18:20"
  }
];

export const INITIAL_RETAIL_CUSTOMERS = [];

export const INITIAL_WHOLESALE_CUSTOMERS = [];

/**
 * =========================================================================
 * 2. FIRESTORE CATEGORIES CRUD
 * =========================================================================
 */
export async function fetchCategoriesFromDb() {
  let remoteCats = [];
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'categories'));
      if (!snap.empty) {
        remoteCats = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      }
    } catch (err) {
      console.warn('[Firestore] fetchCategories error:', err.message);
    }
  }

  let localCats = [];
  let deletedCatIds = [];
  try {
    const deletedCached = localStorage.getItem('rubyred_deleted_categories');
    if (deletedCached) deletedCatIds = JSON.parse(deletedCached);
    const cached = localStorage.getItem('rubyred_db_categories');
    if (cached) localCats = JSON.parse(cached);
  } catch (e) {}

  const catsMap = new Map();
  INITIAL_REAL_CATEGORIES.forEach(c => {
    if (!deletedCatIds.includes(c.id)) {
      catsMap.set(c.id, { ...c });
    }
  });

  if (Array.isArray(localCats)) {
    localCats.forEach(lc => {
      if (lc && lc.id && !deletedCatIds.includes(lc.id)) {
        catsMap.set(lc.id, { ...(catsMap.get(lc.id) || {}), ...lc });
      }
    });
  }

  if (Array.isArray(remoteCats)) {
    remoteCats.forEach(rc => {
      if (rc && rc.id && !deletedCatIds.includes(rc.id)) {
        catsMap.set(rc.id, { ...(catsMap.get(rc.id) || {}), ...rc });
      }
    });
  }

  const result = Array.from(catsMap.values());
  try {
    localStorage.setItem('rubyred_db_categories', JSON.stringify(result));
  } catch (e) {}
  return result;
}

export async function saveCategoryToDb(category) {
  const catId = category.id || category.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  const record = {
    ...category,
    id: catId,
    name: category.title || category.name,
    title: category.title || category.name,
    img: category.img || category.image || '/images/cat_snacks.jpg',
    image: category.img || category.image || '/images/cat_snacks.jpg',
    updatedAt: new Date().toISOString()
  };

  try {
    const cached = localStorage.getItem('rubyred_db_categories');
    let list = cached ? JSON.parse(cached) : [...INITIAL_REAL_CATEGORIES];
    const existingIndex = list.findIndex(c => c.id === catId);
    if (existingIndex >= 0) {
      list[existingIndex] = record;
    } else {
      list.push(record);
    }
    localStorage.setItem('rubyred_db_categories', JSON.stringify(list));
  } catch (e) {
    console.warn('LocalStorage saveCategory error:', e);
  }

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'categories', catId), {
        ...record,
        timestamp: serverTimestamp()
      });
      console.log('[Firestore DB] Saved category:', catId);
    } catch (err) {
      console.warn('[Firestore DB] Could not write category:', err.message);
    }
  }
  return record;
}

export async function deleteCategoryFromDb(categoryId) {
  try {
    const deletedCached = localStorage.getItem('rubyred_deleted_categories');
    const deletedIds = deletedCached ? JSON.parse(deletedCached) : [];
    if (!deletedIds.includes(categoryId)) {
      deletedIds.push(categoryId);
      localStorage.setItem('rubyred_deleted_categories', JSON.stringify(deletedIds));
    }

    const cached = localStorage.getItem('rubyred_db_categories');
    if (cached) {
      const list = JSON.parse(cached).filter(c => c.id !== categoryId);
      localStorage.setItem('rubyred_db_categories', JSON.stringify(list));
    }
  } catch (e) {}

  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'categories', categoryId));
      console.log('[Firestore DB] Deleted category:', categoryId);
      return true;
    } catch (err) {
      console.warn('[Firestore DB] Delete category error:', err.message);
    }
  }
  return true;
}

/**
 * =========================================================================
 * 3. FIRESTORE PRODUCTS CRUD
 * =========================================================================
 */
export async function fetchProductsFromDb() {
  let remoteProds = [];
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'products'));
      if (!snap.empty) {
        remoteProds = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      }
    } catch (err) {
      console.warn('[Firestore] fetchProducts error:', err.message);
    }
  }

  // Load from persistent local storage
  let localProds = [];
  let deletedIds = [];
  try {
    const deletedCached = localStorage.getItem('rubyred_deleted_products');
    if (deletedCached) deletedIds = JSON.parse(deletedCached);
    const cached = localStorage.getItem('rubyred_db_products');
    if (cached) localProds = JSON.parse(cached);
  } catch (e) {}

  // Merge map:
  // 1. Start with all authentic INITIAL_REAL_PRODUCTS
  const prodsMap = new Map();
  INITIAL_REAL_PRODUCTS.forEach(p => {
    if (!deletedIds.includes(p.id)) {
      prodsMap.set(p.id, { ...p });
    }
  });

  // 2. Overlay any local modifications or user-added products
  if (Array.isArray(localProds)) {
    localProds.forEach(lp => {
      if (lp && lp.id && !deletedIds.includes(lp.id)) {
        const base = prodsMap.get(lp.id) || {};
        prodsMap.set(lp.id, { ...base, ...lp });
      }
    });
  }

  // 3. Overlay any remote Firestore modifications or user-added products
  if (Array.isArray(remoteProds)) {
    remoteProds.forEach(rp => {
      if (rp && rp.id && !deletedIds.includes(rp.id)) {
        const base = prodsMap.get(rp.id) || {};
        prodsMap.set(rp.id, { ...base, ...rp });
      }
    });
  }

  const finalProds = Array.from(prodsMap.values());
  try {
    localStorage.setItem('rubyred_db_products', JSON.stringify(finalProds));
  } catch (e) {}

  return finalProds;
}

export async function saveProductToDb(product) {
  const prodId = product.id || `prod-${Date.now()}`;
  const retailP = parseFloat(product.retailPrice || product.price || 0);
  const wholesaleP = parseFloat(product.wholesalePrice || product.b2bPrice || 0);
  const origP = parseFloat(product.originalPrice || (retailP > 0 ? (retailP * 1.33).toFixed(2) : 5.99));
  const desc = product.description || product.fullDesc || product.shortDesc || '';
  const brandVal = product.brand || 'Koikeya (湖池屋)';
  const originVal = product.origin || '🇯🇵 Japan';
  const netWeightVal = product.netWeight || '115g (Large Size)';

  const record = {
    ...product,
    id: prodId,
    title: product.title || product.name || 'New Product',
    name: product.title || product.name || 'New Product',
    categoryId: product.categoryId || 'koikeya-snacks',
    categoryName: product.categoryName || 'Koikeya Snacks',
    brand: brandVal,
    origin: originVal,
    netWeight: netWeightVal,
    retailPrice: retailP,
    price: retailP,
    originalPrice: origP,
    wholesalePrice: wholesaleP,
    b2bPrice: wholesaleP,
    caseQty: parseInt(product.caseQty || 24),
    moq: parseInt(product.moq || 1),
    stock: parseInt(product.stock || product.stockCount || 100),
    stockCount: parseInt(product.stock || product.stockCount || 100),
    inStock: product.inStock !== false,
    rating: parseFloat(product.rating || 5.0),
    reviewsCount: parseInt(product.reviewsCount || 128),
    img: product.img || product.image || '/images/ruby_red_hero.jpg',
    image: product.img || product.image || '/images/ruby_red_hero.jpg',
    gallery: Array.isArray(product.gallery) && product.gallery.length > 0 
      ? product.gallery 
      : [product.img || product.image || '/images/ruby_red_hero.jpg'],
    description: desc,
    shortDesc: desc,
    fullDesc: desc,
    flavors: Array.isArray(product.flavors) && product.flavors.length > 0 
      ? product.flavors 
      : ['Original Large', 'Mild Chili', 'Extra Spicy'],
    overview: {
      origin: originVal,
      netWeight: netWeightVal,
      brand: brandVal,
      flavor: Array.isArray(product.flavors) && product.flavors.length > 0 ? product.flavors[0] : 'Original',
      shelfLife: product.overview?.shelfLife || '8 Months',
      storage: product.overview?.storage || 'Store in a cool, dry place away from direct sunlight'
    },
    bullets: Array.isArray(product.bullets) && product.bullets.length > 0 
      ? product.bullets 
      : [
        "Japan's #1 best-selling snack brand",
        "Generous bag size with crispy texture and authentic spices",
        "Proprietary umami blend with certified Japanese freshness packaging"
      ],
    updatedAt: new Date().toISOString()
  };

  // Sync with persistent local storage
  try {
    const cached = localStorage.getItem('rubyred_db_products');
    let list = cached ? JSON.parse(cached) : [...INITIAL_REAL_PRODUCTS];
    const existingIndex = list.findIndex(p => p.id === prodId);
    if (existingIndex >= 0) {
      list[existingIndex] = record;
    } else {
      list.unshift(record);
    }
    localStorage.setItem('rubyred_db_products', JSON.stringify(list));
  } catch (e) {
    console.warn('LocalStorage save error:', e);
  }

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'products', prodId), {
        ...record,
        timestamp: serverTimestamp()
      });
      console.log('[Firestore DB] Saved product:', prodId);
    } catch (err) {
      console.warn('[Firestore DB] Could not write product:', err.message);
    }
  }
  return record;
}

export async function deleteProductFromDb(productId) {
  try {
    const deletedCached = localStorage.getItem('rubyred_deleted_products');
    const deletedIds = deletedCached ? JSON.parse(deletedCached) : [];
    if (!deletedIds.includes(productId)) {
      deletedIds.push(productId);
      localStorage.setItem('rubyred_deleted_products', JSON.stringify(deletedIds));
    }

    const cached = localStorage.getItem('rubyred_db_products');
    if (cached) {
      const list = JSON.parse(cached).filter(p => p.id !== productId);
      localStorage.setItem('rubyred_db_products', JSON.stringify(list));
    }
  } catch (e) {}

  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'products', productId));
      console.log('[Firestore DB] Deleted product:', productId);
      return true;
    } catch (err) {
      console.warn('[Firestore DB] Delete product error:', err.message);
    }
  }
  return true;
}

/**
 * =========================================================================
 * 4. FIRESTORE ORDERS CRUD (Retail & Wholesale)
 * =========================================================================
 */
export async function fetchOrdersFromDb() {
  if (!isFirebaseConfigured || !db) {
    return {
      retail: INITIAL_RETAIL_ORDERS,
      wholesale: INITIAL_WHOLESALE_ORDERS
    };
  }
  try {
    const snap = await getDocs(collection(db, 'orders'));
    if (!snap.empty) {
      const allOrders = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      return {
        retail: allOrders.filter(o => o.channel === 'retail' || o.type?.includes('Retail')),
        wholesale: allOrders.filter(o => o.channel === 'wholesale' || o.type?.includes('Wholesale'))
      };
    }
  } catch (err) {
    console.warn('[Firestore] fetchOrders error:', err.message);
  }
  return {
    retail: INITIAL_RETAIL_ORDERS,
    wholesale: INITIAL_WHOLESALE_ORDERS
  };
}

export async function updateOrderStatusInDb(orderId, newStatus) {
  if (isFirebaseConfigured && db) {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
      return true;
    } catch (e) {
      console.warn('Update order status error:', e.message);
    }
  }
  return true;
}

/**
 * =========================================================================
 * 5. FIRESTORE CUSTOMERS (Retail & Wholesale)
 * =========================================================================
 */
export async function fetchCustomersFromDb() {
  let retailUsers = [];
  let b2bUsers = [];

  // 1. Fetch from local registered accounts
  try {
    const local = JSON.parse(localStorage.getItem('rubyred_registered_accounts') || '[]');
    retailUsers = local.filter(u => u.role === 'retail');
    b2bUsers = local.filter(u => u.role === 'b2b');
  } catch (e) {}

  // 2. Fetch from Firestore if configured
  if (isFirebaseConfigured && db) {
    try {
      const usersSnap = await getDocs(collection(db, 'users'));
      if (!usersSnap.empty) {
        const users = usersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        const fsRetail = users.filter(u => u.role === 'retail');
        const fsB2b = users.filter(u => u.role === 'b2b');

        const retailMap = new Map();
        [...retailUsers, ...fsRetail].forEach(u => retailMap.set(u.email || u.id, u));
        retailUsers = Array.from(retailMap.values());

        const b2bMap = new Map();
        [...b2bUsers, ...fsB2b].forEach(u => b2bMap.set(u.email || u.id, u));
        b2bUsers = Array.from(b2bMap.values());
      }
    } catch (err) {
      console.warn('[Firestore] fetchCustomers error:', err.message);
    }
  }

  return {
    retail: retailUsers,
    wholesale: b2bUsers
  };
}

/**
 * =========================================================================
 * 6. LOCAL PROJECT DIRECTORY MEDIA UPLOAD (public/images/)
 * =========================================================================
 */
export async function uploadProjectMedia(file, customFilename = null) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Data = reader.result;
        const filename = customFilename || file.name || `media_${Date.now()}.png`;
        
        const response = await fetch('/api/media/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename, base64Data })
        });
        
        const resJson = await response.json();
        if (resJson.success) {
          console.log('[Project Media] Saved to public/images/:', resJson.file.url);
          resolve(resJson.file);
        } else {
          resolve({ name: filename, url: base64Data });
        }
      } catch (e) {
        console.warn('[Project Media] Saved locally as Data URL:', e.message);
        resolve({ name: file.name, url: reader.result });
      }
    };
    reader.onerror = err => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * =========================================================================
 * 7. AUTHENTICATION & REGISTRATION (Real Credentials Validation)
 * =========================================================================
 */
export async function registerRetailUser(email, password, displayName, phone) {
  const cleanEmail = (email || '').toLowerCase().trim();
  const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  const userData = {
    uid: userId,
    id: userId,
    email: cleanEmail,
    password: password || 'RubyRed@2026',
    displayName: displayName || cleanEmail.split('@')[0],
    name: displayName || cleanEmail.split('@')[0],
    phone: phone || '',
    role: 'retail',
    isAgeVerified: true,
    createdAt: new Date().toISOString()
  };

  // Check local registered accounts
  try {
    const local = JSON.parse(localStorage.getItem('rubyred_registered_accounts') || '[]');
    if (local.some(u => u.email === cleanEmail)) {
      throw new Error('An account with this email already exists. Please sign in instead.');
    }
    local.push(userData);
    localStorage.setItem('rubyred_registered_accounts', JSON.stringify(local));
  } catch (err) {
    if (err.message.includes('already exists')) throw err;
  }

  // Save to Firestore if configured
  if (isFirebaseConfigured && db) {
    try {
      const userRef = doc(db, 'users', cleanEmail);
      const existing = await getDoc(userRef);
      if (existing.exists()) {
        throw new Error('An account with this email already exists. Please sign in instead.');
      }
      await setDoc(userRef, {
        ...userData,
        serverTime: serverTimestamp()
      });
      console.log('[Firestore DB] User credentials registered successfully:', cleanEmail);
    } catch (err) {
      if (err.message.includes('already exists')) throw err;
    }
  }

  return userData;
}

export async function loginUserWithFirebase(emailOrPhone, password, roleHint = 'retail') {
  const clean = (emailOrPhone || '').toLowerCase().trim();
  let foundUser = null;

  // 1. Search persistent local accounts
  try {
    const local = JSON.parse(localStorage.getItem('rubyred_registered_accounts') || '[]');
    foundUser = local.find(u => 
      (u.email && u.email.toLowerCase() === clean) ||
      (u.phone && u.phone.replace(/\D/g, '') === clean.replace(/\D/g, '') && clean.length > 5)
    );
  } catch (e) {}

  // 2. Search Firestore
  if (!foundUser && isFirebaseConfigured && db) {
    try {
      const userRef = doc(db, 'users', clean);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        foundUser = { uid: userDoc.id, id: userDoc.id, ...userDoc.data() };
      }
    } catch (err) {}
  }

  if (!foundUser) {
    throw new Error('No account found with this email or phone. Please create an account.');
  }

  if (foundUser.password && foundUser.password !== password) {
    throw new Error('Incorrect password. Please verify your credentials and try again.');
  }

  if (roleHint === 'b2b' && foundUser.role !== 'b2b') {
    throw new Error('This account is registered as Retail. Please switch to the Retail tab to sign in.');
  }

  return foundUser;
}

export async function submitB2BWholesaleApplication(applicationData, file = null) {
  const appId = 'TX-B2B-' + Math.floor(100000 + Math.random() * 900000);
  const cleanEmail = (applicationData.email || '').toLowerCase().trim();
  
  const appRecord = {
    id: appId,
    appId,
    uid: appId,
    businessName: applicationData.businessName,
    dba: applicationData.dba || applicationData.businessName,
    storeType: applicationData.storeType || 'Convenience Store',
    contactName: applicationData.contactName || '',
    name: applicationData.contactName || '',
    displayName: applicationData.contactName || applicationData.businessName,
    email: cleanEmail,
    phone: applicationData.phone || '',
    address: applicationData.address || 'Houston, TX',
    taxId: applicationData.taxId || '',
    password: applicationData.password || 'RubyRed@B2B',
    role: 'b2b',
    status: 'Active',
    tier: 'Wholesale Active',
    documents: applicationData.documents || [],
    createdAt: new Date().toISOString()
  };

  // Check local registered accounts
  try {
    const local = JSON.parse(localStorage.getItem('rubyred_registered_accounts') || '[]');
    if (local.some(u => u.email === cleanEmail)) {
      throw new Error('A wholesale account with this email already exists. Please sign in instead.');
    }
    local.push(appRecord);
    localStorage.setItem('rubyred_registered_accounts', JSON.stringify(local));
  } catch (err) {
    if (err.message.includes('already exists')) throw err;
  }

  // Save to Firestore if configured
  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'users', cleanEmail), {
        ...appRecord,
        serverTime: serverTimestamp()
      });
      console.log('[Firestore DB] B2B customer registered successfully:', cleanEmail);
    } catch (e) {
      console.warn('Firestore B2B save error:', e);
    }
  }

  return appRecord;
}

export function subscribeToB2BApplications(onUpdate) {
  return () => {};
}

export async function updateB2BApplicationStatus(appId, newStatus) {
  return true;
}

export async function logOutFirebase() {
  console.log('[Auth] User signed out');
}
