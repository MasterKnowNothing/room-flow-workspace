import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sparkles, Send, Lightbulb, CheckSquare, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Project } from './MultiSpace';

interface AICommandCenterProps {
  onOpenApp: (app: { name: string; url: string; icon: string }) => void;
  currentProject?: Project;
}

const quickCommands = [
  {
    icon: <Lightbulb className="h-4 w-4" />,
    title: "Summarize Project",
    description: "Get a quick overview of your current work",
    prompt: "Please summarize my current project progress and suggest next steps."
  },
  {
    icon: <CheckSquare className="h-4 w-4" />,
    title: "Generate Tasks",
    description: "Create actionable tasks from your notes",
    prompt: "Based on my notes and goals, create a prioritized task list."
  },
  {
    icon: <Globe className="h-4 w-4" />,
    title: "Find Tools",
    description: "Discover new productivity tools",
    prompt: "Suggest 3 productivity tools that would help with my current project."
  }
];

export const AICommandCenter = ({ onOpenApp, currentProject }: AICommandCenterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleQuickCommand = (command: typeof quickCommands[0]) => {
    setPrompt(command.prompt);
    executeCommand(command.prompt);
  };

  const executeCommand = async (commandText: string) => {
    setIsProcessing(true);
    
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock AI responses based on command type
      if (commandText.includes('summarize')) {
        toast({
          title: "Project Summary 📊",
          description: `Your workspace has ${currentProject?.windows?.length || 0} active tools and ${(currentProject?.notes?.length || 0) + (currentProject?.goals?.length || 0)} notes/goals.`,
        });
      } else if (commandText.includes('tasks')) {
        toast({
          title: "Tasks Generated ✅",
          description: "Created 5 prioritized tasks based on your goals. Check your notes!",
        });
        // Could add tasks to the project here
      } else if (commandText.includes('tools')) {
        toast({
          title: "Tool Recommendations 🔧",
          description: "Found 3 helpful tools. Opening Miro for brainstorming...",
        });
        // Auto-open a recommended tool
        onOpenApp({
          name: 'Miro',
          url: 'https://miro.com',
          icon: '🎯'
        });
      } else {
        toast({
          title: "AI Response 🤖",
          description: "I understand your request. Here are some suggestions based on your workspace.",
        });
      }
    } catch (error) {
      toast({
        title: "AI Command Failed",
        description: "Sorry, I couldn't process that command right now.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setPrompt('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      executeCommand(prompt);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="flex flex-col items-center">
          <Button
            size="icon"
            className="h-12 w-12 rounded-full shadow-lg bg-primary hover:bg-primary/90"
            title="AI Assistant"
          >
            <Sparkles className="h-5 w-5" />
          </Button>
          <span className="text-xs text-muted-foreground mt-1">Ask AI</span>
        </div>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI Command Center
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Quick Commands */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Quick Commands</h4>
            <div className="grid gap-2">
              {quickCommands.map((command, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="flex items-start gap-3 h-auto p-3 text-left justify-start"
                  onClick={() => handleQuickCommand(command)}
                  disabled={isProcessing}
                >
                  <div className="mt-0.5">{command.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{command.title}</div>
                    <div className="text-xs text-muted-foreground">{command.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Command */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Custom Command</h4>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                placeholder="Ask me anything about your workspace..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isProcessing}
                className="flex-1"
              />
              <Button 
                type="submit" 
                size="icon"
                disabled={!prompt.trim() || isProcessing}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* Processing Indicator */}
          {isProcessing && (
            <Card className="p-4 bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="animate-spin">
                  <Sparkles className="h-4 w-4" />
                </div>
                <span className="text-sm text-muted-foreground">
                  AI is thinking...
                </span>
              </div>
            </Card>
          )}

          {/* Context Info */}
          <div className="text-xs text-muted-foreground border-t pt-3">
            Current context: {currentProject?.name || 'Default Workspace'} • 
            {currentProject?.windows?.length || 0} active tools • 
            {(currentProject?.notes?.length || 0) + (currentProject?.goals?.length || 0)} notes/goals
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};