import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, FolderOpen } from 'lucide-react';
import { Project } from './MultiSpace';

interface ProjectSwitcherProps {
  projects: { [key: string]: Project };
  currentProject: string;
  onProjectSwitch: (projectId: string) => void;
}

export const ProjectSwitcher = ({ projects, currentProject, onProjectSwitch }: ProjectSwitcherProps) => {
  const [newProjectName, setNewProjectName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      const projectId = Date.now().toString();
      onProjectSwitch(projectId);
      setNewProjectName('');
      setIsDialogOpen(false);
    }
  };

  const currentProjectData = projects[currentProject];
  const totalProductivityTime = Math.floor((currentProjectData?.totalProductivityTime || 0) / 60);

  return (
    <div className="flex items-center gap-3 bg-glass backdrop-blur-md border border-glass-border rounded-lg px-4 py-2 shadow-lg">
      <FolderOpen className="h-5 w-5 text-workspace-foreground" />
      
      <Select value={currentProject} onValueChange={onProjectSwitch}>
        <SelectTrigger className="w-48 border-0 bg-transparent focus:ring-0">
          <SelectValue placeholder="Select Project" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(projects).map(([id, project]) => (
            <SelectItem key={id} value={id}>
              <div className="flex items-center justify-between w-full">
                <span>{project.name}</span>
                <span className="text-xs text-muted-foreground ml-2">
                  {Math.floor((project.totalProductivityTime || 0) / 60)}h
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {totalProductivityTime > 0 && (
        <div className="text-xs text-workspace-foreground bg-primary/20 px-2 py-1 rounded">
          {totalProductivityTime}h
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-glass/80"
            title="New Project"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Project Name
              </label>
              <Input
                placeholder="e.g., Website Redesign, Research Project..."
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateProject();
                  }
                }}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1"
                onClick={handleCreateProject}
                disabled={!newProjectName.trim()}
              >
                Create Project
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};