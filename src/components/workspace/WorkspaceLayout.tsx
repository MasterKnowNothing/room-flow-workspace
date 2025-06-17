import React from 'react';

interface WorkspaceLayoutProps {
  children: React.ReactNode;
}

export const WorkspaceLayout = ({ children }: WorkspaceLayoutProps) => {
  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-workspace via-background to-workspace-foreground/10">
      {/* Ambient Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(120,119,198,0.3),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(45,180,180,0.2),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(120,210,180,0.1),transparent_50%)]" />
      </div>
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--workspace-foreground)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--workspace-foreground)) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
      
      {/* Main Content */}
      <div className="relative w-full h-screen">
        {children}
      </div>
    </div>
  );
};