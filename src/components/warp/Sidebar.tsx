import { useState } from "react";
import { CATEGORIES } from "./tools";
import { Home, Search, Sparkles, Menu, X } from "lucide-react";

export function Sidebar({ active, onSelect }: { active: string; onSelect: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const nav = [{ id: "home", label: "Dashboard", icon: Home }, ...CATEGORIES.map(c => ({ id: c.id, label: c.label, icon: c.icon }))];
  return <>
    <button onClick={() => setOpen(true)} className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg glass-strong">
      <Menu className="w-5 h-5" />
    </button>
    <aside className={"fixed lg:sticky top-0 left-0 h-screen z-40 w-64 lg:w-72 transition-transform " + (open ? "translate-x-0" : "-translate-x-full lg:translate-x-0")}>
      <div className="h-full glass-strong border-r border-white/10 p-4 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="relative w-9 h-9 rounded-xl bg-white text-black grid place-items-center font-display font-bold">A
              <div className="absolute inset-0 rounded-xl blur-lg bg-white/40 -z-10" /></div>
            <div>
              <div className="font-display font-bold text-sm tracking-widest">ANORMOUS</div>
              <div className="text-[10px] text-white/50 tracking-[0.3em]">WARP OS</div>
            </div>
          </div>
          <button onClick={() => setOpen(false)} className="lg:hidden p-1.5 rounded-md hover:bg-white/10"><X className="w-4 h-4" /></button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto scrollbar-hide">
          {nav.map(n => {
            const I = n.icon; const a = active === n.id;
            return <button key={n.id} onClick={() => { onSelect(n.id); setOpen(false); }}
              className={"w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all " + (a ? "bg-white text-black font-semibold glow-text" : "text-white/70 hover:bg-white/5 hover:text-white")}>
              <I className="w-4 h-4" />{n.label}
              {a && <Sparkles className="w-3 h-3 ml-auto" />}
            </button>;
          })}
        </nav>
        <div className="mt-4 p-3 rounded-xl glass border border-white/10">
          <div className="text-[10px] text-white/50 tracking-widest mb-1">SYSTEM v1.0</div>
          <div className="text-xs text-white/80">All tools run locally in your browser.</div>
        </div>
      </div>
    </aside>
    {open && <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={() => setOpen(false)} />}
  </>;
}
