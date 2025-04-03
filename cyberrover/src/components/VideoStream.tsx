import React, { useState } from 'react';

interface VideoStreamProps {
  streamUrl: string;
}

const VideoStream: React.FC<VideoStreamProps> = ({ streamUrl }) => {
  const [isError, setIsError] = useState<boolean>(false);

  //sull'ip nn trova nulla quindi dà errore
  const handleImageError = () => {
    console.log('Video stream error: unable to load the stream.');
    setIsError(true);
  };

  //sull'ip appare unimmagine fallita
  const handleImageLoad = () => {
    console.log('Video stream loaded successfully.');
    setIsError(false);
  };

  
  return (
    <div className="w-full max-w-4xl h-64 bg-gray-900 flex justify-center items-center rounded-md shadow-lg overflow-hidden">
      {isError || !streamUrl ? (
        <div className="flex items-center justify-center h-full w-full bg-black text-white">
          <p>No signal...</p>
        </div>
      ) : (
        <img
          src={streamUrl}
          alt="Video Stream"
          className="w-full h-full object-cover"
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      )}
    </div>
  );
};

export default VideoStream;
