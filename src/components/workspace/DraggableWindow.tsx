import React, { useState, useRef, useEffect } from 'react';
import { X, Minimize2, Maximize2, ArrowLeft, ArrowRight, RotateCcw, Home, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { WorkspaceWindow } from './MultiSpace';

interface DraggableWindowProps {
  window: WorkspaceWindow;
  onClose: () => void;
  onUpdate: (updates: Partial<WorkspaceWindow>) => void;
  onFocus: () => void;
}

export const DraggableWindow = ({ window, onClose, onUpdate, onFocus }: DraggableWindowProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState('');
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [inputUrl, setInputUrl] = useState(window.url);
  const [currentUrl, setCurrentUrl] = useState(window.url);
  const [showHomepage, setShowHomepage] = useState(false);
  
  const windowRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentUrl(window.url);
    setInputUrl(window.url);
  }, [window.url]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !window.isFullscreen) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        
        // Keep within viewport bounds
        const maxX = window.innerWidth - window.width;
        const maxY = window.innerHeight - window.height;
        
        onUpdate({
          x: Math.max(0, Math.min(maxX, newX)),
          y: Math.max(0, Math.min(maxY, newY))
        });
      }
      
      if (isResizing && !window.isFullscreen) {
        const rect = windowRef.current?.getBoundingClientRect();
        if (!rect) return;
        
        let newWidth = window.width;
        let newHeight = window.height;
        let newX = window.x;
        let newY = window.y;
        
        if (resizeDirection.includes('e')) {
          newWidth = e.clientX - rect.left;
        }
        if (resizeDirection.includes('w')) {
          newWidth = rect.right - e.clientX;
          newX = e.clientX;
        }
        if (resizeDirection.includes('s')) {
          newHeight = e.clientY - rect.top;
        }
        if (resizeDirection.includes('n')) {
          newHeight = rect.bottom - e.clientY;
          newY = e.clientY;
        }
        
        // Minimum dimensions
        newWidth = Math.max(300, newWidth);
        newHeight = Math.max(200, newHeight);
        
        onUpdate({ width: newWidth, height: newHeight, x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeDirection('');
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, window, resizeDirection, onUpdate]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === headerRef.current || headerRef.current?.contains(e.target as Node)) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - window.x,
        y: e.clientY - window.y
      });
    }
    onFocus();
  };

  const handleResizeStart = (direction: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeDirection(direction);
  };

  const toggleFullscreen = () => {
    if (window.isFullscreen) {
      // Restore from fullscreen
      onUpdate({
        isFullscreen: false,
        ...window.savedPosition
      });
    } else {
      // Go fullscreen
      onUpdate({
        isFullscreen: true,
        savedPosition: { x: window.x, y: window.y, width: window.width, height: window.height },
        x: 0,
        y: 0,
        width: window.innerWidth,
        height: window.innerHeight - 200
      });
    }
  };

  const toggleMinimize = () => {
    onUpdate({ isMinimized: !window.isMinimized });
  };

  const navigateTo = (url: string) => {
    const normalizedUrl = normalizeUrl(url);
    setCurrentUrl(normalizedUrl);
    setInputUrl(normalizedUrl);
    setShowHomepage(false);
    onUpdate({ url: normalizedUrl });
  };

  const normalizeUrl = (url: string) => {
    if (url === 'file-opener') return url;
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    if (url.includes('.') && !url.includes(' ')) {
      return `https://${url}`;
    }
    return `https://www.google.com/search?q=${encodeURIComponent(url)}`;
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigateTo(inputUrl);
  };

  const handleHome = () => {
    setShowHomepage(true);
    setCurrentUrl('home');
    setInputUrl('');
  };

  const renderHomepage = () => (
    <div className="flex flex-col items-center justify-center h-full p-8 bg-background">
      <div className="text-center space-y-6 max-w-md">
        <h2 className="text-2xl font-bold">Welcome back to your Multispace</h2>
        <p className="text-muted-foreground">Use the search above or open a tool from the Quick Access bar.</p>
        
        <div className="w-full">
          <Input
            placeholder="Search the web..."
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                navigateTo(inputUrl);
              }
            }}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );

  if (window.isMinimized) {
    return (
      <div 
        className="fixed bottom-16 left-4 bg-glass backdrop-blur-md border border-glass-border rounded-lg p-2 cursor-pointer hover:bg-glass/80 transition-all duration-200 z-40"
        onClick={toggleMinimize}
        style={{ zIndex: window.zIndex }}
      >
        <div className="flex items-center gap-2">
          <div className="w-4 h-3 bg-primary/20 rounded-sm" />
          <span className="text-sm text-workspace-foreground truncate max-w-32">
            {window.title}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={windowRef}
      className="fixed bg-background border border-border rounded-lg shadow-2xl overflow-hidden select-none"
      style={{
        left: window.x,
        top: window.y,
        width: window.width,
        height: window.height,
        zIndex: window.zIndex
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Window Header */}
      <div
        ref={headerRef}
        className="flex items-center gap-2 p-2 bg-muted border-b border-border cursor-move"
      >
        {/* Navigation Controls */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleHome}>
            <Home className="h-4 w-4" />
          </Button>
        </div>

        {/* URL Bar */}
        <form onSubmit={handleUrlSubmit} className="flex-1 flex items-center gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
            onClick={(e) => {
              e.stopPropagation();
              toggleMinimize();
            }}
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              toggleFullscreen();
            }}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-destructive/20"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="w-full h-full" style={{ height: 'calc(100% - 48px)' }}>
        {showHomepage || currentUrl === 'home' ? (
          renderHomepage()
        ) : window.url === 'file-opener' ? (
          <div className="flex items-center justify-center h-full p-8">
            <div className="text-center space-y-4">
              <div className="text-6xl">📁</div>
              <h3 className="text-lg font-semibold">Open File</h3>
              <input
                type="file"
                className="block w-full text-sm text-muted-foreground
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary file:text-primary-foreground
                  hover:file:bg-primary/90 cursor-pointer"
                accept="*/*"
              />
            </div>
          </div>
        ) : (
          <iframe
            src={currentUrl}
            className="w-full h-full border-0"
            title={window.title}
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
          />
        )}
      </div>

      {/* Resize Handles */}
      {!window.isFullscreen && (
        <>
          <div
            className="absolute top-0 left-0 w-full h-1 cursor-n-resize"
            onMouseDown={handleResizeStart('n')}
          />
          <div
            className="absolute bottom-0 left-0 w-full h-1 cursor-s-resize"
            onMouseDown={handleResizeStart('s')}
          />
          <div
            className="absolute left-0 top-0 w-1 h-full cursor-w-resize"
            onMouseDown={handleResizeStart('w')}
          />
          <div
            className="absolute right-0 top-0 w-1 h-full cursor-e-resize"
            onMouseDown={handleResizeStart('e')}
          />
          <div
            className="absolute top-0 left-0 w-2 h-2 cursor-nw-resize"
            onMouseDown={handleResizeStart('nw')}
          />
          <div
            className="absolute top-0 right-0 w-2 h-2 cursor-ne-resize"
            onMouseDown={handleResizeStart('ne')}
          />
          <div
            className="absolute bottom-0 left-0 w-2 h-2 cursor-sw-resize"
            onMouseDown={handleResizeStart('sw')}
          />
          <div
            className="absolute bottom-0 right-0 w-2 h-2 cursor-se-resize"
            onMouseDown={handleResizeStart('se')}
          />
        </>
      )}
    </div>
  );
};
