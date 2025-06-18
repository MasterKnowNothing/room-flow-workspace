import React, { useState, useEffect } from 'react';
import { WorkspaceLayout } from './WorkspaceLayout';
import { DraggableWindow } from './DraggableWindow';
import { AppDock } from './AppDock';
import { ProjectSwitcher } from './ProjectSwitcher';
import { ProductivityTimer } from './ProductivityTimer';
import { SecondBrainWall } from './SecondBrainWall';
import { AICommandCenter } from './AICommandCenter';
import { SocialButton } from './SocialButton';
import { ShareWorkspaceButton } from './ShareWorkspaceButton';
import { SubmitToolButton } from './SubmitToolButton';
import { ExploreToolsButton } from './ExploreToolsButton';
import { ThemeSwitcher } from './ThemeSwitcher';
import { IntroductionTour } from './IntroductionTour';
import { useToast } from '@/hooks/use-toast';

export interface WorkspaceWindow {
  id: string;
  title: string;
  url: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isMinimized?: boolean;
}

export interface Project {
  id: string;
  name: string;
  windows: WorkspaceWindow[];
  notes: string[];
  goals: string[];
  totalProductivityTime: number;
}

export const MultiSpace = () => {
  const [currentProject, setCurrentProject] = useState<string>('default');
  const [projects, setProjects] = useState<{ [key: string]: Project }>({});
  const [windows, setWindows] = useState<WorkspaceWindow[]>([]);
  const [highestZIndex, setHighestZIndex] = useState(1000);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const { toast } = useToast();

  // Load data from localStorage on mount
  useEffect(() => {
    const savedProjects = localStorage.getItem('multispace-projects');
    if (savedProjects) {
      const parsedProjects = JSON.parse(savedProjects);
      setProjects(parsedProjects);
      
      // Load default project if it exists
      if (parsedProjects.default) {
        setWindows(parsedProjects.default.windows || []);
      }
    } else {
      // Initialize with default project
      const defaultProject: Project = {
        id: 'default',
        name: 'My Workspace',
        windows: [],
        notes: [],
        goals: [],
        totalProductivityTime: 0
      };
      setProjects({ default: defaultProject });
    }
  }, []);

  // Save to localStorage whenever projects change
  useEffect(() => {
    localStorage.setItem('multispace-projects', JSON.stringify(projects));
  }, [projects]);

  // Update current project's windows when windows change
  useEffect(() => {
    setProjects(prev => ({
      ...prev,
      [currentProject]: {
        ...prev[currentProject],
        windows: windows
      }
    }));
  }, [windows, currentProject]);

  const openWindow = (app: { name: string; url: string; icon: string }) => {
    const newWindow: WorkspaceWindow = {
      id: Date.now().toString(),
      title: app.name,
      url: app.url,
      x: Math.random() * 300 + 100,
      y: Math.random() * 200 + 100,
      width: 800,
      height: 600,
      zIndex: highestZIndex + 1
    };

    setWindows(prev => [...prev, newWindow]);
    setHighestZIndex(prev => prev + 1);
    
    toast({
      title: `${app.name} opened`,
      description: `New window created in your workspace`,
    });
  };

  const closeWindow = (windowId: string) => {
    setWindows(prev => prev.filter(w => w.id !== windowId));
    
    toast({
      title: "Window closed",
      description: "Window removed from workspace",
    });
  };

  const updateWindow = (windowId: string, updates: Partial<WorkspaceWindow>) => {
    setWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, ...updates } : w
    ));
  };

  const bringToFront = (windowId: string) => {
    const newZIndex = highestZIndex + 1;
    setHighestZIndex(newZIndex);
    updateWindow(windowId, { zIndex: newZIndex });
  };

  const switchProject = (projectId: string) => {
    if (!projects[projectId]) {
      const newProject: Project = {
        id: projectId,
        name: `Project ${Object.keys(projects).length + 1}`,
        windows: [],
        notes: [],
        goals: [],
        totalProductivityTime: 0
      };
      setProjects(prev => ({ ...prev, [projectId]: newProject }));
    }

    setCurrentProject(projectId);
    setWindows(projects[projectId]?.windows || []);
    
    toast({
      title: "Project switched",
      description: `Now working on ${projects[projectId]?.name || 'New Project'}`,
    });
  };

  const addProductivityTime = (minutes: number) => {
    setProjects(prev => ({
      ...prev,
      [currentProject]: {
        ...prev[currentProject],
        totalProductivityTime: (prev[currentProject]?.totalProductivityTime || 0) + minutes
      }
    }));
  };

  return (
    <WorkspaceLayout>
      <IntroductionTour />
      
      {/* Top Left Controls */}
      <div className="absolute top-4 left-4 z-50 flex items-center gap-2">
        <ProjectSwitcher 
          projects={projects}
          currentProject={currentProject}
          onProjectSwitch={switchProject}
        />
        <SocialButton />
        <ShareWorkspaceButton />
        <ExploreToolsButton />
      </div>
      
      {/* Top Right Controls */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeSwitcher />
      </div>

      {/* Central Desk Area */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <ProductivityTimer 
          isActive={isTimerActive}
          onToggle={() => setIsTimerActive(!isTimerActive)}
          onSessionComplete={addProductivityTime}
        />
      </div>

      {/* Draggable Windows */}
      {windows.map(window => (
        <DraggableWindow
          key={window.id}
          window={window}
          onClose={() => closeWindow(window.id)}
          onUpdate={(updates) => updateWindow(window.id, updates)}
          onFocus={() => bringToFront(window.id)}
        />
      ))}

      {/* Second Brain Wall */}
      <div className="absolute left-4 top-1/4 z-20">
        <SecondBrainWall 
          project={projects[currentProject]}
          onUpdateProject={(updates) => {
            setProjects(prev => ({
              ...prev,
              [currentProject]: { ...prev[currentProject], ...updates }
            }));
          }}
        />
      </div>

      {/* App Dock */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <AppDock onOpenApp={openWindow} />
      </div>

      {/* AI Command Center */}
      <div className="absolute bottom-20 right-4 z-50">
        <AICommandCenter 
          onOpenApp={openWindow}
          currentProject={projects[currentProject]}
        />
      </div>
      
      {/* Submit Tool Button */}
      <SubmitToolButton />
    </WorkspaceLayout>
  );
};