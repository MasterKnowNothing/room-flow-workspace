import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
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

const popularApps: App[] = [
  { name: 'Notion', url: 'https://notion.so', icon: '📝' },
  { name: 'ChatGPT', url: 'https://chat.openai.com', icon: '🤖' },
  { name: 'Google Docs', url: 'https://docs.google.com', icon: '📄' },
  { name: 'Figma', url: 'https://figma.com', icon: '🎨' },
  { name: 'Linear', url: 'https://linear.app', icon: '📋' },
  { name: 'GitHub', url: 'https://github.com', icon: '💻' },
  { name: 'Calendar', url: 'https://calendar.google.com', icon: '📅' },
  { name: 'Gmail', url: 'https://gmail.com', icon: '📧' },
];

export const AppDock = ({ onOpenApp }: AppDockProps) => {
  const [customAppName, setCustomAppName] = useState('');
  const [customAppUrl, setCustomAppUrl] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddCustomApp = () => {
    if (customAppName && customAppUrl) {
      let url = customAppUrl;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      
      onOpenApp({
        name: customAppName,
        url: url,
        icon: '🌐'
      });
      
      setCustomAppName('');
      setCustomAppUrl('');
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="flex items-center gap-2 bg-glass backdrop-blur-md border border-glass-border rounded-full px-4 py-2 shadow-lg">
      {/* Popular Apps */}
      {popularApps.map((app) => (
        <Button
          key={app.name}
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-full hover:bg-glass/80 hover:scale-110 transition-all duration-200 text-lg"
          onClick={() => onOpenApp(app)}
          title={app.name}
        >
          {app.icon}
        </Button>
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
  );
};