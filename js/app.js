/**
 * Global Stock Exchange - Core Application Logic
 * Minimalist, high performance, responsive and user-friendly.
 */

// Application State
const AppState = {
  region: "all",
  searchQuery: "",
  sortBy: "marketCap",
  currency: "USD",
  viewMode: "grid", // 'grid' or 'table'
  watchlist: JSON.parse(localStorage.getItem("globe_stock_watchlist") || "[]"),
  liveSimulation: true,
  theme: localStorage.getItem("globe_stock_theme") || "dark",
  selectedExchange: null,
  currentTimeframe: "1D"
};

let modalChartInstance = null;
let simulationInterval = null;

// Initialize on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initClocks();
  initTickerTape();
  renderExchanges();
  renderMarketSummary();
  renderAnnouncements();
  setupEventListeners();
  startLiveSimulation();
});

// ----------------------------------------------------
// THEME HANDLING
// ----------------------------------------------------
function initTheme() {
  document.documentElement.setAttribute("data-theme", AppState.theme);
  const themeBtn = document.getElementById("themeToggleBtn");
  if (themeBtn) {
    updateThemeIcon(themeBtn);
  }
}

function toggleTheme() {
  AppState.theme = AppState.theme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", AppState.theme);
  localStorage.setItem("globe_stock_theme", AppState.theme);
  const themeBtn = document.getElementById("themeToggleBtn");
  if (themeBtn) updateThemeIcon(themeBtn);
  if (modalChartInstance && AppState.selectedExchange) {
    modalChartInstance.render();
  }
}

function updateThemeIcon(btn) {
  if (AppState.theme === "dark") {
    btn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
      <span class="sr-only">Light Mode</span>
    `;
    btn.title = "Switch to Light Mode";
  } else {
    btn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
      <span class="sr-only">Dark Mode</span>
    `;
    btn.title = "Switch to Dark Mode";
  }
}

// ----------------------------------------------------
// GLOBAL CLOCKS
// ----------------------------------------------------
function initClocks() {
  const updateTimes = () => {
    const now = new Date();
    const formatTime = (timeZone) => {
      try {
        return new Intl.DateTimeFormat("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone
        }).format(now);
      } catch (e) {
        return now.toTimeString().substring(0, 8);
      }
    };

    const utcEl = document.getElementById("clockUtc");
    const nyEl = document.getElementById("clockNy");
    const lonEl = document.getElementById("clockLondon");
    const tokEl = document.getElementById("clockTokyo");
    const locEl = document.getElementById("clockLocal");

    if (utcEl) utcEl.textContent = formatTime("UTC");
    if (nyEl) nyEl.textContent = formatTime("America/New_York");
    if (lonEl) lonEl.textContent = formatTime("Europe/London");
    if (tokEl) tokEl.textContent = formatTime("Asia/Tokyo");
    if (locEl) locEl.textContent = now.toLocaleTimeString([], { hour12: false });
  };

  updateTimes();
  setInterval(updateTimes, 1000);
}

// ----------------------------------------------------
// TOP TICKER TAPE
// ----------------------------------------------------
function initTickerTape() {
  const track = document.getElementById("tickerTrack");
  if (!track) return;

  const indices = stockExchangesData.slice(0, 10);
  const itemsHtml = indices.map(item => {
    const change = item.price - item.prevClose;
    const pctChange = ((change / item.prevClose) * 100).toFixed(2);
    const isUp = change >= 0;
    const sign = isUp ? "+" : "";
    const colorClass = isUp ? "trend-up" : "trend-down";

    return `
      <div class="ticker-item" onclick="openExchangeModal('${item.id}')">
        <span class="ticker-flag">${item.flag}</span>
        <span class="ticker-sym">${item.indexName}</span>
        <span class="ticker-val">${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        <span class="ticker-change ${colorClass}">${sign}${pctChange}%</span>
      </div>
    `;
  }).join("");

  // Duplicate for seamless infinite marquee loop
  track.innerHTML = itemsHtml + itemsHtml;
}

