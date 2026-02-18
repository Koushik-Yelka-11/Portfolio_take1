
(function () {
  // ── Ellipse dimensions ──────────────────────────────────────────
  const RX = 500;    // half-width  of the ellipse path (px)
  const RY = 150;    // half-height of the ellipse path (px)
  const SPEED = 0.0003; // radians per millisecond  (adjust to taste)

  // ── Collect all icon elements ───────────────────────────────────
  const items = Array.from(document.querySelectorAll('.icon-item'));
  const total = items.length; // 26

  // Assign each icon a starting angle evenly around the ellipse
  const angles = items.map((_, i) => (i / total) * 2 * Math.PI);

  // ── Avatar fallback ─────────────────────────────────────────────
  const avatarImg = document.getElementById('avatarImg');
  avatarImg.onerror = function () {
    document.getElementById('avatarWrap').innerHTML =
      '<div class="avatar-fallback">🧑🏻‍💻</div>';
  };

  // ── Icon image fallback ─────────────────────────────────────────
  items.forEach(item => {
    const img = item.querySelector('img');
    img.onerror = function () {
      // Show initials if image missing
      const label = item.getAttribute('data-label') || '?';
      const abbr  = label.slice(0, 2).toUpperCase();
      item.innerHTML =
        `<span style="color:#fff;font-family:'DM Sans',sans-serif;font-size:0.65rem;font-weight:700;letter-spacing:0.02em;">${abbr}</span>`;
    };
  });

  // ── Animation loop ──────────────────────────────────────────────
  let lastTime = null;

  function frame(ts) {
    if (lastTime === null) lastTime = ts;
    const dt = ts - lastTime;
    lastTime = ts;

    angles.forEach((angle, i) => {
      angles[i] = angle + SPEED * dt;
    });

    items.forEach((el, i) => {
      const a = angles[i];
      const x = RX * Math.cos(a);
      const y = RY * Math.sin(a);

      // Depth: icons at the bottom (sin > 0) are "closer" → scale up slightly
      const depth = (Math.sin(a) + 1) / 2; // 0 … 1
      const scale = 0.80 + 0.28 * depth;
      const opacity = 0.70 + 0.30 * depth;
      const zIndex  = Math.round(1 + 18 * depth);

      el.style.transform = `translate(calc(-50% + ${x.toFixed(2)}px), calc(-50% + ${y.toFixed(2)}px)) scale(${scale.toFixed(3)})`;
      el.style.opacity   = opacity.toFixed(2);
      el.style.zIndex    = zIndex;
    });

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
})();
