
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users, Share, LogOut, UserX, Upload, LogIn } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { AuthModal } from '@/components/auth/AuthModal';

export const SocialButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [friendEmail, setFriendEmail] = useState('');
  const { toast } = useToast();
  const { user, profile, signOut, deleteProfile } = useAuth();

  const handleInviteShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join me on MultiSpace',
          text: 'Hey, join me on MultiSpace – Your Online, Private Workplace.',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(`Hey, join me on MultiSpace – Your Online, Private Workplace. ${window.location.href}`);
      toast({
        title: "Invite link copied",
        description: "Share this with friends to invite them to MultiSpace",
      });
    }
  };

  const sendFriendRequest = () => {
    if (friendEmail.trim()) {
      // TODO: Implement friend request sending
      toast({
        title: "Friend request sent",
        description: `Sent friend request to ${friendEmail}`,
      });
      setFriendEmail('');
    }
  };

  const handleDeleteProfile = async () => {
    if (confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
      await deleteProfile();
      setIsOpen(false);
    }
  };

  const clearLoginData = () => {
    localStorage.clear();
    toast({
      title: "Login data cleared",
      description: "All local data has been cleared",
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
          {user ? (
            <>
              <Users className="h-4 w-4 mr-2" />
              Profile
            </>
          ) : (
            <>
              <LogIn className="h-4 w-4 mr-2" />
              Login
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{user ? 'Profile' : 'Login'}</DialogTitle>
        </DialogHeader>
        
        {!user ? (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-muted-foreground">Sign in to access your profile and connect with friends</p>
            </div>
            <Button onClick={() => setShowAuthModal(true)} className="w-full">
              Sign In / Sign Up
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center py-2">
              <div className="text-lg font-semibold">{profile?.display_name || 'User'}</div>
              <div className="text-sm text-muted-foreground">@{profile?.username || 'username'}</div>
              <div className="text-sm text-muted-foreground">See who's on</div>
            </div>
            
            {/* Storage Incentive */}
            <div className="p-3 bg-muted rounded-lg">
              <button 
                onClick={handleInviteShare}
                className="text-sm underline text-primary hover:no-underline"
              >
                Get 5GB of Storage, free forever, for every friend/colleague you invite
              </button>
            </div>
            
            {/* Friend Requests */}
            <div className="space-y-2">
              <Label>Send Friend Request</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Friend's email"
                  value={friendEmail}
                  onChange={(e) => setFriendEmail(e.target.value)}
                />
                <Button size="sm" onClick={sendFriendRequest}>
                  Send
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Button variant="outline" className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Sync Phonebook
              </Button>
              
              <Button variant="outline" className="w-full">
                <Users className="h-4 w-4 mr-2" />
                Manage Friend Requests
              </Button>
              
              <Button variant="outline" className="w-full" onClick={clearLoginData}>
                Clear Login Data
              </Button>
              
              <Button variant="outline" className="w-full" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
              
              <Button variant="destructive" className="w-full" onClick={handleDeleteProfile}>
                <UserX className="h-4 w-4 mr-2" />
                Delete Profile
              </Button>
            </div>
          </div>
        )}
        
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </DialogContent>
    </Dialog>
  );
};
