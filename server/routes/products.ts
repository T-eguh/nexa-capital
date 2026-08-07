import { Router, Request, Response } from 'express';

const router = Router();

// Sample product catalog with rich metrics and simulation schedules
export const SAMPLE_PRODUCTS = [
  {
    id: 'prod-bbca',
    name: 'BBCA - Bank Central Asia Bluechip',
    category: 'Saham Bluechip',
    description: 'Investasi saham perbankan terbesar di Indonesia dengan imbal hasil dividen stabil & risiko sangat terukur.',
    price: 100000,
    minInvest: 100000,
    maxInvest: 100000000,
    durationDays: 35,
    dailyProfitPct: 12.0,
    dailyProfitRp: 12000,
    totalProfitTarget: 420000,
    riskLevel: 'LOW',
    isLockable35H: true,
    minVipLevel: 'VIP 0',
    popularityBadge: 'Best Seller',
    progressPct: 88,
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'prod-tlkm',
    name: 'TLKM - Telkom Indonesia Digital Yield',
    category: 'Dividend High Yield',
    description: 'Portofolio saham telekomunikasi terkemuka dengan dividen teratur & jaringan 5G nasional.',
    price: 50000,
    minInvest: 50000,
    maxInvest: 50000000,
    durationDays: 35,
    dailyProfitPct: 11.0,
    dailyProfitRp: 5500,
    totalProfitTarget: 192500,
    riskLevel: 'LOW',
    isLockable35H: true,
    minVipLevel: 'VIP 0',
    popularityBadge: 'Populer',
    progressPct: 75,
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=600&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'prod-goto',
    name: 'GOTO - GoTo Gojek Tokopedia Fast Yield',
    category: 'Sektor Teknologi',
    description: 'Ekosistem digital terbesar di Indonesia dengan potensi lonjakan pertumbuhan transaksi harian tinggi.',
    price: 100000,
    minInvest: 100000,
    maxInvest: 20000000,
    durationDays: 3,
    dailyProfitPct: 25.0,
    dailyProfitRp: 25000,
    totalProfitTarget: 75000,
    riskLevel: 'HIGH',
    isLockable35H: false,
    minVipLevel: 'VIP 1',
    popularityBadge: 'Eksklusif VIP',
    progressPct: 94,
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'prod-bmri',
    name: 'BMRI - Bank Mandiri Growth Fund',
    category: 'Saham Bluechip',
    description: 'Bank BUMN dengan ekspansi kredit korporasi dan digital banking Livin terdepan.',
    price: 200000,
    minInvest: 200000,
    maxInvest: 150000000,
    durationDays: 35,
    dailyProfitPct: 13.5,
    dailyProfitRp: 27000,
    totalProfitTarget: 945000,
    riskLevel: 'LOW',
    isLockable35H: true,
    minVipLevel: 'VIP 0',
    popularityBadge: 'Rekomendasi',
    progressPct: 82,
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'prod-asii',
    name: 'ASII - Astra International Industri',
    category: 'Dividend High Yield',
    description: 'Konglomerat otomotif, alat berat, dan infrastruktur dengan cashflow dividen yang sangat stabil.',
    price: 150000,
    minInvest: 150000,
    maxInvest: 80000000,
    durationDays: 35,
    dailyProfitPct: 12.5,
    dailyProfitRp: 18750,
    totalProfitTarget: 656250,
    riskLevel: 'MEDIUM',
    isLockable35H: true,
    minVipLevel: 'VIP 0',
    popularityBadge: 'Pilihan Investor',
    progressPct: 68,
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'prod-nvda',
    name: 'NVDA - Nexa AI Tech Basket',
    category: 'Sektor Teknologi',
    description: 'Keranjang saham raksasa AI global & komputasi awan generasi mendatang.',
    price: 300000,
    minInvest: 300000,
    maxInvest: 200000000,
    durationDays: 1,
    dailyProfitPct: 30.0,
    dailyProfitRp: 90000,
    totalProfitTarget: 90000,
    riskLevel: 'HIGH',
    isLockable35H: false,
    minVipLevel: 'VIP 2',
    popularityBadge: 'VIP 2 Super Yield',
    progressPct: 98,
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80'
    ]
  }
];

// GET /api/products
router.get('/', (req: Request, res: Response) => {
  const { category, search, riskLevel } = req.query;

  let products = [...SAMPLE_PRODUCTS];

  if (category && category !== 'Semua') {
    products = products.filter((p) => p.category === category);
  }

  if (riskLevel) {
    products = products.filter((p) => p.riskLevel === (riskLevel as string).toUpperCase());
  }

  if (search) {
    const q = (search as string).toLowerCase();
    products = products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
  }

  return res.status(200).json({
    success: true,
    products,
  });
});

// GET /api/products/:id
router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const product = SAMPLE_PRODUCTS.find((p) => p.id === id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Produk tidak ditemukan.',
    });
  }

  // Generate 7-day or full duration simulation schedule
  const simulationSchedule = Array.from({ length: Math.min(product.durationDays, 7) }, (_, idx) => {
    const day = idx + 1;
    const accumulatedProfit = product.dailyProfitRp * day;
    return {
      day,
      date: new Date(Date.now() + day * 86400000).toISOString().split('T')[0],
      dailyProfit: product.dailyProfitRp,
      accumulatedProfit,
    };
  });

  const relatedProducts = SAMPLE_PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 3);

  return res.status(200).json({
    success: true,
    product,
    simulationSchedule,
    relatedProducts,
  });
});

export default router;
