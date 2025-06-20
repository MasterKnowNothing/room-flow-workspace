import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share } from 'lucide-react';

export const WorkspaceTitle = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'MultiSpace - Private Online Workspace',
          text: 'Hey, join me on MultiSpace – Your Online, Private Workplace.',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div 
      className="flex flex-col items-center text-center cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleShare}
    >
      <h1 className="text-xl font-bold text-foreground">
        MultiSpace: Private Online Workspace
      </h1>
      <p className="text-sm text-muted-foreground">
        Access Everything from Anywhere
      </p>
      
      {isHovered && (
        <div className="absolute mt-16 bg-popover border border-border rounded-md p-2 shadow-md z-50">
          <div className="flex items-center gap-2 text-sm">
            <Share className="h-4 w-4" />
            Share MultiSpace
          </div>
        </div>
      )}
    </div>
  );
};