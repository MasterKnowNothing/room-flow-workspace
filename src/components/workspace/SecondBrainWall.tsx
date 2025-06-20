import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Plus, X, Target, StickyNote, Trash2 } from 'lucide-react';
import { Project } from './MultiSpace';

interface SecondBrainWallProps {
  project?: Project;
  onUpdateProject: (updates: Partial<Project>) => void;
}

interface Note {
  id: string;
  content: string;
  type: 'note' | 'goal';
  color: string;
}

const noteColors = ['#fef3c7', '#dbeafe', '#d1fae5', '#fce7f3', '#e0e7ff', '#fed7d7'];

export const SecondBrainWall = ({ project, onUpdateProject }: SecondBrainWallProps) => {
  const [newNote, setNewNote] = useState('');
  const [newGoal, setNewGoal] = useState('');
  const [title, setTitle] = useState(project?.name || 'My Goals');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 320, height: 'auto' });
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [showGoalInput, setShowGoalInput] = useState(false);

  const notes: Note[] = [
    ...(project?.notes || []).map((note, index) => ({
      id: `note-${index}`,
      content: note,
      type: 'note' as const,
      color: noteColors[index % noteColors.length]
    })),
    ...(project?.goals || []).map((goal, index) => ({
      id: `goal-${index}`,
      content: goal,
      type: 'goal' as const,
      color: noteColors[(index + 3) % noteColors.length]
    }))
  ];

  const addNote = () => {
    if (newNote.trim()) {
      onUpdateProject({
        notes: [...(project?.notes || []), newNote.trim()]
      });
      setNewNote('');
      setShowNoteInput(false);
    }
  };

  const addGoal = () => {
    if (newGoal.trim()) {
      onUpdateProject({
        goals: [...(project?.goals || []), newGoal.trim()]
      });
      setNewGoal('');
      setShowGoalInput(false);
    }
  };

  const removeNote = (noteId: string) => {
    if (noteId.startsWith('note-')) {
      const index = parseInt(noteId.split('-')[1]);
      const newNotes = [...(project?.notes || [])];
      newNotes.splice(index, 1);
      onUpdateProject({ notes: newNotes });
    } else if (noteId.startsWith('goal-')) {
      const index = parseInt(noteId.split('-')[1]);
      const newGoals = [...(project?.goals || [])];
      newGoals.splice(index, 1);
      onUpdateProject({ goals: newGoals });
    }
  };

  return (
    <Card className="h-full bg-glass backdrop-blur-md border border-glass-border shadow-lg p-4 overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-glass-border">
          <h3 className="font-semibold text-workspace-foreground">My Notes</h3>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-glass/80"
              onClick={() => setShowNoteInput(true)}
              title="Add Note"
            >
              <StickyNote className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-glass/80"
              onClick={() => setShowGoalInput(true)}
              title="Add Goal"
            >
              <Target className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Note Input */}
        {showNoteInput && (
          <div className="mb-4 space-y-2">
            <Textarea
              placeholder="Write a note..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="min-h-[80px] bg-background/50"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={addNote} disabled={!newNote.trim()}>
                Add Note
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowNoteInput(false);
                  setNewNote('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Goal Input */}
        {showGoalInput && (
          <div className="mb-4 space-y-2">
            <Input
              placeholder="What's your goal?"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              className="bg-background/50"
              onKeyDown={(e) => {
                if (e.key === 'Enter') addGoal();
              }}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={addGoal} disabled={!newGoal.trim()}>
                Add Goal
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowGoalInput(false);
                  setNewGoal('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Notes Wall */}
        <div className="flex-1 overflow-y-auto space-y-3">
          {notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <div className="text-workspace-foreground/40 mb-4">
                <StickyNote className="h-12 w-12 mx-auto mb-2" />
                <p className="text-sm">Your notes are empty</p>
                <p className="text-xs text-workspace-foreground/30 mt-1">
                  Add notes and goals to get started
                </p>
              </div>
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="group relative p-3 rounded-lg border border-glass-border shadow-sm hover:shadow-md transition-all duration-200"
                style={{ backgroundColor: note.color }}
              >
                <div className="flex items-start gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-1 mb-1">
                      {note.type === 'goal' ? (
                        <Target className="h-3 w-3 text-workspace-foreground/60" />
                      ) : (
                        <StickyNote className="h-3 w-3 text-workspace-foreground/60" />
                      )}
                      <span className="text-xs text-workspace-foreground/60 font-medium">
                        {note.type === 'goal' ? 'Goal' : 'Note'}
                      </span>
                    </div>
                    <p className="text-sm text-workspace-foreground whitespace-pre-wrap">
                      {note.content}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20"
                    onClick={() => removeNote(note.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
};