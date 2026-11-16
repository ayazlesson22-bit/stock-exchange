# GlobeStock | Global Stock Exchange & National Announcements Portal

A clean, minimalist, high-performance, fully responsive website built in pure **HTML5**, **CSS3**, and **Vanilla JavaScript** (zero external dependencies).

---

## 📁 Complete Folder & File Structure

```text
STOCK EXCHANG/
│
├── index.html                   # Main semantic entry point & layout
├── README.md                    # Project documentation & integration guide
│
├── css/
│   ├── style.css                # Minimalist styling, dark/light theme, modern typography
│   └── responsive.css           # Responsive breakpoints for mobile, tablet & desktop
│
├── js/
│   ├── data.js                  # Global stock exchanges data & blank announcements store
│   ├── chart.js                 # Custom high-DPI Canvas interactive chart & SVG sparklines
│   └── app.js                   # Application state, live ticker, market hours & event logic
│
└── assets/
    ├── favicon.svg              # Minimalist stock exchange SVG icon
    └── icons/                   # Directory for custom icons and assets
```

---

## 🌟 Key Features

1. **Daily & Live Global Stock Exchanges Tracked**:
   - **Americas**: NYSE (S&P 500, Dow Jones), NASDAQ, TSX (Toronto), B3 (Brazil).
   - **Europe**: LSE (London FTSE 100), Deutsche Börse (Frankfurt DAX 40), Euronext Paris (CAC 40), SIX Swiss Exchange.
   - **Asia-Pacific**: Tokyo Stock Exchange (Nikkei 225), National Stock Exchange of India (NIFTY 50), Bombay Stock Exchange (SENSEX), Hong Kong (Hang Seng), Shanghai (SSE Composite), Australia (ASX 200), Korea (KOSPI), Singapore (SGX).
   - **Middle East & Africa**: Saudi Tadawul (TASI), Dubai Financial Market (DFM), Johannesburg Stock Exchange (JSE).

2. **Real-Time Dynamic Market Status**:
   - Automatically computes whether an exchange is **Open**, **Closed**, or in **Pre-Market** based on UTC market trading hours and weekends (including Sunday-Thursday trading weeks for Middle East exchanges).

3. **Interactive Detailed Charting (Zero Dependencies)**:
   - Built-in canvas engine with retina DPI rendering, interactive crosshair hover, and timeframe switching (`1D`, `5D`, `1M`, `1Y`).
   - Lightweight inline SVG sparklines for all market cards.

4. **Announcements & National Disclosures Section**:
   - **Default Clean & Blank State**: As requested, kept empty by default with an elegant waiting beacon and live listener indicator.
   - **Instant Programmatic Publishing API**: Whenever an announcement is issued anywhere in the country or globally, calling `window.postCountryAnnouncement({...})` instantly renders it without page reload.
   - Includes **"Simulate Announcement"** and **"Clear (Keep Blank)"** controls for quick verification.

5. **Multi-Currency Converter**:
   - Convert index valuations in real-time into USD ($), EUR (€), GBP (£), JPY (¥), INR (₹), CNY (¥), CAD (CA$), AUD (A$), and CHF.

6. **Watchlist & Personalization**:
   - Star your favorite exchanges; persists in browser `localStorage`.

7. **Dark & Light Mode**:
   - Sleek institutional dark theme by default, with instant high-contrast light mode toggle.

---

## 🚀 How to Run

No build step or node package installations are required!

1. Open the project folder `STOCK EXCHANG`.
2. Double-click `index.html` to open it directly in any modern web browser (Chrome, Firefox, Safari, Edge).
3. Or serve using any lightweight static server:
   ```bash
   # Using Python:
   python -m http.server 3000

   # Or using npx:
   npx serve .
   ```

---

## 📢 How to Connect Live National Announcements

To post an announcement from a backend webhook, RSS feed, or API, invoke `postCountryAnnouncement` in JavaScript:

```javascript
window.postCountryAnnouncement({
  title: "Central Bank issues new monetary policy statement and revised repo rate",
  source: "Reserve Bank / SEC",
  country: "National",
  urgency: "high", // 'high' for breaking flash alerts, 'normal' for regular circulars
  summary: "Official statement regarding regulatory adjustments and scheduled market operations.",
  link: "https://example.gov/announcement"
});
```

To restore the section to its blank state at any time:
```javascript
window.clearAnnouncements();
```
