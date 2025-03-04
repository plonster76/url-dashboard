import React, { useEffect, useState, useRef } from 'react';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';

interface VirtualKeyboardProps {
  onClose: () => void;
}

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ onClose }) => {
  const [input, setInput] = useState('');
  const [layout, setLayout] = useState('default');
  const [activeElement, setActiveElement] = useState<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const keyboardRef = useRef<any>(null);
  
  useEffect(() => {
    // Function to access iframe document
    const getIframeDocument = () => {
      const iframe = document.querySelector('iframe');
      return iframe?.contentDocument || iframe?.contentWindow?.document;
    };

    // Function to handle input focus
    const handleFocus = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        const inputElement = target as HTMLInputElement | HTMLTextAreaElement;
        setActiveElement(inputElement);
        setInput(inputElement.value || '');
        setIsVisible(true);
      }
    };
    
    // Function to handle blur
    const handleBlur = () => {
      // Use a timeout to prevent keyboard from disappearing when clicking on it
      setTimeout(() => {
        const mainActiveElement = document.activeElement;
        const iframeDoc = getIframeDocument();
        const iframeActiveElement = iframeDoc?.activeElement;
        
        const isInputFocused = 
          (mainActiveElement && (mainActiveElement.tagName === 'INPUT' || mainActiveElement.tagName === 'TEXTAREA')) ||
          (iframeActiveElement && (iframeActiveElement.tagName === 'INPUT' || iframeActiveElement.tagName === 'TEXTAREA'));
        
        if (!isInputFocused && !keyboardRef.current?.div.contains(mainActiveElement)) {
          setIsVisible(false);
        }
      }, 200);
    };

    // Function to handle iframe load
    const handleIframeLoad = () => {
      const iframeDoc = getIframeDocument();
      if (iframeDoc) {
        // Remove any existing listeners to avoid duplicates
        iframeDoc.removeEventListener('focusin', handleFocus);
        iframeDoc.removeEventListener('focusout', handleBlur);
        
        // Add new listeners
        iframeDoc.addEventListener('focusin', handleFocus);
        iframeDoc.addEventListener('focusout', handleBlur);
        
        // Add listeners to all input elements
        const inputs = iframeDoc.querySelectorAll('input, textarea');
        inputs.forEach(input => {
          input.removeEventListener('focus', handleFocus);
          input.removeEventListener('blur', handleBlur);
          input.addEventListener('focus', handleFocus);
          input.addEventListener('blur', handleBlur);
        });
      }
    };

    // Add event listeners to the main document
    document.addEventListener('focusin', handleFocus);
    document.addEventListener('focusout', handleBlur);
    
    // Add listener for iframe load
    const iframe = document.querySelector('iframe');
    if (iframe) {
      iframe.addEventListener('load', handleIframeLoad);
      
      // If iframe is already loaded, initialize listeners
      if (iframe.contentDocument) {
        handleIframeLoad();
      }
    }
    
    // Set up mutation observer to detect DOM changes in iframe
    const observeIframeChanges = () => {
      const iframeDoc = getIframeDocument();
      if (!iframeDoc) return;
      
      const observer = new MutationObserver((mutations) => {
        // When DOM changes, check for new inputs
        const inputs = iframeDoc.querySelectorAll('input, textarea');
        inputs.forEach(input => {
          input.removeEventListener('focus', handleFocus);
          input.removeEventListener('blur', handleBlur);
          input.addEventListener('focus', handleFocus);
          input.addEventListener('blur', handleBlur);
        });
      });
      
      observer.observe(iframeDoc.body, { 
        childList: true, 
        subtree: true 
      });
      
      return observer;
    };
    
    // Initialize observer
    const observer = observeIframeChanges();
    
    // Check iframe content periodically as a fallback
    const intervalId = setInterval(() => {
      handleIframeLoad();
    }, 2000);
    
    return () => {
      document.removeEventListener('focusin', handleFocus);
      document.removeEventListener('focusout', handleBlur);
      
      const iframe = document.querySelector('iframe');
      if (iframe) {
        iframe.removeEventListener('load', handleIframeLoad);
      }
      
      if (observer) {
        observer.disconnect();
      }
      
      clearInterval(intervalId);
    };
  }, []);
  
  const onChange = (input: string) => {
    setInput(input);
    if (activeElement) {
      activeElement.value = input;
      // Trigger input event to update React controlled components
      const event = new Event('input', { bubbles: true });
      activeElement.dispatchEvent(event);
    }
  };
  
  const handleShift = () => {
    setLayout(layout === 'default' ? 'shift' : 'default');
  };
  
  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 bg-gray-100 p-2 shadow-lg transition-transform duration-300 z-50 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="flex justify-between items-center mb-2">
        <button 
          onClick={() => setIsVisible(false)}
          className="px-4 py-1 bg-red-500 text-white rounded"
        >
          Close Keyboard
        </button>
      </div>
      
      <div ref={keyboardRef}>
        <Keyboard
          layoutName={layout}
          onChange={onChange}
          onKeyPress={(button) => {
            if (button === '{shift}' || button === '{lock}') {
              handleShift();
            }
          }}
        />
      </div>
    </div>
  );
};

export default VirtualKeyboard;