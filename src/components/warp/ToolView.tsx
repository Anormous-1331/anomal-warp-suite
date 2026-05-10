import { useEffect, useMemo, useRef, useState } from "react";
import type { ToolKey } from "./tools";

const Btn = ({ children, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button {...p} className={"px-4 py-2 rounded-lg glass-strong text-sm font-medium hover:bg-white/10 transition-all border border-white/10 disabled:opacity-50 " + (p.className ?? "")}>{children}</button>
);
const Input = (p: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...p} className={"w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/10 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition text-sm " + (p.className ?? "")} />
);
const TA = (p: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea {...p} className={"w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/10 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition text-sm font-mono " + (p.className ?? "")} />
);

const Section = ({ children }: { children: React.ReactNode }) => (
  <div className="space-y-4">{children}</div>
);

// ---- Helpers ----
const downloadBlob = (b: Blob, name: string) => {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(b);
  a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
};

// ---------------- Tools -----------------

function Base64Tool() {
  const [v, setV] = useState(""); const [out, setOut] = useState("");
  return <Section>
    <TA rows={5} placeholder="Enter text..." value={v} onChange={e => setV(e.target.value)} />
    <div className="flex gap-2">
      <Btn onClick={() => setOut(btoa(unescape(encodeURIComponent(v))))}>Encode</Btn>
      <Btn onClick={() => { try { setOut(decodeURIComponent(escape(atob(v)))); } catch { setOut("Invalid Base64"); } }}>Decode</Btn>
      <Btn onClick={() => navigator.clipboard.writeText(out)}>Copy</Btn>
    </div>
    <TA rows={5} value={out} readOnly />
  </Section>;
}

function JsonFormatTool() {
  const [v, setV] = useState(""); const [out, setOut] = useState(""); const [err, setErr] = useState("");
  const fmt = (n: number) => { try { setOut(JSON.stringify(JSON.parse(v), null, n)); setErr(""); } catch (e: any) { setErr(e.message); setOut(""); } };
  return <Section>
    <TA rows={6} placeholder='{"hello":"world"}' value={v} onChange={e => setV(e.target.value)} />
    <div className="flex gap-2"><Btn onClick={() => fmt(2)}>Format</Btn><Btn onClick={() => fmt(0)}>Minify</Btn></div>
    {err && <div className="text-rose-400 text-sm">{err}</div>}
    <TA rows={8} value={out} readOnly />
  </Section>;
}

function PasswordTool() {
  const [len, setLen] = useState(20);
  const [opts, setOpts] = useState({ U: true, l: true, n: true, s: true });
  const [out, setOut] = useState("");
  const gen = () => {
    const sets = [opts.U && "ABCDEFGHIJKLMNOPQRSTUVWXYZ", opts.l && "abcdefghijklmnopqrstuvwxyz", opts.n && "0123456789", opts.s && "!@#$%^&*()-_=+[]{}<>?"].filter(Boolean) as string[];
    const all = sets.join(""); if (!all) return;
    const arr = new Uint32Array(len); crypto.getRandomValues(arr);
    setOut(Array.from(arr, n => all[n % all.length]).join(""));
  };
  useEffect(gen, [len, opts]);
  return <Section>
    <div className="flex items-center gap-3"><label className="text-sm text-white/70">Length: {len}</label>
      <input type="range" min={6} max={64} value={len} onChange={e => setLen(+e.target.value)} className="flex-1" /></div>
    <div className="flex flex-wrap gap-2 text-sm">
      {(["U", "l", "n", "s"] as const).map(k =>
        <label key={k} className="flex items-center gap-2 px-3 py-1.5 glass rounded-lg cursor-pointer">
          <input type="checkbox" checked={opts[k]} onChange={e => setOpts({ ...opts, [k]: e.target.checked })} />
          {{ U: "A-Z", l: "a-z", n: "0-9", s: "Symbols" }[k]}
        </label>)}
    </div>
    <div className="flex gap-2"><Btn onClick={gen}>Regenerate</Btn><Btn onClick={() => navigator.clipboard.writeText(out)}>Copy</Btn></div>
    <div className="px-4 py-3 rounded-lg glass font-mono text-lg break-all">{out}</div>
  </Section>;
}

function UuidTool() {
  const [list, setList] = useState<string[]>([crypto.randomUUID()]);
  const [n, setN] = useState(5);
  return <Section>
    <div className="flex gap-2 items-center">
      <Input type="number" value={n} onChange={e => setN(+e.target.value)} className="w-32" />
      <Btn onClick={() => setList(Array.from({ length: n }, () => crypto.randomUUID()))}>Generate</Btn>
      <Btn onClick={() => navigator.clipboard.writeText(list.join("\n"))}>Copy All</Btn>
    </div>
    <TA rows={8} value={list.join("\n")} readOnly />
  </Section>;
}

function GradientTool() {
  const [c1, setC1] = useState("#ffffff"); const [c2, setC2] = useState("#000000"); const [angle, setAngle] = useState(135);
  const css = `background: linear-gradient(${angle}deg, ${c1}, ${c2});`;
  return <Section>
    <div className="grid grid-cols-3 gap-3">
      <div><label className="text-xs text-white/60">Color 1</label><Input type="color" value={c1} onChange={e => setC1(e.target.value)} /></div>
      <div><label className="text-xs text-white/60">Color 2</label><Input type="color" value={c2} onChange={e => setC2(e.target.value)} /></div>
      <div><label className="text-xs text-white/60">Angle: {angle}°</label><input type="range" min={0} max={360} value={angle} onChange={e => setAngle(+e.target.value)} className="w-full mt-2" /></div>
    </div>
    <div className="h-48 rounded-xl glow-border" style={{ background: `linear-gradient(${angle}deg, ${c1}, ${c2})` }} />
    <div className="flex gap-2"><pre className="flex-1 px-4 py-2 glass rounded-lg text-xs overflow-auto">{css}</pre><Btn onClick={() => navigator.clipboard.writeText(css)}>Copy</Btn></div>
  </Section>;
}

