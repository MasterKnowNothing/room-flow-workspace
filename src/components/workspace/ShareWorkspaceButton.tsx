import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Share2, AlertTriangle, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const ShareWorkspaceButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const generateShareLink = () => {
    const shareId = Math.random().toString(36).substring(2, 15);
    return `${window.location.origin}?workspace=${shareId}`;
  };

  const handleShare = () => {
    const shareLink = generateShareLink();
    navigator.clipboard.writeText(shareLink);
    toast({
      title: "Workspace link copied",
      description: "Share this link to collaborate with others",
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="bg-glass backdrop-blur-md border border-glass-border hover:bg-glass/80"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share Workspace
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Your Workspace</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Warning: Your logged-in accounts will be shared with people you share this link with.
            </AlertDescription>
          </Alert>
          
          <div className="text-sm text-muted-foreground">
            Generate a link to collaborate with others in real-time. They'll be able to see and use your workspace setup.
          </div>
          
          <Button onClick={handleShare} className="w-full">
            <Copy className="h-4 w-4 mr-2" />
            Generate & Copy Share Link
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};