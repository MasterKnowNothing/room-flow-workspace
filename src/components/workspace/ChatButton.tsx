
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, Send, Globe, Users, UserPlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/hooks/useAuth';

export const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [globalMessage, setGlobalMessage] = useState('');
  const [privateMessage, setPrivateMessage] = useState('');
  const [teamMessage, setTeamMessage] = useState('');
  const [activeTab, setActiveTab] = useState('global');
  const { user } = useAuth();

  const sendGlobalMessage = () => {
    if (globalMessage.trim()) {
      // TODO: Implement global chat
      console.log('Global message:', globalMessage);
      setGlobalMessage('');
    }
  };

  const sendPrivateMessage = () => {
    if (privateMessage.trim()) {
      // TODO: Implement private chat
      console.log('Private message:', privateMessage);
      setPrivateMessage('');
    }
  };

  const sendTeamMessage = () => {
    if (teamMessage.trim()) {
      // TODO: Implement team chat
      console.log('Team message:', teamMessage);
      setTeamMessage('');
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col items-center">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            size="icon"
            className="h-12 w-12 rounded-full shadow-lg bg-primary hover:bg-primary/90"
            title="Chat"
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg h-[600px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Chat</DialogTitle>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="global" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Global
              </TabsTrigger>
              <TabsTrigger value="private" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Friends
              </TabsTrigger>
              <TabsTrigger value="teams" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Teams
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="global" className="flex-1 flex flex-col">
              <ScrollArea className="flex-1 border rounded-lg p-3 mb-4">
                <div className="space-y-2">
                  <div className="text-center text-muted-foreground text-sm">
                    Global chat - connect with all Multispace users
                  </div>
                </div>
              </ScrollArea>
              <div className="flex gap-2">
                <Input
                  placeholder="Type a global message..."
                  value={globalMessage}
                  onChange={(e) => setGlobalMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') sendGlobalMessage();
                  }}
                />
                <Button size="sm" onClick={sendGlobalMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="private" className="flex-1 flex flex-col">
              <ScrollArea className="flex-1 border rounded-lg p-3 mb-4">
                <div className="space-y-2">
                  <div className="text-center text-muted-foreground text-sm">
                    Private chat with friends
                  </div>
                </div>
              </ScrollArea>
              <div className="flex gap-2">
                <Input
                  placeholder="Type a private message..."
                  value={privateMessage}
                  onChange={(e) => setPrivateMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') sendPrivateMessage();
                  }}
                />
                <Button size="sm" onClick={sendPrivateMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="teams" className="flex-1 flex flex-col">
              <ScrollArea className="flex-1 border rounded-lg p-3 mb-4">
                <div className="space-y-2">
                  <div className="text-center text-muted-foreground text-sm">
                    Team chat - like WhatsApp for your invited members
                  </div>
                </div>
              </ScrollArea>
              <div className="flex gap-2">
                <Input
                  placeholder="Type a team message..."
                  value={teamMessage}
                  onChange={(e) => setTeamMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') sendTeamMessage();
                  }}
                />
                <Button size="sm" onClick={sendTeamMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
      <span className="text-xs text-muted-foreground mt-1">Chat</span>
    </div>
  );
};
