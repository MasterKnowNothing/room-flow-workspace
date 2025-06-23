
import React, { useState, useEffect } from 'react';
import { WorkspaceLayout } from './WorkspaceLayout';
import { ScreenLayout } from './ScreenLayout';
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
import { ChatButton } from './ChatButton';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface Project {
  id: string;
  name: string;
  notes: string[];
  goals: string[];
  totalProductivityTime: number;
}

export const MultiSpace = () => {
  const [currentProject, setCurrentProject] = useState<string>('default');
  const [projects, setProjects] = useState<{ [key: string]: Project }>({});
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

  // Reset start time when component mounts
  useEffect(() => {
    setStartTime(Date.now());
  }, []);

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
  }, [projects, user, timeSpent]);

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
            notes: Array.isArray(workspace.notes) ? (workspace.notes as unknown as string[]) : [],
            goals: Array.isArray(workspace.goals) ? (workspace.goals as unknown as string[]) : [],
            totalProductivityTime: workspace.total_productivity_time || 0
          };
        });
        setProjects(userProjects);
        
        const defaultWorkspace = workspaces.find(w => w.is_default) || workspaces[0];
        setCurrentProject(defaultWorkspace.id);
        setTimeSpent(defaultWorkspace.total_productivity_time || 0);
        setStartTime(Date.now() - (defaultWorkspace.total_productivity_time || 0) * 1000);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      loadLocalData();
    }
  };

  const saveUserData = async () => {
    if (!user || !projects[currentProject]) return;

    const updatedProject = {
      ...projects[currentProject],
      totalProductivityTime: timeSpent
    };

    try {
      await supabase
        .from('workspaces')
        .upsert({
          id: currentProject,
          user_id: user.id,
          name: updatedProject.name,
          notes: updatedProject.notes,
          goals: updatedProject.goals,
          total_productivity_time: timeSpent,
          is_default: currentProject === 'default'
        });
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const loadLocalData = () => {
    const savedProjects = localStorage.getItem('multispace-projects');
    
    if (savedProjects) {
      const parsedProjects = JSON.parse(savedProjects);
      setProjects(parsedProjects);
      
      if (parsedProjects.default) {
        setTimeSpent(parsedProjects.default.totalProductivityTime || 0);
        setStartTime(Date.now() - (parsedProjects.default.totalProductivityTime || 0) * 1000);
      }
    } else {
      const defaultProject: Project = {
        id: 'default',
        name: 'Workspace 1',
        notes: [],
        goals: [],
        totalProductivityTime: 0
      };
      setProjects({ default: defaultProject });
    }
  };

  const saveLocalData = () => {
    const updatedProjects = {
      ...projects,
      [currentProject]: {
        ...projects[currentProject],
        totalProductivityTime: timeSpent
      }
    };
    
    localStorage.setItem('multispace-projects', JSON.stringify(updatedProjects));
    localStorage.setItem(`multispace-time-${currentProject}`, timeSpent.toString());
  };

  const switchProject = (projectId: string) => {
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
        notes: [],
        goals: [],
        totalProductivityTime: 0
      };
      setProjects(prev => ({ ...prev, [projectId]: newProject }));
    }

    setCurrentProject(projectId);
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

  const handleAppOpen = (app: { name: string; url: string; icon: string }, screenId?: string) => {
    if (screenId) {
      console.log(`Opening ${app.name} on screen ${screenId}`);
    }
    
    toast({
      title: "App opened",
      description: `${app.name} opened on ${screenId ? `screen ${screenId}` : 'selected screen'}`,
    });
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
        </div>
        
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
      
      {/* Top Right Controls - First Row */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        <SocialButton />
        <ShareWorkspaceButton />
        <ExploreToolsButton />
        <ThemeSwitcher />
      </div>

      {/* Top Right Controls - Second Row */}
      <div className="absolute top-16 right-4 z-50 flex items-center gap-2">
        <ChatButton />
        <ProductivityTimerButton />
        <SubmitToolButton isHighlighted={true} />
        <AICommandCenter 
          onOpenApp={() => {}}
          currentProject={projects[currentProject]}
        />
      </div>

      {/* Bottom Right Action Button */}
      <div className="absolute bottom-4 right-4 z-50">
        <TeamModeButton />
      </div>

      {/* New Screen Layout */}
      <div className="absolute inset-0 top-24 bottom-20 z-10">
        <ScreenLayout onAppOpen={handleAppOpen} />
      </div>

      {/* App Dock */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <AppDock onOpenApp={handleAppOpen} />
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
