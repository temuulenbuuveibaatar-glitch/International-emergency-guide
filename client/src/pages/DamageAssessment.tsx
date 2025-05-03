import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Camera, AlertCircle, RefreshCw, Image as ImageIcon, Search, Check, X } from "lucide-react";

interface Assessment {
  damage_type: string;
  severity: string;
  description: string;
  recommendation: string;
}

export default function DamageAssessment() {
  const { t } = useTranslation();
  const [cameraActive, setCameraActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
        setError(null);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Could not access camera. Please make sure you've granted camera permissions.");
      setCameraActive(false);
    }
  };

  // Stop camera stream
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  };

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setSelectedImage(result);
        setCameraActive(false);
        stopCamera();
      };
      reader.readAsDataURL(file);
    }
  };

  // Capture image from camera
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL('image/jpeg');
        setSelectedImage(imageDataUrl);
        stopCamera();
      }
    }
  };

  // Reset everything
  const resetAssessment = () => {
    setSelectedImage(null);
    setAssessment(null);
    setAnalyzing(false);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Perform AI analysis
  const analyzeImage = async () => {
    if (!selectedImage) return;
    
    setAnalyzing(true);
    setError(null);
    
    try {
      const response = await fetch('/api/analyze-damage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: selectedImage }),
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      setAssessment(data);
    } catch (err) {
      console.error("Error analyzing image:", err);
      setError("Failed to analyze the image. Please try again or use a clearer image.");
    } finally {
      setAnalyzing(false);
    }
  };

  // Define severity colors
  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'minor':
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'moderate':
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'severe':
      case 'high':
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center text-[#004A9F]">
          {t('damageAssessment.title') || 'AI Damage Assessment'}
        </h1>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                {t('damageAssessment.description') || 'Use your device camera or upload an image to assess damage in real-time with our AI-powered system.'}
              </p>

              {/* Warning note */}
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      {t('damageAssessment.disclaimer') || 'This AI assessment provides an initial evaluation only and should not replace professional medical or emergency services judgment. In case of serious injury, seek professional help immediately.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Camera/Image section */}
              <div className="space-y-6">
                {!selectedImage && !cameraActive ? (
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={startCamera}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <Camera className="h-5 w-5" />
                      Use Camera
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      <ImageIcon className="h-5 w-5" />
                      Upload Image
                    </button>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                ) : null}

                {cameraActive && (
                  <div className="relative">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full rounded-lg border border-gray-300 aspect-video object-cover"
                    />
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                      <button
                        onClick={captureImage}
                        className="flex items-center justify-center w-14 h-14 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <Camera className="h-6 w-6" />
                      </button>
                    </div>
                    <button
                      onClick={stopCamera}
                      className="absolute top-4 right-4 bg-gray-800 bg-opacity-70 text-white p-2 rounded-full hover:bg-opacity-100 transition-opacity"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                )}

                {selectedImage && (
                  <div className="relative">
                    <img
                      src={selectedImage}
                      alt="Selected for analysis"
                      className="w-full rounded-lg border border-gray-300"
                    />
                    <button
                      onClick={resetAssessment}
                      className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 text-white p-2 rounded-full hover:bg-opacity-100 transition-opacity"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                )}

                <canvas ref={canvasRef} className="hidden" />

                {selectedImage && !assessment && !analyzing && (
                  <div className="flex justify-center">
                    <button
                      onClick={analyzeImage}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      <Search className="h-5 w-5" />
                      Analyze Image
                    </button>
                  </div>
                )}

                {analyzing && (
                  <div className="flex flex-col items-center justify-center py-6">
                    <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mb-3" />
                    <p className="text-gray-600">Analyzing image using AI...</p>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-red-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                {assessment && (
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Assessment Results</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">DAMAGE TYPE</h4>
                        <p className="text-lg font-medium text-gray-900">{assessment.damage_type}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">SEVERITY</h4>
                        <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full border ${getSeverityColor(assessment.severity)}`}>
                          {assessment.severity}
                        </span>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">DESCRIPTION</h4>
                        <p className="text-gray-700">{assessment.description}</p>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                        <h4 className="text-sm font-medium text-blue-700 flex items-center">
                          <Check className="h-4 w-4 mr-1" />
                          RECOMMENDATION
                        </h4>
                        <p className="text-blue-700 mt-1">{assessment.recommendation}</p>
                      </div>
                      
                      <div className="flex justify-center mt-6">
                        <button
                          onClick={resetAssessment}
                          className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          <RefreshCw className="h-4 w-4" />
                          Start New Assessment
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}