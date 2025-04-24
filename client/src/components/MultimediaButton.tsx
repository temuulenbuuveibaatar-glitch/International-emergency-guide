import { ExternalLink, PlayCircle, Video, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";

interface MultimediaButtonProps {
  url: string;
  type: "video" | "image";
  title?: string;
}

export default function MultimediaButton({ url, type, title }: MultimediaButtonProps) {
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  
  // Determine if it's a YouTube URL
  const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
  const displayTitle = title || (type === 'video' ? 'Watch Video' : 'View Image');

  // YouTube URLs are almost always valid, so we don't need to check them
  const shouldValidate = type === "image" && !isYouTube;
  
  // We only check image URLs to avoid 404 errors
  useEffect(() => {
    // Skip validation for YouTube and video URLs
    if (!shouldValidate) {
      setIsLoading(false);
      setIsValidUrl(true);
      return;
    }
    
    // For images, we check if the URL is valid
    const checkImageUrl = async () => {
      try {
        // Simple check to ensure URL is reasonably formatted
        const urlPattern = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;
        
        // Skip extensive checks for known good URLs
        if (url.includes('images.unsplash.com') || 
            url.includes('res.cloudinary.com') ||
            url.includes('media.istockphoto.com') ||
            url.includes('firebasestorage.googleapis.com')) {
          setIsValidUrl(true);
          setIsLoading(false);
          return;
        }
        
        // Basic pattern validation
        if (!urlPattern.test(url)) {
          setIsValidUrl(false);
          setIsLoading(false);
          return;
        }
        
        setIsValidUrl(true);
        setIsLoading(false);
      } catch (error) {
        console.error("Error validating URL:", error);
        setIsValidUrl(false);
        setIsLoading(false);
      }
    };
    
    checkImageUrl();
  }, [url, shouldValidate]);
  
  // While validating URLs, show a loading state
  if (isLoading) {
    return (
      <Button 
        variant="outline" 
        className="w-full justify-start bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-500"
        disabled
      >
        <span className="flex-1 text-left">Loading resource...</span>
      </Button>
    );
  }
  
  // If URL is invalid, show a warning
  if (!isValidUrl) {
    return (
      <Button 
        variant="outline" 
        className="w-full justify-start bg-red-50 hover:bg-red-100 border-red-200 text-red-700"
        disabled
      >
        <AlertTriangle className="text-red-600 mr-2" />
        <span className="flex-1 text-left">Resource unavailable</span>
      </Button>
    );
  }
  
  return (
    <Button 
      variant="outline" 
      className="w-full justify-start bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700"
      onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
    >
      {type === 'video' ? (
        isYouTube ? <PlayCircle className="text-red-600 mr-2" /> : <Video className="text-blue-600 mr-2" />
      ) : (
        <ExternalLink className="text-blue-600 mr-2" />
      )}
      <span className="flex-1 text-left">{displayTitle}</span>
      <ExternalLink className="ml-2 w-3 h-3 text-gray-400" />
    </Button>
  );
}