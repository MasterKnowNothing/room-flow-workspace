
export interface WorkspaceWindow {
  id: string;
  title: string;
  url: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isMinimized: boolean;
  isFullscreen: boolean;
  savedPosition?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}
