import { useEffect, useRef, useState, useCallback } from "react";
import { toPng } from "html-to-image";
import { ShareImageCard } from "./ShareImageCard";
import { Button } from "@/components/ui/button";
import { Download, X, Loader2, Share2 } from "lucide-react";

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  streak: number;
  bonusEarned: number;
  milestoneReached: boolean;
  milestoneLabel?: string;
  cycleNum: number;
  totalBonusEarned: number;
  walletAddress: string;
  shareText: string;
}

export function ShareModal({
  open,
  onClose,
  streak,
  bonusEarned,
  milestoneReached,
  milestoneLabel,
  cycleNum,
  totalBonusEarned,
  walletAddress,
  shareText,
}: ShareModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async () => {
    if (!cardRef.current) return;
    setGenerating(true);
    setError(null);
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 1,
      });
      setPreviewUrl(dataUrl);
    } catch (e) {
      setError("Could not generate image. Try downloading manually.");
      console.error(e);
    } finally {
      setGenerating(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    setPreviewUrl(null);
    setError(null);
    const timer = setTimeout(generate, 100);
    return () => clearTimeout(timer);
  }, [open, generate]);

  const download = () => {
    if (!previewUrl) return;
    const a = document.createElement("a");
    a.href = previewUrl;
    a.download = `gooddollar-streak-day${streak}.png`;
    a.click();
  };

  const shareOnX = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
      "_blank"
    );
  };

  const shareOnFarcaster = () => {
    window.open(
      `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}`,
      "_blank"
    );
  };

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-sm">Share Your Achievement</h3>
            </div>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Image preview */}
          <div className="p-4">
            <div className="relative rounded-xl overflow-hidden bg-muted/30 aspect-[1200/630]">
              {generating && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-10">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              )}
              {error && (
                <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground p-4 text-center">
                  {error}
                </div>
              )}
              {previewUrl && !generating ? (
                <img
                  src={previewUrl}
                  alt="Share card preview"
                  className="w-full h-full object-cover"
                />
              ) : null}
            </div>

            {/* Tip */}
            <p className="text-xs text-muted-foreground mt-2.5 text-center">
              Download the image, then attach it when posting to X or Farcaster
            </p>
          </div>

          {/* Actions */}
          <div className="px-4 pb-4 space-y-2">
            <Button
              className="w-full"
              onClick={download}
              disabled={!previewUrl || generating}
            >
              <Download className="w-4 h-4 mr-2" />
              Download Image
            </Button>

            <div className="flex gap-2">
              <button
                onClick={shareOnX}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-semibold bg-black text-white hover:bg-black/80 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Post on X
              </button>
              <button
                onClick={shareOnFarcaster}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-semibold bg-[#7c3aed] text-white hover:bg-[#6d28d9] transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.83 0C5.297 0 0 5.297 0 11.83v.34C0 18.703 5.297 24 11.83 24h.34C18.703 24 24 18.703 24 12.17v-.34C24 5.297 18.703 0 12.17 0h-.34zm4.17 6l-4 6-4-6H5l5 7.5V18h4v-4.5L19 6h-3z" />
                </svg>
                Cast on Farcaster
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden render target (1200×630) */}
      <div
        style={{
          position: "fixed",
          top: -9999,
          left: -9999,
          zIndex: -1,
          pointerEvents: "none",
        }}
      >
        <div ref={cardRef}>
          <ShareImageCard
            streak={streak}
            bonusEarned={bonusEarned}
            milestoneReached={milestoneReached}
            milestoneLabel={milestoneLabel}
            cycleNum={cycleNum}
            totalBonusEarned={totalBonusEarned}
            walletAddress={walletAddress}
          />
        </div>
      </div>
    </>
  );
}
