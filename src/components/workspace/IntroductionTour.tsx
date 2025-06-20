import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, ArrowDown, ArrowLeft, ArrowUp, ArrowRight } from 'lucide-react';

export const IntroductionTour = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Show introduction for new users
    const hasSeenIntro = localStorage.getItem('hasSeenIntro');
    if (!hasSeenIntro) {
      setIsVisible(true);
    }
  }, []);

  const steps = [
    {
      title: "Welcome to MultiSpace!",
      description: "Your browser-based productivity workspace",
      position: "center",
      arrow: null
    },
    {
      title: "Project Switcher",
      description: "Switch between different workspace setups",
      position: "top-left",
      arrow: ArrowDown
    },
    {
      title: "App Dock",
      description: "Quick access to your favorite tools",
      position: "bottom",
      arrow: ArrowUp
    },
    {
      title: "My Notes",
      description: "Pin your notes and goals here",
      position: "left",
      arrow: ArrowRight
    },
    {
      title: "AI Assistant",
      description: "Get help and generate tasks",
      position: "bottom-right",
      arrow: ArrowLeft
    },
    {
      title: "Save Your Work",
      description: "Everything saves automatically. Sign in to sync across devices",
      position: "center", 
      arrow: null
    }
  ];

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('hasSeenIntro', 'true');
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  if (!isVisible) return null;

  const step = steps[currentStep];
  const ArrowIcon = step.arrow;

  const getPositionClasses = () => {
    switch (step.position) {
      case 'top-left':
        return 'top-16 left-4';
      case 'bottom':
        return 'bottom-20 left-1/2 transform -translate-x-1/2';
      case 'left':
        return 'left-4 top-1/2 transform -translate-y-1/2';
      case 'center':
        return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
      case 'bottom-right':
        return 'bottom-20 right-4';
      default:
        return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-[100]" />
      
      {/* Introduction Card */}
      <div className={`fixed ${getPositionClasses()} z-[101] bg-card border border-border rounded-lg p-6 max-w-sm shadow-2xl`}>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
        </Button>
        
        <div className="space-y-4">
          {ArrowIcon && (
            <div className="flex justify-center">
              <ArrowIcon className="h-6 w-6 text-primary animate-bounce" />
            </div>
          )}
          
          <div>
            <h3 className="font-semibold text-lg">{step.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-xs text-muted-foreground">
              {currentStep + 1} of {steps.length}
            </div>
            
            <Button onClick={nextStep} size="sm">
              {currentStep < steps.length - 1 ? 'Next' : 'Get Started'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};