function ColorPickerTool() {
  const [c, setC] = useState("#7c3aed");
  const hex = c.replace("#", ""); const r = parseInt(hex.slice(0, 2), 16); const g = parseInt(hex.slice(2, 4), 16); const b = parseInt(hex.slice(4, 6), 16);
  const max = Math.max(r, g, b), min = Math.min(r, g, b); let h = 0; const s = max === 0 ? 0 : (max - min) / max; const v = max / 255;
  if (max !== min) { const d = max - min; h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; }
  return <Section>
    <Input type="color" value={c} onChange={e => setC(e.target.value)} className="h-32" />
    <div className="grid grid-cols-3 gap-3 text-sm">
      <div className="glass p-3 rounded-lg"><div className="text-white/50 text-xs">HEX</div>{c.toUpperCase()}</div>
      <div className="glass p-3 rounded-lg"><div className="text-white/50 text-xs">RGB</div>{r}, {g}, {b}</div>
      <div className="glass p-3 rounded-lg"><div className="text-white/50 text-xs">HSV</div>{Math.round(h)}, {Math.round(s * 100)}%, {Math.round(v * 100)}%</div>
    </div>
  </Section>;
}

function HtmlPrevTool() {
  const [v, setV] = useState("<h1 style='color:white;font-family:sans-serif'>Hello World</h1>");
  return <Section>
    <TA rows={6} value={v} onChange={e => setV(e.target.value)} />
    <iframe sandbox="" srcDoc={v} className="w-full h-72 rounded-lg bg-white" />
  </Section>;
}

