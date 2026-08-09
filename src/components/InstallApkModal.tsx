import React, { useState, useEffect } from "react";
import { X, Smartphone, Download, CheckCircle2, ArrowRight, ShieldCheck, Sparkles, Share2 } from "lucide-react";

interface InstallApkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InstallApkModal({ isOpen, onClose }: InstallApkModalProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  if (!isOpen) return null;

  const currentAppUrl = window.location.origin;
  const pwaBuilderUrl = `https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(currentAppUrl)}`;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      alert("To install directly on Android: tap Chrome options (⋮) and select 'Add to Home Screen' or 'Install App'.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-emerald-950 border border-emerald-700/60 rounded-3xl shadow-2xl overflow-hidden text-slate-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-900 to-emerald-950 border-b border-emerald-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-inner">
              <Smartphone className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Install App / Download APK</h2>
              <p className="text-xs text-emerald-300">Run natively on your Android or Mobile device</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-emerald-400 hover:text-white hover:bg-emerald-800/50 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Direct Install Card */}
          <div className="p-4 rounded-2xl bg-emerald-900/40 border border-emerald-700/50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-white text-sm">Option 1: Instant Native WebAPK</span>
              </div>
              <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Recommended
              </span>
            </div>
            <p className="text-xs text-emerald-200/90 leading-relaxed">
              Android Chrome seamlessly builds and installs a standalone WebAPK onto your device app drawer with offline support.
            </p>

            {isInstalled ? (
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs bg-amber-500/10 p-3 rounded-xl border border-amber-500/30">
                <CheckCircle2 className="w-4 h-4" />
                <span>App is already installed on this device!</span>
              </div>
            ) : (
              <button
                onClick={handleInstallClick}
                className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>{deferredPrompt ? "Install App Directly Now" : "Install via Browser Menu"}</span>
              </button>
            )}
          </div>

          {/* Download APK Package Option */}
          <div className="p-4 rounded-2xl bg-emerald-900/30 border border-emerald-800/60 space-y-3">
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-white text-sm">Option 2: Generate Downloadable Android .APK</span>
            </div>
            <p className="text-xs text-emerald-200/90 leading-relaxed">
              Generate a signed Android `.apk` or `.aab` package file using PWABuilder (Google's official PWA tool) to sideload directly onto any Android phone.
            </p>
            <a
              href={pwaBuilderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-emerald-100 font-bold text-xs flex items-center justify-center gap-2 border border-emerald-600/50 transition"
            >
              <span>Download .APK via PWABuilder</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Quick Steps Guide */}
          <div className="p-4 rounded-2xl bg-emerald-900/20 border border-emerald-800/40 space-y-2">
            <h4 className="font-bold text-emerald-200 text-xs flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>How to install on Android Chrome:</span>
            </h4>
            <ol className="list-decimal list-inside text-xs text-emerald-300/90 space-y-1.5 pl-1">
              <li>Open this app URL in **Chrome** on your phone.</li>
              <li>Tap the top right three dots **(⋮)**.</li>
              <li>Select **"Install App"** or **"Add to Home Screen"**.</li>
              <li>Android will automatically create the app icon on your home screen!</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-emerald-950/80 border-t border-emerald-800/60 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-emerald-200 text-xs font-bold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
