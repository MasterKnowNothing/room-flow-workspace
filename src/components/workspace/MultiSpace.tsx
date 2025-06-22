import React, { useState, useEffect } from 'react';
import { WorkspaceLayout } from './WorkspaceLayout';
import { WindowManager } from './WindowManager';
import { AppDock } from './AppDock';
import { ProjectSwitcher } from './ProjectSwitcher';
import { SecondBrainWall } from './SecondBrainWall';
import { AICommandCenter } from './AICommandCenter';
import { SocialButton } from './SocialButton';
import { ShareWorkspaceButton } from './ShareWorkspaceButton';
import { SubmitToolButton } from './SubmitToolButton';
import { ExploreToolsButton } from './ExploreToolsButton';
import { ThemeSwitcher } from './ThemeSwitcher';
import { IntroductionTour } from './IntroductionTour';
import { WorkspaceTitle } from './WorkspaceTitle';
import { TeamModeButton } from './TeamModeButton';
import { ProductivityTimerButton } from './ProductivityTimerButton';
import { SaveOptionsButton } from './SaveOptionsButton';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

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
  isFullscreen?: boolean;
  savedPosition?: { x: number; y: number; width: number; height: number };
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
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const { toast } = useToast();
  const { user } = useAuth();

  // Time tracking for current workspace
  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = Date.now();
      const elapsed = Math.floor((currentTime - startTime) / 1000);
      setTimeSpent(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  // Load/save data from Supabase when user is authenticated
  useEffect(() => {
    if (user) {
      loadUserData();
    } else {
      loadLocalData();
    }
  }, [user]);

  // Save to Supabase when authenticated, localStorage when not
  useEffect(() => {
    if (user) {
      saveUserData();
    } else {
      saveLocalData();
    }
  }, [projects, user]);

  const loadUserData = async () => {
    if (!user) return;
    
    try {
      const { data: workspaces } = await supabase
        .from('workspaces')
        .select('*')
        .eq('user_id', user.id);

      if (workspaces && workspaces.length > 0) {
        const userProjects: { [key: string]: Project } = {};
        workspaces.forEach(workspace => {
          userProjects[workspace.id] = {
            id: workspace.id,
            name: workspace.name,
            windows: Array.isArray(workspace.windows) ? workspace.windows as WorkspaceWindow[] : [],
            notes: Array.isArray(workspace.notes) ? workspace.notes as string[] : [],
            goals: Array.isArray(workspace.goals) ? workspace.goals as string[] : [],
            totalProductivityTime: workspace.total_productivity_time || 0
          };
        });
        setProjects(userProjects);
        
        const defaultWorkspace = workspaces.find(w => w.is_default) || workspaces[0];
        setCurrentProject(defaultWorkspace.id);
        setWindows(Array.isArray(defaultWorkspace.windows) ? defaultWorkspace.windows as WorkspaceWindow[] : []);
        setTimeSpent(defaultWorkspace.total_productivity_time || 0);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      loadLocalData();
    }
  };

  const saveUserData = async () => {
    if (!user || !projects[currentProject]) return;

    try {
      await supabase
        .from('workspaces')
        .upsert({
          id: currentProject,
          user_id: user.id,
          name: projects[currentProject].name,
          windows: JSON.parse(JSON.stringify(windows)), // Ensure JSON serializable
          notes: projects[currentProject].notes,
          goals: projects[currentProject].goals,
          total_productivity_time: timeSpent,
          is_default: currentProject === 'default'
        });
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const loadLocalData = () => {
    const savedProjects = localStorage.getItem('multispace-projects');
    const savedTime = localStorage.getItem(`multispace-time-${currentProject}`);
    
    if (savedProjects) {
      const parsedProjects = JSON.parse(savedProjects);
      setProjects(parsedProjects);
      
      if (parsedProjects.default) {
        setWindows(parsedProjects.default.windows || []);
      }
    } else {
      const defaultProject: Project = {
        id: 'default',
        name: 'Workspace 1',
        windows: [],
        notes: [],
        goals: [],
        totalProductivityTime: 0
      };
      setProjects({ default: defaultProject });
    }

    if (savedTime) {
      setTimeSpent(parseInt(savedTime));
    }
  };

  const saveLocalData = () => {
    localStorage.setItem('multispace-projects', JSON.stringify(projects));
    localStorage.setItem(`multispace-time-${currentProject}`, timeSpent.toString());
  };

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
    // Save current time to current project
    setProjects(prev => ({
      ...prev,
      [currentProject]: {
        ...prev[currentProject],
        totalProductivityTime: timeSpent
      }
    }));

    if (!projects[projectId]) {
      const newProject: Project = {
        id: projectId,
        name: `Workspace ${Object.keys(projects).length + 1}`,
        windows: [],
        notes: [],
        goals: [],
        totalProductivityTime: 0
      };
      setProjects(prev => ({ ...prev, [projectId]: newProject }));
    }

    setCurrentProject(projectId);
    setWindows(projects[projectId]?.windows || []);
    setTimeSpent(projects[projectId]?.totalProductivityTime || 0);
    setStartTime(Date.now() - (projects[projectId]?.totalProductivityTime || 0) * 1000);
    
    toast({
      title: "Project switched",
      description: `Now working on ${projects[projectId]?.name || 'New Project'}`,
    });
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  return (
    <WorkspaceLayout>
      <IntroductionTour />
      
      {/* Top Left Controls */}
      <div className="absolute top-4 left-4 z-50 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <ProjectSwitcher 
            projects={projects}
            currentProject={currentProject}
            onProjectSwitch={switchProject}
          />
          <SaveOptionsButton />
        </div>
        
        {/* My Notes under Workspace */}
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
      
      {/* Top Center Title */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
        <WorkspaceTitle />
      </div>
      
      {/* Top Right Controls */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        <SocialButton />
        <ShareWorkspaceButton />
        <ExploreToolsButton />
        <ThemeSwitcher />
      </div>

      {/* Time Display */}
      <div className="absolute top-4 left-4 z-40 mt-12 bg-white dark:bg-gray-900 px-3 py-1 rounded-md shadow-sm border">
        <span className="text-sm font-medium">{formatTime(timeSpent)}</span>
      </div>

      {/* Bottom Right Action Buttons */}
      <div className="absolute bottom-4 right-4 z-50 flex flex-col gap-3">
        <AICommandCenter 
          onOpenApp={openWindow}
          currentProject={projects[currentProject]}
        />
        <TeamModeButton />
        <ProductivityTimerButton />
        <SubmitToolButton />
      </div>

      {/* Expanded Window Manager with Canvas */}
      <div className="absolute inset-0 top-24 bottom-20 left-4 right-4 z-10">
        <WindowManager
          windows={windows}
          onClose={closeWindow}
          onUpdate={updateWindow}
          onFocus={bringToFront}
        />
      </div>

      {/* App Dock */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <AppDock onOpenApp={openWindow} />
      </div>

      {/* Footer Links */}
      <div className="absolute bottom-2 left-4 z-50 flex gap-4 text-xs text-muted-foreground">
        <a href="/contact" className="hover:text-foreground">Contact</a>
        <a href="/terms" className="hover:text-foreground">Terms & Conditions</a>
        <a href="/data" className="hover:text-foreground">My Data</a>
      </div>
    </WorkspaceLayout>
  );
};
