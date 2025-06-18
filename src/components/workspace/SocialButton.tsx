import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users, Share, LogIn, UserPlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

export const SocialButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  const handleLogin = () => {
    // Placeholder for authentication logic
    if (username && password) {
      setIsLoggedIn(true);
      toast({
        title: "Logged in successfully",
        description: "Welcome back!",
      });
      setIsOpen(false);
    }
  };

  const handleSignup = () => {
    // Placeholder for signup logic
    if (username && password) {
      setIsLoggedIn(true);
      toast({
        title: "Account created successfully",
        description: "Welcome to MultiSpace!",
      });
      setIsOpen(false);
    }
  };

  const shareWorkspace = () => {
    navigator.clipboard.writeText(window.location.href + '?shared=true');
    toast({
      title: "Workspace link copied",
      description: "Share this link with others to collaborate",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="bg-glass backdrop-blur-md border border-glass-border hover:bg-glass/80"
        >
          <Users className="h-4 w-4 mr-2" />
          Social
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Social Features</DialogTitle>
        </DialogHeader>
        
        {!isLoggedIn ? (
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                />
              </div>
              <Button onClick={handleLogin} className="w-full">
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-username">Username</Label>
                <Input
                  id="new-username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Choose password"
                />
              </div>
              <Button onClick={handleSignup} className="w-full">
                <UserPlus className="h-4 w-4 mr-2" />
                Sign Up
              </Button>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="space-y-4">
            <div className="text-center py-4">
              <div className="text-lg font-semibold">Welcome back!</div>
              <div className="text-sm text-muted-foreground">See who's on</div>
            </div>
            
            <div className="space-y-2">
              <Button onClick={shareWorkspace} className="w-full">
                <Share className="h-4 w-4 mr-2" />
                Share Workspace Setup
              </Button>
              
              <Button variant="outline" className="w-full">
                <Users className="h-4 w-4 mr-2" />
                Sync Phonebook
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};