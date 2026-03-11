import React, { useEffect, useMemo, useRef, useState } from 'react';
import useAuthStore, { ROLES } from '../../store/useAuthStore';
import useDigitalTwinStore from '../../store/useDigitalTwinStore';
import useToastStore from '../../store/useToastStore';

const supportsFinePointer = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(pointer:fine)').matches;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function getThemeMode(uiTheme) {
  if (uiTheme === 'light' || uiTheme === 'dark') return uiTheme;
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  return 'dark';
}

function roleConfig(role, themeMode) {
  const base = {
    ring: themeMode === 'light' ? 'rgba(17,24,39,0.35)' : 'rgba(255,255,255,0.22)',
    dot: themeMode === 'light' ? 'rgba(17,24,39,0.85)' : 'rgba(255,255,255,0.85)',
    glow: themeMode === 'light' ? 'rgba(59,130,246,0.45)' : 'rgba(59,130,246,0.55)',
    alert: 'rgba(239,68,68,0.75)',
  };

  if (role === ROLES.OPERATOR) {
    return { ...base, glow: 'rgba(234,179,8,0.55)' };
  }
  if (role === ROLES.ADMIN) {
    return { ...base, glow: 'rgba(168,85,247,0.55)' };
  }
  return base; // viewer/default
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function RoleCursor() {
  const { user } = useAuthStore();
  const { uiState, alerts } = useDigitalTwinStore();
  const pushToast = useToastStore((s) => s.pushToast);
  const role = user?.role || ROLES.VIEWER;
  const themeMode = useMemo(() => getThemeMode(uiState?.theme), [uiState?.theme]);
  const colors = useMemo(() => roleConfig(role, themeMode), [role, themeMode]);

  const [enabled, setEnabled] = useState(() => supportsFinePointer() && !prefersReducedMotion());
  const [tooltip, setTooltip] = useState(null);
  const [preview, setPreview] = useState(null);

  const rootRef = useRef(null);
  const ringRef = useRef(null);
  const dotRef = useRef(null);
  const trail1Ref = useRef(null);
  const trail2Ref = useRef(null);
  const trail3Ref = useRef(null);
  const tipRef = useRef(null);

  const rafRef = useRef(0);
  const stateRef = useRef({
    x: 0,
    y: 0,
    tx: 0,
    ty: 0,
    vx: 0,
    vy: 0,
    down: false,
    dragging: false,
    hover: false,
    hoverKind: null, // 'chart' | 'kpi' | 'button' | 'control' | 'nav' | ...
    alertModeUntil: 0,
    magnet: null, // { x, y }
    lastMoveAt: 0,
  });

  // React to environment changes (fine pointer / reduced motion).
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const fine = window.matchMedia('(pointer:fine)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setEnabled(fine.matches && !reduce.matches);

    fine.addEventListener?.('change', update);
    reduce.addEventListener?.('change', update);
    return () => {
      fine.removeEventListener?.('change', update);
      reduce.removeEventListener?.('change', update);
    };
  }, []);

  // Hide native cursor only when enabled.
  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add('dt-cursor-enabled');
    return () => document.documentElement.classList.remove('dt-cursor-enabled');
  }, [enabled]);

  // Alert pulse/glow when a new alert appears.
  useEffect(() => {
    if (!enabled) return;
    const s = stateRef.current;
    const prevCount = s._alertCount || 0;
    const nextCount = Array.isArray(alerts) ? alerts.length : 0;
    if (nextCount > prevCount) {
      s.alertModeUntil = Date.now() + 2500;
      const latest = alerts?.[0];
      pushToast({
        type: latest?.severity === 'critical' ? 'error' : 'warning',
        title: 'New realtime alert',
        message: latest?.ruleName || 'A new alert was triggered.',
        durationMs: 2400,
      });
    }
    s._alertCount = nextCount;
  }, [alerts, enabled, pushToast]);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (e) => {
      const s = stateRef.current;
      s.tx = e.clientX;
      s.ty = e.clientY;
      s.lastMoveAt = Date.now();

      // Magnet effect (admin bonus / operator anti-gravity feel).
      const el = e.target?.closest?.('[data-cursor]');
      if (el && el.hasAttribute('data-cursor-magnet')) {
        const r = el.getBoundingClientRect();
        s.magnet = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      } else {
        s.magnet = null;
      }
    };

    const onDown = () => {
      const s = stateRef.current;
      s.down = true;
      s.dragging = false;
    };
    const onUp = () => {
      const s = stateRef.current;
      s.down = false;
      s.dragging = false;
    };

    const onOver = (e) => {
      const el = e.target?.closest?.('[data-cursor]');
      if (!el) return;
      const s = stateRef.current;
      s.hover = true;
      s.hoverKind = el.getAttribute('data-cursor') || 'hover';
      setTooltip(el.getAttribute('data-cursor-tooltip') || null);
      setPreview(el.getAttribute('data-cursor-preview') || null);
    };
    const onOut = (e) => {
      const rel = e.relatedTarget;
      // Only clear when leaving cursor-tracked elements completely.
      if (rel && rel.closest?.('[data-cursor]')) return;
      const s = stateRef.current;
      s.hover = false;
      s.hoverKind = null;
      setTooltip(null);
      setPreview(null);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    window.addEventListener('mouseout', onOut, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mouseout', onOut);
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    const s = stateRef.current;

    // Initialize at center.
    s.x = window.innerWidth / 2;
    s.y = window.innerHeight / 2;
    s.tx = s.x;
    s.ty = s.y;

    const tick = () => {
      const now = Date.now();
      const ring = ringRef.current;
      const dot = dotRef.current;
      const t1 = trail1Ref.current;
      const t2 = trail2Ref.current;
      const t3 = trail3Ref.current;
      const tip = tipRef.current;
      if (!ring || !dot) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const isIdle = now - s.lastMoveAt > 5000;
      const alpha = role === ROLES.OPERATOR ? 0.14 : role === ROLES.ADMIN ? 0.12 : 0.16; // trailing delay

      // Magnetic attraction for admin/important controls; subtle so it never "jumps".
      let mx = 0;
      let my = 0;
      if (s.magnet && (role === ROLES.ADMIN || role === ROLES.OPERATOR)) {
        const dx = s.magnet.x - s.tx;
        const dy = s.magnet.y - s.ty;
        const dist = Math.hypot(dx, dy);
        const strength = role === ROLES.ADMIN ? 0.06 : 0.04;
        const pull = clamp(1 - dist / 240, 0, 1) * strength;
        mx = dx * pull;
        my = dy * pull;
      }

      const targetX = s.tx + mx;
      const targetY = s.ty + my;

      // Smooth follow (no React re-render).
      s.x += (targetX - s.x) * alpha;
      s.y += (targetY - s.y) * alpha;

      const scale =
        s.down && s.hover ? 0.92 : s.hover ? 1.12 : 1;

      const alerting = now < s.alertModeUntil;
      const glow = alerting ? colors.alert : colors.glow;

      const ringSizeBase = role === ROLES.OPERATOR ? 30 : role === ROLES.ADMIN ? 28 : 26;
      const ringSize =
        s.hoverKind === 'chart'
          ? ringSizeBase + 12
          : s.hoverKind === 'kpi'
          ? ringSizeBase + 8
          : s.hoverKind === 'control'
          ? ringSizeBase + 10
          : ringSizeBase;

      ring.style.transform = `translate3d(${s.x - ringSize / 2}px, ${s.y - ringSize / 2}px, 0) scale(${scale})`;
      ring.style.width = `${ringSize}px`;
      ring.style.height = `${ringSize}px`;
      ring.style.boxShadow = `0 0 ${alerting ? 26 : 18}px ${glow}`;
      ring.style.borderColor = colors.ring;
      ring.style.opacity = isIdle ? '0' : '1';

      dot.style.transform = `translate3d(${s.tx - 3}px, ${s.ty - 3}px, 0)`;
      dot.style.background = colors.dot;
      dot.style.opacity = isIdle ? '0' : '1';

      // Trail dots (operator/admin) – very cheap.
      const showTrail = role !== ROLES.VIEWER;
      const trailOpacity = showTrail ? (alerting ? 0.95 : 0.55) : 0;
      if (t1 && t2 && t3) {
        t1.style.opacity = String(trailOpacity);
        t2.style.opacity = String(trailOpacity * 0.8);
        t3.style.opacity = String(trailOpacity * 0.6);
        t1.style.transform = `translate3d(${s.x - 2}px, ${s.y - 2}px, 0)`;
        t2.style.transform = `translate3d(${s.x - 10}px, ${s.y - 10}px, 0)`;
        t3.style.transform = `translate3d(${s.x - 18}px, ${s.y - 18}px, 0)`;
        t1.style.boxShadow = `0 0 ${alerting ? 14 : 10}px ${glow}`;
      }

      // Tooltip near cursor for chart/KPI.
      if (tip) {
        const showTip = !!(tooltip || preview);
        tip.style.opacity = showTip && !isIdle ? '1' : '0';
        tip.style.transform = `translate3d(${clamp(s.tx + 14, 10, window.innerWidth - 260)}px, ${clamp(
          s.ty + 14,
          10,
          window.innerHeight - 120
        )}px, 0)`;
        tip.style.borderColor = colors.ring;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [enabled, role, colors, tooltip, preview]);

  if (!enabled) return null;

  return (
    <div ref={rootRef} className="pointer-events-none fixed inset-0 z-[80]">
      {/* Ring */}
      <div
        ref={ringRef}
        className="absolute rounded-full border bg-white/0 backdrop-blur-[1px] will-change-transform"
      />
      {/* Dot */}
      <div ref={dotRef} className="absolute w-[6px] h-[6px] rounded-full will-change-transform" />

      {/* Trail */}
      <div ref={trail1Ref} className="absolute w-[4px] h-[4px] rounded-full will-change-transform bg-white/80" />
      <div ref={trail2Ref} className="absolute w-[3px] h-[3px] rounded-full will-change-transform bg-white/70" />
      <div ref={trail3Ref} className="absolute w-[2px] h-[2px] rounded-full will-change-transform bg-white/60" />

      {/* Tooltip / preview */}
      <div
        ref={tipRef}
        className="absolute max-w-[240px] rounded-xl border bg-gray-900/80 text-white shadow-2xl backdrop-blur-xl px-3 py-2 opacity-0 transition-opacity duration-100"
      >
        {tooltip ? <div className="text-xs font-semibold text-white">{tooltip}</div> : null}
        {preview ? <div className="text-[11px] text-gray-200/80 mt-0.5">{preview}</div> : null}
      </div>
    </div>
  );
}

export default RoleCursor;

