
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Share } from 'lucide-react';

export const WorkspaceTitle = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Hide after 15 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 15000);

    // Hide on first click anywhere
    const handleClick = () => {
      setIsVisible(false);
    };

    document.addEventListener('click', handleClick);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
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
      navigator.clipboard.writeText(`Hey, join me on MultiSpace – Your Online, Private Workplace. ${window.location.href}`);
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      className="flex flex-col items-center text-center cursor-pointer bg-white dark:bg-gray-900 px-6 py-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
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
      <p className="text-xs text-muted-foreground mt-1">
        Measure and Review Your Productivity
      </p>
      
      {isHovered && (
        <div className="absolute mt-20 bg-popover border border-border rounded-md p-2 shadow-md z-50">
          <div className="flex items-center gap-2 text-sm">
            <Share className="h-4 w-4" />
            Share MultiSpace
          </div>
        </div>
      )}
    </div>
  );
};