// ----------------------------------------------------
// CURRENCY & VALUE FORMATTING
// ----------------------------------------------------
function formatExchangePrice(value, originalCurrency) {
  const currentRateObj = currencyRates[AppState.currency] || { rate: 1, symbol: "$" };
  const baseRateObj = currencyRates[originalCurrency] || { rate: 1, symbol: "$" };

  // Convert from source currency to USD then to target currency
  const inUsd = value / (baseRateObj.rate || 1);
  const converted = inUsd * currentRateObj.rate;

  return {
    symbol: currentRateObj.symbol,
    formatted: converted.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }),
    raw: converted
  };
}

// ----------------------------------------------------
// RENDER EXCHANGES
// ----------------------------------------------------
function getFilteredExchanges() {
  let list = [...stockExchangesData];

  // Filter by Region or Watchlist
  if (AppState.region === "watchlist") {
    list = list.filter(item => AppState.watchlist.includes(item.id));
  } else if (AppState.region !== "all") {
    list = list.filter(item => item.region.toLowerCase() === AppState.region.toLowerCase());
  }

  // Filter by Search Query
  if (AppState.searchQuery.trim() !== "") {
    const q = AppState.searchQuery.toLowerCase().trim();
    list = list.filter(item =>
      item.name.toLowerCase().includes(q) ||
      item.indexName.toLowerCase().includes(q) ||
      item.shortName.toLowerCase().includes(q) ||
      item.country.toLowerCase().includes(q) ||
      item.ticker.toLowerCase().includes(q)
    );
  }

  // Sorting
  list.sort((a, b) => {
    const changeA = ((a.price - a.prevClose) / a.prevClose) * 100;
    const changeB = ((b.price - b.prevClose) / b.prevClose) * 100;

    switch (AppState.sortBy) {
      case "gainers":
        return changeB - changeA;
      case "losers":
        return changeA - changeB;
      case "price":
        return b.price - a.price;
      case "name":
        return a.indexName.localeCompare(b.indexName);
      case "marketCap":
      default:
        // Use default ranking
        return 0;
    }
  });

  return list;
}

function renderExchanges() {
  const container = document.getElementById("exchangesContainer");
  const tableContainer = document.getElementById("exchangesTableContainer");
  if (!container || !tableContainer) return;

  const exchanges = getFilteredExchanges();
  const countEl = document.getElementById("resultsCount");
  if (countEl) countEl.textContent = `${exchanges.length} ${exchanges.length === 1 ? 'Market' : 'Markets'}`;

  if (exchanges.length === 0) {
    const emptyHtml = `
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <h3>No Exchanges Found</h3>
        <p>No stock exchanges matched your filter or search query. Try clearing your filters or selecting another region.</p>
        <button class="btn btn-secondary" onclick="resetFilters()">Reset All Filters</button>
      </div>
    `;
    container.innerHTML = emptyHtml;
    tableContainer.innerHTML = emptyHtml;
    return;
  }

  if (AppState.viewMode === "grid") {
    container.style.display = "grid";
    tableContainer.style.display = "none";
    renderGridView(container, exchanges);
  } else {
    container.style.display = "none";
    tableContainer.style.display = "block";
    renderTableView(tableContainer, exchanges);
  }
}

