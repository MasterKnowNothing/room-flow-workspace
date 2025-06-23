
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ProductivityAnalytics } from './ProductivityAnalytics';

interface ProductivityTimerProps {
  isActive: boolean;
  onToggle: () => void;
  onSessionComplete: (minutes: number) => void;
}

export const ProductivityTimer = ({ isActive, onToggle, onSessionComplete }: ProductivityTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [sessions, setSessions] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Session completed
            if (mode === 'work') {
              onSessionComplete(25);
              setSessions(prev => prev + 1);
              toast({
                title: "Work session complete! 🎉",
                description: "Time for a 5-minute break",
              });
              setMode('break');
              return 5 * 60; // 5 minute break
            } else {
              toast({
                title: "Break time over! ⚡",
                description: "Ready for another work session?",
              });
              setMode('work');
              return 25 * 60; // 25 minute work session
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, onSessionComplete, toast]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const resetTimer = () => {
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  const progress = mode === 'work' 
    ? ((25 * 60) - timeLeft) / (25 * 60) * 100
    : ((5 * 60) - timeLeft) / (5 * 60) * 100;

  return (
    <div className="flex items-center gap-2">
      <ProductivityAnalytics totalProductivityTime={sessions * 25 * 60} />
      
      <Card className="bg-glass backdrop-blur-md border border-glass-border shadow-2xl p-4 min-w-[200px]">
        <div className="text-center space-y-2">
          {/* Timer Display */}
          <div className="space-y-1">
            <div className="text-xs font-medium text-workspace-foreground/80 uppercase tracking-wider">
              {mode === 'work' ? 'Focus Time' : 'Break Time'}
            </div>
            <div className="text-2xl font-mono font-bold text-workspace-foreground">
              {formatTime(timeLeft)}
            </div>
          </div>

          {/* Progress Circle */}
          <div className="relative w-16 h-16 mx-auto">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 24 24">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-glass-border"
              />
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 10}`}
                strokeDashoffset={`${2 * Math.PI * 10 * (1 - progress / 100)}`}
                className={mode === 'work' ? 'text-primary' : 'text-accent'}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-medium text-workspace-foreground">
                {Math.round(progress)}%
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-glass/80"
              onClick={onToggle}
            >
              {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-glass/80"
              onClick={resetTimer}
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
          </div>

          {/* Session Counter */}
          {sessions > 0 && (
            <div className="text-xs text-workspace-foreground/60">
              Sessions: {sessions}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
