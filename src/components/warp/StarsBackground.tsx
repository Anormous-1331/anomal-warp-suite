import { useEffect, useRef } from "react";

export function StarsBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    let w = 0, h = 0;
    type Star = { x: number; y: number; z: number; r: number; t: number; s: number };
    let stars: Star[] = [];

    const resize = () => {
      w = canvas.width = window.innerWidth * devicePixelRatio;
      h = canvas.height = window.innerHeight * devicePixelRatio;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      const count = Math.floor((window.innerWidth * window.innerHeight) / 4000);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random(),
        r: Math.random() * 1.4 + 0.2,
        t: Math.random() * Math.PI * 2,
        s: Math.random() * 0.02 + 0.005,
      }));
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const st of stars) {
        st.t += st.s;
        const tw = (Math.sin(st.t) + 1) / 2;
        const a = 0.15 + tw * 0.85 * st.z;
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.r * devicePixelRatio * (0.6 + st.z * 0.8), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.shadowColor = "rgba(255,255,255,0.8)";
        ctx.shadowBlur = 8 * st.z;
        ctx.fill();
        st.y += 0.05 * st.z * devicePixelRatio;
        if (st.y > h) { st.y = 0; st.x = Math.random() * w; }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <canvas ref={ref} className="absolute inset-0" />
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-white/10 blur-[120px] animate-glow-pulse" />
      <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-white/5 blur-[100px]" />
    </div>
  );
}