function renderGridView(container, list) {
  container.innerHTML = list.map(item => {
    const change = item.price - item.prevClose;
    const pctChange = ((change / item.prevClose) * 100).toFixed(2);
    const isUp = change >= 0;
    const trendClass = isUp ? "trend-up" : "trend-down";
    const sign = isUp ? "+" : "";
    const isBookmarked = AppState.watchlist.includes(item.id);
    const status = getExchangeMarketStatus(item);

    const priceInfo = formatExchangePrice(item.price, item.currency);
    const changeInfo = formatExchangePrice(Math.abs(change), item.currency);
    const sparklineSvg = generateSvgSparkline(item.sparkline, isUp);

    return `
      <div class="exchange-card" onclick="openExchangeModal('${item.id}')">
        <div class="card-header">
          <div class="card-title-group">
            <span class="card-flag" title="${item.country}">${item.flag}</span>
            <div>
              <h3 class="card-index-name">${item.indexName}</h3>
              <div class="card-exchange-sub">
                <span class="card-short-name">${item.shortName}</span>
                <span class="card-dot">•</span>
                <span class="card-country">${item.country}</span>
              </div>
            </div>
          </div>
          <button class="btn-star ${isBookmarked ? 'active' : ''}" 
                  onclick="event.stopPropagation(); toggleWatchlist('${item.id}')"
                  title="${isBookmarked ? 'Remove from Watchlist' : 'Add to Watchlist'}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="${isBookmarked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </button>
        </div>

        <div class="card-price-row">
          <div>
            <div class="card-price">${priceInfo.symbol}${priceInfo.formatted}</div>
            <div class="card-change ${trendClass}">
              <span class="change-icon">${isUp ? "▲" : "▼"}</span>
              <span class="change-points">${sign}${changeInfo.symbol}${changeInfo.formatted}</span>
              <span class="change-pct">(${sign}${pctChange}%)</span>
            </div>
          </div>
          <div class="card-sparkline">
            ${sparklineSvg}
          </div>
        </div>

        <div class="card-footer">
          <div class="status-badge status-${status.color}">
            <span class="status-dot"></span>
            <span>${status.label}</span>
          </div>
          <div class="card-volume">Vol: ${item.volume}</div>
        </div>
      </div>
    `;
  }).join("");
}

function renderTableView(container, list) {
  const rows = list.map(item => {
    const change = item.price - item.prevClose;
    const pctChange = ((change / item.prevClose) * 100).toFixed(2);
    const isUp = change >= 0;
    const trendClass = isUp ? "trend-up" : "trend-down";
    const sign = isUp ? "+" : "";
    const isBookmarked = AppState.watchlist.includes(item.id);
    const status = getExchangeMarketStatus(item);

    const priceInfo = formatExchangePrice(item.price, item.currency);
    const changeInfo = formatExchangePrice(Math.abs(change), item.currency);
    const sparklineSvg = generateSvgSparkline(item.sparkline, isUp, 80, 24);

    return `
      <tr onclick="openExchangeModal('${item.id}')">
        <td class="col-star" onclick="event.stopPropagation(); toggleWatchlist('${item.id}')">
          <button class="btn-star ${isBookmarked ? 'active' : ''}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="${isBookmarked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </button>
        </td>
        <td class="col-market">
          <div class="table-market-cell">
            <span class="table-flag">${item.flag}</span>
            <div>
              <div class="table-index">${item.indexName}</div>
              <div class="table-sub">${item.shortName} • ${item.country}</div>
            </div>
          </div>
        </td>
        <td class="col-status">
          <div class="status-badge status-${status.color}">
            <span class="status-dot"></span>
            <span>${status.status}</span>
          </div>
        </td>
        <td class="col-price text-right font-mono">
          ${priceInfo.symbol}${priceInfo.formatted}
        </td>
        <td class="col-change text-right ${trendClass} font-mono">
          ${sign}${pctChange}%
        </td>
        <td class="col-range text-right font-mono hide-mobile">
          ${formatExchangePrice(item.low, item.currency).symbol}${formatExchangePrice(item.low, item.currency).formatted} - ${formatExchangePrice(item.high, item.currency).formatted}
        </td>
        <td class="col-volume text-right hide-mobile">
          ${item.volume}
        </td>
        <td class="col-sparkline text-center hide-tablet">
          ${sparklineSvg}
        </td>
      </tr>
    `;
  }).join("");

  container.innerHTML = `
    <div class="table-responsive">
      <table class="market-table">
        <thead>
          <tr>
            <th class="col-star"></th>
            <th class="col-market">Exchange & Index</th>
            <th class="col-status">Status</th>
            <th class="col-price text-right">Price</th>
            <th class="col-change text-right">24h Change</th>
            <th class="col-range text-right hide-mobile">Day's Range</th>
            <th class="col-volume text-right hide-mobile">Volume</th>
            <th class="col-sparkline text-center hide-tablet">Trend</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
  `;
}

