import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Camera, Upload, X, Image as ImageIcon, Zap, BrainCircuit, Activity, MessageSquare, SkullIcon, FileSpreadsheet } from "lucide-react";

interface MedicalImage {
  id: string;
  timestamp: number;
  imageData: string;
  analysisType: 'xray' | 'mri' | 'medical';
  analysis: any | null;
  pending: boolean;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export default function MedicalImaging() {
  const { t } = useTranslation();
  const [images, setImages] = useState<MedicalImage[]>([]);
  const [activeTab, setActiveTab] = useState<'capture' | 'history' | 'chat'>('capture');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [analysisType, setAnalysisType] = useState<'xray' | 'mri' | 'medical'>('xray');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: t('medicalImaging.welcomeMessage'),
      timestamp: Date.now()
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<MedicalImage | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Start camera for image capture
  const startCamera = async () => {
    try {
      setErrorMessage(null);
      const constraints = {
        video: { facingMode: 'environment' }
      };
      
      if (videoRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setErrorMessage("Could not access camera. Please check permissions or try uploading an image instead.");
    }
  };
  
  // Stop camera stream
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
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
        const imageData = canvas.toDataURL('image/jpeg');
        
        analyzeImage(imageData);
        stopCamera();
      }
    }
  };
  
  // Handle file upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === 'string') {
          analyzeImage(e.target.result);
        }
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  // Initialize file upload dialog
  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Send image to API for analysis
  const analyzeImage = async (imageData: string) => {
    try {
      setIsProcessing(true);
      setErrorMessage(null);
      
      // Create a new image entry
      const newImage: MedicalImage = {
        id: `img_${Date.now()}`,
        timestamp: Date.now(),
        imageData,
        analysisType,
        analysis: null,
        pending: true
      };
      
      setImages(prev => [newImage, ...prev]);
      
      // Select the endpoint based on analysis type
      let endpoint = '';
      switch (analysisType) {
        case 'xray':
          endpoint = '/api/analyze-xray';
          break;
        case 'mri':
          endpoint = '/api/analyze-mri';
          break;
        default:
          endpoint = '/api/analyze-medical';
      }
      
      // Call the API
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image: imageData })
      });
      
      if (!response.ok) {
        throw new Error(`Analysis failed with status: ${response.status}`);
      }
      
      const analysisResult = await response.json();
      
      // Update the image with analysis results
      setImages(prev => prev.map(img => {
        if (img.id === newImage.id) {
          return {
            ...img,
            analysis: analysisResult,
            pending: false
          };
        }
        return img;
      }));
      
      // Add the analysis to chat
      const analysisDescription = getAnalysisDescription(analysisResult, analysisType);
      setChatMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `I've analyzed your ${analysisType.toUpperCase()} image: ${analysisDescription}`,
          timestamp: Date.now()
        }
      ]);
      
      // Set the newly analyzed image as selected
      setImages(prev => {
        const updatedImages = prev.map(img => {
          if (img.id === newImage.id) {
            return {
              ...img,
              analysis: analysisResult,
              pending: false
            };
          }
          return img;
        });
        
        const analyzedImage = updatedImages.find(img => img.id === newImage.id);
        if (analyzedImage) {
          setSelectedImage(analyzedImage);
        }
        
        return updatedImages;
      });
      
      // Switch to history tab to show the result
      setActiveTab('history');
      
    } catch (error) {
      console.error("Image analysis error:", error);
      setErrorMessage(error instanceof Error ? error.message : "Failed to analyze image. Please try again.");
      
      // Update the pending status of the failed image
      setImages(prev => prev.map(img => {
        if (img.id === `img_${Date.now()}`) {
          return {
            ...img,
            pending: false,
            analysis: { error: "Analysis failed" }
          };
        }
        return img;
      }));
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Extract a user-friendly description from the analysis results
  const getAnalysisDescription = (analysis: any, type: string): string => {
    try {
      if (!analysis) return "No analysis data available.";
      
      if (type === 'xray') {
        return `Finding: ${analysis.finding_type}. Severity: ${analysis.severity}. ${analysis.description} Possible diagnosis: ${analysis.possible_diagnosis}. Recommendation: ${analysis.recommendation}`;
      } else if (type === 'mri') {
        return `Finding: ${analysis.finding_type} in the ${analysis.location}. ${analysis.description} Possible diagnosis: ${analysis.possible_diagnosis}. Recommendation: ${analysis.recommendation}`;
      } else if (type === 'medical') {
        return `Finding: ${analysis.finding_type}. Severity: ${analysis.severity}. ${analysis.description} Possible diagnosis: ${analysis.possible_diagnosis}. Recommendation: ${analysis.recommendation}`;
      } else {
        return `Type: ${analysis.damage_type}. Severity: ${analysis.severity}. ${analysis.description} Recommendation: ${analysis.recommendation}`;
      }
    } catch (error) {
      console.error("Error processing analysis data:", error);
      return "Unable to process analysis data.";
    }
  };
  
  // Send a chat message
  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;
    
    const userMessage: ChatMessage = {
      role: 'user',
      content: chatInput,
      timestamp: Date.now()
    };
    
    const currentInput = chatInput;
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    
    try {
      // Show typing indicator
      setChatMessages(prev => [
        ...prev, 
        {
          role: 'assistant',
          content: '...',
          timestamp: Date.now()
        }
      ]);
      
      // Call the medical chat API
      const response = await fetch('/api/medical-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: currentInput })
      });
      
      if (!response.ok) {
        throw new Error(`Chat failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Remove typing indicator and add actual response
      setChatMessages(prev => {
        const withoutTyping = prev.filter(msg => msg.content !== '...');
        return [
          ...withoutTyping,
          {
            role: 'assistant',
            content: data.response || "I'm sorry, I couldn't process your request.",
            timestamp: Date.now()
          }
        ];
      });
      
      // Scroll to the bottom of chat
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Remove typing indicator and add error message
      setChatMessages(prev => {
        const withoutTyping = prev.filter(msg => msg.content !== '...');
        return [
          ...withoutTyping,
          {
            role: 'assistant',
            content: "I'm sorry, I encountered an error processing your request. Please try again.",
            timestamp: Date.now()
          }
        ];
      });
    }
  };
  
  // Show analysis details
  const renderAnalysisDetails = (analysis: any, type: string) => {
    if (!analysis) return <p>No analysis data available</p>;
    
    if (type === 'xray') {
      return (
        <div className="space-y-3">
          <div className="flex items-center">
            <SkullIcon className="h-5 w-5 mr-2 text-blue-600" />
            <h3 className="font-semibold text-lg">X-ray Analysis</h3>
          </div>
          <div className="bg-blue-50 p-3 rounded-md">
            <p className="font-medium text-blue-800">Finding: {analysis.finding_type}</p>
            <p className="text-blue-700">Severity: {analysis.severity}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-700">Description:</h4>
            <p className="text-gray-600">{analysis.description}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-700">Possible Diagnosis:</h4>
            <p className="text-gray-600">{analysis.possible_diagnosis}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-700">Recommendations:</h4>
            <p className="text-gray-600">{analysis.recommendation}</p>
          </div>
          <div className="bg-yellow-50 p-3 rounded-md text-sm text-yellow-700">
            <p className="font-medium">Limitations:</p>
            <p>{analysis.limitations}</p>
          </div>
        </div>
      );
    } else if (type === 'mri') {
      return (
        <div className="space-y-3">
          <div className="flex items-center">
            <BrainCircuit className="h-5 w-5 mr-2 text-purple-600" />
            <h3 className="font-semibold text-lg">MRI Analysis</h3>
          </div>
          <div className="bg-purple-50 p-3 rounded-md">
            <p className="font-medium text-purple-800">Finding: {analysis.finding_type}</p>
            <p className="text-purple-700">Location: {analysis.location}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-700">Description:</h4>
            <p className="text-gray-600">{analysis.description}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-700">Possible Diagnosis:</h4>
            <p className="text-gray-600">{analysis.possible_diagnosis}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-700">Recommendations:</h4>
            <p className="text-gray-600">{analysis.recommendation}</p>
          </div>
          <div className="bg-yellow-50 p-3 rounded-md text-sm text-yellow-700">
            <p className="font-medium">Limitations:</p>
            <p>{analysis.limitations}</p>
          </div>
        </div>
      );
    } else if (type === 'medical') {
      return (
        <div className="space-y-3">
          <div className="flex items-center">
            <Activity className="h-5 w-5 mr-2 text-green-600" />
            <h3 className="font-semibold text-lg">Medical Image Analysis</h3>
          </div>
          <div className="bg-green-50 p-3 rounded-md">
            <p className="font-medium text-green-800">Finding: {analysis.finding_type}</p>
            <p className="text-green-700">Severity: {analysis.severity}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-700">Description:</h4>
            <p className="text-gray-600">{analysis.description}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-700">Possible Diagnosis:</h4>
            <p className="text-gray-600">{analysis.possible_diagnosis}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-700">Recommendations:</h4>
            <p className="text-gray-600">{analysis.recommendation}</p>
          </div>
          <div className="bg-yellow-50 p-3 rounded-md text-sm text-yellow-700">
            <p className="font-medium">Limitations:</p>
            <p>{analysis.limitations}</p>
          </div>
        </div>
      );
    } else {
      return (
        <div className="space-y-3">
          <div className="flex items-center">
            <Zap className="h-5 w-5 mr-2 text-amber-600" />
            <h3 className="font-semibold text-lg">Damage Analysis</h3>
          </div>
          <div className="bg-amber-50 p-3 rounded-md">
            <p className="font-medium text-amber-800">Type: {analysis.damage_type}</p>
            <p className="text-amber-700">Severity: {analysis.severity}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-700">Description:</h4>
            <p className="text-gray-600">{analysis.description}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-700">Recommendations:</h4>
            <p className="text-gray-600">{analysis.recommendation}</p>
          </div>
        </div>
      );
    }
  };
  
  return (
    <section className="py-4 md:py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-[#004A9F]">
          {t('medicalImaging.title')}
        </h1>
        <p className="text-gray-600 text-center mb-8 max-w-3xl mx-auto">
          {t('medicalImaging.description')}
        </p>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Tab navigation */}
          <div className="flex border-b border-gray-200">
            <button
              className={`flex-1 py-3 px-4 text-center ${activeTab === 'capture' ? 'bg-[#004A9F] text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
              onClick={() => setActiveTab('capture')}
            >
              <div className="flex justify-center items-center">
                <Camera className="h-4 w-4 mr-2" />
                <span>{t('medicalImaging.capture')}</span>
              </div>
            </button>
            <button
              className={`flex-1 py-3 px-4 text-center ${activeTab === 'history' ? 'bg-[#004A9F] text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
              onClick={() => setActiveTab('history')}
            >
              <div className="flex justify-center items-center">
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                <span>{t('medicalImaging.history')}</span>
              </div>
            </button>
            <button
              className={`flex-1 py-3 px-4 text-center ${activeTab === 'chat' ? 'bg-[#004A9F] text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
              onClick={() => setActiveTab('chat')}
            >
              <div className="flex justify-center items-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                <span>{t('medicalImaging.chat')}</span>
              </div>
            </button>
          </div>
          
          <div className="p-4">
            {/* Capture Tab */}
            {activeTab === 'capture' && (
              <div className="space-y-6">
                {/* Analysis type selection */}
                <div className="mb-4">
                  <p className="text-gray-700 mb-2 font-medium">{t('medicalImaging.selectAnalysisType')}:</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      className={`px-4 py-2 rounded-md flex items-center ${analysisType === 'xray' ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-gray-100 hover:bg-gray-200'}`}
                      onClick={() => setAnalysisType('xray')}
                    >
                      <SkullIcon className="h-4 w-4 mr-2" />
                      {t('medicalImaging.xrayAnalysis')}
                    </button>
                    <button
                      className={`px-4 py-2 rounded-md flex items-center ${analysisType === 'mri' ? 'bg-purple-100 text-purple-700 border border-purple-300' : 'bg-gray-100 hover:bg-gray-200'}`}
                      onClick={() => setAnalysisType('mri')}
                    >
                      <BrainCircuit className="h-4 w-4 mr-2" />
                      {t('medicalImaging.mriAnalysis')}
                    </button>
                    <button
                      className={`px-4 py-2 rounded-md flex items-center ${analysisType === 'medical' ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-gray-100 hover:bg-gray-200'}`}
                      onClick={() => setAnalysisType('medical')}
                    >
                      <Activity className="h-4 w-4 mr-2" />
                      {t('medicalImaging.medicalImage')}
                    </button>
                  </div>
                </div>
                
                {/* Camera view or upload options */}
                <div className="space-y-4">
                  {isCameraActive ? (
                    <div className="relative">
                      <div className="bg-black rounded-md overflow-hidden">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          className="w-full max-h-[50vh] object-contain mx-auto"
                        ></video>
                      </div>
                      <div className="flex justify-center mt-4 space-x-4">
                        <button
                          className="bg-red-500 text-white px-4 py-2 rounded-md flex items-center hover:bg-red-600"
                          onClick={stopCamera}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </button>
                        <button
                          className="bg-green-500 text-white px-4 py-2 rounded-md flex items-center hover:bg-green-600"
                          onClick={captureImage}
                        >
                          <Camera className="h-4 w-4 mr-1" />
                          Capture
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="bg-gray-50 border border-dashed border-gray-300 rounded-md p-6 mb-4">
                        <div className="space-y-4">
                          <div className="flex flex-col items-center">
                            <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
                            <p className="text-gray-600 text-sm">Take a photo or upload a {analysisType === 'xray' ? 'X-ray' : analysisType === 'mri' ? 'MRI scan' : 'medical image'}</p>
                          </div>
                          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
                            <button
                              className="bg-[#004A9F] text-white px-4 py-2 rounded-md flex items-center justify-center hover:bg-blue-700"
                              onClick={startCamera}
                            >
                              <Camera className="h-4 w-4 mr-1" />
                              Take Photo
                            </button>
                            <button
                              className="bg-gray-600 text-white px-4 py-2 rounded-md flex items-center justify-center hover:bg-gray-700"
                              onClick={triggerFileUpload}
                            >
                              <Upload className="h-4 w-4 mr-1" />
                              Upload Image
                            </button>
                            <input
                              type="file"
                              ref={fileInputRef}
                              className="hidden"
                              accept="image/*"
                              onChange={handleFileChange}
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Information about the analysis type */}
                      <div className="bg-blue-50 p-4 rounded-md text-left">
                        <h3 className="font-medium text-blue-800 mb-2">
                          {analysisType === 'xray' ? 'X-Ray Analysis' : 
                           analysisType === 'mri' ? 'MRI Analysis' : 
                           'Medical Image Analysis'}
                        </h3>
                        <p className="text-blue-700 text-sm">
                          {analysisType === 'xray' ? 
                            'Upload an X-ray image to detect common findings like fractures, dislocations, pneumonia, and other radiological abnormalities.' : 
                           analysisType === 'mri' ? 
                            'Upload an MRI scan to analyze soft tissue structures, ligaments, cartilage, organs, and identify abnormalities such as tears, tumors, or inflammations.' : 
                            'Upload any medical image (skin conditions, visible symptoms, etc.) for a general medical analysis and preliminary assessment.'}
                        </p>
                        <p className="text-xs text-blue-600 mt-2">
                          Note: This AI analysis is for informational purposes only and should not replace professional medical diagnosis.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Processing indicator */}
                  {isProcessing && (
                    <div className="text-center p-4">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-blue-500 border-blue-200"></div>
                      <p className="mt-2 text-gray-600">Analyzing image...</p>
                    </div>
                  )}
                  
                  {/* Error message */}
                  {errorMessage && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
                      <p className="font-medium">Error:</p>
                      <p>{errorMessage}</p>
                    </div>
                  )}
                  
                  {/* Hidden canvas for image capture */}
                  <canvas ref={canvasRef} className="hidden"></canvas>
                </div>
              </div>
            )}
            
            {/* History Tab */}
            {activeTab === 'history' && (
              <div className="space-y-6">
                {images.length === 0 ? (
                  <div className="text-center py-8">
                    <FileSpreadsheet className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">No analyzed images yet. Capture or upload an image to get started.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Thumbnail sidebar */}
                    <div className="md:col-span-1 space-y-3 max-h-[70vh] overflow-y-auto p-2">
                      <h3 className="font-medium text-gray-700 mb-2">Analysis History</h3>
                      {images.map(img => (
                        <div 
                          key={img.id}
                          className={`border rounded-md overflow-hidden cursor-pointer ${selectedImage?.id === img.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-blue-300'}`}
                          onClick={() => setSelectedImage(img)}
                        >
                          <div className="aspect-video relative">
                            <img 
                              src={img.imageData} 
                              alt="Medical scan" 
                              className="w-full h-full object-cover"
                            />
                            {img.pending && (
                              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-4 border-t-blue-500 border-blue-200"></div>
                              </div>
                            )}
                            <div className="absolute top-2 right-2">
                              {img.analysisType === 'xray' && (
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">X-Ray</span>
                              )}
                              {img.analysisType === 'mri' && (
                                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">MRI</span>
                              )}
                              {img.analysisType === 'medical' && (
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Medical</span>
                              )}
                            </div>
                          </div>
                          <div className="p-2">
                            <p className="text-xs text-gray-500">
                              {new Date(img.timestamp).toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-700 truncate">
                              {img.analysis && !img.pending
                                ? img.analysisType === 'xray' 
                                  ? img.analysis.finding_type
                                  : img.analysisType === 'mri'
                                  ? `${img.analysis.finding_type} (${img.analysis.location})`
                                  : img.analysis.finding_type || img.analysis.damage_type
                                : 'Processing...'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Analysis details view */}
                    <div className="md:col-span-2 bg-gray-50 rounded-md p-4">
                      {selectedImage ? (
                        <div>
                          <div className="aspect-video mb-4 bg-black rounded-md overflow-hidden">
                            <img 
                              src={selectedImage.imageData} 
                              alt="Medical scan" 
                              className="w-full h-full object-contain"
                            />
                          </div>
                          
                          {selectedImage.pending ? (
                            <div className="text-center p-6">
                              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-blue-500 border-blue-200"></div>
                              <p className="mt-2 text-gray-600">Analysis in progress...</p>
                            </div>
                          ) : selectedImage.analysis ? (
                            renderAnalysisDetails(selectedImage.analysis, selectedImage.analysisType)
                          ) : (
                            <div className="bg-yellow-50 p-4 rounded-md">
                              <p className="text-yellow-700">No analysis data available for this image.</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <FileSpreadsheet className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-600">Select an image from the history to view its analysis details.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Chat Tab */}
            {activeTab === 'chat' && (
              <div className="h-[70vh] flex flex-col">
                {/* Chat messages */}
                <div 
                  ref={chatContainerRef}
                  className="flex-grow overflow-y-auto p-4 bg-gray-50 rounded-md"
                >
                  {chatMessages.map((msg, index) => (
                    <div 
                      key={index} 
                      className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}
                    >
                      <div 
                        className={`inline-block max-w-[80%] p-3 rounded-lg ${
                          msg.role === 'user' 
                            ? 'bg-blue-500 text-white rounded-br-none' 
                            : 'bg-white text-gray-700 border border-gray-200 rounded-bl-none'
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Chat input */}
                <div className="p-3 border-t border-gray-200">
                  <div className="flex">
                    <input
                      type="text"
                      className="flex-grow border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ask about medical imaging, X-rays, MRIs..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && sendChatMessage()}
                    />
                    <button
                      className="bg-[#004A9F] text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
                      onClick={sendChatMessage}
                    >
                      <MessageSquare className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Ask questions about reading X-rays, MRIs, or how to use this tool
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Medical disclaimer */}
        <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 text-yellow-700">
          <h4 className="font-semibold">Medical Disclaimer</h4>
          <p className="text-sm mt-1">
            This AI-powered medical imaging analysis is provided for informational and educational purposes only and 
            is not intended to replace professional medical advice, diagnosis, or treatment. 
            Always seek the advice of a qualified healthcare provider for any medical concerns.
          </p>
        </div>
      </div>
    </section>
  );
}