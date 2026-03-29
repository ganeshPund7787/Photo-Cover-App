"use client";

import { useState, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const STYLES = [
  { id: "anime", label: "Anime", icon: "⛩️", desc: "Studio Ghibli vibes" },
  { id: "cartoon", label: "Cartoon", icon: "🎨", desc: "Pixar 3D style" },
  {
    id: "cyberpunk",
    label: "Cyberpunk",
    icon: "🌆",
    desc: "Neon & futuristic",
  },
  { id: "sketch", label: "Sketch", icon: "✏️", desc: "Pencil & ink" },
  {
    id: "watercolor",
    label: "Watercolor",
    icon: "🎭",
    desc: "Soft & painterly",
  },
  {
    id: "oil_painting",
    label: "Oil Paint",
    icon: "🖼️",
    desc: "Classic fine art",
  },
  { id: "pixel_art", label: "Pixel Art", icon: "👾", desc: "Retro 8-bit" },
  { id: "fantasy", label: "Fantasy", icon: "🧙", desc: "Epic & magical" },
];

interface GeneratedImage {
  id: string;
  prompt: string;
  style: string;
  imageUrl: string;
  createdAt: string;
}

interface LimitInfo {
  used: number;
  limit: number;
  remaining: number;
}

export default function StudioPage() {
  const [tab, setTab] = useState("generate");
  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("anime");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [gallery, setGallery] = useState<GeneratedImage[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [limitInfo, setLimitInfo] = useState<LimitInfo | null>(null);
  const [generatedMeta, setGeneratedMeta] = useState<{
    style: string;
    prompt: string;
  } | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchLimit();
  }, []);

  useEffect(() => {
    if (tab === "gallery") fetchGallery();
  }, [tab]);

  const fetchLimit = async () => {
    try {
      const res = await fetch("/api/studio/limit");
      const data = await res.json();
      setLimitInfo(data);
    } catch {}
  };

  const fetchGallery = async () => {
    setGalleryLoading(true);
    try {
      const res = await fetch("/api/studio/gallery");
      const data = await res.json();
      setGallery(data.images || []);
    } catch {}
    setGalleryLoading(false);
  };

  const generate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/studio/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, style: selectedStyle }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Generation failed");
        return;
      }

      setResult(data.image);
      setGeneratedMeta({ style: selectedStyle, prompt });
      setLimitInfo(data.limitInfo);
      setTimeout(
        () => resultRef.current?.scrollIntoView({ behavior: "smooth" }),
        100,
      );
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = (imageUrl: string, filename = "generated.png") => {
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = filename;
    a.click();
  };

  const generateAnother = () => {
    setResult(null);
    setGeneratedMeta(null);
    setPrompt("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const selectedStyleData = STYLES.find((s) => s.id === selectedStyle);
  const generatedStyleData = STYLES.find((s) => s.id === generatedMeta?.style);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-5 md:px-10 pt-12 pb-20">
        {/* Header */}
        <Badge
          variant="outline"
          className="mb-5 text-xs tracking-widest uppercase"
        >
          ✦ AI Image Studio
        </Badge>

        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-3">
          Create{" "}
          <span className="bg-gradient-to-r from-violet-500 to-cyan-400 bg-clip-text text-transparent">
            Stunning
          </span>{" "}
          Visuals
        </h1>

        <p className="text-muted-foreground text-sm mb-8">
          Describe anything. Pick a style. Let AI do the rest.
        </p>

        {/* Daily limit indicator */}
        {limitInfo && (
          <div className="flex items-center gap-3 bg-muted/40 border border-border rounded-xl px-4 py-3 mb-8 text-sm">
            <div className="flex gap-1.5">
              {Array.from({ length: limitInfo.limit }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full border transition-colors ${
                    i < limitInfo.used
                      ? "bg-violet-500 border-violet-500"
                      : "bg-cyan-400/20 border-cyan-400/50"
                  }`}
                />
              ))}
            </div>
            <span className="text-muted-foreground text-xs">
              <strong className="text-foreground font-semibold">
                {limitInfo.remaining}
              </strong>{" "}
              generation{limitInfo.remaining !== 1 ? "s" : ""} left today
              {limitInfo.remaining === 0 && " · Resets tomorrow"}
            </span>
          </div>
        )}

        {/* Tabs */}
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="generate">✦ Generate</TabsTrigger>
            <TabsTrigger value="gallery">◈ My Gallery</TabsTrigger>
          </TabsList>

          {/* ─── Generate Tab ─── */}
          <TabsContent value="generate" className="space-y-7">
            {/* Style grid */}
            <div>
              <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-3">
                Choose Style
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {STYLES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedStyle(s.id)}
                    className={`relative text-left p-3.5 rounded-xl border transition-all duration-150 ${
                      selectedStyle === s.id
                        ? "border-violet-500/60 bg-violet-500/10 ring-1 ring-violet-500/30"
                        : "border-border bg-muted/20 hover:border-violet-400/30 hover:bg-violet-500/5"
                    }`}
                  >
                    {selectedStyle === s.id && (
                      <span className="absolute top-2 right-2 w-4 h-4 bg-violet-500 rounded-full flex items-center justify-center text-white text-[9px] font-bold leading-none">
                        ✓
                      </span>
                    )}
                    <span className="text-xl mb-1.5 block">{s.icon}</span>
                    <div className="text-xs font-bold text-foreground mb-0.5">
                      {s.label}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {s.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt input */}
            <div>
              <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-3">
                Your Prompt
              </p>
              <div className="relative">
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value.slice(0, 300))}
                  placeholder="Describe what you want to generate... e.g. 'a samurai standing on a mountain at sunset'"
                  className="min-h-[120px] resize-none pb-9 text-sm"
                />
                <span className="absolute bottom-3 right-3 text-[10px] text-muted-foreground pointer-events-none">
                  {prompt.length}/300
                </span>
              </div>
            </div>

            {/* Generate button */}
            <Button
              onClick={generate}
              disabled={loading || !prompt.trim() || limitInfo?.remaining === 0}
              className="w-full h-12 text-sm font-bold bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-700 hover:to-cyan-600 text-white border-0 transition-all"
            >
              {loading
                ? "Generating your image..."
                : limitInfo?.remaining === 0
                  ? "Daily limit reached · Come back tomorrow"
                  : `Generate ${selectedStyleData?.label} Image →`}
            </Button>

            {/* Error message */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/25 rounded-xl px-4 py-3 text-destructive text-sm">
                ⚠ {error}
              </div>
            )}

            {/* Result */}
            {result && (
              <div
                ref={resultRef}
                className="space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-300"
              >
                <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground">
                  Your Creation
                </p>

                <Card className="overflow-hidden border-border">
                  <div className="relative">
                    <img
                      src={result}
                      alt="Generated"
                      className="w-full max-h-[520px] object-contain block"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/75 to-transparent">
                      <Badge className="bg-violet-600/70 text-white border-violet-500/40 text-[10px] uppercase tracking-widest backdrop-blur-sm">
                        {generatedStyleData?.icon} {generatedMeta?.style}
                      </Badge>
                    </div>
                  </div>
                </Card>

                <div className="flex gap-2.5">
                  <Button
                    variant="outline"
                    className="flex-1 h-11 text-sm"
                    onClick={generateAnother}
                  >
                    ↺ Generate Another
                  </Button>
                  <Button
                    className="flex-1 h-11 text-sm font-bold bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-700 hover:to-cyan-600 text-white border-0"
                    onClick={() =>
                      downloadImage(
                        result,
                        `${generatedMeta?.style}-${Date.now()}.png`,
                      )
                    }
                  >
                    ↓ Download Image
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          {/* ─── Gallery Tab ─── */}
          <TabsContent value="gallery">
            <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-4">
              All Generated Images
            </p>

            {galleryLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="aspect-square rounded-xl" />
                ))}
              </div>
            ) : gallery.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-3">
                <span className="text-5xl">🎨</span>
                <p className="text-sm">
                  No images yet. Generate your first one!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {gallery.map((img) => {
                  const styleData = STYLES.find((s) => s.id === img.style);
                  return (
                    <Card
                      key={img.id}
                      className="overflow-hidden border-border hover:border-violet-500/30 transition-colors duration-200"
                    >
                      <img
                        src={img.imageUrl}
                        alt={img.prompt}
                        className="w-full aspect-square object-cover block"
                      />
                      <CardContent className="p-3 space-y-1.5">
                        <p className="text-[10px] font-bold tracking-widest uppercase text-violet-400">
                          {styleData?.icon} {img.style}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {img.prompt}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full h-7 text-[11px]"
                          onClick={() =>
                            downloadImage(
                              img.imageUrl,
                              `${img.style}-${img.id}.png`,
                            )
                          }
                        >
                          ↓ Download
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
