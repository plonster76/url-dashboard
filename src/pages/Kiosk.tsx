import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKioskStore } from '../store/kioskStore';
import VirtualKeyboard from '../components/VirtualKeyboard';
import { ArrowLeft } from 'lucide-react';

const Kiosk: React.FC = () => {
  const { getActiveUrl } = useKioskStore();
  const [showControls, setShowControls] = useState(false);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const navigate = useNavigate();
  
  const activeUrl = getActiveUrl();
  
  useEffect(() => {
    // Check for scheduled start times
    const checkScheduledUrls = () => {
      const activeUrl = getActiveUrl();
      if (activeUrl?.startTime) {
        const [hours, minutes] = activeUrl.startTime.split(':').map(Number);
        const now = new Date();
        const currentHours = now.getHours();
        const currentMinutes = now.getMinutes();
        
        // If current time matches the scheduled time (within the same minute)
        if (currentHours === hours && currentMinutes === minutes) {
          // Reload the iframe to ensure the content is fresh
          if (iframeRef.current) {
            iframeRef.current.src = activeUrl.url;
          }
        }
      }
    };
    
    // Check every minute
    const intervalId = setInterval(checkScheduledUrls, 60000);
    
    // Initial check
    checkScheduledUrls();
    
    return () => clearInterval(intervalId);
  }, [getActiveUrl]);
  
  useEffect(() => {
    // Show controls when mouse moves
    const handleMouseMove = () => {
      setShowControls(true);
      
      // Hide controls after 3 seconds of inactivity
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
      
      const timeout = setTimeout(() => {
        setShowControls(false);
      }, 3000);
      
      setControlsTimeout(timeout);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
    };
  }, [controlsTimeout]);

  // Function to inject cookie banner blocker script
  const injectCookieBlocker = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        const iframe = iframeRef.current;
        iframe.addEventListener('load', () => {
          const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
          if (!iframeDoc) return;
          
          // Create and inject the cookie banner blocker script
          const script = iframeDoc.createElement('script');
          script.textContent = `
            (function() {
              // Common cookie banner selectors
              const cookieBannerSelectors = [
                // Common class names
                '.cookie-banner', '.cookie-consent', '.cookie-notice', '.cookie-policy',
                '.cookies-banner', '.cookies-consent', '.cookies-notice', '.cookies-policy',
                '.cookie-dialog', '.cookie-popup', '.cookie-alert', '.cookie-warning',
                '.gdpr-banner', '.gdpr-consent', '.gdpr-notice', '.gdpr-popup',
                '.cc-banner', '.cc-window', '.cc-dialog', '.cc-popup',
                
                // Common IDs
                '#cookie-banner', '#cookie-consent', '#cookie-notice', '#cookie-policy',
                '#cookies-banner', '#cookies-consent', '#cookies-notice', '#cookies-policy',
                '#cookie-dialog', '#cookie-popup', '#cookie-alert', '#cookie-warning',
                '#gdpr-banner', '#gdpr-consent', '#gdpr-notice', '#gdpr-popup',
                '#CybotCookiebotDialog', '#onetrust-banner-sdk', '#onetrust-consent-sdk',
                
                // Common attributes
                '[data-cookie-banner]', '[data-cookie-consent]', '[data-cookie-notice]',
                '[data-gdpr-banner]', '[data-gdpr-consent]', '[data-gdpr-notice]',
                
                // Specific known cookie banners
                '.CookieConsent', '.CookieBanner', '.cookie-law-info-bar',
                '.wt-cli-cookie-bar', '.js-cookie-consent', '.cookieconsent',
                '.cookiebar', '.cookiealert', '.cookienotice'
              ];
              
              // Function to hide cookie banners
              function hideCookieBanners() {
                cookieBannerSelectors.forEach(selector => {
                  const elements = document.querySelectorAll(selector);
                  elements.forEach(el => {
                    if (el) {
                      el.style.display = 'none';
                      el.style.visibility = 'hidden';
                      el.style.opacity = '0';
                      el.style.pointerEvents = 'none';
                      el.style.height = '0';
                      el.style.maxHeight = '0';
                      el.style.overflow = 'hidden';
                      el.setAttribute('aria-hidden', 'true');
                      el.classList.add('kiosk-hidden-element');
                    }
                  });
                });
                
                // Also try to find elements with text related to cookies
                const allElements = document.querySelectorAll('div, section, aside, footer, header, nav');
                const cookieTerms = ['cookie', 'cookies', 'gdpr', 'consent', 'privacy policy', 'accept all'];
                
                allElements.forEach(el => {
                  const text = el.textContent?.toLowerCase() || '';
                  if (cookieTerms.some(term => text.includes(term)) && 
                      (text.length < 500) && // Avoid hiding main content
                      !el.classList.contains('kiosk-hidden-element')) {
                    
                    // Check if it's likely a cookie banner (small text, fixed position, etc.)
                    const style = window.getComputedStyle(el);
                    const isFixed = style.position === 'fixed' || style.position === 'sticky';
                    const isSmall = el.clientHeight < 300;
                    
                    if ((isFixed || el.parentElement?.style.position === 'fixed') && isSmall) {
                      el.style.display = 'none';
                      el.style.visibility = 'hidden';
                      el.style.opacity = '0';
                      el.classList.add('kiosk-hidden-element');
                    }
                  }
                });
              }
              
              // Auto-accept common cookie consent functions
              function autoAcceptCookies() {
                // Common cookie accept function names and button selectors
                const acceptFunctions = [
                  'acceptCookies', 'acceptAllCookies', 'acceptCookieConsent',
                  'CookieConsent.accept', 'cookieAccept', 'acceptTracking',
                  'consentAccept', 'gdprAccept', 'acceptAll', 'acceptAllCookies'
                ];
                
                const acceptButtonSelectors = [
                  '.accept-cookies', '.accept-all-cookies', '.cookie-accept',
                  '.cookie-accept-all', '.cookie-consent-accept', '.gdpr-accept',
                  '.cc-accept', '.cc-accept-all', '.consent-accept', '.consent-accept-all',
                  '[data-accept-cookies]', '[data-accept-all-cookies]',
                  'button:contains("Accept")', 'button:contains("Accept all")',
                  'button:contains("Accept cookies")', 'button:contains("I agree")',
                  'button:contains("Agree")', 'button:contains("OK")',
                  'button:contains("Got it")', 'button:contains("Allow")',
                  'button:contains("Allow all")', 'button:contains("Allow cookies")'
                ];
                
                // Try to call accept functions
                acceptFunctions.forEach(funcName => {
                  try {
                    const parts = funcName.split('.');
                    if (parts.length > 1 && window[parts[0]]) {
                      window[parts[0]][parts[1]]();
                    } else if (typeof window[funcName] === 'function') {
                      window[funcName]();
                    }
                  } catch (e) {
                    // Ignore errors
                  }
                });
                
                // Try to click accept buttons
                acceptButtonSelectors.forEach(selector => {
                  try {
                    const buttons = document.querySelectorAll(selector);
                    buttons.forEach(button => {
                      if (button && typeof button.click === 'function') {
                        button.click();
                      }
                    });
                  } catch (e) {
                    // Ignore errors
                  }
                });
                
                // Set common cookie consent cookies
                document.cookie = "cookieconsent_status=allow; path=/; max-age=31536000";
                document.cookie = "cookie_consent=1; path=/; max-age=31536000";
                document.cookie = "cookies_accepted=1; path=/; max-age=31536000";
                document.cookie = "cookies_accepted=true; path=/; max-age=31536000";
                document.cookie = "gdpr_consent=1; path=/; max-age=31536000";
                document.cookie = "gdpr_consent=true; path=/; max-age=31536000";
              }
              
              // Run immediately
              hideCookieBanners();
              autoAcceptCookies();
              
              // Run again after a short delay to catch dynamically added banners
              setTimeout(hideCookieBanners, 500);
              setTimeout(autoAcceptCookies, 500);
              
              // Run periodically to catch delayed banners
              setInterval(hideCookieBanners, 2000);
              
              // Create a MutationObserver to watch for dynamically added cookie banners
              const observer = new MutationObserver(mutations => {
                hideCookieBanners();
                autoAcceptCookies();
              });
              
              // Start observing the document with the configured parameters
              observer.observe(document.body, { childList: true, subtree: true });
              
              // Add CSS to hide common cookie banners
              const style = document.createElement('style');
              style.textContent = \`
                .cookie-banner, .cookie-consent, .cookie-notice, .cookie-policy,
                .cookies-banner, .cookies-consent, .cookies-notice, .cookies-policy,
                .cookie-dialog, .cookie-popup, .cookie-alert, .cookie-warning,
                .gdpr-banner, .gdpr-consent, .gdpr-notice, .gdpr-popup,
                .cc-banner, .cc-window, .cc-dialog, .cc-popup,
                #cookie-banner, #cookie-consent, #cookie-notice, #cookie-policy,
                #cookies-banner, #cookies-consent, #cookies-notice, #cookies-policy,
                #cookie-dialog, #cookie-popup, #cookie-alert, #cookie-warning,
                #gdpr-banner, #gdpr-consent, #gdpr-notice, #gdpr-popup,
                #CybotCookiebotDialog, #onetrust-banner-sdk, #onetrust-consent-sdk,
                .CookieConsent, .CookieBanner, .cookie-law-info-bar,
                .wt-cli-cookie-bar, .js-cookie-consent, .cookieconsent,
                .cookiebar, .cookiealert, .cookienotice,
                .kiosk-hidden-element {
                  display: none !important;
                  visibility: hidden !important;
                  opacity: 0 !important;
                  pointer-events: none !important;
                  height: 0 !important;
                  max-height: 0 !important;
                  overflow: hidden !important;
                }
              \`;
              document.head.appendChild(style);
            })();
          `;
          
          iframeDoc.head.appendChild(script);
        });
      } catch (error) {
        console.error("Error injecting cookie blocker:", error);
      }
    }
  };
  
  useEffect(() => {
    // Inject cookie banner blocker when iframe loads
    injectCookieBlocker();
  }, [activeUrl]);
  
  const handleExitKiosk = () => {
    navigate('/');
  };
  
  if (!activeUrl) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
        <h1 className="text-3xl font-bold mb-4">No Active URL</h1>
        <p className="mb-6">Please set an active URL in the dashboard.</p>
        <button
          onClick={handleExitKiosk}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }
  
  return (
    <div className="h-screen w-screen overflow-hidden relative bg-black">
      <iframe
        ref={iframeRef}
        src={activeUrl.url}
        className="w-full h-full border-0"
        title="Kiosk Content"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
      />
      
      <div 
        className={`absolute top-0 left-0 right-0 p-4 bg-black bg-opacity-70 transition-opacity duration-300 flex justify-between items-center ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <button
          onClick={handleExitKiosk}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
        >
          <ArrowLeft size={18} className="mr-1" />
          Exit Kiosk
        </button>
        <div className="text-white font-medium">
          {activeUrl.name}
        </div>
      </div>
      
      <VirtualKeyboard onClose={() => {}} />
    </div>
  );
};

export default Kiosk;