function MinifierTool({ kind }: { kind: "css" | "js" }) {
  const [v, setV] = useState(""); const [out, setOut] = useState("");
  const minify = () => {
    if (kind === "css") setOut(v.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").replace(/\s*([{}:;,>])\s*/g, "$1").trim());
    else setOut(v.replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").trim());
  };
  return <Section>
    <TA rows={6} value={v} onChange={e => setV(e.target.value)} placeholder={`Paste ${kind.toUpperCase()}...`} />
    <div className="flex gap-2"><Btn onClick={minify}>Minify</Btn><Btn onClick={() => navigator.clipboard.writeText(out)}>Copy</Btn>
      <span className="text-xs text-white/50 self-center">{out.length} chars ({v.length ? Math.round((1 - out.length / v.length) * 100) : 0}% smaller)</span></div>
    <TA rows={6} value={out} readOnly />
  </Section>;
}

// ---- Media (image based) ----
function ImageCompressTool() {
  const [src, setSrc] = useState<string>(); const [q, setQ] = useState(0.7); const [out, setOut] = useState<{ url: string; size: number; orig: number; }>();
  const onFile = (f?: File) => { if (!f) return; const r = new FileReader(); r.onload = () => setSrc(r.result as string); r.readAsDataURL(f); };
  const compress = async () => {
    if (!src) return; const img = new Image(); img.src = src; await img.decode();
    const c = document.createElement("canvas"); c.width = img.width; c.height = img.height;
    c.getContext("2d")!.drawImage(img, 0, 0);
    c.toBlob(b => { if (!b) return; const url = URL.createObjectURL(b); setOut({ url, size: b.size, orig: src.length * 0.75 }); }, "image/jpeg", q);
  };
  return <Section>
    <Input type="file" accept="image/*" onChange={e => onFile(e.target.files?.[0])} />
    <div><label className="text-xs text-white/60">Quality: {Math.round(q * 100)}%</label>
      <input type="range" min={0.1} max={1} step={0.05} value={q} onChange={e => setQ(+e.target.value)} className="w-full" /></div>
    <Btn onClick={compress} disabled={!src}>Compress</Btn>
    {out && <>
      <img src={out.url} alt="" className="rounded-lg max-h-64 mx-auto" />
      <div className="text-sm text-white/70">Size: {(out.size / 1024).toFixed(1)} KB</div>
      <a href={out.url} download="compressed.jpg"><Btn>Download</Btn></a>
    </>}
  </Section>;
}

function ImageResizeTool() {
  const [src, setSrc] = useState<HTMLImageElement>(); const [w, setW] = useState(800); const [h, setH] = useState(600); const [out, setOut] = useState<string>();
  const onFile = (f?: File) => { if (!f) return; const r = new FileReader(); r.onload = () => { const i = new Image(); i.onload = () => { setSrc(i); setW(i.width); setH(i.height); }; i.src = r.result as string; }; r.readAsDataURL(f); };
  const run = () => { if (!src) return; const c = document.createElement("canvas"); c.width = w; c.height = h; c.getContext("2d")!.drawImage(src, 0, 0, w, h); setOut(c.toDataURL()); };
  return <Section>
    <Input type="file" accept="image/*" onChange={e => onFile(e.target.files?.[0])} />
    <div className="grid grid-cols-2 gap-2">
      <Input type="number" value={w} onChange={e => setW(+e.target.value)} placeholder="Width" />
      <Input type="number" value={h} onChange={e => setH(+e.target.value)} placeholder="Height" />
    </div>
    <Btn onClick={run} disabled={!src}>Resize</Btn>
    {out && <><img src={out} alt="" className="rounded-lg max-h-64 mx-auto" /><a href={out} download="resized.png"><Btn>Download</Btn></a></>}
  </Section>;
}

function ImageConvertTool() {
  const [src, setSrc] = useState<HTMLImageElement>(); const [fmt, setFmt] = useState<"png" | "jpeg" | "webp">("png"); const [out, setOut] = useState<string>();
  const onFile = (f?: File) => { if (!f) return; const r = new FileReader(); r.onload = () => { const i = new Image(); i.onload = () => setSrc(i); i.src = r.result as string; }; r.readAsDataURL(f); };
  const run = () => { if (!src) return; const c = document.createElement("canvas"); c.width = src.width; c.height = src.height; c.getContext("2d")!.drawImage(src, 0, 0); setOut(c.toDataURL("image/" + fmt, 0.92)); };
  return <Section>
    <Input type="file" accept="image/*" onChange={e => onFile(e.target.files?.[0])} />
    <select value={fmt} onChange={e => setFmt(e.target.value as any)} className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/10">
      <option value="png">PNG</option><option value="jpeg">JPG</option><option value="webp">WEBP</option>
    </select>
    <Btn onClick={run} disabled={!src}>Convert</Btn>
    {out && <a href={out} download={"converted." + fmt}><Btn>Download</Btn></a>}
  </Section>;
}

// ---- Video / audio ----
function VideoSpeedTool() {
  const ref = useRef<HTMLVideoElement>(null); const [src, setSrc] = useState<string>(); const [s, setS] = useState(1);
  useEffect(() => { if (ref.current) ref.current.playbackRate = s; }, [s]);
  return <Section>
    <Input type="file" accept="video/*" onChange={e => { const f = e.target.files?.[0]; if (f) setSrc(URL.createObjectURL(f)); }} />
    {src && <video ref={ref} src={src} controls className="w-full rounded-lg" />}
    <div><label className="text-xs text-white/60">Speed: {s}×</label>
      <input type="range" min={0.25} max={4} step={0.25} value={s} onChange={e => setS(+e.target.value)} className="w-full" /></div>
  </Section>;
}

function VideoTrimTool() {
  const ref = useRef<HTMLVideoElement>(null); const [src, setSrc] = useState<string>(); const [a, setA] = useState(0); const [b, setB] = useState(10); const [d, setD] = useState(0);
  return <Section>
    <Input type="file" accept="video/*" onChange={e => { const f = e.target.files?.[0]; if (f) setSrc(URL.createObjectURL(f)); }} />
    {src && <video ref={ref} src={src} controls className="w-full rounded-lg" onLoadedMetadata={e => { setD(e.currentTarget.duration); setB(e.currentTarget.duration); }} />}
    <div className="grid grid-cols-2 gap-2">
      <div><label className="text-xs text-white/60">Start: {a.toFixed(1)}s</label><input type="range" min={0} max={d} step={0.1} value={a} onChange={e => setA(+e.target.value)} className="w-full" /></div>
      <div><label className="text-xs text-white/60">End: {b.toFixed(1)}s</label><input type="range" min={0} max={d} step={0.1} value={b} onChange={e => setB(+e.target.value)} className="w-full" /></div>
    </div>
    <Btn onClick={() => { if (ref.current) { ref.current.currentTime = a; ref.current.play(); setTimeout(() => ref.current?.pause(), (b - a) * 1000); } }}>Preview Trim</Btn>
    <p className="text-xs text-white/50">Browser preview only — for export, use a server tool.</p>
  </Section>;
}

function AudioCutTool() {
  const ref = useRef<HTMLAudioElement>(null); const [src, setSrc] = useState<string>();
  return <Section>
    <Input type="file" accept="audio/*" onChange={e => { const f = e.target.files?.[0]; if (f) setSrc(URL.createObjectURL(f)); }} />
    {src && <audio ref={ref} src={src} controls className="w-full" />}
    <p className="text-xs text-white/50">Use the audio scrub bar to choose your section, then download original to edit further.</p>
  </Section>;
}

function PdfViewTool() {
  const [src, setSrc] = useState<string>();
  return <Section>
    <Input type="file" accept="application/pdf" onChange={e => { const f = e.target.files?.[0]; if (f) setSrc(URL.createObjectURL(f)); }} />
    {src && <iframe src={src} className="w-full h-[60vh] rounded-lg bg-white" />}
  </Section>;
}

function ZipExtractTool() {
  const [items, setItems] = useState<{ name: string; size: number }[]>([]);
  const onFile = async (f?: File) => {
    if (!f) return;
    const buf = await f.arrayBuffer();
    const dv = new DataView(buf); const u8 = new Uint8Array(buf);
    const list: { name: string; size: number }[] = [];
    // central directory minimal parser (signature 0x02014b50)
    for (let i = u8.length - 22; i >= 0; i--) {
      if (dv.getUint32(i, true) === 0x06054b50) {
        const cdOff = dv.getUint32(i + 16, true); const cdNum = dv.getUint16(i + 10, true);
        let p = cdOff;
        for (let n = 0; n < cdNum; n++) {
          const nameLen = dv.getUint16(p + 28, true); const extra = dv.getUint16(p + 30, true); const cmt = dv.getUint16(p + 32, true);
          const size = dv.getUint32(p + 24, true);
          const name = new TextDecoder().decode(u8.slice(p + 46, p + 46 + nameLen));
          list.push({ name, size });
          p += 46 + nameLen + extra + cmt;
        }
        break;
      }
    }
    setItems(list);
  };
  return <Section>
    <Input type="file" accept=".zip,.mcpack" onChange={e => onFile(e.target.files?.[0])} />
    <div className="max-h-72 overflow-auto glass rounded-lg">
      {items.map((i, k) => <div key={k} className="flex justify-between px-3 py-1.5 text-sm border-b border-white/5"><span className="truncate">{i.name}</span><span className="text-white/50">{(i.size / 1024).toFixed(1)}KB</span></div>)}
      {!items.length && <div className="p-4 text-white/50 text-sm">Upload a .zip or .mcpack to list contents.</div>}
    </div>
  </Section>;
}

function Mp4ToGifTool() {
  const ref = useRef<HTMLVideoElement>(null); const [src, setSrc] = useState<string>(); const [out, setOut] = useState<string>();
  const capture = async () => {
    const v = ref.current; if (!v) return;
    const c = document.createElement("canvas"); c.width = 320; c.height = 320 * v.videoHeight / v.videoWidth;
    const ctx = c.getContext("2d")!;
    ctx.drawImage(v, 0, 0, c.width, c.height);
    setOut(c.toDataURL("image/png"));
  };
  return <Section>
    <Input type="file" accept="video/*" onChange={e => { const f = e.target.files?.[0]; if (f) setSrc(URL.createObjectURL(f)); }} />
    {src && <video ref={ref} src={src} controls className="w-full rounded-lg" />}
    <Btn onClick={capture} disabled={!src}>Capture Frame</Btn>
    {out && <a href={out} download="frame.png"><img src={out} className="rounded-lg max-h-48" /></a>}
    <p className="text-xs text-white/50">Frame export. Full GIF encoding requires ffmpeg.wasm — coming soon.</p>
  </Section>;
}

function Mp4ToMp3Tool() {
  const [src, setSrc] = useState<string>();
  return <Section>
    <Input type="file" accept="video/*" onChange={e => { const f = e.target.files?.[0]; if (f) setSrc(URL.createObjectURL(f)); }} />
    {src && <>
      <video src={src} controls className="w-full rounded-lg" />
      <p className="text-xs text-white/50">Right-click the video → "Save audio" or use a desktop ffmpeg for full MP3 export.</p>
    </>}
  </Section>;
}

// ---- Minecraft ----
function McMetaTool() {
  const [pf, setPf] = useState(15); const [desc, setDesc] = useState("My Pack");
  const json = JSON.stringify({ pack: { pack_format: pf, description: desc } }, null, 2);
  return <Section>
    <div className="grid grid-cols-2 gap-2">
      <Input type="number" value={pf} onChange={e => setPf(+e.target.value)} placeholder="Pack Format" />
      <Input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Description" />
    </div>
    <pre className="glass p-4 rounded-lg text-sm whitespace-pre-wrap">{json}</pre>
    <Btn onClick={() => downloadBlob(new Blob([json], { type: "application/json" }), "pack.mcmeta")}>Download pack.mcmeta</Btn>
  </Section>;
}

function McpackZipTool({ to }: { to: "zip" | "mcpack" }) {
  const [name, setName] = useState<string>();
  return <Section>
    <Input type="file" accept={to === "zip" ? ".mcpack" : ".zip"} onChange={async e => {
      const f = e.target.files?.[0]; if (!f) return;
      const newName = f.name.replace(to === "zip" ? /\.mcpack$/i : /\.zip$/i, "." + to);
      downloadBlob(new Blob([await f.arrayBuffer()]), newName); setName(newName);
    }} />
    <p className="text-sm text-white/60">Just renames the extension — content is identical between .zip and .mcpack.</p>
    {name && <div className="text-emerald-300 text-sm">✓ Downloaded {name}</div>}
  </Section>;
}

function MotdTool() {
  const codes: [string, string][] = [["0", "#000000"], ["1", "#0000AA"], ["2", "#00AA00"], ["3", "#00AAAA"], ["4", "#AA0000"], ["5", "#AA00AA"], ["6", "#FFAA00"], ["7", "#AAAAAA"], ["8", "#555555"], ["9", "#5555FF"], ["a", "#55FF55"], ["b", "#55FFFF"], ["c", "#FF5555"], ["d", "#FF55FF"], ["e", "#FFFF55"], ["f", "#FFFFFF"]];
  const [v, setV] = useState("§6Welcome to §bAnormous §fServer\n§7Have fun!");
  const render = () => {
    const out: React.ReactNode[] = []; let color = "#fff", bold = false; let buf = "";
    const flush = (k: number) => { if (buf) out.push(<span key={k} style={{ color, fontWeight: bold ? "bold" : "normal" }}>{buf}</span>); buf = ""; };
    let i = 0; let key = 0;
    while (i < v.length) {
      if (v[i] === "§" && i + 1 < v.length) { flush(key++); const c = v[i + 1]; const cm = codes.find(x => x[0] === c); if (cm) color = cm[1]; if (c === "l") bold = true; if (c === "r") { color = "#fff"; bold = false; } i += 2; }
      else if (v[i] === "\n") { flush(key++); out.push(<br key={key++} />); i++; }
      else { buf += v[i++]; }
    }
    flush(key++); return out;
  };
  return <Section>
    <TA rows={4} value={v} onChange={e => setV(e.target.value)} />
    <div className="text-xs text-white/50">Use § followed by 0-9, a-f for colors. §l = bold, §r = reset.</div>
    <div className="glass p-4 rounded-lg font-mono text-lg bg-black/60">{render()}</div>
  </Section>;
}

function ServerIconTool() {
  const [src, setSrc] = useState<string>();
  const onFile = (f?: File) => {
    if (!f) return; const r = new FileReader(); r.onload = () => {
      const img = new Image(); img.onload = () => {
        const c = document.createElement("canvas"); c.width = 64; c.height = 64;
        c.getContext("2d")!.drawImage(img, 0, 0, 64, 64);
        setSrc(c.toDataURL("image/png"));
      }; img.src = r.result as string;
    }; r.readAsDataURL(f);
  };
  return <Section>
    <Input type="file" accept="image/*" onChange={e => onFile(e.target.files?.[0])} />
    {src && <><img src={src} className="rounded-lg" style={{ imageRendering: "pixelated", width: 192, height: 192 }} /><a href={src} download="server-icon.png"><Btn>Download server-icon.png</Btn></a></>}
  </Section>;
}

function CrosshairTool() {
  const [size, setSize] = useState(24); const [thick, setThick] = useState(2); const [gap, setGap] = useState(6); const [color, setColor] = useState("#ffffff");
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!; c.width = 256; c.height = 256; const ctx = c.getContext("2d")!;
    ctx.clearRect(0, 0, 256, 256); ctx.fillStyle = color;
    const cx = 128, cy = 128;
    ctx.fillRect(cx - thick / 2, cy - gap - size, thick, size);
    ctx.fillRect(cx - thick / 2, cy + gap, thick, size);
    ctx.fillRect(cx - gap - size, cy - thick / 2, size, thick);
    ctx.fillRect(cx + gap, cy - thick / 2, size, thick);
  }, [size, thick, gap, color]);
  return <Section>
    <div className="grid grid-cols-2 gap-3 text-sm">
      <label>Length: {size}<input type="range" min={4} max={60} value={size} onChange={e => setSize(+e.target.value)} className="w-full" /></label>
      <label>Thickness: {thick}<input type="range" min={1} max={10} value={thick} onChange={e => setThick(+e.target.value)} className="w-full" /></label>
      <label>Gap: {gap}<input type="range" min={0} max={30} value={gap} onChange={e => setGap(+e.target.value)} className="w-full" /></label>
      <label>Color<Input type="color" value={color} onChange={e => setColor(e.target.value)} /></label>
    </div>
    <canvas ref={ref} className="mx-auto bg-black/60 rounded-lg" style={{ width: 256, height: 256, imageRendering: "pixelated" }} />
    <Btn onClick={() => { const a = document.createElement("a"); a.href = ref.current!.toDataURL(); a.download = "crosshair.png"; a.click(); }}>Download</Btn>
  </Section>;
}

