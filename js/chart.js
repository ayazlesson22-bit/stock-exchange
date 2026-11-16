/**
 * High-performance, lightweight Canvas & SVG Chart Renderer
 * Zero dependencies, Retina display ready, responsive, and smooth.
 */

// Generate inline SVG sparkline markup for stock exchange cards
function generateSvgSparkline(dataPoints, isPositive, width = 120, height = 36) {
  if (!dataPoints || dataPoints.length < 2) return "";
  
  const min = Math.min(...dataPoints);
  const max = Math.max(...dataPoints);
  const range = max - min || 1;
  const padding = 4;
  const usableWidth = width - padding * 2;
  const usableHeight = height - padding * 2;

  const points = dataPoints.map((val, idx) => {
    const x = padding + (idx / (dataPoints.length - 1)) * usableWidth;
    const y = height - padding - ((val - min) / range) * usableHeight;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const pathD = `M ${points.join(" L ")}`;
  const strokeColor = isPositive ? "#10b981" : "#f43f5e";
  const fillColor = isPositive ? "rgba(16, 185, 129, 0.12)" : "rgba(244, 63, 94, 0.12)";

  // Closed area polygon for soft gradient fill
  const firstX = padding;
  const lastX = width - padding;
  const bottomY = height - 2;
  const areaD = `M ${firstX},${bottomY} L ${points.join(" L ")} L ${lastX},${bottomY} Z`;

  return `
    <svg class="sparkline-svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
      <path d="${areaD}" fill="${fillColor}" />
      <path d="${pathD}" fill="none" stroke="${strokeColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  `;
}

// Modal Interactive Canvas Chart Class
class StockModalChart {
  constructor(canvasId, tooltipId) {
    this.canvas = document.getElementById(canvasId);
    this.tooltip = document.getElementById(tooltipId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    this.data = [];
    this.labels = [];
    this.isPositive = true;
    this.hoverIndex = -1;

    this.bindEvents();
  }

  setData(dataPoints, isPositive = true, labels = null) {
    this.data = dataPoints || [];
    this.isPositive = isPositive;
    this.labels = labels || this.generateDefaultLabels(this.data.length);
    this.hoverIndex = -1;
    this.render();
  }

  generateDefaultLabels(count) {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push(`T-${count - 1 - i}`);
    }
    return arr;
  }

  bindEvents() {
    window.addEventListener("resize", () => {
      if (this.data.length > 0) this.render();
    });

    this.canvas.addEventListener("mousemove", (e) => this.handleHover(e));
    this.canvas.addEventListener("mouseleave", () => this.handleLeave());
    this.canvas.addEventListener("touchmove", (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        this.handleHoverCoord(touch.clientX - rect.left);
      }
    }, { passive: true });
    this.canvas.addEventListener("touchend", () => this.handleLeave());
  }

  handleHover(e) {
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    this.handleHoverCoord(mouseX);
  }

  handleHoverCoord(mouseX) {
    if (!this.data || this.data.length < 2) return;
    const padding = 20;
    const usableWidth = this.canvas.clientWidth - padding * 2;
    const ratio = Math.max(0, Math.min(1, (mouseX - padding) / usableWidth));
    const idx = Math.round(ratio * (this.data.length - 1));

    if (idx !== this.hoverIndex) {
      this.hoverIndex = idx;
      this.render();
      this.updateTooltip();
    }
  }

  handleLeave() {
    this.hoverIndex = -1;
    this.render();
    if (this.tooltip) {
      this.tooltip.style.opacity = "0";
      this.tooltip.style.pointerEvents = "none";
    }
  }

  updateTooltip() {
    if (!this.tooltip || this.hoverIndex < 0 || this.hoverIndex >= this.data.length) return;
    const val = this.data[this.hoverIndex];
    const label = this.labels[this.hoverIndex] || "";

    const padding = 20;
    const usableWidth = this.canvas.clientWidth - padding * 2;
    const posX = padding + (this.hoverIndex / (this.data.length - 1)) * usableWidth;

    this.tooltip.innerHTML = `
      <div class="tooltip-val">${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
      <div class="tooltip-lbl">${label}</div>
    `;

    this.tooltip.style.left = `${posX}px`;
    this.tooltip.style.opacity = "1";
  }

  render() {
    if (!this.canvas || !this.ctx || this.data.length < 2) return;

    // Retina DPI correction
    const dpr = window.devicePixelRatio || 1;
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;

    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.ctx.resetTransform?.();
    this.ctx.scale(dpr, dpr);

    const ctx = this.ctx;
    ctx.clearRect(0, 0, width, height);

    const paddingX = 20;
    const paddingTop = 25;
    const paddingBottom = 30;
    const usableWidth = width - paddingX * 2;
    const usableHeight = height - paddingTop - paddingBottom;

    const min = Math.min(...this.data);
    const max = Math.max(...this.data);
    const range = max - min || 1;

    // Coordinate mapping
    const getPoint = (idx) => {
      const x = paddingX + (idx / (this.data.length - 1)) * usableWidth;
      const y = height - paddingBottom - ((this.data[idx] - min) / range) * usableHeight;
      return { x, y };
    };

    // Draw horizontal grid lines
    ctx.strokeStyle = document.documentElement.getAttribute("data-theme") === "light"
      ? "rgba(0, 0, 0, 0.05)"
      : "rgba(255, 255, 255, 0.06)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);

    for (let i = 0; i <= 3; i++) {
      const gridY = paddingTop + (i / 3) * usableHeight;
      ctx.beginPath();
      ctx.moveTo(paddingX, gridY);
      ctx.lineTo(width - paddingX, gridY);
      ctx.stroke();

      // Label
      const gridVal = max - (i / 3) * range;
      ctx.fillStyle = "rgba(148, 163, 184, 0.7)";
      ctx.font = "11px Inter, -apple-system, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(gridVal.toFixed(1), width - 6, gridY + 3);
    }

    ctx.setLineDash([]); // Reset line dash

    // Draw Gradient Area under curve
    const mainColor = this.isPositive ? "#10b981" : "#f43f5e";
    const gradient = ctx.createLinearGradient(0, paddingTop, 0, height - paddingBottom);
    if (this.isPositive) {
      gradient.addColorStop(0, "rgba(16, 185, 129, 0.28)");
      gradient.addColorStop(1, "rgba(16, 185, 129, 0.0)");
    } else {
      gradient.addColorStop(0, "rgba(244, 63, 94, 0.28)");
      gradient.addColorStop(1, "rgba(244, 63, 94, 0.0)");
    }

    ctx.beginPath();
    const firstPt = getPoint(0);
    ctx.moveTo(firstPt.x, height - paddingBottom);
    ctx.lineTo(firstPt.x, firstPt.y);

    for (let i = 1; i < this.data.length; i++) {
      const pt = getPoint(i);
      ctx.lineTo(pt.x, pt.y);
    }

    const lastPt = getPoint(this.data.length - 1);
    ctx.lineTo(lastPt.x, height - paddingBottom);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw Line Stroke
    ctx.beginPath();
    ctx.moveTo(firstPt.x, firstPt.y);
    for (let i = 1; i < this.data.length; i++) {
      const pt = getPoint(i);
      ctx.lineTo(pt.x, pt.y);
    }
    ctx.strokeStyle = mainColor;
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    // If Hovering, draw vertical crosshair line and active dot
    if (this.hoverIndex >= 0 && this.hoverIndex < this.data.length) {
      const hPt = getPoint(this.hoverIndex);

      // Vertical line
      ctx.beginPath();
      ctx.strokeStyle = "rgba(148, 163, 184, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.moveTo(hPt.x, paddingTop);
      ctx.lineTo(hPt.x, height - paddingBottom);
      ctx.stroke();
      ctx.setLineDash([]);

      // Outer glow
      ctx.beginPath();
      ctx.arc(hPt.x, hPt.y, 6.5, 0, Math.PI * 2);
      ctx.fillStyle = this.isPositive ? "rgba(16, 185, 129, 0.3)" : "rgba(244, 63, 94, 0.3)";
      ctx.fill();

      // Inner dot
      ctx.beginPath();
      ctx.arc(hPt.x, hPt.y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = mainColor;
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }
}
