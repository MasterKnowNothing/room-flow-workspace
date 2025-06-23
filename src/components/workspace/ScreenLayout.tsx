
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2 } from 'lucide-react';
import { VirtualDesktop } from './VirtualDesktop';
import { SideScreen } from './SideScreen';

export interface Screen {
  id: string;
  type: 'main' | 'side';
  position?: 'left-top' | 'left-bottom' | 'right-top' | 'right-bottom';
  title: string;
  content?: string;
  url?: string;
  isExpanded?: boolean;
}

interface ScreenLayoutProps {
  onAppOpen?: (app: { name: string; url: string; icon: string }, screenId: string) => void;
}

export const ScreenLayout = ({ onAppOpen }: ScreenLayoutProps) => {
  const [screens, setScreens] = useState<Screen[]>([
    { id: 'main', type: 'main', title: 'Virtual Desktop' },
    { id: 'left-top', type: 'side', position: 'left-top', title: 'Screen 1' },
    { id: 'left-bottom', type: 'side', position: 'left-bottom', title: 'Screen 2' },
    { id: 'right-top', type: 'side', position: 'right-top', title: 'Screen 3' },
    { id: 'right-bottom', type: 'side', position: 'right-bottom', title: 'Screen 4' }
  ]);

  const [expandedScreen, setExpandedScreen] = useState<string | null>(null);

  const handleExpand = (screenId: string) => {
    setExpandedScreen(screenId);
  };

  const handleMinimize = () => {
    setExpandedScreen(null);
  };

  const handleUrlChange = (screenId: string, url: string) => {
    console.log(`Setting URL for screen ${screenId}: ${url}`);
    setScreens(prev => prev.map(screen => 
      screen.id === screenId ? { ...screen, url } : screen
    ));
  };

  // Handle app opening on specific screen
  const handleAppOpenOnScreen = (app: { name: string; url: string; icon: string }, screenId: string) => {
    console.log(`Opening ${app.name} on screen ${screenId} with URL: ${app.url}`);
    
    // Find the screen and update its URL
    const targetScreen = screens.find(s => s.id === screenId);
    if (targetScreen) {
      console.log(`Found target screen: ${targetScreen.title}`);
      handleUrlChange(screenId, app.url);
      onAppOpen?.(app, screenId);
    } else {
      console.error(`Screen ${screenId} not found`);
    }
  };

  // Register this function globally so AppDock can use it
  React.useEffect(() => {
    console.log('Registering openAppOnScreen function');
    (window as any).openAppOnScreen = handleAppOpenOnScreen;
    
    return () => {
      delete (window as any).openAppOnScreen;
    };
  }, [screens]);

  if (expandedScreen) {
    const screen = screens.find(s => s.id === expandedScreen);
    return (
      <div className="absolute inset-0 bg-background">
        <div className="absolute top-2 right-2 z-50">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleMinimize}
            className="bg-background/80 backdrop-blur-sm"
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
        </div>
        
        {screen?.type === 'main' ? (
          <VirtualDesktop isFullscreen={true} />
        ) : (
          <SideScreen 
            screen={screen!} 
            isFullscreen={true}
            onExpand={() => {}}
            onMinimize={handleMinimize}
            onUrlChange={handleUrlChange}
          />
        )}
      </div>
    );
  }

  return (
    <div className="absolute inset-0 p-4 grid grid-cols-12 grid-rows-12 gap-4">
      {/* Left Side Screens */}
      <div className="col-span-3 row-span-12 flex flex-col gap-4">
        {screens
          .filter(s => s.position?.startsWith('left'))
          .map(screen => (
            <div key={screen.id} className="flex-1">
              <SideScreen 
                screen={screen}
                onExpand={() => handleExpand(screen.id)}
                onMinimize={() => {}}
                onUrlChange={handleUrlChange}
              />
            </div>
          ))}
      </div>

      {/* Main Virtual Desktop */}
      <div className="col-span-6 row-span-12">
        <div className="relative h-full bg-background border border-border rounded-lg overflow-hidden">
          <div className="absolute top-2 right-2 z-10">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleExpand('main')}
              className="bg-background/80 backdrop-blur-sm"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
          <VirtualDesktop />
        </div>
      </div>

      {/* Right Side Screens */}
      <div className="col-span-3 row-span-12 flex flex-col gap-4">
        {screens
          .filter(s => s.position?.startsWith('right'))
          .map(screen => (
            <div key={screen.id} className="flex-1">
              <SideScreen 
                screen={screen}
                onExpand={() => handleExpand(screen.id)}
                onMinimize={() => {}}
                onUrlChange={handleUrlChange}
              />
            </div>
          ))}
      </div>
    </div>
  );
};
