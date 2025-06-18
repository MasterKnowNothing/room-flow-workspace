import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Grid3X3 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const ExploreToolsButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="bg-glass backdrop-blur-md border border-glass-border hover:bg-glass/80"
        >
          <Grid3X3 className="h-4 w-4 mr-2" />
          Explore Tools
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Explore Tools</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Categories */}
          <Tabs defaultValue="ai" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="ai">AI</TabsTrigger>
              <TabsTrigger value="productivity">Productivity</TabsTrigger>
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="development">Development</TabsTrigger>
            </TabsList>
            
            <TabsContent value="ai" className="mt-4">
              <div className="text-center py-8 text-muted-foreground">
                AI tools directory will be populated here.
              </div>
            </TabsContent>
            
            <TabsContent value="productivity" className="mt-4">
              <div className="text-center py-8 text-muted-foreground">
                Productivity tools directory will be populated here.
              </div>
            </TabsContent>
            
            <TabsContent value="design" className="mt-4">
              <div className="text-center py-8 text-muted-foreground">
                Design tools directory will be populated here.
              </div>
            </TabsContent>
            
            <TabsContent value="development" className="mt-4">
              <div className="text-center py-8 text-muted-foreground">
                Development tools directory will be populated here.
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};