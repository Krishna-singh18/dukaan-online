import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Share2, PlusSquare, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../hooks/useStore';

export function PwaInstallPrompt() {
  const { storeConfig } = useStore();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    // Check if already in standalone app mode
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      window.navigator.standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Check if previously dismissed in this session
    if (sessionStorage.getItem('dukaan_pwa_dismissed') === 'true') {
      setIsDismissed(true);
    }

    // Detect iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    const isSafari = /safari/.test(userAgent) && !/chrome|crios|fxios/.test(userAgent);
    if (isIosDevice && isSafari && !isStandalone) {
      setIsIos(true);
    }

    // Listen to Android / Chrome / Edge install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIos) {
      setShowIosGuide(true);
      return;
    }

    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('dukaan_pwa_dismissed', 'true');
  };

  const showPrompt = !isInstalled && !isDismissed && (isInstallable || isIos);

  if (!showPrompt && isOnline) {
    return null;
  }

  return (
    <>
      {/* Offline Alert Bar */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-white text-[11px] font-bold py-1.5 px-3 text-center flex items-center justify-center gap-1.5 shadow-md">
          <span>⚠️ Offline Mode: Showing cached catalog</span>
        </div>
      )}

      {/* Floating Bottom / Banner Prompt */}
      {showPrompt && (
        <aside
          aria-label="App installation prompt"
          className="fixed bottom-20 md:bottom-5 left-4 right-4 md:left-auto md:right-5 md:max-w-md z-40 bg-surface rounded-2xl p-4 shadow-2xl border border-emerald-100 flex items-center justify-between gap-3 animate-in slide-in-from-bottom-5 duration-300"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white shrink-0 shadow-sm">
              <Smartphone size={22} />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-extrabold text-mainText truncate">
                Install {storeConfig?.name || 'Dukaan'} App
              </h4>
              <p className="text-[11px] text-secondaryText truncate">
                Fast 1-click ordering from home screen
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleInstallClick}
              className="px-3.5 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
            >
              <Download size={14} />
              <span>Install</span>
            </button>
            <button
              onClick={handleDismiss}
              className="p-1.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              title="Dismiss"
            >
              <X size={16} />
            </button>
          </div>
        </aside>
      )}

      {/* iOS Installation Guide Modal */}
      {showIosGuide && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div
            onClick={() => setShowIosGuide(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
          />

          <div className="relative bg-surface rounded-3xl max-w-sm w-full p-6 shadow-2xl z-10 border border-gray-100 text-center animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-primary mx-auto flex items-center justify-center mb-4">
              <Smartphone size={28} />
            </div>

            <h3 className="text-base font-extrabold text-mainText mb-1">
              Install on iPhone / iPad
            </h3>
            <p className="text-xs text-secondaryText mb-5 leading-relaxed">
              Apple Safari me direct install karne ke 2 aasan steps:
            </p>

            <div className="space-y-3 text-left text-xs mb-6">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-background border border-gray-100">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Share2 size={15} />
                </div>
                <span>1. Safari ke bottom menu me <strong>Share</strong> icon dabayein.</span>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-background border border-gray-100">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <PlusSquare size={15} />
                </div>
                <span>2. Niche scroll karke <strong>Add to Home Screen</strong> select karein.</span>
              </div>
            </div>

            <button
              onClick={() => setShowIosGuide(false)}
              className="w-full py-2.5 rounded-xl bg-primary text-white font-bold text-xs"
            >
              Samajh Gaya (Done)
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default PwaInstallPrompt;