function XpCalcTool() {
  const xpFor = (lvl: number) => lvl <= 16 ? lvl * lvl + 6 * lvl : lvl <= 31 ? 2.5 * lvl * lvl - 40.5 * lvl + 360 : 4.5 * lvl * lvl - 162.5 * lvl + 2220;
  const [from, setFrom] = useState(0); const [to, setTo] = useState(30);
  return <Section>
    <div className="grid grid-cols-2 gap-2">
      <Input type="number" value={from} onChange={e => setFrom(+e.target.value)} placeholder="From level" />
      <Input type="number" value={to} onChange={e => setTo(+e.target.value)} placeholder="To level" />
    </div>
    <div className="glass p-4 rounded-lg space-y-1 text-sm">
      <div>Total XP needed: <b>{Math.round(xpFor(to) - xpFor(from))}</b></div>
      <div>XP to next level: <b>{to <= 15 ? 2 * to + 7 : to <= 30 ? 5 * to - 38 : 9 * to - 158}</b></div>
    </div>
  </Section>;
}

function BeaconTool() {
  const tiers = [1, 2, 3, 4]; const blocks = tiers.map(t => { let s = 0; for (let i = 1; i <= t; i++) s += (2 * i + 1) ** 2; return s; });
  return <Section>
    <div className="grid grid-cols-4 gap-2">
      {tiers.map((t, i) => <div key={t} className="glass p-3 rounded-lg text-center">
        <div className="text-2xl font-display">{blocks[i]}</div>
        <div className="text-xs text-white/60">Tier {t}</div>
      </div>)}
    </div>
    <p className="text-xs text-white/50">Iron/Gold/Diamond/Emerald/Netherite blocks needed for each pyramid tier.</p>
  </Section>;
}

