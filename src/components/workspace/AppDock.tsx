
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, X, Edit3 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface App {
  name: string;
  url: string;
  icon: string;
}

interface AppDockProps {
  onOpenApp: (app: App, screenId?: string) => void;
}

const defaultApps: App[] = [
  { name: 'Systematron', url: 'https://systematron.com', icon: '⚙️' },
  { name: 'Word', url: 'https://office.live.com/start/Word.aspx', icon: '📄' },
  { name: 'Notion', url: 'https://notion.so', icon: '📝' },
  { name: 'Calculator', url: 'https://calculator.net', icon: '🧮' },
  { name: 'DuckDuckGo', url: 'https://duckduckgo.com', icon: '🔍' },
  { name: 'Figma', url: 'https://figma.com', icon: '🎨' },
  { name: 'Open File', url: 'file-opener', icon: '📁' },
  { name: 'Spotify', url: 'https://open.spotify.com', icon: '🎵' },
];

const screenOptions = [
  { id: 'left-top', label: 'Screen 1' },
  { id: 'left-bottom', label: 'Screen 2' },
  { id: 'right-top', label: 'Screen 3' },
  { id: 'right-bottom', label: 'Screen 4' },
];

export const AppDock = ({ onOpenApp }: AppDockProps) => {
  const [customAppName, setCustomAppName] = useState('');
  const [customAppUrl, setCustomAppUrl] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [apps, setApps] = useState<App[]>(defaultApps);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [editingApp, setEditingApp] = useState<number | null>(null);
  const [screenSelectionApp, setScreenSelectionApp] = useState<App | null>(null);
  const [selectedScreen, setSelectedScreen] = useState<string>('');

  const handleAddCustomApp = () => {
    if (customAppName && customAppUrl) {
      let url = customAppUrl;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      
      const newApp = {
        name: customAppName,
        url: url,
        icon: '🌐'
      };
      
      setApps(prev => [...prev, newApp]);
      setScreenSelectionApp(newApp);
      
      setCustomAppName('');
      setCustomAppUrl('');
      setIsDialogOpen(false);
    }
  };

  const moveApp = (fromIndex: number, toIndex: number) => {
    setApps(prev => {
      const newApps = [...prev];
      const [movedApp] = newApps.splice(fromIndex, 1);
      newApps.splice(toIndex, 0, movedApp);
      return newApps;
    });
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      moveApp(draggedIndex, index);
      setDraggedIndex(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleAppClick = (app: App) => {
    console.log(`AppDock: App clicked: ${app.name}`);
    setScreenSelectionApp(app);
  };

  const handleScreenSelection = () => {
    if (screenSelectionApp && selectedScreen) {
      console.log(`AppDock: Opening ${screenSelectionApp.name} on screen ${selectedScreen}`);
      
      // Use the global function to actually open the app on the screen
      if ((window as any).openAppOnScreen) {
        console.log('AppDock: Calling openAppOnScreen function');
        (window as any).openAppOnScreen(screenSelectionApp, selectedScreen);
      } else {
        console.error('AppDock: openAppOnScreen function not found on window');
      }
      
      onOpenApp(screenSelectionApp, selectedScreen);
      setScreenSelectionApp(null);
      setSelectedScreen('');
    } else {
      console.error('AppDock: Missing app or screen selection', { 
        hasApp: !!screenSelectionApp, 
        hasScreen: !!selectedScreen,
        app: screenSelectionApp?.name,
        screen: selectedScreen
      });
    }
  };

  const handleRightClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    setEditingApp(index);
  };

  const updateApp = (index: number, newUrl: string) => {
    setApps(prev => prev.map((app, i) => 
      i === index ? { ...app, url: newUrl } : app
    ));
    setEditingApp(null);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2 bg-glass backdrop-blur-md border border-glass-border rounded-full px-3 py-1 shadow-lg">
        {/* Apps */}
        {apps.map((app, index) => (
          <div 
            key={app.name} 
            className="relative group"
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full hover:bg-glass/80 hover:scale-110 transition-all duration-200 text-lg cursor-pointer"
              onClick={() => handleAppClick(app)}
              onContextMenu={(e) => handleRightClick(e, index)}
              title={app.name}
            >
              {app.icon}
            </Button>
            
            {editingApp === index && (
              <div className="absolute top-12 left-0 bg-popover border border-border rounded-md p-2 shadow-md z-50 min-w-48">
                <Input
                  placeholder="Enter new URL"
                  defaultValue={app.url}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      updateApp(index, e.currentTarget.value);
                    } else if (e.key === 'Escape') {
                      setEditingApp(null);
                    }
                  }}
                  onBlur={(e) => updateApp(index, e.target.value)}
                  autoFocus
                />
              </div>
            )}
          </div>
        ))}

        {/* Separator */}
        <div className="w-px h-6 bg-glass-border mx-1" />

        {/* Add Custom App */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full hover:bg-glass/80 hover:scale-110 transition-all duration-200"
              title="Add Custom App"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Custom App</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  App Name
                </label>
                <Input
                  placeholder="e.g., YouTube, Twitter..."
                  value={customAppName}
                  onChange={(e) => setCustomAppName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  URL
                </label>
                <Input
                  placeholder="e.g., youtube.com, twitter.com..."
                  value={customAppUrl}
                  onChange={(e) => setCustomAppUrl(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1"
                  onClick={handleAddCustomApp}
                  disabled={!customAppName || !customAppUrl}
                >
                  Add App
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Screen Selection Dialog */}
      <Dialog open={!!screenSelectionApp} onOpenChange={() => {
        setScreenSelectionApp(null);
        setSelectedScreen('');
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Choose Screen</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Select which screen to open {screenSelectionApp?.name} on:
            </p>
            
            <Select value={selectedScreen} onValueChange={setSelectedScreen}>
              <SelectTrigger>
                <SelectValue placeholder="Select a screen" />
              </SelectTrigger>
              <SelectContent>
                {screenOptions.map((screen) => (
                  <SelectItem key={screen.id} value={screen.id}>
                    {screen.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  setScreenSelectionApp(null);
                  setSelectedScreen('');
                }}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1"
                onClick={handleScreenSelection}
                disabled={!selectedScreen}
              >
                Open on Screen
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