// ----------------------------------------------------
// MARKET SUMMARY METRICS
// ----------------------------------------------------
function renderMarketSummary() {
  const total = stockExchangesData.length;
  let openCount = 0;
  let gainers = 0;
  let losers = 0;

  stockExchangesData.forEach(item => {
    const status = getExchangeMarketStatus(item);
    if (status.status === "OPEN") openCount++;
    if (item.price >= item.prevClose) gainers++;
    else losers++;
  });

  const totalEl = document.getElementById("metricTotalMarkets");
  const openEl = document.getElementById("metricOpenMarkets");
  const gainersEl = document.getElementById("metricGainers");
  const losersEl = document.getElementById("metricLosers");
  const sentimentEl = document.getElementById("metricSentiment");

  if (totalEl) totalEl.textContent = total;
  if (openEl) openEl.textContent = openCount;
  if (gainersEl) gainersEl.textContent = gainers;
  if (losersEl) losersEl.textContent = losers;

  if (sentimentEl) {
    const ratio = gainers / total;
    if (ratio >= 0.6) {
      sentimentEl.innerHTML = `<span class="trend-up font-semibold">Bullish</span>`;
    } else if (ratio <= 0.4) {
      sentimentEl.innerHTML = `<span class="trend-down font-semibold">Bearish</span>`;
    } else {
      sentimentEl.innerHTML = `<span class="text-amber font-semibold">Neutral</span>`;
    }
  }
}

// ----------------------------------------------------
// ANNOUNCEMENTS & COUNTRY RELEASES SECTION
// ----------------------------------------------------
/**
 * Renders the Announcements section.
 * As requested: "Whenever is announced anywhere in the country, it should appear on my website. For now, keep the News section blank."
 * The feed defaults to empty/blank state.
 */
function renderAnnouncements() {
  const feedContainer = document.getElementById("announcementsFeed");
  const countBadge = document.getElementById("announcementCountBadge");
  if (!feedContainer) return;

  if (countBadge) {
    countBadge.textContent = announcementsData.length;
    countBadge.style.display = announcementsData.length > 0 ? "inline-flex" : "none";
  }

  // If blank (as requested)
  if (!announcementsData || announcementsData.length === 0) {
    feedContainer.innerHTML = `
      <div class="announcements-empty">
        <div class="announcements-empty-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
        </div>
        <h4 class="empty-title">No Active Announcements</h4>
        <p class="empty-description">
          National stock exchange disclosures, regulatory bulletins, circuit breaker triggers, and company announcements will stream directly into this section in real time.
        </p>
        <div class="empty-status-tag">
          <span class="live-pulse"></span>
          Listening for country-wide announcements
        </div>
      </div>
    `;
    return;
  }

  // When announcements exist, render high-contrast announcement cards
  feedContainer.innerHTML = announcementsData.map(item => {
    const urgencyClass = item.urgency === "high" ? "badge-urgent" : "badge-info";
    const dateStr = item.timestamp ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now";

    return `
      <div class="announcement-item ${item.urgency === 'high' ? 'is-urgent' : ''}">
        <div class="announcement-meta">
          <span class="badge ${urgencyClass}">${item.urgency === 'high' ? 'FLASH' : 'OFFICIAL'}</span>
          <span class="announcement-source">${item.source || 'Exchange Authority'}</span>
          <span class="announcement-dot">•</span>
          <span class="announcement-country">${item.country || 'National'}</span>
          <span class="announcement-time">${dateStr}</span>
        </div>
        <h4 class="announcement-headline">${item.title}</h4>
        ${item.summary ? `<p class="announcement-body">${item.summary}</p>` : ''}
        ${item.link ? `<a href="${item.link}" target="_blank" rel="noopener" class="announcement-link">Read Circular →</a>` : ''}
      </div>
    `;
  }).join("");
}