function PvpTool() {
  const [base, setBase] = useState(7); const [str, setStr] = useState(0); const [sharp, setSharp] = useState(0); const [crit, setCrit] = useState(false);
  const dmg = (base + str * 3) * (1 + sharp * 0.0625) * (crit ? 1.5 : 1);
  return <Section>
    <div className="grid grid-cols-2 gap-2">
      <Input type="number" value={base} onChange={e => setBase(+e.target.value)} placeholder="Base damage" />
      <Input type="number" value={str} onChange={e => setStr(+e.target.value)} placeholder="Strength level" />
      <Input type="number" value={sharp} onChange={e => setSharp(+e.target.value)} placeholder="Sharpness" />
      <label className="flex items-center gap-2 px-3 glass rounded-lg"><input type="checkbox" checked={crit} onChange={e => setCrit(e.target.checked)} />Critical hit</label>
    </div>
    <div className="glass p-6 rounded-lg text-center"><div className="text-4xl font-display glow-text">{dmg.toFixed(2)} ❤</div><div className="text-xs text-white/60 mt-1">damage per hit</div></div>
  </Section>;
}

function CpsTool() {
  const [running, setRunning] = useState(false); const [c, setC] = useState(0); const [t, setT] = useState(0);
  useEffect(() => { if (!running) return; const id = setInterval(() => setT(x => x + 0.1), 100); return () => clearInterval(id); }, [running]);
  useEffect(() => { if (t >= 5) setRunning(false); }, [t]);
  return <Section>
    <div className="text-center glass p-8 rounded-xl">
      <div className="text-6xl font-display glow-text">{(c / Math.max(t, 0.1)).toFixed(2)}</div>
      <div className="text-xs text-white/60 mt-1">CPS — {Math.max(0, 5 - t).toFixed(1)}s left</div>
    </div>
    <button onClick={() => { if (!running) { setC(1); setT(0); setRunning(true); } else setC(c + 1); }}
      className="w-full py-12 rounded-xl glass-strong glow-border-hover text-2xl font-display">
      {running ? `CLICK! (${c})` : "Start clicking"}
    </button>
    <Btn onClick={() => { setC(0); setT(0); setRunning(false); }}>Reset</Btn>
  </Section>;
}

function SensConvTool() {
  const games: Record<string, number> = { "Minecraft (×0.6)": 0.6, "CS2": 1, "Valorant": 1 / 0.07, "Apex": 1, "Fortnite": 1, "Overwatch": 1 / 0.0066 };
  const [from, setFrom] = useState("CS2"); const [to, setTo] = useState("Valorant"); const [s, setS] = useState(1);
  const cm360 = 360 * 2.54 / (s * 0.022 * games[from]);
  const out = 360 * 2.54 / (cm360 * 0.022 * games[to]);
  return <Section>
    <div className="grid grid-cols-2 gap-2">
      <select value={from} onChange={e => setFrom(e.target.value)} className="px-4 py-2 rounded-lg bg-black/40 border border-white/10">{Object.keys(games).map(g => <option key={g}>{g}</option>)}</select>
      <select value={to} onChange={e => setTo(e.target.value)} className="px-4 py-2 rounded-lg bg-black/40 border border-white/10">{Object.keys(games).map(g => <option key={g}>{g}</option>)}</select>
    </div>
    <Input type="number" step="0.01" value={s} onChange={e => setS(+e.target.value)} placeholder="Source sens" />
    <div className="glass p-4 rounded-lg text-center"><div className="text-3xl font-display">{out.toFixed(3)}</div><div className="text-xs text-white/60">Equivalent sensitivity</div></div>
  </Section>;
}

// ---- Utility ----
function NotesTool() {
  const [v, setV] = useState(""); const [list, setList] = useState<string[]>([]);
  useEffect(() => { setList(JSON.parse(localStorage.getItem("warp-notes") || "[]")); }, []);
  const save = (l: string[]) => { setList(l); localStorage.setItem("warp-notes", JSON.stringify(l)); };
  return <Section>
    <TA rows={4} value={v} onChange={e => setV(e.target.value)} placeholder="Write a note..." />
    <Btn onClick={() => { if (v) { save([v, ...list]); setV(""); } }}>Save Note</Btn>
    <div className="space-y-2 max-h-64 overflow-auto">{list.map((n, i) =>
      <div key={i} className="glass p-3 rounded-lg flex justify-between gap-2"><div className="text-sm whitespace-pre-wrap">{n}</div>
        <button onClick={() => save(list.filter((_, j) => j !== i))} className="text-rose-400 text-xs">×</button></div>)}</div>
  </Section>;
}

function CalcTool() {
  const [v, setV] = useState("");
  const press = (k: string) => { if (k === "=") { try { setV(String(Function("return (" + v.replace(/[^0-9+\-*/.() ]/g, "") + ")")())); } catch { setV("Err"); } } else if (k === "C") setV(""); else setV(v + k); };
  const keys = ["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", ".", "C", "+", "(", ")", "=", ""];
  return <Section>
    <div className="glass p-4 rounded-lg text-right text-3xl font-display min-h-[60px]">{v || "0"}</div>
    <div className="grid grid-cols-4 gap-2">{keys.map((k, i) => k && <Btn key={i} onClick={() => press(k)} className="!py-4 text-lg">{k}</Btn>)}</div>
  </Section>;
}

