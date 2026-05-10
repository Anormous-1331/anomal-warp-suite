import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { StarsBackground } from "@/components/warp/StarsBackground";
import { Sidebar } from "@/components/warp/Sidebar";
import { CATEGORIES, ALL_TOOLS, type ToolKey } from "@/components/warp/tools";
import { ToolView } from "@/components/warp/ToolView";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Search, ArrowRight, X } from "lucide-react";
import heroImg from "@/assets/minecraft-hero.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ANORMOUS WARP — Futuristic Toolbox OS" },
      { name: "description", content: "ANORMOUS WARP: a futuristic, browser-based toolbox of media, Minecraft, developer, gaming and creator tools. Beautifully crafted, always free." },
      { property: "og:title", content: "ANORMOUS WARP — Futuristic Toolbox OS" },
      { property: "og:description", content: "Massive futuristic browser toolbox with media, Minecraft, developer, gaming and creator tools." },
    ],
  }),
  component: Index,
});

function Index() {
  const [section, setSection] = useState("home");
  const [q, setQ] = useState("");
  const [active, setActive] = useState<ToolKey | null>(null);

  const visibleCats = section === "home" ? CATEGORIES : CATEGORIES.filter(c => c.id === section);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase(); if (!s) return [];
    return ALL_TOOLS.filter(t => t.name.toLowerCase().includes(s) || t.desc.toLowerCase().includes(s) || t.catLabel.toLowerCase().includes(s)).slice(0, 8);
  }, [q]);

  const activeTool = active ? ALL_TOOLS.find(t => t.key === active) : null;

  return (
    <div className="relative min-h-screen text-white">
      <StarsBackground />
      <div className="relative z-10 flex">
        <Sidebar active={section} onSelect={setSection} />
        <main className="flex-1 min-w-0">
          {section === "home" && <Hero q={q} setQ={setQ} results={results} onPick={k => { setActive(k); setQ(""); }} />}
          <div className="px-4 sm:px-8 lg:px-12 pb-24 max-w-7xl mx-auto space-y-16">
            {visibleCats.map((c, ci) => (
              <section key={c.id} className="animate-fade-up" style={{ animationDelay: `${ci * 80}ms` }}>
                <div className="flex items-end justify-between mb-6">
                  <div>
                    <div className="text-[10px] tracking-[0.3em] text-white/50">CATEGORY · {String(ci + 1).padStart(2, "0")}</div>
                    <h2 className="font-display text-3xl md:text-4xl font-bold mt-1">{c.label}</h2>
                  </div>
                  <div className="text-xs text-white/50 hidden sm:block">{c.tools.length} tools</div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {c.tools.map(t => {
                    const I = t.icon;
                    return (
                      <button key={t.key + c.id} onClick={() => setActive(t.key)}
                        className="group relative text-left glass rounded-2xl p-5 glow-border-hover overflow-hidden">
                        <div className={`absolute -top-20 -right-20 w-44 h-44 rounded-full bg-gradient-to-br ${c.accent} blur-3xl opacity-60 group-hover:opacity-100 transition`} />
                        <div className="relative">
                          <div className="w-11 h-11 rounded-xl glass-strong grid place-items-center mb-4 group-hover:scale-110 transition-transform">
                            <I className="w-5 h-5" />
                          </div>
                          <div className="font-display font-semibold tracking-wide">{t.name}</div>
                          <div className="text-xs text-white/60 mt-1 line-clamp-2">{t.desc}</div>
                          <div className="mt-4 flex items-center gap-1.5 text-xs text-white/70 opacity-0 group-hover:opacity-100 transition">
                            Launch <ArrowRight className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
          <Footer />
        </main>
      </div>

      <Dialog open={!!active} onOpenChange={o => !o && setActive(null)}>
        <DialogContent className="max-w-2xl bg-background/95 border-white/10 backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl flex items-center gap-3">
              {activeTool && <activeTool.icon className="w-5 h-5" />}
              {activeTool?.name}
            </DialogTitle>
            <div className="text-xs text-white/60">{activeTool?.desc}</div>
          </DialogHeader>
          <div className="mt-2 max-h-[75vh] overflow-auto pr-2">
            {active && <ToolView k={active} />}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Hero({ q, setQ, results, onPick }: { q: string; setQ: (s: string) => void; results: typeof ALL_TOOLS; onPick: (k: ToolKey) => void }) {
  return (
    <section className="relative px-4 sm:px-8 lg:px-12 pt-16 lg:pt-20 pb-12 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10 items-center">
        <div className="space-y-6 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-[11px] tracking-widest text-white/70">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> SYSTEM ONLINE · {ALL_TOOLS.length} TOOLS LOADED
          </div>
          <h1 className="font-display font-black text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] tracking-tight">
            <span className="block text-shimmer">ANORMOUS</span>
            <span className="block text-white glow-text">WELCOMES U</span>
          </h1>
          <p className="text-white/60 text-lg max-w-xl">
            A futuristic operating system of <b className="text-white">{ALL_TOOLS.length}+ browser tools</b> for creators, developers and Minecraft players. No installs. No accounts. Just power.
          </p>
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search tools — try 'gradient', 'crosshair', 'mp4'..."
              className="w-full pl-11 pr-10 py-4 rounded-2xl glass-strong glow-border focus:outline-none focus:ring-2 focus:ring-white/30 placeholder:text-white/40" />
            {q && <button onClick={() => setQ("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-white/10"><X className="w-4 h-4" /></button>}
            {results.length > 0 && (
              <div className="absolute top-full mt-2 left-0 right-0 glass-strong rounded-2xl overflow-hidden z-20 animate-scale-in">
                {results.map(r => {
                  const I = r.icon;
                  return <button key={r.key + r.cat} onClick={() => onPick(r.key)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 text-left">
                    <I className="w-4 h-4 text-white/70" /><div className="flex-1"><div className="text-sm font-medium">{r.name}</div><div className="text-xs text-white/50">{r.catLabel}</div></div>
                    <ArrowRight className="w-3.5 h-3.5 text-white/40" /></button>;
                })}
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            {["Minecraft", "Media", "Developer", "Gaming", "Creator"].map(t =>
              <span key={t} className="px-3 py-1 rounded-full glass border border-white/10">{t}</span>)}
          </div>
        </div>
        <div className="relative h-[420px] lg:h-[520px] grid place-items-center">
          <div className="absolute inset-0 grid place-items-center">
            <div className="w-80 h-80 rounded-full border border-white/10 animate-[warp-spin_30s_linear_infinite]" />
            <div className="absolute w-[26rem] h-[26rem] rounded-full border border-white/5 animate-[warp-spin_50s_linear_infinite_reverse]" />
            <div className="absolute w-72 h-72 rounded-full bg-white/10 blur-3xl animate-glow-pulse" />
          </div>
          <img src={heroImg} alt="Minecraft hero" width={500} height={500} className="relative z-10 max-h-full object-contain animate-float drop-shadow-[0_0_60px_rgba(255,255,255,0.25)]" />
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/5 mt-12 px-4 sm:px-8 lg:px-12 py-10 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
        <div className="font-display tracking-widest">ANORMOUS WARP · v1.0</div>
        <div>Built for creators · 100% browser-based · No data leaves your device</div>
      </div>
    </footer>
  );
}