/**
 * Public programmatic API for adding announcements.
 * Can be triggered from any webhook, country RSS/JSON feed, or administrative push!
 */
window.postCountryAnnouncement = function(announcement) {
  if (!announcement || !announcement.title) return;
  const newEntry = {
    id: announcement.id || `ann-${Date.now()}`,
    title: announcement.title,
    source: announcement.source || "Securities & Exchange Commission",
    country: announcement.country || "National",
    urgency: announcement.urgency || "normal",
    summary: announcement.summary || "",
    link: announcement.link || "#",
    timestamp: announcement.timestamp || new Date().toISOString()
  };

  announcementsData.unshift(newEntry);
  renderAnnouncements();
  
  // Show brief floating toast notification
  showToast(`Breaking: ${newEntry.title}`);
};

/**
 * Helper to simulate an announcement (for testing)
 */
window.simulateTestAnnouncement = function() {
  const sampleTitles = [
    { title: "National Exchange announces revision of Market Trading Hours and Holiday Schedule", source: "Exchange Regulatory Board", urgency: "normal" },
    { title: "Circuit Breaker Alert: Index reaches Upper Band limit; 15-minute trading cooling period initiated", source: "Surveillance Desk", urgency: "high" },
    { title: "Central Bank releases Quarterly Interest Rate and Monetary Policy Statement", source: "Federal Reserve / Central Bank", urgency: "high" },
    { title: "Special Trading Session scheduled for national festive holiday", source: "Operations Authority", urgency: "normal" }
  ];
  const item = sampleTitles[Math.floor(Math.random() * sampleTitles.length)];
  window.postCountryAnnouncement({
    title: item.title,
    source: item.source,
    urgency: item.urgency,
    summary: "Official bulletin issued regarding standard market operations, compliance disclosure, and clearing adjustments.",
    country: "National"
  });
};

/**
 * Helper to clear announcements and return to blank state
 */
window.clearAnnouncements = function() {
  announcementsData.length = 0;
  renderAnnouncements();
  showToast("Announcements cleared. Blank state restored.");
};

// ----------------------------------------------------
// WATCHLIST MANAGEMENT
// ----------------------------------------------------
function toggleWatchlist(id) {
  const idx = AppState.watchlist.indexOf(id);
  if (idx > -1) {
    AppState.watchlist.splice(idx, 1);
    showToast("Removed from Watchlist");
  } else {
    AppState.watchlist.push(id);
    showToast("Added to Watchlist");
  }

  localStorage.setItem("globe_stock_watchlist", JSON.stringify(AppState.watchlist));
  renderExchanges();
  updateWatchlistTabBadge();
}

function updateWatchlistTabBadge() {
  const badge = document.getElementById("watchlistBadge");
  if (badge) {
    badge.textContent = AppState.watchlist.length;
    badge.style.display = AppState.watchlist.length > 0 ? "inline-flex" : "none";
  }
}

// ----------------------------------------------------
// REAL-TIME PRICE TICK SIMULATION
// ----------------------------------------------------
function startLiveSimulation() {
  if (simulationInterval) clearInterval(simulationInterval);
  
  simulationInterval = setInterval(() => {
    if (!AppState.liveSimulation) return;

    // Pick 2-4 random exchanges to update slightly
    const count = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      const idx = Math.floor(Math.random() * stockExchangesData.length);
      const item = stockExchangesData[idx];
      
      // Small fluctuation between -0.15% and +0.15%
      const deltaPct = (Math.random() - 0.49) * 0.003;
      const newPrice = Math.round((item.price * (1 + deltaPct)) * 100) / 100;
      
      item.price = newPrice;
      if (newPrice > item.high) item.high = newPrice;
      if (newPrice < item.low) item.low = newPrice;

      // Update sparkline tail
      item.sparkline.shift();
      item.sparkline.push(newPrice);
    }

    renderExchanges();
    renderMarketSummary();

    // If modal is open for currently selected exchange, refresh chart & stats
    if (AppState.selectedExchange) {
      updateModalDetails(AppState.selectedExchange);
    }
  }, 4000);
}