function StopwatchTool() {
  const [t, setT] = useState(0); const [run, setRun] = useState(false);
  useEffect(() => { if (!run) return; const id = setInterval(() => setT(x => x + 10), 10); return () => clearInterval(id); }, [run]);
  const f = (ms: number) => { const m = Math.floor(ms / 60000); const s = Math.floor((ms % 60000) / 1000); const x = Math.floor((ms % 1000) / 10); return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(x).padStart(2, "0")}`; };
  return <Section>
    <div className="text-center glass p-8 rounded-xl text-6xl font-display glow-text">{f(t)}</div>
    <div className="flex gap-2 justify-center"><Btn onClick={() => setRun(!run)}>{run ? "Pause" : "Start"}</Btn><Btn onClick={() => { setT(0); setRun(false); }}>Reset</Btn></div>
  </Section>;
}

function TimerTool() {
  const [s, setS] = useState(60); const [left, setLeft] = useState(0); const [run, setRun] = useState(false);
  useEffect(() => {
    if (!run) return;
    const id = setInterval(() => setLeft(l => { if (l <= 1) { setRun(false); new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAAA").play(); return 0; } return l - 1; }), 1000);
    return () => clearInterval(id);
  }, [run]);
  return <Section>
    <Input type="number" value={s} onChange={e => setS(+e.target.value)} placeholder="Seconds" />
    <div className="text-center glass p-8 rounded-xl text-6xl font-display glow-text">{left}s</div>
    <div className="flex gap-2"><Btn onClick={() => { setLeft(s); setRun(true); }}>Start</Btn><Btn onClick={() => setRun(false)}>Pause</Btn></div>
  </Section>;
}

function PomodoroTool() {
  const [phase, setPhase] = useState<"work" | "break">("work"); const [t, setT] = useState(25 * 60); const [run, setRun] = useState(false);
  useEffect(() => { if (!run) return; const id = setInterval(() => setT(x => { if (x <= 1) { setPhase(p => p === "work" ? "break" : "work"); return phase === "work" ? 5 * 60 : 25 * 60; } return x - 1; }), 1000); return () => clearInterval(id); }, [run, phase]);
  return <Section>
    <div className="text-center"><div className="text-xs text-white/60 uppercase">{phase}</div><div className="text-7xl font-display glow-text">{Math.floor(t / 60)}:{String(t % 60).padStart(2, "0")}</div></div>
    <div className="flex gap-2 justify-center"><Btn onClick={() => setRun(!run)}>{run ? "Pause" : "Start"}</Btn><Btn onClick={() => { setT(25 * 60); setPhase("work"); setRun(false); }}>Reset</Btn></div>
  </Section>;
}

function UnitConvTool() {
  const cats: Record<string, Record<string, number>> = {
    Length: { m: 1, km: 1000, cm: 0.01, mi: 1609.34, ft: 0.3048, in: 0.0254 },
    Mass: { kg: 1, g: 0.001, lb: 0.453592, oz: 0.0283495 },
    Temperature: { C: 1, F: 1, K: 1 },
  };
  const [cat, setCat] = useState("Length"); const [from, setFrom] = useState("m"); const [to, setTo] = useState("ft"); const [v, setV] = useState(1);
  let out = 0;
  if (cat === "Temperature") {
    let c = v; if (from === "F") c = (v - 32) * 5 / 9; if (from === "K") c = v - 273.15;
    out = c; if (to === "F") out = c * 9 / 5 + 32; if (to === "K") out = c + 273.15;
  } else out = v * cats[cat][from] / cats[cat][to];
  const units = Object.keys(cats[cat]);
  return <Section>
    <select value={cat} onChange={e => { setCat(e.target.value); const u = Object.keys(cats[e.target.value]); setFrom(u[0]); setTo(u[1]); }} className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/10">{Object.keys(cats).map(c => <option key={c}>{c}</option>)}</select>
    <div className="grid grid-cols-3 gap-2">
      <Input type="number" value={v} onChange={e => setV(+e.target.value)} />
      <select value={from} onChange={e => setFrom(e.target.value)} className="px-4 py-2 rounded-lg bg-black/40 border border-white/10">{units.map(u => <option key={u}>{u}</option>)}</select>
      <select value={to} onChange={e => setTo(e.target.value)} className="px-4 py-2 rounded-lg bg-black/40 border border-white/10">{units.map(u => <option key={u}>{u}</option>)}</select>
    </div>
    <div className="glass p-6 rounded-lg text-center text-3xl font-display">{out.toFixed(4)} <span className="text-white/60 text-base">{to}</span></div>
  </Section>;
}

function QrTool() {
  const [v, setV] = useState("https://anormous.warp"); const [src, setSrc] = useState<string>();
  useEffect(() => { setSrc(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(v)}&color=ffffff&bgcolor=000000`); }, [v]);
  return <Section>
    <Input value={v} onChange={e => setV(e.target.value)} placeholder="URL or text" />
    {src && <img src={src} alt="QR" className="mx-auto rounded-lg glow-border" />}
  </Section>;
}

