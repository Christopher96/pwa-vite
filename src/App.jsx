import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import appLogo from '/favicon.svg'
import PWABadge from './PWABadge.jsx'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Show the install button
      setShowInstallButton(true);
      // Update UI notify the user they can install the PWA
      console.log(`'beforeinstallprompt' event was fired.`);
    });
    
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      setShowInstallButton(false);
    }
    // Clear the deferredPrompt
    setDeferredPrompt(null);
  };

  window.addEventListener('appinstalled', () => {
    // Hide the app-provided install promotion
    setShowInstallButton(false);

    // Clear the deferredPrompt so it can be garbage collected
    setDeferredPrompt(null);

    // Optionally, send analytics event to indicate successful install
    console.log('PWA was installed');
  });

  function getPWADisplayMode() {
    if (document.referrer.startsWith('android-app://'))
      return 'twa';
    if (window.matchMedia('(display-mode: browser)').matches)
      return 'browser';
    if (window.matchMedia('(display-mode: standalone)').matches || navigator.standalone)
      return 'standalone';
    if (window.matchMedia('(display-mode: minimal-ui)').matches)
      return 'minimal-ui';
    if (window.matchMedia('(display-mode: fullscreen)').matches)
      return 'fullscreen';
    if (window.matchMedia('(display-mode: window-controls-overlay)').matches)
      return 'window-controls-overlay';
  
    return 'unknown';
  }

  // Replace "standalone" with the display mode used in your manifest
  window.matchMedia('(display-mode: standalone)').addEventListener('change', () => {
    // Log display mode change to analytics
    console.log('DISPLAY_MODE_CHANGED', getPWADisplayMode());
  });

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={appLogo} className="logo" alt="pwa-vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>pwa-vite</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <PWABadge />
      {showInstallButton && (
        <div className="install-prompt">
          <img src={reactLogo} className="install-logo" alt="logo" />
          <button onClick={handleInstallClick}>
            Add to Home Screen
          </button>
        </div>
      )}
    </>
  )
}

export default App