// ----------------------------------------------------
// EXCHANGE DETAIL MODAL & CHART
// ----------------------------------------------------
function openExchangeModal(id) {
  const exchange = stockExchangesData.find(item => item.id === id);
  if (!exchange) return;

  AppState.selectedExchange = exchange;
  AppState.currentTimeframe = "1D";

  const modal = document.getElementById("exchangeModal");
  if (!modal) return;

  // Initialize or fetch chart instance
  if (!modalChartInstance) {
    modalChartInstance = new StockModalChart("modalCanvasChart", "chartTooltip");
  }

  updateModalDetails(exchange);

  modal.classList.add("is-visible");
  document.body.style.overflow = "hidden";
}

function updateModalDetails(exchange) {
  const change = exchange.price - exchange.prevClose;
  const pctChange = ((change / exchange.prevClose) * 100).toFixed(2);
  const isUp = change >= 0;
  const trendClass = isUp ? "trend-up" : "trend-down";
  const sign = isUp ? "+" : "";
  const status = getExchangeMarketStatus(exchange);

  const priceInfo = formatExchangePrice(exchange.price, exchange.currency);
  const changeInfo = formatExchangePrice(Math.abs(change), exchange.currency);

  document.getElementById("modalFlag").textContent = exchange.flag;
  document.getElementById("modalIndexName").textContent = exchange.indexName;
  document.getElementById("modalSubTitle").textContent = `${exchange.name} (${exchange.shortName}) • ${exchange.country} • Ticker: ${exchange.ticker}`;

  document.getElementById("modalPrice").textContent = `${priceInfo.symbol}${priceInfo.formatted}`;
  
  const modalChangeEl = document.getElementById("modalChange");
  modalChangeEl.className = `modal-price-change ${trendClass}`;
  modalChangeEl.innerHTML = `
    <span>${isUp ? "▲" : "▼"}</span>
    <span>${sign}${changeInfo.symbol}${changeInfo.formatted}</span>
    <span>(${sign}${pctChange}%)</span>
  `;

  // Status badge
  const statusBadge = document.getElementById("modalStatusBadge");
  if (statusBadge) {
    statusBadge.className = `status-badge status-${status.color}`;
    statusBadge.innerHTML = `<span class="status-dot"></span><span>${status.label}</span>`;
  }

  // Key stats
  document.getElementById("statPrevClose").textContent = `${formatExchangePrice(exchange.prevClose, exchange.currency).symbol}${formatExchangePrice(exchange.prevClose, exchange.currency).formatted}`;
  document.getElementById("statDayHigh").textContent = `${formatExchangePrice(exchange.high, exchange.currency).symbol}${formatExchangePrice(exchange.high, exchange.currency).formatted}`;
  document.getElementById("statDayLow").textContent = `${formatExchangePrice(exchange.low, exchange.currency).symbol}${formatExchangePrice(exchange.low, exchange.currency).formatted}`;
  document.getElementById("statVolume").textContent = exchange.volume;
  document.getElementById("statMarketCap").textContent = exchange.marketCap;
  document.getElementById("statCurrency").textContent = `${exchange.currency} (Tracked in ${AppState.currency})`;

  // Range bar positioning
  const rangeBar = document.getElementById("modalDayRangeIndicator");
  if (rangeBar && exchange.high > exchange.low) {
    const rangePct = Math.min(100, Math.max(0, ((exchange.price - exchange.low) / (exchange.high - exchange.low)) * 100));
    rangeBar.style.left = `${rangePct}%`;
  }

  // Render Chart for active timeframe
  const timeframeData = exchange.timeframes[AppState.currentTimeframe] || exchange.sparkline;
  if (modalChartInstance) {
    modalChartInstance.setData(timeframeData, isUp);
  }
}

