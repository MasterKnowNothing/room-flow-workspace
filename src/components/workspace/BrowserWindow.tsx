import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, ArrowRight, RotateCcw, Home, Search, X, Minimize2, Maximize2 } from 'lucide-react';

interface BrowserWindowProps {
  initialUrl: string;
  title: string;
  onClose: () => void;
  onUrlChange?: (url: string) => void;
  className?: string;
}

export const BrowserWindow = ({ initialUrl, title, onClose, onUrlChange, className }: BrowserWindowProps) => {
  const [currentUrl, setCurrentUrl] = useState(initialUrl);
  const [inputUrl, setInputUrl] = useState(initialUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const webviewRef = useRef<HTMLIFrameElement>(null);

  const normalizeUrl = (url: string) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    if (url.includes('.') && !url.includes(' ')) {
      return `https://${url}`;
    }
    return `https://www.google.com/search?q=${encodeURIComponent(url)}`;
  };

  const navigateTo = (url: string) => {
    const normalizedUrl = normalizeUrl(url);
    setCurrentUrl(normalizedUrl);
    setInputUrl(normalizedUrl);
    setIsLoading(true);
    onUrlChange?.(normalizedUrl);
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigateTo(inputUrl);
  };

  const handleRefresh = () => {
    if (webviewRef.current) {
      const iframe = webviewRef.current;
      iframe.src = iframe.src;
      setIsLoading(true);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=16`;
    } catch {
      return null;
    }
  };

  return (
    <div className={`bg-background border border-border rounded-lg overflow-hidden flex flex-col ${className}`}>
      {/* Browser Header */}
      <div className="flex items-center gap-2 p-2 bg-muted border-b border-border">
        {/* Navigation Controls */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            disabled={!canGoBack}
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            disabled={!canGoForward}
            onClick={() => window.history.forward()}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleRefresh}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        {/* URL Bar */}
        <form onSubmit={handleUrlSubmit} className="flex-1 flex items-center gap-2">
          <div className="flex-1 relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              {getFaviconUrl(currentUrl) && (
                <img 
                  src={getFaviconUrl(currentUrl)!} 
                  alt="Site icon" 
                  className="w-4 h-4"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              )}
              {!getFaviconUrl(currentUrl) && <Search className="h-4 w-4 text-muted-foreground" />}
            </div>
            <Input
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="pl-10 pr-4"
              placeholder="Search or enter website..."
            />
          </div>
        </form>

        {/* Window Controls */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => navigateTo('https://google.com')}
            title="Home"
          >
            <Home className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-destructive/20"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
        
        {/* Iframe Container */}
        <iframe
          ref={webviewRef}
          src={currentUrl}
          className="w-full h-full border-0"
          onLoad={handleLoad}
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
          title={title}
        />
      </div>
    </div>
  );
};