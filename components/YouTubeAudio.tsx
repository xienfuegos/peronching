import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

interface YouTubeAudioProps {
  isPlaying: boolean;
}

export const YouTubeAudio: React.FC<YouTubeAudioProps> = ({ isPlaying }) => {
  const playerRef = useRef<any>(null);

  useEffect(() => {
    // Load YouTube IFrame API
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        playerRef.current = new window.YT.Player('youtube-player', {
          height: '0',
          width: '0',
          videoId: 'tD04phRnHck', // Synthwave Peronist March
          playerVars: {
            'playsinline': 1,
            'controls': 0,
            'loop': 1,
            'playlist': 'tD04phRnHck' // Required for loop to work
          },
          events: {
            'onReady': (event: any) => {
              event.target.setVolume(50);
              if (isPlaying) event.target.playVideo();
            }
          }
        });
      };
    } else if (!playerRef.current) {
      playerRef.current = new window.YT.Player('youtube-player', {
        height: '0',
        width: '0',
        videoId: 'tD04phRnHck',
        playerVars: {
          'playsinline': 1,
          'controls': 0,
          'loop': 1,
          'playlist': 'tD04phRnHck',
          'autoplay': 1
        },
        events: {
          'onReady': (event: any) => {
            event.target.setVolume(50);
            event.target.playVideo(); // Force play
          }
        }
      });
    }
  }, []);

  useEffect(() => {
    if (playerRef.current && playerRef.current.playVideo) {
      if (isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
        playerRef.current.seekTo(0);
      }
    }
  }, [isPlaying]);

  return <div id="youtube-player" className="absolute top-0 left-0 w-0 h-0 pointer-events-none" />;
};