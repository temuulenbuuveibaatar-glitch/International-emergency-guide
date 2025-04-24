import { ExternalLink, PlayCircle, Video } from "lucide-react";
import { Button } from "./ui/button";

interface MultimediaButtonProps {
  url: string;
  type: "video" | "image";
  title?: string;
}

export default function MultimediaButton({ url, type, title }: MultimediaButtonProps) {
  // Determine if it's a YouTube URL
  const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
  const displayTitle = title || (type === 'video' ? 'Watch Video' : 'View Image');
  
  return (
    <Button 
      variant="outline" 
      className="w-full justify-start bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700"
      onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
    >
      {type === 'video' ? (
        isYouTube ? <PlayCircle className="text-red-600" /> : <Video className="text-blue-600" />
      ) : (
        <ExternalLink className="text-blue-600" />
      )}
      <span className="flex-1 text-left">{displayTitle}</span>
      <ExternalLink className="ml-2 w-3 h-3 text-gray-400" />
    </Button>
  );
}