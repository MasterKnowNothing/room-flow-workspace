
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Maximize2, Search, Globe } from 'lucide-react';
import { Screen } from './ScreenLayout';

interface SideScreenProps {
  screen: Screen;
  isFullscreen?: boolean;
  onExpand: () => void;
  onMinimize: () => void;
}

export const SideScreen = ({ screen, isFullscreen = false, onExpand, onMinimize }: SideScreenProps) => {
  const [url, setUrl] = useState('');
  const [currentUrl, setCurrentUrl] = useState('');

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;
    setCurrentUrl(normalizedUrl);
  };

  return (
    <div className="h-full bg-background border border-border rounded-lg overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-2 bg-muted border-b">
        <h3 className="text-sm font-medium truncate">{screen.title}</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onExpand}
          className="h-6 w-6"
        >
          <Maximize2 className="h-3 w-3" />
        </Button>
      </div>

      {/* URL Bar */}
      <div className="p-2 border-b">
        <form onSubmit={handleUrlSubmit} className="flex gap-2">
          <div className="flex-1 relative">
            <Globe className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL..."
              className="pl-8 h-7 text-xs"
            />
          </div>
        </form>
      </div>

      {/* Content */}
      <div className="flex-1 relative">
        {currentUrl ? (
          <iframe
            src={currentUrl}
            className="w-full h-full border-0"
            title={screen.title}
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-2">Enter a URL above</p>
            <p className="text-xs text-muted-foreground">
              Browse any website or web app
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
