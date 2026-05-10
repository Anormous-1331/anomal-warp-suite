import {
  Music, Film, ImageIcon, Crop, Scissors, Gauge, RefreshCw, FileText, Archive,
  Box, Package, FileBox, MessageSquare, Server, Crosshair, Sparkles, Sun, Swords, MousePointer2, Settings2,
  Code2, Braces, KeyRound, Hash, Palette, Pipette, Eye, Minimize2, FileCode2,
  StickyNote, Calculator, Timer, TimerReset, Clock, Ruler, QrCode, FileType,
  Target, Zap, MousePointerClick, Mouse, Keyboard,
  Image as ImageIcon2, Volume2, BookOpen, Hash as HashIcon, Layers,
  type LucideIcon,
} from "lucide-react";

export type ToolKey =
  | "mp4-mp3" | "mp4-gif" | "img-compress" | "img-resize" | "video-trim" | "audio-cut"
  | "video-speed" | "img-convert" | "pdf-view" | "zip-extract"
  | "mcmeta" | "mcpack-zip" | "zip-mcpack" | "motd" | "server-icon" | "crosshair"
  | "xp-calc" | "beacon" | "pvp-utils" | "cps" | "sens-conv"
  | "base64" | "json-format" | "password" | "uuid" | "gradient" | "color-pick"
  | "html-prev" | "css-min" | "js-min"
  | "notes" | "calc" | "stopwatch" | "timer" | "pomodoro" | "unit-conv" | "qr" | "md-prev"
  | "aim-trainer" | "reaction" | "tracking" | "mouse-test" | "keyboard-vis"
  | "thumbnail" | "tts" | "story" | "hashtag" | "overlay";

export type ToolCategory = {
  id: string;
  label: string;
  icon: LucideIcon;
  accent: string;
  tools: { key: ToolKey; name: string; desc: string; icon: LucideIcon }[];
};

