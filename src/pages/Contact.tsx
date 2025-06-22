
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Contact = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to MultiSpace
        </Button>
        
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Contact</h1>
          <div className="prose dark:prose-invert">
            <p>Contact information will be added here.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
