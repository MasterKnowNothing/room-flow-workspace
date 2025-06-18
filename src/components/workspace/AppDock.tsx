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
  { name: 'YouTube', url: 'https://youtube.com', icon: '📺' },
  { name: 'Spotify', url: 'https://open.spotify.com', icon: '🎵' },
];

export const AppDock = ({ onOpenApp }: AppDockProps) => {
  const [customAppName, setCustomAppName] = useState('');
  const [customAppUrl, setCustomAppUrl] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [apps, setApps] = useState<App[]>(defaultApps);

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

  const removeApp = (index: number) => {
    setApps(prev => prev.filter((_, i) => i !== index));
  };

  const moveApp = (fromIndex: number, toIndex: number) => {
    setApps(prev => {
      const newApps = [...prev];
      const [movedApp] = newApps.splice(fromIndex, 1);
      newApps.splice(toIndex, 0, movedApp);
      return newApps;
    });
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2 bg-glass backdrop-blur-md border border-glass-border rounded-full px-4 py-2 shadow-lg">
        {/* Apps */}
        {apps.map((app, index) => (
          <div key={app.name} className="relative group">
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-full hover:bg-glass/80 hover:scale-110 transition-all duration-200 text-lg"
              onClick={() => !isEditMode && onOpenApp(app)}
              title={app.name}
            >
              {app.icon}
            </Button>
            {isEditMode && (
              <Button
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeApp(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        ))}

      {/* Separator */}
      <div className="w-px h-8 bg-glass-border mx-2" />

      {/* Add Custom App */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-full hover:bg-glass/80 hover:scale-110 transition-all duration-200"
            title="Add Custom App"
          >
            <Plus className="h-5 w-5" />
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
      
      {/* Edit Button */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute -top-8 right-0 text-xs underline hover:no-underline"
        onClick={() => setIsEditMode(!isEditMode)}
      >
        <Edit3 className="h-3 w-3 mr-1" />
        edit
      </Button>
    </div>
  );
};