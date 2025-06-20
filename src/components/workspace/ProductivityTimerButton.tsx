import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Clock, Play, Pause, RotateCcw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { ProductivityAnalytics } from './ProductivityAnalytics';

export const ProductivityTimerButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [customTime, setCustomTime] = useState(25);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const { user } = useAuth();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const updateCustomTime = () => {
    setTimeLeft(customTime * 60);
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setTimeLeft(customTime * 60);
    setIsActive(false);
  };

  React.useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            return customTime * 60;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, customTime]);

  const progress = ((customTime * 60 - timeLeft) / (customTime * 60)) * 100;

  return (
    <div className="flex flex-col items-center">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            size="icon"
            className="h-12 w-12 rounded-full shadow-lg bg-primary hover:bg-primary/90"
            title="Productivity Timer"
          >
            <Clock className="h-5 w-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Productivity Timer</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {user && <ProductivityAnalytics totalProductivityTime={0} />}
            
            {/* Custom Time Setting */}
            <div className="space-y-2">
              <Label htmlFor="custom-time">Focus Time (minutes)</Label>
              <div className="flex gap-2">
                <Input
                  id="custom-time"
                  type="number"
                  value={customTime}
                  onChange={(e) => setCustomTime(Number(e.target.value))}
                  min="1"
                  max="120"
                />
                <Button onClick={updateCustomTime} variant="outline">
                  Set
                </Button>
              </div>
            </div>

            {/* Timer Display */}
            <div className="text-center space-y-4">
              <div className="text-3xl font-mono font-bold">
                {formatTime(timeLeft)}
              </div>
              
              {/* Progress Circle */}
              <div className="relative w-20 h-20 mx-auto">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 24 24">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    className="text-muted"
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
                    className="text-primary"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {Math.round(progress)}%
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-2">
                <Button onClick={toggleTimer} size="sm">
                  {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {isActive ? 'Pause' : 'Start'}
                </Button>
                <Button onClick={resetTimer} variant="outline" size="sm">
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <span className="text-xs text-muted-foreground mt-1">Productivity Timer</span>
    </div>
  );
};