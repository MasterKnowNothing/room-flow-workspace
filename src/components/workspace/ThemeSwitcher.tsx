import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Lightbulb } from 'lucide-react';

export const ThemeSwitcher = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-10 w-10 rounded-full bg-glass backdrop-blur-md border border-glass-border hover:bg-glass/80"
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <Lightbulb className={`h-4 w-4 ${isDark ? 'text-yellow-400' : 'text-foreground'}`} />
    </Button>
  );
};