function setModalTimeframe(tf) {
  AppState.currentTimeframe = tf;
  document.querySelectorAll(".tf-btn").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-tf") === tf);
  });

  if (AppState.selectedExchange && modalChartInstance) {
    const tfData = AppState.selectedExchange.timeframes[tf] || AppState.selectedExchange.sparkline;
    const isUp = (AppState.selectedExchange.price - AppState.selectedExchange.prevClose) >= 0;
    modalChartInstance.setData(tfData, isUp);
  }
}

function closeExchangeModal() {
  const modal = document.getElementById("exchangeModal");
  if (modal) {
    modal.classList.remove("is-visible");
    document.body.style.overflow = "";
    AppState.selectedExchange = null;
  }
}

// ----------------------------------------------------
// TOAST NOTIFICATIONS
// ----------------------------------------------------
function showToast(message) {
  let toast = document.getElementById("appToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "appToast";
    toast.className = "app-toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
}

// ----------------------------------------------------
// EVENT LISTENERS & FILTER CONTROLS
// ----------------------------------------------------
function setupEventListeners() {
  // Theme Toggle
  const themeToggle = document.getElementById("themeToggleBtn");
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }

  // Region Filter Tabs
  document.querySelectorAll(".region-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".region-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      AppState.region = tab.getAttribute("data-region");
      renderExchanges();
    });
  });

  // Search Input
  const searchInput = document.getElementById("marketSearchInput");
  const clearSearchBtn = document.getElementById("clearSearchBtn");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      AppState.searchQuery = e.target.value;
      if (clearSearchBtn) {
        clearSearchBtn.style.display = e.target.value ? "flex" : "none";
      }
      renderExchanges();
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener("click", () => {
      if (searchInput) {
        searchInput.value = "";
        AppState.searchQuery = "";
        clearSearchBtn.style.display = "none";
        searchInput.focus();
        renderExchanges();
      }
    });
  }

  // Sort Dropdown
  const sortSelect = document.getElementById("sortSelect");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      AppState.sortBy = e.target.value;
      renderExchanges();
    });
  }

  // Currency Dropdown
  const currencySelect = document.getElementById("currencySelect");
  if (currencySelect) {
    currencySelect.addEventListener("change", (e) => {
      AppState.currency = e.target.value;
      renderExchanges();
      if (AppState.selectedExchange) {
        updateModalDetails(AppState.selectedExchange);
      }
    });
  }

  // View Mode Toggles (Grid / Table)
  const viewGridBtn = document.getElementById("viewGridBtn");
  const viewTableBtn = document.getElementById("viewTableBtn");
  if (viewGridBtn && viewTableBtn) {
    viewGridBtn.addEventListener("click", () => {
      AppState.viewMode = "grid";
      viewGridBtn.classList.add("active");
      viewTableBtn.classList.remove("active");
      renderExchanges();
    });

    viewTableBtn.addEventListener("click", () => {
      AppState.viewMode = "table";
      viewTableBtn.classList.add("active");
      viewGridBtn.classList.remove("active");
      renderExchanges();
    });
  }

  // Timeframe Buttons in Modal
  document.querySelectorAll(".tf-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      setModalTimeframe(btn.getAttribute("data-tf"));
    });
  });

  // Modal Close buttons
  const modalCloseBtn = document.getElementById("modalCloseBtn");
  const modalBackdrop = document.getElementById("modalBackdrop");
  if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeExchangeModal);
  if (modalBackdrop) modalBackdrop.addEventListener("click", closeExchangeModal);

  // Keyboard navigation
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeExchangeModal();
    }
    if (e.key === "/" && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput?.focus();
    }
  });

  // Update initial watchlist badge
  updateWatchlistTabBadge();
}

function resetFilters() {
  AppState.region = "all";
  AppState.searchQuery = "";
  AppState.sortBy = "marketCap";

  const searchInput = document.getElementById("marketSearchInput");
  if (searchInput) searchInput.value = "";
  
  const sortSelect = document.getElementById("sortSelect");
  if (sortSelect) sortSelect.value = "marketCap";

  document.querySelectorAll(".region-tab").forEach(tab => {
    tab.classList.toggle("active", tab.getAttribute("data-region") === "all");
  });

  renderExchanges();
}
