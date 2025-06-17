import React, { useState, useRef, useEffect } from 'react';
import { X, Minimize2, Maximize2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WorkspaceWindow } from './MultiSpace';

interface DraggableWindowProps {
  window: WorkspaceWindow;
  onClose: () => void;
  onUpdate: (updates: Partial<WorkspaceWindow>) => void;
  onFocus: () => void;
}

export const DraggableWindow = ({ window, onClose, onUpdate, onFocus }: DraggableWindowProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState('');
  const [isMaximized, setIsMaximized] = useState(false);
  const [prevDimensions, setPrevDimensions] = useState({ x: 0, y: 0, width: 0, height: 0 });
  
  const windowRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !isMaximized) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        
        // Keep window within viewport bounds
        const maxX = globalThis.window.innerWidth - window.width;
        const maxY = globalThis.window.innerHeight - window.height;
        
        onUpdate({
          x: Math.max(0, Math.min(maxX, newX)),
          y: Math.max(0, Math.min(maxY, newY))
        });
      }
      
      if (isResizing) {
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
  }, [isDragging, isResizing, dragOffset, window, resizeDirection, isMaximized, onUpdate]);

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

  const toggleMaximize = () => {
    if (isMaximized) {
      onUpdate(prevDimensions);
      setIsMaximized(false);
    } else {
      setPrevDimensions({ x: window.x, y: window.y, width: window.width, height: window.height });
      onUpdate({
        x: 0,
        y: 0,
        width: globalThis.window.innerWidth,
        height: globalThis.window.innerHeight
      });
      setIsMaximized(true);
    }
  };

  const toggleMinimize = () => {
    onUpdate({ isMinimized: !window.isMinimized });
  };

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
      className="fixed bg-glass backdrop-blur-md border border-glass-border rounded-lg shadow-2xl overflow-hidden select-none"
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
        className="flex items-center justify-between bg-glass/50 border-b border-glass-border p-2 cursor-move"
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-3 h-3 bg-primary rounded-full" />
          <span className="text-sm font-medium text-workspace-foreground truncate">
            {window.title}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:bg-glass/80"
            onClick={(e) => {
              e.stopPropagation();
              toggleMinimize();
            }}
          >
            <Minimize2 className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:bg-glass/80"
            onClick={(e) => {
              e.stopPropagation();
              toggleMaximize();
            }}
          >
            {isMaximized ? <RotateCcw className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:bg-destructive/20"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Window Content */}
      <div className="w-full h-full bg-background">
        <iframe
          src={window.url}
          className="w-full h-full border-0"
          style={{ height: 'calc(100% - 40px)' }}
          title={window.title}
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
        />
      </div>

      {/* Resize Handles */}
      {!isMaximized && (
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