export const CATEGORIES: ToolCategory[] = [
  {
    id: "media", label: "Media Tools", icon: Film, accent: "from-white/30 to-white/0",
    tools: [
      { key: "mp4-mp3", name: "MP4 → MP3", desc: "Extract audio from video", icon: Music },
      { key: "mp4-gif", name: "MP4 → GIF", desc: "Convert clips to GIF", icon: Film },
      { key: "img-compress", name: "Image Compressor", desc: "Shrink without quality loss", icon: ImageIcon },
      { key: "img-resize", name: "Image Resizer", desc: "Resize to exact dimensions", icon: Crop },
      { key: "video-trim", name: "Video Trimmer", desc: "Cut start & end of videos", icon: Scissors },
      { key: "audio-cut", name: "Audio Cutter", desc: "Trim audio in browser", icon: Scissors },
      { key: "video-speed", name: "Video Speed", desc: "Speed up or slow down", icon: Gauge },
      { key: "img-convert", name: "Format Converter", desc: "PNG / JPG / WEBP", icon: RefreshCw },
      { key: "pdf-view", name: "PDF Viewer", desc: "Read PDFs locally", icon: FileText },
      { key: "zip-extract", name: "ZIP Extractor", desc: "Unpack archives", icon: Archive },
    ],
  },
  {
    id: "minecraft", label: "Minecraft Tools", icon: Box, accent: "from-emerald-300/20 to-white/0",
    tools: [
      { key: "mcmeta", name: "MCMETA Creator", desc: "Pack metadata", icon: FileBox },
      { key: "mcpack-zip", name: "MCPACK → ZIP", desc: "Convert to zip", icon: Package },
      { key: "zip-mcpack", name: "ZIP → MCPACK", desc: "Convert to mcpack", icon: Package },
      { key: "motd", name: "MOTD Creator", desc: "Color-coded server text", icon: MessageSquare },
      { key: "server-icon", name: "Server Icon", desc: "64×64 PNG generator", icon: Server },
      { key: "crosshair", name: "Crosshair Maker", desc: "Custom HUD crosshairs", icon: Crosshair },
      { key: "xp-calc", name: "XP Calculator", desc: "Levels ↔ experience", icon: Sparkles },
      { key: "beacon", name: "Beacon Calculator", desc: "Pyramid resources", icon: Sun },
      { key: "pvp-utils", name: "PvP Utilities", desc: "Strength & damage", icon: Swords },
      { key: "cps", name: "CPS Tester", desc: "Clicks per second", icon: MousePointer2 },
      { key: "sens-conv", name: "Sensitivity Converter", desc: "Game-to-game sens", icon: Settings2 },
    ],
  },
  {
    id: "dev", label: "Developer Tools", icon: Code2, accent: "from-sky-300/20 to-white/0",
    tools: [
      { key: "base64", name: "Base64", desc: "Encode / decode", icon: Code2 },
      { key: "json-format", name: "JSON Formatter", desc: "Beautify & validate", icon: Braces },
      { key: "password", name: "Password Gen", desc: "Strong & secure", icon: KeyRound },
      { key: "uuid", name: "UUID Generator", desc: "v4 unique IDs", icon: Hash },
      { key: "gradient", name: "Gradient Maker", desc: "CSS gradients", icon: Palette },
      { key: "color-pick", name: "Color Picker", desc: "HEX / RGB / HSL", icon: Pipette },
      { key: "html-prev", name: "HTML Previewer", desc: "Live render", icon: Eye },
      { key: "css-min", name: "CSS Minifier", desc: "Compress styles", icon: Minimize2 },
      { key: "js-min", name: "JS Minifier", desc: "Compress scripts", icon: FileCode2 },
    ],
  },
  {
    id: "utility", label: "Utility Tools", icon: Settings2, accent: "from-amber-300/20 to-white/0",
    tools: [
      { key: "notes", name: "Notes", desc: "Saved locally", icon: StickyNote },
      { key: "calc", name: "Calculator", desc: "Quick math", icon: Calculator },
      { key: "stopwatch", name: "Stopwatch", desc: "Precise timing", icon: Timer },
      { key: "timer", name: "Timer", desc: "Countdown alerts", icon: TimerReset },
      { key: "pomodoro", name: "Pomodoro", desc: "Focus sessions", icon: Clock },
      { key: "unit-conv", name: "Unit Converter", desc: "Length/mass/temp", icon: Ruler },
      { key: "qr", name: "QR Generator", desc: "Instant QR codes", icon: QrCode },
      { key: "md-prev", name: "Markdown Preview", desc: "Render MD live", icon: FileType },
    ],
  },
  {
    id: "gaming", label: "Gaming Tools", icon: Target, accent: "from-rose-300/20 to-white/0",
    tools: [
      { key: "aim-trainer", name: "Aim Trainer", desc: "FPS click targets", icon: Target },
      { key: "reaction", name: "Reaction Tester", desc: "Measure reflexes", icon: Zap },
      { key: "tracking", name: "Tracking Trainer", desc: "Follow the dot", icon: MousePointerClick },
      { key: "mouse-test", name: "Mouse Tester", desc: "Buttons & wheel", icon: Mouse },
      { key: "keyboard-vis", name: "Keyboard Visualizer", desc: "Live key map", icon: Keyboard },
    ],
  },
  {
    id: "creator", label: "Creator Tools", icon: Sparkles, accent: "from-fuchsia-300/20 to-white/0",
    tools: [
      { key: "thumbnail", name: "Thumbnail Maker", desc: "16:9 canvas editor", icon: ImageIcon2 },
      { key: "tts", name: "Text to Speech", desc: "Browser voices", icon: Volume2 },
      { key: "story", name: "Story Prompts", desc: "Idea generator", icon: BookOpen },
      { key: "hashtag", name: "Hashtag Generator", desc: "Topic-based tags", icon: HashIcon },
      { key: "overlay", name: "Overlay Creator", desc: "Stream overlays", icon: Layers },
    ],
  },
  {
    id: "internet", label: "Internet Tools", icon: Eye, accent: "from-cyan-300/20 to-white/0",
    tools: [
      { key: "qr", name: "QR Generator", desc: "URLs to QR", icon: QrCode },
      { key: "base64", name: "Base64 URL", desc: "Encode/decode", icon: Code2 },
      { key: "html-prev", name: "HTML Preview", desc: "Sandbox render", icon: Eye },
      { key: "md-prev", name: "Markdown Preview", desc: "Render MD live", icon: FileType },
    ],
  },
];

export const ALL_TOOLS = CATEGORIES.flatMap(c => c.tools.map(t => ({ ...t, cat: c.id, catLabel: c.label })));
