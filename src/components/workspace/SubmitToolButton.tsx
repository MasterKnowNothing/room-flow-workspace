import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';

export const SubmitToolButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            size="icon"
            className="h-12 w-12 rounded-full shadow-lg bg-primary hover:bg-primary/90"
            title="Submit Tool"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Submit a Tool</DialogTitle>
          </DialogHeader>
          
          <div className="text-center py-8">
            <div className="text-muted-foreground">
              Tool submission form will be available here.
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};