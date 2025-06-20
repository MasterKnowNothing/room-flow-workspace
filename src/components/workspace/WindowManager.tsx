import React, { useState, useEffect } from 'react';
import { BrowserWindow } from './BrowserWindow';
import { FileOpenerWindow } from './FileOpenerWindow';
import { WorkspaceWindow } from './MultiSpace';

interface WindowManagerProps {
  windows: WorkspaceWindow[];
  onClose: (windowId: string) => void;
  onUpdate: (windowId: string, updates: Partial<WorkspaceWindow>) => void;
  onFocus: (windowId: string) => void;
}

export const WindowManager = ({ windows, onClose, onUpdate, onFocus }: WindowManagerProps) => {
  const [screenLayout, setScreenLayout] = useState<{ cols: number; rows: number }>({ cols: 1, rows: 1 });

  useEffect(() => {
    const activeWindows = windows.filter(w => !w.isMinimized);
    const count = activeWindows.length;
    
    if (count === 0) {
      setScreenLayout({ cols: 1, rows: 1 });
    } else if (count === 1) {
      setScreenLayout({ cols: 1, rows: 1 });
    } else if (count === 2) {
      setScreenLayout({ cols: 2, rows: 1 });
    } else if (count <= 4) {
      setScreenLayout({ cols: 2, rows: 2 });
    } else if (count <= 6) {
      setScreenLayout({ cols: 3, rows: 2 });
    } else if (count <= 9) {
      setScreenLayout({ cols: 3, rows: 3 });
    } else {
      setScreenLayout({ cols: 4, rows: 3 });
    }
  }, [windows]);

  const activeWindows = windows.filter(w => !w.isMinimized);
  const minimizedWindows = windows.filter(w => w.isMinimized);

  const getWindowDimensions = (index: number) => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const headerHeight = 120; // Space for header controls
    const footerHeight = 100; // Space for app dock
    const sidebarWidth = 350; // Space for sidebar
    
    const availableWidth = viewportWidth - sidebarWidth - 40;
    const availableHeight = viewportHeight - headerHeight - footerHeight;
    
    const windowWidth = availableWidth / screenLayout.cols;
    const windowHeight = availableHeight / screenLayout.rows;
    
    const col = index % screenLayout.cols;
    const row = Math.floor(index / screenLayout.cols);
    
    return {
      width: windowWidth - 10,
      height: windowHeight - 10,
      x: sidebarWidth + (col * windowWidth) + 5,
      y: headerHeight + (row * windowHeight) + 5,
    };
  };

  const handleFileOpen = (fileName: string, fileContent: string, fileType: string) => {
    // Create a new window for the opened file
    const newWindow: WorkspaceWindow = {
      id: Date.now().toString(),
      title: fileName,
      url: fileContent,
      ...getWindowDimensions(activeWindows.length),
      zIndex: 1000,
    };
    
    // This would need to be passed up to the parent component
    console.log('File opened:', { fileName, fileType });
  };

  return (
    <>
      {/* Active Windows */}
      {activeWindows.map((window, index) => {
        const dimensions = getWindowDimensions(index);
        
        return (
          <div
            key={window.id}
            className="fixed"
            style={{
              left: dimensions.x,
              top: dimensions.y,
              width: dimensions.width,
              height: dimensions.height,
              zIndex: window.zIndex,
            }}
          >
            {window.url === 'file-opener' ? (
              <div className="w-full h-full bg-background border border-border rounded-lg">
                <FileOpenerWindow onFileOpen={handleFileOpen} />
              </div>
            ) : (
              <BrowserWindow
                initialUrl={window.url}
                title={window.title}
                onClose={() => onClose(window.id)}
                onUrlChange={(newUrl) => onUpdate(window.id, { url: newUrl })}
                className="w-full h-full"
              />
            )}
          </div>
        );
      })}

      {/* Minimized Windows */}
      {minimizedWindows.map((window, index) => (
        <div 
          key={window.id}
          className="fixed bottom-16 bg-glass backdrop-blur-md border border-glass-border rounded-lg p-2 cursor-pointer hover:bg-glass/80 transition-all duration-200 z-40"
          style={{ left: 20 + (index * 160), zIndex: window.zIndex }}
          onClick={() => onUpdate(window.id, { isMinimized: false })}
        >
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 bg-primary/20 rounded-sm" />
            <span className="text-sm text-workspace-foreground truncate max-w-32">
              {window.title}
            </span>
          </div>
        </div>
      ))}
    </>
  );
};