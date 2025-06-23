import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Wrench } from 'lucide-react';

interface SubmitToolButtonProps {
  isHighlighted?: boolean;
}

export const SubmitToolButton = ({ isHighlighted = false }: SubmitToolButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [toolLink, setToolLink] = useState('');
  const [toolName, setToolName] = useState('');
  const [toolFunctions, setToolFunctions] = useState('');
  const [email, setEmail] = useState('');

  return (
    <div className="flex flex-col items-center">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            size="icon"
            className={`h-12 w-12 rounded-full shadow-lg ${
              isHighlighted 
                ? 'bg-orange-500 hover:bg-orange-600' 
                : 'bg-primary hover:bg-primary/90'
            }`}
            title="Submit My Tool"
          >
            <Wrench className="h-5 w-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              🧰 Submit Your Tool
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              Offer your app to the Multispace community and reach thousands of potential users instantly.
            </p>
            
            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">💬 Guidelines</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• No NSFW, phishing, or illegal tools (see EU compliance rules)</li>
                <li>• 🔗 Direct app links work best — promotional landing pages usually get fewer clicks</li>
                <li>• 💳 All your payments, logins, and operations are handled by your organisation — Multispace only reviews and connects the link</li>
              </ul>
            </div>
            
            <div className="border-t pt-4 space-y-4">
              <h3 className="font-medium mb-3">📥 Tool Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="tool-link">App or Website Link</Label>
                <Input
                  id="tool-link"
                  placeholder="https://..."
                  value={toolLink}
                  onChange={(e) => setToolLink(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tool-name">Tool Name</Label>
                <Input
                  id="tool-name"
                  placeholder="Short and clear name"
                  value={toolName}
                  onChange={(e) => setToolName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tool-functions">Tool Functions (Topics/Categories)</Label>
                <Textarea
                  id="tool-functions"
                  placeholder="Enter 3 to 10 keywords (e.g. AI, resume, design, productivity, marketing,...)"
                  value={toolFunctions}
                  onChange={(e) => setToolFunctions(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Your Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="So we can contact you about approval or support"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">Submit My Tool:</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Hosting your tool on Multispace requires a $29.99/month hosting fee, giving you exposure to thousands of users.
                Start with an automatic 14-day trial. If your tool is not accepted, you will not be charged.
              </p>
              
              <div className="bg-muted p-3 rounded-lg text-sm">
                <p className="font-medium mb-2">💳 [Stripe Payment Link here, I'll add it manually later]</p>
                <p className="text-muted-foreground mb-2">Once submitted:</p>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Your tool will be manually reviewed within 24 hours</li>
                  <li>• If approved, it will instantly appear in the Tool Library for all interested users to explore, try and buy.</li>
                </ul>
              </div>
              
              <Button 
                className="w-full mt-4" 
                disabled={!toolLink || !toolName || !toolFunctions || !email}
              >
                Submit Tool for Review
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <span className="text-xs text-muted-foreground mt-1">Submit My Tool</span>
    </div>
  );
};
