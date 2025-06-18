import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BarChart3, Timer, TrendingUp, Flame } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface ProductivityAnalyticsProps {
  totalProductivityTime: number;
}

export const ProductivityAnalytics = ({ totalProductivityTime }: ProductivityAnalyticsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(5); // Placeholder data

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Placeholder analytics data
  const analytics = {
    dailyAverage: 120,
    weeklyAverage: 840,
    monthlyAverage: 3600,
    todayTime: 45,
    thisWeekTime: 300,
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full bg-glass backdrop-blur-md border border-glass-border hover:bg-glass/80"
          title="Productivity Analytics"
        >
          <BarChart3 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Productivity Analytics</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Total Time & Streak */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 text-center">
              <Timer className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{formatTime(totalProductivityTime)}</div>
              <div className="text-sm text-muted-foreground">Total Time</div>
            </Card>
            
            <Card className="p-4 text-center">
              <Flame className="h-6 w-6 mx-auto mb-2 text-orange-500" />
              <div className="text-2xl font-bold">{currentStreak}</div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
            </Card>
          </div>
          
          {/* Analytics */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Today</span>
              <span className="font-medium">{formatTime(analytics.todayTime)}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">This Week</span>
              <span className="font-medium">{formatTime(analytics.thisWeekTime)}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Daily Average</span>
              <span className="font-medium">{formatTime(analytics.dailyAverage)}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Weekly Average</span>
              <span className="font-medium">{formatTime(analytics.weeklyAverage)}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Monthly Average</span>
              <span className="font-medium">{formatTime(analytics.monthlyAverage)}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            Keep up the great work! Your productivity is trending upward.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};