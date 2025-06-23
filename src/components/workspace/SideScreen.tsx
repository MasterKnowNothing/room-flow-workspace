
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Maximize2, Search, RefreshCw } from 'lucide-react';
import { Screen } from './ScreenLayout';

interface SideScreenProps {
  screen: Screen;
  isFullscreen?: boolean;
  onExpand: () => void;
  onMinimize: () => void;
  onUrlChange?: (screenId: string, url: string) => void;
}

export const SideScreen = ({ screen, isFullscreen = false, onExpand, onMinimize, onUrlChange }: SideScreenProps) => {
  const [currentUrl, setCurrentUrl] = useState('');

  // Update URL when screen.url changes
  useEffect(() => {
    if (screen.url && screen.url !== currentUrl) {
      console.log(`SideScreen ${screen.id} updating URL to: ${screen.url}`);
      setCurrentUrl(screen.url);
    }
  }, [screen.url]);

  const handleReplace = () => {
    // Clear current URL to allow new app selection
    setCurrentUrl('');
    onUrlChange?.(screen.id, '');
  };

  return (
    <div className="h-full bg-background border border-border rounded-lg overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-2 bg-muted border-b">
        <h3 className="text-sm font-medium truncate">{screen.title}</h3>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleReplace}
            className="h-6 w-6"
            title="Replace content"
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onExpand}
            className="h-6 w-6"
          >
            <Maximize2 className="h-3 w-3" />
          </Button>
        </div>
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
            <p className="text-sm text-muted-foreground mb-2">Select an app from the dock</p>
            <p className="text-xs text-muted-foreground">
              Click any app and choose this screen
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
