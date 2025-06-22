
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, X, StickyNote, Target, ChevronDown, ChevronUp } from 'lucide-react';
import { Project } from './MultiSpace';

interface SecondBrainWallProps {
  project: Project;
  onUpdateProject: (updates: Partial<Project>) => void;
}

export const SecondBrainWall = ({ project, onUpdateProject }: SecondBrainWallProps) => {
  const [newNote, setNewNote] = useState('');
  const [newGoal, setNewGoal] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [editingNote, setEditingNote] = useState<number | null>(null);
  const [editingGoal, setEditingGoal] = useState<number | null>(null);
  const [wallSize, setWallSize] = useState({ width: 350, height: 400 });
  const [isResizing, setIsResizing] = useState(false);

  const addNote = () => {
    if (newNote.trim()) {
      onUpdateProject({
        notes: [...(project?.notes || []), newNote.trim()]
      });
      setNewNote('');
    }
  };

  const addGoal = () => {
    if (newGoal.trim()) {
      onUpdateProject({
        goals: [...(project?.goals || []), newGoal.trim()]
      });
      setNewGoal('');
    }
  };

  const updateNote = (index: number, newValue: string) => {
    const updatedNotes = [...(project?.notes || [])];
    updatedNotes[index] = newValue;
    onUpdateProject({ notes: updatedNotes });
    setEditingNote(null);
  };

  const updateGoal = (index: number, newValue: string) => {
    const updatedGoals = [...(project?.goals || [])];
    updatedGoals[index] = newValue;
    onUpdateProject({ goals: updatedGoals });
    setEditingGoal(null);
  };

  const removeNote = (index: number) => {
    const updatedNotes = project?.notes?.filter((_, i) => i !== index) || [];
    onUpdateProject({ notes: updatedNotes });
  };

  const removeGoal = (index: number) => {
    const updatedGoals = project?.goals?.filter((_, i) => i !== index) || [];
    onUpdateProject({ goals: updatedGoals });
  };

  const handleMouseDown = (e: React.MouseEvent, direction: string) => {
    e.preventDefault();
    setIsResizing(true);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = wallSize.width;
    const startHeight = wallSize.height;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      let newWidth = startWidth;
      let newHeight = startHeight;
      
      if (direction.includes('right')) newWidth = Math.max(250, startWidth + deltaX);
      if (direction.includes('left')) newWidth = Math.max(250, startWidth - deltaX);
      if (direction.includes('bottom')) newHeight = Math.max(200, startHeight + deltaY);
      if (direction.includes('top')) newHeight = Math.max(200, startHeight - deltaY);
      
      setWallSize({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  if (!isExpanded) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(true)}
        className="bg-glass backdrop-blur-md border border-glass-border hover:bg-glass/80"
      >
        <StickyNote className="h-4 w-4 mr-2" />
        My Notes
      </Button>
    );
  }

  return (
    <div 
      className="relative bg-glass backdrop-blur-md border border-glass-border rounded-lg shadow-lg"
      style={{ width: wallSize.width, height: wallSize.height }}
    >
      {/* Resize Handles */}
      <div
        className="absolute top-0 right-0 w-2 h-full cursor-e-resize hover:bg-primary/20"
        onMouseDown={(e) => handleMouseDown(e, 'right')}
      />
      <div
        className="absolute bottom-0 left-0 w-full h-2 cursor-s-resize hover:bg-primary/20"
        onMouseDown={(e) => handleMouseDown(e, 'bottom')}
      />
      <div
        className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize hover:bg-primary/20"
        onMouseDown={(e) => handleMouseDown(e, 'bottom-right')}
      />

      <div className="p-4 h-full overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-workspace-foreground flex items-center gap-2">
            <StickyNote className="h-5 w-5" />
            My Notes
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(false)}
            className="h-6 w-6"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {/* Notes Section */}
          <div>
            <h4 className="font-medium text-workspace-foreground mb-2 flex items-center gap-2">
              <StickyNote className="h-4 w-4" />
              Notes
            </h4>
            <div className="space-y-2">
              {project?.notes?.map((note, index) => (
                <div key={index} className="group relative">
                  {editingNote === index ? (
                    <Textarea
                      defaultValue={note}
                      className="text-sm"
                      onBlur={(e) => updateNote(index, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.ctrlKey) {
                          updateNote(index, e.currentTarget.value);
                        }
                      }}
                      autoFocus
                    />
                  ) : (
                    <div 
                      className="p-2 bg-card rounded border cursor-pointer hover:bg-accent/50"
                      onClick={() => setEditingNote(index)}
                    >
                      <p className="text-sm text-card-foreground">{note}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNote(index);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
              <div className="flex gap-2">
                <Input
                  placeholder="Add a note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addNote()}
                  className="text-sm"
                />
                <Button onClick={addNote} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Goals Section */}
          <div>
            <h4 className="font-medium text-workspace-foreground mb-2 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Goals
            </h4>
            <div className="space-y-2">
              {project?.goals?.map((goal, index) => (
                <div key={index} className="group relative">
                  {editingGoal === index ? (
                    <Textarea
                      defaultValue={goal}
                      className="text-sm"
                      onBlur={(e) => updateGoal(index, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.ctrlKey) {
                          updateGoal(index, e.currentTarget.value);
                        }
                      }}
                      autoFocus
                    />
                  ) : (
                    <div 
                      className="p-2 bg-card rounded border cursor-pointer hover:bg-accent/50"
                      onClick={() => setEditingGoal(index)}
                    >
                      <p className="text-sm text-card-foreground">{goal}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeGoal(index);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
              <div className="flex gap-2">
                <Input
                  placeholder="Add a goal..."
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addGoal()}
                  className="text-sm"
                />
                <Button onClick={addGoal} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
