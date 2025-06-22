
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, X, Edit3 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface App {
  name: string;
  url: string;
  icon: string;
}

interface AppDockProps {
  onOpenApp: (app: App) => void;
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

export const AppDock = ({ onOpenApp }: AppDockProps) => {
  const [customAppName, setCustomAppName] = useState('');
  const [customAppUrl, setCustomAppUrl] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [apps, setApps] = useState<App[]>(defaultApps);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [editingApp, setEditingApp] = useState<number | null>(null);

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
      onOpenApp(newApp);
      
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

  const handleAppClick = (app: App, index: number) => {
    if (app.url === 'file-opener') {
      onOpenApp(app);
    } else {
      onOpenApp(app);
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
      <div className="flex items-center gap-2 bg-glass backdrop-blur-md border border-glass-border rounded-full px-4 py-2 shadow-lg">
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
              className="h-12 w-12 rounded-full hover:bg-glass/80 hover:scale-110 transition-all duration-200 text-lg cursor-pointer"
              onClick={() => handleAppClick(app, index)}
              onContextMenu={(e) => handleRightClick(e, index)}
              title={app.name}
            >
              {app.icon}
            </Button>
            
            {editingApp === index && (
              <div className="absolute top-14 left-0 bg-popover border border-border rounded-md p-2 shadow-md z-50 min-w-48">
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
        <div className="w-px h-8 bg-glass-border mx-2" />

        {/* Add Custom App */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <div className="flex flex-col items-center">
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-full hover:bg-glass/80 hover:scale-110 transition-all duration-200"
                title="Add Custom App"
              >
                <Plus className="h-5 w-5" />
              </Button>
              <span className="text-xs text-muted-foreground mt-1">Access any app</span>
            </div>
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
    </div>
  );
};
