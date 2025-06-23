
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
  isExpanded?: boolean;
}

export const ScreenLayout = () => {
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

  const addSideScreen = (side: 'left' | 'right') => {
    const existingScreens = screens.filter(s => s.position?.startsWith(side));
    const newPosition = `${side}-${existingScreens.length % 2 === 0 ? 'top' : 'bottom'}` as const;
    const newScreen: Screen = {
      id: `${side}-${Date.now()}`,
      type: 'side',
      position: newPosition,
      title: `Screen ${screens.length}`
    };
    setScreens(prev => [...prev, newScreen]);
  };

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
              />
            </div>
          ))}
        <Button 
          variant="outline" 
          onClick={() => addSideScreen('left')}
          className="mt-2"
        >
          + Add Left Screen
        </Button>
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
              />
            </div>
          ))}
        <Button 
          variant="outline" 
          onClick={() => addSideScreen('right')}
          className="mt-2"
        >
          + Add Right Screen
        </Button>
      </div>
    </div>
  );
};