function MdPrevTool() {
  const [v, setV] = useState("# Hello\n\n**Bold** and *italic*\n\n- Item 1\n- Item 2\n\n[Link](https://example.com)");
  const html = useMemo(() => v
    .replace(/^### (.*)$/gm, "<h3>$1</h3>")
    .replace(/^## (.*)$/gm, "<h2>$1</h2>")
    .replace(/^# (.*)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, "<code>$1</code>")
    .replace(/^\- (.*)$/gm, "<li>$1</li>")
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="underline">$1</a>')
    .split("\n\n").map(p => p.startsWith("<") ? p : `<p>${p}</p>`).join(""), [v]);
  return <Section>
    <div className="grid md:grid-cols-2 gap-3">
      <TA rows={12} value={v} onChange={e => setV(e.target.value)} />
      <div className="glass p-4 rounded-lg prose prose-invert prose-sm max-w-none [&_h1]:text-2xl [&_h1]:font-display [&_h2]:text-xl [&_h2]:font-display [&_li]:list-disc [&_li]:ml-5" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  </Section>;
}

// ---- Gaming ----
function AimTrainerTool() {
  const ref = useRef<HTMLDivElement>(null); const [score, setScore] = useState(0); const [t, setT] = useState(30); const [run, setRun] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  useEffect(() => { if (!run) return; const id = setInterval(() => setT(x => x <= 1 ? (setRun(false), 0) : x - 1), 1000); return () => clearInterval(id); }, [run]);
  const move = () => { const r = ref.current?.getBoundingClientRect(); if (!r) return; setPos({ x: Math.random() * (r.width - 60), y: Math.random() * (r.height - 60) }); };
  return <Section>
    <div className="flex justify-between text-sm"><span>Score: <b>{score}</b></span><span>Time: <b>{t}s</b></span></div>
    <div ref={ref} className="relative h-80 glass rounded-xl overflow-hidden cursor-crosshair" onClick={() => { if (!run) { setScore(0); setT(30); setRun(true); move(); } }}>
      {run && <button style={{ left: pos.x, top: pos.y }} onClick={e => { e.stopPropagation(); setScore(s => s + 1); move(); }}
        className="absolute w-12 h-12 rounded-full bg-white/90 glow-border animate-scale-in" />}
      {!run && <div className="absolute inset-0 grid place-items-center text-white/60">Click anywhere to start</div>}
    </div>
  </Section>;
}

function ReactionTool() {
  const [state, setState] = useState<"idle" | "wait" | "now" | "done">("idle"); const [time, setTime] = useState(0); const startRef = useRef(0);
  return <Section>
    <button onClick={() => {
      if (state === "wait") { setState("idle"); return; }
      if (state === "now") { setTime(performance.now() - startRef.current); setState("done"); return; }
      setState("wait"); setTimeout(() => { startRef.current = performance.now(); setState("now"); }, 1000 + Math.random() * 3000);
    }}
      className={"w-full h-64 rounded-xl text-2xl font-display transition-all " + (state === "now" ? "bg-emerald-500" : state === "wait" ? "bg-rose-600" : "glass-strong")}>
      {state === "idle" && "Click to start"}
      {state === "wait" && "Wait for green..."}
      {state === "now" && "CLICK NOW!"}
      {state === "done" && `${time.toFixed(0)} ms`}
    </button>
  </Section>;
}

function TrackingTool() {
  const ref = useRef<HTMLDivElement>(null); const [pos, setPos] = useState({ x: 50, y: 50 }); const [hits, setHits] = useState(0);
  useEffect(() => {
    const id = setInterval(() => { const r = ref.current?.getBoundingClientRect(); if (r) setPos({ x: Math.random() * (r.width - 40), y: Math.random() * (r.height - 40) }); }, 1500);
    return () => clearInterval(id);
  }, []);
  return <Section>
    <div className="text-sm">Hover hits: <b>{hits}</b></div>
    <div ref={ref} className="relative h-80 glass rounded-xl overflow-hidden cursor-crosshair">
      <div onMouseEnter={() => setHits(h => h + 1)} style={{ left: pos.x, top: pos.y, transition: "all 1.4s ease-in-out" }}
        className="absolute w-10 h-10 rounded-full bg-white/90 glow-border" />
    </div>
  </Section>;
}

function MouseTestTool() {
  const [b, setB] = useState<Record<number, boolean>>({}); const [w, setW] = useState(0);
  return <Section>
    <div onMouseDown={e => { e.preventDefault(); setB(x => ({ ...x, [e.button]: true })); }}
      onMouseUp={e => setB(x => ({ ...x, [e.button]: false }))} onWheel={e => setW(w + (e.deltaY > 0 ? 1 : -1))} onContextMenu={e => e.preventDefault()}
      className="glass p-8 rounded-xl select-none">
      <div className="grid grid-cols-3 gap-2 mb-4">{["L", "M", "R", "B4", "B5"].map((n, i) =>
        <div key={i} className={"py-6 text-center rounded-lg font-display text-xl " + (b[i] ? "bg-white text-black glow-text" : "glass")}>{n}</div>)}</div>
      <div className="text-center">Wheel: <b>{w}</b></div>
    </div>
  </Section>;
}

function KeyboardVisTool() {
  const [keys, setKeys] = useState<Set<string>>(new Set());
  useEffect(() => {
    const d = (e: KeyboardEvent) => setKeys(k => new Set(k).add(e.key.toUpperCase()));
    const u = (e: KeyboardEvent) => setKeys(k => { const n = new Set(k); n.delete(e.key.toUpperCase()); return n; });
    window.addEventListener("keydown", d); window.addEventListener("keyup", u);
    return () => { window.removeEventListener("keydown", d); window.removeEventListener("keyup", u); };
  }, []);
  const rows = [["1234567890"], ["QWERTYUIOP"], ["ASDFGHJKL"], ["ZXCVBNM"]];
  return <Section>
    <div className="space-y-2">{rows.map((r, i) => <div key={i} className="flex justify-center gap-1.5">
      {r[0].split("").map(k => <div key={k} className={"w-10 h-10 rounded-lg flex items-center justify-center font-display transition-all " + (keys.has(k) ? "bg-white text-black glow-text scale-110" : "glass")}>{k}</div>)}
    </div>)}
      <div className="flex justify-center gap-1.5">{["SHIFT", " ", "CTRL"].map(k =>
        <div key={k} className={"px-4 h-10 rounded-lg flex items-center justify-center font-display text-xs transition-all " + (keys.has(k === " " ? " " : k) ? "bg-white text-black glow-text" : "glass")}>{k === " " ? "SPACE" : k}</div>)}</div>
    </div>
    <div className="text-center text-xs text-white/50">Press any key — focus this window first.</div>
  </Section>;
}

// ---- Creator ----
function ThumbnailTool() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [title, setTitle] = useState("EPIC THUMBNAIL"); const [bg, setBg] = useState("#1a1a2e"); const [color, setColor] = useState("#ffffff");
  useEffect(() => {
    const c = ref.current!; c.width = 1280; c.height = 720; const ctx = c.getContext("2d")!;
    const g = ctx.createLinearGradient(0, 0, 1280, 720); g.addColorStop(0, bg); g.addColorStop(1, "#000");
    ctx.fillStyle = g; ctx.fillRect(0, 0, 1280, 720);
    ctx.fillStyle = color; ctx.font = "bold 120px sans-serif"; ctx.textAlign = "center"; ctx.shadowColor = color; ctx.shadowBlur = 30;
    ctx.fillText(title, 640, 380);
  }, [title, bg, color]);
  return <Section>
    <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
    <div className="grid grid-cols-2 gap-2"><Input type="color" value={bg} onChange={e => setBg(e.target.value)} /><Input type="color" value={color} onChange={e => setColor(e.target.value)} /></div>
    <canvas ref={ref} className="w-full rounded-lg glow-border" />
    <Btn onClick={() => { const a = document.createElement("a"); a.href = ref.current!.toDataURL(); a.download = "thumbnail.png"; a.click(); }}>Download 1280×720</Btn>
  </Section>;
}

function TtsTool() {
  const [v, setV] = useState("Hello from Anormous Warp"); const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]); const [idx, setIdx] = useState(0); const [rate, setRate] = useState(1);
  useEffect(() => { const load = () => setVoices(speechSynthesis.getVoices()); load(); speechSynthesis.onvoiceschanged = load; }, []);
  return <Section>
    <TA rows={4} value={v} onChange={e => setV(e.target.value)} />
    <select value={idx} onChange={e => setIdx(+e.target.value)} className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/10">{voices.map((vo, i) => <option key={i} value={i}>{vo.name} ({vo.lang})</option>)}</select>
    <label className="text-xs text-white/60">Rate: {rate}<input type="range" min={0.5} max={2} step={0.1} value={rate} onChange={e => setRate(+e.target.value)} className="w-full" /></label>
    <Btn onClick={() => { const u = new SpeechSynthesisUtterance(v); u.voice = voices[idx]; u.rate = rate; speechSynthesis.speak(u); }}>Speak</Btn>
  </Section>;
}

