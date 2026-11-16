/**
 * Global Stock Exchange Market Data & Announcements Feed
 * Includes comprehensive index data for the Americas, Europe, Asia-Pacific, and Middle East & Africa.
 */

// Blank Announcements List as requested:
// "Whenever is announced anywhere in the country, it should appear on my website. For now, keep the News section blank."
const announcementsData = [];

// Currency Conversion Rates (Base: USD)
const currencyRates = {
  USD: { rate: 1.0, symbol: "$" },
  EUR: { rate: 0.92, symbol: "€" },
  GBP: { rate: 0.79, symbol: "£" },
  JPY: { rate: 154.5, symbol: "¥" },
  INR: { rate: 84.4, symbol: "₹" },
  CNY: { rate: 7.24, symbol: "¥" },
  CAD: { rate: 1.38, symbol: "CA$" },
  AUD: { rate: 1.53, symbol: "A$" },
  CHF: { rate: 0.88, symbol: "CHF" }
};

// Major Global Stock Exchanges & Primary Benchmark Indices
const stockExchangesData = [
  // --- AMERICAS ---
  {
    id: "sp500",
    name: "New York Stock Exchange",
    shortName: "NYSE",
    indexName: "S&P 500",
    ticker: "^GSPC",
    region: "Americas",
    country: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    currency: "USD",
    price: 5983.99,
    prevClose: 5949.17,
    high: 6012.45,
    low: 5960.30,
    volume: "4.21B",
    marketCap: "$45.8T",
    // Trading hours in UTC: 14:30 to 21:00 UTC (Mon-Fri)
    utcOpen: 14.5,
    utcClose: 21.0,
    sparkline: [5949, 5958, 5972, 5965, 5991, 5980, 5983.99],
    timeframes: {
      "1D": [5949, 5955, 5968, 5960, 5985, 5979, 5983.99],
      "5D": [5864, 5890, 5920, 5935, 5983.99],
      "1M": [5750, 5810, 5860, 5920, 5983.99],
      "1Y": [4500, 4800, 5100, 5450, 5983.99]
    }
  },
  {
    id: "nasdaq",
    name: "Nasdaq Stock Market",
    shortName: "NASDAQ",
    indexName: "NASDAQ Composite",
    ticker: "^IXIC",
    region: "Americas",
    country: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    currency: "USD",
    price: 19281.40,
    prevClose: 19145.20,
    high: 19320.10,
    low: 19160.00,
    volume: "5.82B",
    marketCap: "$25.4T",
    utcOpen: 14.5,
    utcClose: 21.0,
    sparkline: [19145, 19180, 19220, 19195, 19260, 19250, 19281.4],
    timeframes: {
      "1D": [19145, 19170, 19230, 19210, 19290, 19281.4],
      "5D": [18800, 18950, 19100, 19150, 19281.4],
      "1M": [18200, 18450, 18800, 19100, 19281.4],
      "1Y": [14200, 15500, 16800, 18200, 19281.4]
    }
  },
  {
    id: "dowjones",
    name: "New York Stock Exchange",
    shortName: "NYSE",
    indexName: "Dow Jones Industrial",
    ticker: "^DJI",
    region: "Americas",
    country: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    currency: "USD",
    price: 43910.98,
    prevClose: 43729.93,
    high: 44020.15,
    low: 43750.00,
    volume: "389M",
    marketCap: "$13.9T",
    utcOpen: 14.5,
    utcClose: 21.0,
    sparkline: [43729, 43780, 43840, 43810, 43930, 43890, 43910.98],
    timeframes: {
      "1D": [43729, 43770, 43850, 43800, 43940, 43910.98],
      "5D": [43200, 43450, 43600, 43800, 43910.98],
      "1M": [42100, 42600, 43100, 43600, 43910.98],
      "1Y": [35000, 37500, 39000, 41500, 43910.98]
    }
  },
  {
    id: "tsx",
    name: "Toronto Stock Exchange",
    shortName: "TSX",
    indexName: "S&P/TSX Composite",
    ticker: "^GSPTSE",
    region: "Americas",
    country: "Canada",
    countryCode: "CA",
    flag: "🇨🇦",
    currency: "CAD",
    price: 24759.43,
    prevClose: 24822.15,
    high: 24850.10,
    low: 24710.20,
    volume: "215M",
    marketCap: "$3.6T",
    utcOpen: 14.5,
    utcClose: 21.0,
    sparkline: [24822, 24800, 24760, 24790, 24740, 24770, 24759.43],
    timeframes: {
      "1D": [24822, 24810, 24770, 24790, 24750, 24759.43],
      "5D": [24500, 24620, 24700, 24822, 24759.43],
      "1M": [23900, 24200, 24500, 24800, 24759.43],
      "1Y": [20100, 21200, 22400, 23800, 24759.43]
    }
  },
  {
    id: "b3",
    name: "Brasil Bolsa Balcão",
    shortName: "B3",
    indexName: "Ibovespa",
    ticker: "^BVSP",
    region: "Americas",
    country: "Brazil",
    countryCode: "BR",
    flag: "🇧🇷",
    currency: "USD",
    price: 127791.75,
    prevClose: 127698.30,
    high: 128200.00,
    low: 127350.50,
    volume: "3.1B",
    marketCap: "$870B",
    utcOpen: 13.0,
    utcClose: 20.0,
    sparkline: [127698, 127720, 127810, 127750, 127840, 127791.75],
    timeframes: {
      "1D": [127698, 127730, 127850, 127700, 127791.75],
      "5D": [126500, 126900, 127200, 127698, 127791.75],
      "1M": [129000, 128200, 127500, 127700, 127791.75],
      "1Y": [118000, 125000, 131000, 125000, 127791.75]
    }
  },

  // --- EUROPE ---
  {
    id: "ftse100",
    name: "London Stock Exchange",
    shortName: "LSE",
    indexName: "FTSE 100",
    ticker: "^FTSE",
    region: "Europe",
    country: "United Kingdom",
    countryCode: "GB",
    flag: "🇬🇧",
    currency: "GBP",
    price: 8071.19,
    prevClose: 8025.33,
    high: 8092.40,
    low: 8035.10,
    volume: "680M",
    marketCap: "$3.9T",
    utcOpen: 8.0,
    utcClose: 16.5,
    sparkline: [8025, 8040, 8055, 8048, 8080, 8065, 8071.19],
    timeframes: {
      "1D": [8025, 8035, 8060, 8050, 8085, 8071.19],
      "5D": [8010, 8030, 8045, 8025, 8071.19],
      "1M": [8200, 8150, 8090, 8030, 8071.19],
      "1Y": [7400, 7650, 8100, 8300, 8071.19]
    }
  },
  {
    id: "dax",
    name: "Frankfurt Stock Exchange (Xetra)",
    shortName: "FSX",
    indexName: "DAX 40",
    ticker: "^GDAXI",
    region: "Europe",
    country: "Germany",
    countryCode: "DE",
    flag: "🇩🇪",
    currency: "EUR",
    price: 19210.85,
    prevClose: 19077.54,
    high: 19260.40,
    low: 19095.00,
    volume: "74M",
    marketCap: "$2.3T",
    utcOpen: 8.0,
    utcClose: 16.5,
    sparkline: [19077, 19120, 19160, 19140, 19230, 19195, 19210.85],
    timeframes: {
      "1D": [19077, 19110, 19170, 19150, 19240, 19210.85],
      "5D": [19300, 19250, 19150, 19077, 19210.85],
      "1M": [19100, 19350, 19400, 19150, 19210.85],
      "1Y": [15800, 16800, 18000, 18800, 19210.85]
    }
  },
  {
    id: "cac40",
    name: "Euronext Paris",
    shortName: "EURONEXT",
    indexName: "CAC 40",
    ticker: "^FCHI",
    region: "Europe",
    country: "France",
    countryCode: "FR",
    flag: "🇫🇷",
    currency: "EUR",
    price: 7269.63,
    prevClose: 7311.80,
    high: 7325.00,
    low: 7248.10,
    volume: "89M",
    marketCap: "$3.5T",
    utcOpen: 8.0,
    utcClose: 16.5,
    sparkline: [7311, 7295, 7275, 7288, 7255, 7262, 7269.63],
    timeframes: {
      "1D": [7311, 7290, 7270, 7285, 7260, 7269.63],
      "5D": [7400, 7350, 7320, 7311, 7269.63],
      "1M": [7550, 7480, 7410, 7350, 7269.63],
      "1Y": [7100, 7350, 7800, 7600, 7269.63]
    }
  },
  {
    id: "six",
    name: "SIX Swiss Exchange",
    shortName: "SIX",
    indexName: "SMI (Swiss Market Index)",
    ticker: "^SSMI",
    region: "Europe",
    country: "Switzerland",
    countryCode: "CH",
    flag: "🇨🇭",
    currency: "CHF",
    price: 11840.20,
    prevClose: 11795.50,
    high: 11865.00,
    low: 11800.10,
    volume: "42M",
    marketCap: "$2.1T",
    utcOpen: 8.0,
    utcClose: 16.5,
    sparkline: [11795, 11810, 11825, 11815, 11850, 11840.2],
    timeframes: {
      "1D": [11795, 11815, 11835, 11820, 11855, 11840.2],
      "5D": [11750, 11780, 11800, 11795, 11840.2],
      "1M": [11950, 11880, 11820, 11795, 11840.2],
      "1Y": [10800, 11200, 11600, 12000, 11840.2]
    }
  },

  // --- ASIA-PACIFIC ---
  {
    id: "nikkei225",
    name: "Tokyo Stock Exchange",
    shortName: "TSE",
    indexName: "Nikkei 225",
    ticker: "^N225",
    region: "Asia-Pacific",
    country: "Japan",
    countryCode: "JP",
    flag: "🇯🇵",
    currency: "JPY",
    price: 38642.91,
    prevClose: 38535.70,
    high: 38780.00,
    low: 38490.20,
    volume: "1.45B",
    marketCap: "$6.5T",
    utcOpen: 0.0,
    utcClose: 6.0,
    sparkline: [38535, 38580, 38650, 38610, 38720, 38680, 38642.91],
    timeframes: {
      "1D": [38535, 38590, 38670, 38620, 38740, 38642.91],
      "5D": [39200, 38900, 38700, 38535, 38642.91],
      "1M": [38800, 39500, 39100, 38500, 38642.91],
      "1Y": [32000, 35000, 40000, 38000, 38642.91]
    }
  },
  {
    id: "nifty50",
    name: "National Stock Exchange of India",
    shortName: "NSE",
    indexName: "NIFTY 50",
    ticker: "^NSEI",
    region: "Asia-Pacific",
    country: "India",
    countryCode: "IN",
    flag: "🇮🇳",
    currency: "INR",
    price: 23532.70,
    prevClose: 23559.05,
    high: 23620.40,
    low: 23480.15,
    volume: "420M",
    marketCap: "$5.1T",
    utcOpen: 3.75,
    utcClose: 10.0,
    sparkline: [23559, 23570, 23520, 23545, 23505, 23532.7],
    timeframes: {
      "1D": [23559, 23580, 23510, 23540, 23490, 23532.7],
      "5D": [24100, 23850, 23700, 23559, 23532.7],
      "1M": [24900, 24500, 24150, 23800, 23532.7],
      "1Y": [19500, 21500, 22800, 24800, 23532.7]
    }
  },
  {
    id: "sensex",
    name: "Bombay Stock Exchange",
    shortName: "BSE",
    indexName: "S&P BSE SENSEX",
    ticker: "^BSESN",
    region: "Asia-Pacific",
    country: "India",
    countryCode: "IN",
    flag: "🇮🇳",
    currency: "INR",
    price: 77580.31,
    prevClose: 77690.95,
    high: 77850.00,
    low: 77410.50,
    volume: "185M",
    marketCap: "$5.0T",
    utcOpen: 3.75,
    utcClose: 10.0,
    sparkline: [77690, 77720, 77550, 77610, 77520, 77580.31],
    timeframes: {
      "1D": [77690, 77730, 77520, 77630, 77500, 77580.31],
      "5D": [79400, 78600, 78100, 77690, 77580.31],
      "1M": [81500, 80400, 79200, 78200, 77580.31],
      "1Y": [65000, 71000, 74500, 81000, 77580.31]
    }
  },
  {
    id: "hangseng",
    name: "Hong Kong Stock Exchange",
    shortName: "HKEX",
    indexName: "Hang Seng Index",
    ticker: "^HSI",
    region: "Asia-Pacific",
    country: "Hong Kong",
    countryCode: "HK",
    flag: "🇭🇰",
    currency: "USD",
    price: 19426.34,
    prevClose: 19661.18,
    high: 19700.50,
    low: 19380.20,
    volume: "2.1B",
    marketCap: "$4.8T",
    utcOpen: 1.5,
    utcClose: 8.0,
    sparkline: [19661, 19610, 19520, 19480, 19400, 19426.34],
    timeframes: {
      "1D": [19661, 19590, 19500, 19450, 19390, 19426.34],
      "5D": [20400, 19900, 19800, 19661, 19426.34],
      "1M": [20600, 20800, 20300, 19800, 19426.34],
      "1Y": [17500, 16200, 18500, 21000, 19426.34]
    }
  },
  {
    id: "sse",
    name: "Shanghai Stock Exchange",
    shortName: "SSE",
    indexName: "SSE Composite",
    ticker: "000001.SS",
    region: "Asia-Pacific",
    country: "China",
    countryCode: "CN",
    flag: "🇨🇳",
    currency: "CNY",
    price: 3330.73,
    prevClose: 3379.84,
    high: 3390.10,
    low: 3315.60,
    volume: "4.8B",
    marketCap: "$7.2T",
    utcOpen: 1.5,
    utcClose: 7.0,
    sparkline: [3379, 3365, 3350, 3340, 3320, 3330.73],
    timeframes: {
      "1D": [3379, 3368, 3345, 3338, 3318, 3330.73],
      "5D": [3450, 3420, 3390, 3379, 3330.73],
      "1M": [3250, 3320, 3480, 3400, 3330.73],
      "1Y": [3050, 2900, 3150, 3450, 3330.73]
    }
  },
  {
    id: "asx200",
    name: "Australian Securities Exchange",
    shortName: "ASX",
    indexName: "S&P/ASX 200",
    ticker: "^AXJO",
    region: "Asia-Pacific",
    country: "Australia",
    countryCode: "AU",
    flag: "🇦🇺",
    currency: "AUD",
    price: 8285.20,
    prevClose: 8225.10,
    high: 8305.00,
    low: 8230.40,
    volume: "510M",
    marketCap: "$2.1T",
    utcOpen: 23.0,
    utcClose: 5.0,
    sparkline: [8225, 8240, 8265, 8255, 8295, 8285.2],
    timeframes: {
      "1D": [8225, 8245, 8270, 8260, 8300, 8285.2],
      "5D": [8260, 8240, 8210, 8225, 8285.2],
      "1M": [8320, 8280, 8220, 8250, 8285.2],
      "1Y": [7100, 7500, 7800, 8100, 8285.2]
    }
  },
  {
    id: "kospi",
    name: "Korea Exchange",
    shortName: "KRX",
    indexName: "KOSPI",
    ticker: "^KS11",
    region: "Asia-Pacific",
    country: "South Korea",
    countryCode: "KR",
    flag: "🇰🇷",
    currency: "USD",
    price: 2416.86,
    prevClose: 2488.86,
    high: 2470.10,
    low: 2405.30,
    volume: "450M",
    marketCap: "$1.7T",
    utcOpen: 0.0,
    utcClose: 6.5,
    sparkline: [2488, 2465, 2440, 2435, 2410, 2416.86],
    timeframes: {
      "1D": [2488, 2460, 2435, 2420, 2408, 2416.86],
      "5D": [2560, 2520, 2490, 2488, 2416.86],
      "1M": [2610, 2590, 2550, 2488, 2416.86],
      "1Y": [2450, 2600, 2750, 2600, 2416.86]
    }
  },
  {
    id: "sti",
    name: "Singapore Exchange",
    shortName: "SGX",
    indexName: "Straits Times Index",
    ticker: "^STI",
    region: "Asia-Pacific",
    country: "Singapore",
    countryCode: "SG",
    flag: "🇸🇬",
    currency: "USD",
    price: 3744.70,
    prevClose: 3721.40,
    high: 3755.10,
    low: 3725.00,
    volume: "190M",
    marketCap: "$680B",
    utcOpen: 1.0,
    utcClose: 9.0,
    sparkline: [3721, 3728, 3736, 3732, 3749, 3744.7],
    timeframes: {
      "1D": [3721, 3730, 3738, 3735, 3752, 3744.7],
      "5D": [3680, 3700, 3715, 3721, 3744.7],
      "1M": [3580, 3620, 3680, 3710, 3744.7],
      "1Y": [3150, 3250, 3350, 3550, 3744.7]
    }
  },

  // --- MIDDLE EAST & AFRICA ---
  {
    id: "tadawul",
    name: "Saudi Stock Exchange",
    shortName: "Tadawul",
    indexName: "TASI (Tadawul All Share)",
    ticker: "^TASI.SR",
    region: "Middle East & Africa",
    country: "Saudi Arabia",
    countryCode: "SA",
    flag: "🇸🇦",
    currency: "USD",
    price: 11791.43,
    prevClose: 11825.10,
    high: 11860.20,
    low: 11760.30,
    volume: "175M",
    marketCap: "$2.7T",
    utcOpen: 7.0,
    utcClose: 12.0,
    sparkline: [11825, 11810, 11785, 11805, 11775, 11791.43],
    timeframes: {
      "1D": [11825, 11815, 11790, 11810, 11780, 11791.43],
      "5D": [11950, 11900, 11860, 11825, 11791.43],
      "1M": [12100, 12020, 11950, 11850, 11791.43],
      "1Y": [10800, 11500, 12600, 11900, 11791.43]
    }
  },
  {
    id: "dfm",
    name: "Dubai Financial Market",
    shortName: "DFM",
    indexName: "DFM General Index",
    ticker: "DFMGI",
    region: "Middle East & Africa",
    country: "United Arab Emirates",
    countryCode: "AE",
    flag: "🇦🇪",
    currency: "USD",
    price: 4732.18,
    prevClose: 4698.50,
    high: 4745.00,
    low: 4702.10,
    volume: "120M",
    marketCap: "$210B",
    utcOpen: 6.0,
    utcClose: 11.0,
    sparkline: [4698, 4710, 4725, 4718, 4738, 4732.18],
    timeframes: {
      "1D": [4698, 4712, 4728, 4720, 4740, 4732.18],
      "5D": [4620, 4650, 4680, 4698, 4732.18],
      "1M": [4480, 4550, 4620, 4680, 4732.18],
      "1Y": [3900, 4100, 4300, 4550, 4732.18]
    }
  },
  {
    id: "jse",
    name: "Johannesburg Stock Exchange",
    shortName: "JSE",
    indexName: "FTSE/JSE Top 40",
    ticker: "^J200",
    region: "Middle East & Africa",
    country: "South Africa",
    countryCode: "ZA",
    flag: "🇿🇦",
    currency: "USD",
    price: 80112.50,
    prevClose: 79840.10,
    high: 80350.00,
    low: 79790.20,
    volume: "85M",
    marketCap: "$1.1T",
    utcOpen: 7.0,
    utcClose: 15.0,
    sparkline: [79840, 79920, 80050, 79990, 80160, 80112.5],
    timeframes: {
      "1D": [79840, 79940, 80080, 80010, 80180, 80112.5],
      "5D": [79200, 79500, 79700, 79840, 80112.5],
      "1M": [81200, 80700, 80200, 79900, 80112.5],
      "1Y": [68000, 72000, 76000, 80500, 80112.5]
    }
  }
];

