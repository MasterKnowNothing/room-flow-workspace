import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users, Plus, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/hooks/useAuth';

export const TeamModeButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [friendEmail, setFriendEmail] = useState('');
  const { user } = useAuth();

  const sendMessage = () => {
    if (newMessage.trim()) {
      // TODO: Implement message sending
      setNewMessage('');
    }
  };

  const sendFriendRequest = () => {
    if (friendEmail.trim()) {
      // TODO: Implement friend request
      setFriendEmail('');
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
            title="Team Mode"
          >
            <Users className="h-5 w-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md h-[600px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Team Mode</DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 flex flex-col">
            {/* Friend Requests Section */}
            <div className="mb-4 p-3 border rounded-lg">
              <h3 className="font-medium mb-2">Add Friends</h3>
              <div className="flex gap-2">
                <Input
                  placeholder="Friend's email"
                  value={friendEmail}
                  onChange={(e) => setFriendEmail(e.target.value)}
                />
                <Button size="sm" onClick={sendFriendRequest}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Chat Area */}
            <ScrollArea className="flex-1 border rounded-lg p-3 mb-4">
              <div className="space-y-2">
                <div className="text-center text-muted-foreground text-sm">
                  Start chatting with your team!
                </div>
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') sendMessage();
                }}
              />
              <Button size="sm" onClick={sendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <span className="text-xs text-muted-foreground mt-1">Team Mode</span>
    </div>
  );
};