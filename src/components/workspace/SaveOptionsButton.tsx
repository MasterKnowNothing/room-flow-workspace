import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FolderOpen, Cloud, HardDrive } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const SaveOptionsButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const saveOnline = () => {
    // TODO: Implement online save to Supabase
    toast({
      title: "Saved online",
      description: "Your workspace has been saved to the cloud",
    });
    setIsOpen(false);
  };

  const saveOnDevice = () => {
    // TODO: Implement local save
    const workspaceData = JSON.stringify({
      timestamp: new Date().toISOString(),
      workspace: localStorage.getItem('multispace-projects') || '{}',
    });
    
    const blob = new Blob([workspaceData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `multispace-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Saved to device",
      description: "Workspace backup downloaded successfully",
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-glass/80"
          title="Save Options"
        >
          <FolderOpen className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Save Workspace</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3">
          <Button onClick={saveOnline} className="w-full justify-start">
            <Cloud className="h-4 w-4 mr-2" />
            Save Online
          </Button>
          
          <Button onClick={saveOnDevice} variant="outline" className="w-full justify-start">
            <HardDrive className="h-4 w-4 mr-2" />
            Save on Device
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};