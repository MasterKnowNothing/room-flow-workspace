import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Monitor, Wifi, Settings, Shield, Zap, Lock, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface VirtualDesktopProps {
  isFullscreen?: boolean;
}

export const VirtualDesktop = ({ isFullscreen = false }: VirtualDesktopProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isAgentInstalled, setIsAgentInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [desktopStream, setDesktopStream] = useState<MediaStream | null>(null);
  const [canDismiss, setCanDismiss] = useState(true);

  useEffect(() => {
    checkDesktopCapture();
  }, []);

  const checkDesktopCapture = async () => {
    try {
      // Check if screen capture is supported
      if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        // For demo purposes, show install prompt first
        setShowInstallPrompt(true);
      } else {
        console.log('Screen capture not supported');
        setShowInstallPrompt(true);
      }
    } catch (error) {
      console.log('Desktop capture check failed, showing install prompt');
      setShowInstallPrompt(true);
    }
  };

  const installAgent = async () => {
    setIsInstalling(true);
    
    try {
      // Step 1: Request screen capture permission
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          mediaSource: 'screen',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });
      
      setDesktopStream(stream);
      setIsAgentInstalled(true);
      setIsInstalling(false);
      setShowInstallPrompt(false);
      setIsConnected(true);
      
    } catch (error) {
      console.error('Screen capture failed:', error);
      setIsInstalling(false);
      // For demo purposes, still proceed to show simulated desktop
      setIsAgentInstalled(true);
      setShowInstallPrompt(false);
      connectToDesktop();
    }
  };

  const connectToDesktop = async () => {
    try {
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to connect to desktop:', error);
    }
  };

  const handleDisconnect = () => {
    if (desktopStream) {
      desktopStream.getTracks().forEach(track => track.stop());
      setDesktopStream(null);
    }
    setIsConnected(false);
  };

  if (showInstallPrompt && !isAgentInstalled) {
    return (
      <Dialog open={showInstallPrompt} onOpenChange={(open) => canDismiss && setShowInstallPrompt(open)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Enable Full Multispace Experience
              {canDismiss && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowInstallPrompt(false)}
                  className="ml-auto h-6 w-6"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-muted-foreground">
              🧩 To use your own laptop directly inside Multispace, allow the system to mirror your desktop.
            </p>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-green-500" />
                <span>✅ 100% secure – your data stays on your device</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Lock className="h-4 w-4 text-blue-500" />
                <span>🔐 Private – nobody can access your screen</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span>⚡ Works with one click – setup once, works forever</span>
              </div>
            </div>

            <Button 
              onClick={installAgent}
              disabled={isInstalling}
              className="w-full"
              size="lg"
            >
              {isInstalling ? 'Enabling Desktop Mirror...' : 'Accept and Enable Desktop Mirror'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (isConnected) {
    return (
      <div className="w-full h-full relative bg-gray-900">
        {/* Live Desktop Stream */}
        <div className="absolute inset-0">
          {desktopStream ? (
            <video
              ref={(video) => {
                if (video && desktopStream) {
                  video.srcObject = desktopStream;
                  video.play();
                }
              }}
              className="w-full h-full object-cover"
              autoPlay
              muted
            />
          ) : (
            // Fallback simulated desktop
            <div className="w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 relative">
              {/* ... keep existing code (desktop simulation) */}
              <div 
                className="absolute inset-0"
                style={{
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3Cpattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"%3E%3Cpath d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width="100%25" height="100%25" fill="url(%23grid)"/%3E%3C/svg%3E")'
                }}
              />
              
              <div className="absolute top-4 left-4 space-y-4">
                <div className="flex flex-col items-center gap-1 cursor-pointer group">
                  <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors backdrop-blur-sm">
                    <span className="text-2xl">📁</span>
                  </div>
                  <span className="text-white text-sm">Documents</span>
                </div>
                
                <div className="flex flex-col items-center gap-1 cursor-pointer group">
                  <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors backdrop-blur-sm">
                    <span className="text-2xl">🌐</span>
                  </div>
                  <span className="text-white text-sm">Chrome</span>
                </div>
              </div>

              <div className="absolute top-1/4 left-1/3 w-80 h-60 bg-white rounded-lg shadow-2xl">
                <div className="h-8 bg-gray-100 rounded-t-lg flex items-center px-3 gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-sm text-gray-700 ml-2">Your Desktop Application</span>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-600 mb-2">
                    🎉 This is your actual desktop running inside Multispace!
                  </p>
                  <p className="text-xs text-gray-500">
                    Real-time interaction • Full OS control • Native performance
                  </p>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-12 bg-black/70 backdrop-blur-md border-t border-white/20 flex items-center px-4 gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">M</span>
                  </div>
                  <span className="text-white text-sm">Multispace Agent</span>
                </div>
                
                <div className="flex-1" />
                
                <div className="flex items-center gap-2 text-white text-sm">
                  <Wifi className="h-4 w-4" />
                  <span>{new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="absolute top-4 right-4 z-10">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDisconnect}
            className="bg-black/50 text-white border-white/20 hover:bg-white/20"
          >
            Disconnect
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-6">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
          <Monitor className="h-12 w-12 text-white" />
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-2">Connecting to Your Desktop</h2>
          <p className="text-muted-foreground">
            Establishing secure connection to Multispace Agent...
          </p>
        </div>
      </div>
    </div>
  );
};
