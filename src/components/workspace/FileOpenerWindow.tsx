import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface FileOpenerWindowProps {
  onFileOpen: (fileName: string, fileContent: string, fileType: string) => void;
}

export const FileOpenerWindow = ({ onFileOpen }: FileOpenerWindowProps) => {
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        // For text files, PDFs will need special handling
        onFileOpen(file.name, result, file.type);
        toast({
          title: "File opened",
          description: `${file.name} opened successfully`,
        });
      } else if (result instanceof ArrayBuffer) {
        // For binary files like images, videos
        const blob = new Blob([result], { type: file.type });
        const url = URL.createObjectURL(blob);
        onFileOpen(file.name, url, file.type);
        toast({
          title: "File opened",
          description: `${file.name} opened successfully`,
        });
      }
    };

    // Handle different file types
    if (file.type.startsWith('text/') || file.type === 'application/json') {
      reader.readAsText(file);
    } else if (file.type.startsWith('image/') || file.type.startsWith('video/') || file.type === 'application/pdf') {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  };

  return (
    <div className="flex items-center justify-center h-full p-8">
      <div className="text-center space-y-4">
        <div className="text-6xl">📁</div>
        <h3 className="text-lg font-semibold">Open File</h3>
        <p className="text-muted-foreground">
          Select a file from your device to open in MultiSpace
        </p>
        <input
          type="file"
          onChange={handleFileSelect}
          className="block w-full text-sm text-muted-foreground
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-primary file:text-primary-foreground
            hover:file:bg-primary/90 cursor-pointer"
          accept="*/*"
        />
        <p className="text-xs text-muted-foreground">
          Supports text, images, videos, PDFs, and more
        </p>
      </div>
    </div>
  );
};