function StoryTool() {
  const themes = ["a forgotten knight", "an AI awakening", "a cursed village", "the last astronaut", "a thief in neon city", "a dragon's apprentice"];
  const events = ["discovers a hidden door", "must betray a friend", "wakes in another world", "loses their memory", "finds an ancient weapon", "races against time"];
  const twists = ["but everything is a simulation", "and time begins to reverse", "while being hunted by shadows", "as gravity inverts", "and only children can see the truth"];
  const [s, setS] = useState("");
  return <Section>
    <Btn onClick={() => setS(`A story about ${themes[Math.floor(Math.random() * themes.length)]} who ${events[Math.floor(Math.random() * events.length)]} ${twists[Math.floor(Math.random() * twists.length)]}.`)}>Generate</Btn>
    {s && <div className="glass p-6 rounded-lg text-lg italic">{s}</div>}
  </Section>;
}

function HashtagTool() {
  const [topic, setTopic] = useState("minecraft"); const [out, setOut] = useState<string[]>([]);
  const gen = () => {
    const base = topic.toLowerCase().replace(/\s+/g, "");
    const pool = ["gaming", "fyp", "viral", "trending", "shorts", "reels", "youtube", "tiktok", "creator", "esports", "stream", "twitch", "pvp", "speedrun", "build", "tutorial"];
    setOut([base, base + "lover", base + "community", "best" + base, base + "2025", ...pool.sort(() => Math.random() - 0.5).slice(0, 12)].map(t => "#" + t));
  };
  return <Section>
    <Input value={topic} onChange={e => setTopic(e.target.value)} placeholder="Topic" />
    <Btn onClick={gen}>Generate</Btn>
    {out.length > 0 && <><div className="flex flex-wrap gap-2">{out.map(t => <span key={t} className="glass px-3 py-1.5 rounded-full text-sm">{t}</span>)}</div>
      <Btn onClick={() => navigator.clipboard.writeText(out.join(" "))}>Copy All</Btn></>}
  </Section>;
}

function OverlayTool() {
  const ref = useRef<HTMLCanvasElement>(null); const [name, setName] = useState("ANORMOUS"); const [color, setColor] = useState("#ffffff");
  useEffect(() => {
    const c = ref.current!; c.width = 1920; c.height = 1080; const ctx = c.getContext("2d")!;
    ctx.clearRect(0, 0, 1920, 1080);
    // bottom bar
    ctx.fillStyle = "rgba(0,0,0,0.6)"; ctx.fillRect(0, 980, 1920, 100);
    ctx.fillStyle = color; ctx.shadowColor = color; ctx.shadowBlur = 20; ctx.font = "bold 56px sans-serif"; ctx.fillText(name, 60, 1050);
    // top corner
    ctx.fillRect(0, 0, 400, 8);
  }, [name, color]);
  return <Section>
    <Input value={name} onChange={e => setName(e.target.value)} placeholder="Stream name" />
    <Input type="color" value={color} onChange={e => setColor(e.target.value)} />
    <canvas ref={ref} className="w-full rounded-lg glow-border bg-black/30" />
    <Btn onClick={() => { const a = document.createElement("a"); a.href = ref.current!.toDataURL(); a.download = "overlay.png"; a.click(); }}>Download 1920×1080</Btn>
  </Section>;
}

// ---- Dispatcher ----
export function ToolView({ k }: { k: ToolKey }) {
  switch (k) {
    case "base64": return <Base64Tool />;
    case "json-format": return <JsonFormatTool />;
    case "password": return <PasswordTool />;
    case "uuid": return <UuidTool />;
    case "gradient": return <GradientTool />;
    case "color-pick": return <ColorPickerTool />;
    case "html-prev": return <HtmlPrevTool />;
    case "css-min": return <MinifierTool kind="css" />;
    case "js-min": return <MinifierTool kind="js" />;
    case "img-compress": return <ImageCompressTool />;
    case "img-resize": return <ImageResizeTool />;
    case "img-convert": return <ImageConvertTool />;
    case "video-speed": return <VideoSpeedTool />;
    case "video-trim": return <VideoTrimTool />;
    case "audio-cut": return <AudioCutTool />;
    case "pdf-view": return <PdfViewTool />;
    case "zip-extract": return <ZipExtractTool />;
    case "mp4-gif": return <Mp4ToGifTool />;
    case "mp4-mp3": return <Mp4ToMp3Tool />;
    case "mcmeta": return <McMetaTool />;
    case "mcpack-zip": return <McpackZipTool to="zip" />;
    case "zip-mcpack": return <McpackZipTool to="mcpack" />;
    case "motd": return <MotdTool />;
    case "server-icon": return <ServerIconTool />;
    case "crosshair": return <CrosshairTool />;
    case "xp-calc": return <XpCalcTool />;
    case "beacon": return <BeaconTool />;
    case "pvp-utils": return <PvpTool />;
    case "cps": return <CpsTool />;
    case "sens-conv": return <SensConvTool />;
    case "notes": return <NotesTool />;
    case "calc": return <CalcTool />;
    case "stopwatch": return <StopwatchTool />;
    case "timer": return <TimerTool />;
    case "pomodoro": return <PomodoroTool />;
    case "unit-conv": return <UnitConvTool />;
    case "qr": return <QrTool />;
    case "md-prev": return <MdPrevTool />;
    case "aim-trainer": return <AimTrainerTool />;
    case "reaction": return <ReactionTool />;
    case "tracking": return <TrackingTool />;
    case "mouse-test": return <MouseTestTool />;
    case "keyboard-vis": return <KeyboardVisTool />;
    case "thumbnail": return <ThumbnailTool />;
    case "tts": return <TtsTool />;
    case "story": return <StoryTool />;
    case "hashtag": return <HashtagTool />;
    case "overlay": return <OverlayTool />;
    default: return <div className="text-white/60">Coming soon.</div>;
  }
}
