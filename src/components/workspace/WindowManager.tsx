import React from 'react';
import { DraggableWindow } from './DraggableWindow';
import { WorkspaceWindow } from './WindowTypes';

interface WindowManagerProps {
  windows: WorkspaceWindow[];
  onClose: (windowId: string) => void;
  onUpdate: (windowId: string, updates: Partial<WorkspaceWindow>) => void;
  onFocus: (windowId: string) => void;
}

export const WindowManager = ({ windows, onClose, onUpdate, onFocus }: WindowManagerProps) => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {windows.map((window) => (
        <DraggableWindow
          key={window.id}
          window={window}
          onClose={() => onClose(window.id)}
          onUpdate={(updates) => onUpdate(window.id, updates)}
          onFocus={() => onFocus(window.id)}
        />
      ))}
    </div>
  );
};