// Helper to determine whether an exchange is actively open right now
function getExchangeMarketStatus(exchange) {
  const now = new Date();
  const day = now.getUTCDay(); // 0 is Sunday, 6 is Saturday
  
  // Weekend check (Note: Middle East exchanges like Saudi trade Sun-Thu)
  if (exchange.countryCode === "SA" || exchange.countryCode === "AE") {
    // Trades Sunday (0) through Thursday (4)
    if (day === 5 || day === 6) {
      return { status: "CLOSED", label: "Closed (Weekend)", color: "rose" };
    }
  } else {
    // Normal international exchanges trade Monday (1) through Friday (5)
    if (day === 0 || day === 6) {
      return { status: "CLOSED", label: "Closed (Weekend)", color: "rose" };
    }
  }

  const currentUtcHours = now.getUTCHours() + now.getUTCMinutes() / 60;
  
  // Special check for exchanges crossing midnight (e.g. ASX open at 23:00 UTC to 05:00 UTC)
  let isOpen = false;
  if (exchange.utcOpen > exchange.utcClose) {
    isOpen = currentUtcHours >= exchange.utcOpen || currentUtcHours < exchange.utcClose;
  } else {
    isOpen = currentUtcHours >= exchange.utcOpen && currentUtcHours < exchange.utcClose;
  }

  if (isOpen) {
    return { status: "OPEN", label: "Market Open", color: "emerald" };
  } else {
    // Check if pre-market (1 hour before open)
    let diff = exchange.utcOpen - currentUtcHours;
    if (diff < 0) diff += 24;
    if (diff <= 1.0) {
      return { status: "PRE_MARKET", label: "Pre-Market", color: "amber" };
    }
    return { status: "CLOSED", label: "Closed", color: "slate" };
  }
}
