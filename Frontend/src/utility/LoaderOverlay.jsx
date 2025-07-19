import React from 'react';
import { Loader2 } from 'lucide-react'; 

const LoaderOverlay = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Loader2 className="w-10 h-10 text-white animate-spin" />
    </div>
  );
};

export default LoaderOverlay;
