import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Search, Camera, Upload, X, Sparkles, Target, Palette, Tag, AlertCircle } from 'lucide-react';

const AdvancedImageAnalysis = ({ onAnalysisComplete, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [useAdvancedMode, setUseAdvancedMode] = useState(false);
  const [modelError, setModelError] = useState(false);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    // Try to load TensorFlow.js and COCO-SSD model
    const loadModel = async () => {
      try {
        // Dynamically import TensorFlow.js
        const tf = await import('@tensorflow/tfjs');
        const cocoSsd = await import('@tensorflow-models/coco-ssd');
        
        // Load the model
        const model = await cocoSsd.load();
        window.tfModel = model;
        setModelLoaded(true);
        setUseAdvancedMode(true);
        console.log('TensorFlow.js model loaded successfully');
      } catch (error) {
        console.error('Error loading TensorFlow.js model:', error);
        setModelError(true);
        setUseAdvancedMode(false);
      }
    };

    loadModel();
  }, []);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setAnalysisResults(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setAnalysisResults(null);
    }
  };

  const analyzeImage = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    try {
      if (useAdvancedMode && modelLoaded) {
        await performAdvancedAnalysis();
      } else {
        await performBasicAnalysis();
      }
    } catch (error) {
      console.error('Error in image analysis:', error);
      // Fallback to basic analysis
      await performBasicAnalysis();
    } finally {
      setIsLoading(false);
    }
  };

  const performAdvancedAnalysis = async () => {
    const tf = await import('@tensorflow/tfjs');
    const model = window.tfModel;

    // Create an image element
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = async () => {
      try {
        // Detect objects in the image
        const predictions = await model.detect(img);
        
        // Extract color information
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const colors = extractDominantColors(imageData);
        
        // Generate search terms based on analysis
        const searchTerms = generateSearchTerms(predictions, colors);
        
        const results = {
          objects: predictions,
          colors: colors,
          searchTerms: searchTerms,
          imageUrl: previewUrl,
          mode: 'advanced'
        };
        
        setAnalysisResults(results);
        onAnalysisComplete(searchTerms);
      } catch (error) {
        console.error('Error in advanced analysis:', error);
        // Fallback to basic analysis
        await performBasicAnalysis();
      }
    };
    
    img.src = previewUrl;
  };

  const performBasicAnalysis = async () => {
    // Basic color analysis without TensorFlow.js
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const colors = extractDominantColors(imageData);
      
      // Generate basic search terms from colors and filename
      const searchTerms = generateBasicSearchTerms(colors, selectedFile.name);
      
      const results = {
        objects: [],
        colors: colors,
        searchTerms: searchTerms,
        imageUrl: previewUrl,
        mode: 'basic'
      };
      
      setAnalysisResults(results);
      onAnalysisComplete(searchTerms);
    };
    
    img.src = previewUrl;
  };

  const extractDominantColors = (imageData) => {
    const data = imageData.data;
    const colorCounts = {};
    
    // Sample pixels to get dominant colors
    for (let i = 0; i < data.length; i += 40) {
      const r = Math.floor(data[i] / 50) * 50;
      const g = Math.floor(data[i + 1] / 50) * 50;
      const b = Math.floor(data[i + 2] / 50) * 50;
      const key = `${r},${g},${b}`;
      colorCounts[key] = (colorCounts[key] || 0) + 1;
    }
    
    // Get top 5 colors
    const sortedColors = Object.entries(colorCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([color]) => color.split(',').map(Number));
    
    return sortedColors;
  };

  const generateSearchTerms = (predictions, colors) => {
    const terms = [];
    
    // Add detected objects
    predictions.forEach(prediction => {
      terms.push(prediction.class);
    });
    
    // Add color-based terms
    colors.forEach(([r, g, b]) => {
      const colorName = getColorName(r, g, b);
      if (colorName) terms.push(colorName);
    });
    
    // Remove duplicates and limit to 10 terms
    return [...new Set(terms)].slice(0, 10);
  };

  const generateBasicSearchTerms = (colors, filename) => {
    const terms = [];
    
    // Add color-based terms
    colors.forEach(([r, g, b]) => {
      const colorName = getColorName(r, g, b);
      if (colorName) terms.push(colorName);
    });
    
    // Extract potential terms from filename
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
    const words = nameWithoutExt.split(/[-_\s]+/).filter(word => word.length > 2);
    terms.push(...words.slice(0, 3));
    
    // Add some generic terms based on colors
    if (colors.some(([r, g, b]) => r > 200 && g > 200 && b > 200)) {
      terms.push('light', 'bright');
    }
    if (colors.some(([r, g, b]) => r < 100 && g < 100 && b < 100)) {
      terms.push('dark', 'black');
    }
    
    // Remove duplicates and limit to 10 terms
    return [...new Set(terms)].slice(0, 10);
  };

  const getColorName = (r, g, b) => {
    const colors = {
      'red': [255, 0, 0],
      'green': [0, 255, 0],
      'blue': [0, 0, 255],
      'yellow': [255, 255, 0],
      'purple': [128, 0, 128],
      'orange': [255, 165, 0],
      'pink': [255, 192, 203],
      'brown': [165, 42, 42],
      'black': [0, 0, 0],
      'white': [255, 255, 255],
      'gray': [128, 128, 128]
    };
    
    for (const [name, [cr, cg, cb]] of Object.entries(colors)) {
      const distance = Math.sqrt((r - cr) ** 2 + (g - cg) ** 2 + (b - cb) ** 2);
      if (distance < 100) return name;
    }
    
    return null;
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setAnalysisResults(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            Advanced Image Analysis
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Mode Indicator */}
        <div className="flex items-center gap-2 text-sm">
          <Badge variant={useAdvancedMode ? "default" : "secondary"}>
            {useAdvancedMode ? "AI-Powered Analysis" : "Basic Color Analysis"}
          </Badge>
          {modelError && (
            <div className="flex items-center gap-1 text-amber-600">
              <AlertCircle className="h-4 w-4" />
              <span>AI model unavailable, using basic analysis</span>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* File Upload Area */}
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors cursor-pointer"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          {!previewUrl ? (
            <div className="space-y-2">
              <Upload className="h-8 w-8 mx-auto text-gray-400" />
              <p className="text-sm text-gray-600">
                Click to upload or drag and drop an image
              </p>
              <p className="text-xs text-gray-500">
                Supports JPG, PNG, GIF up to 10MB
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-32 mx-auto rounded"
              />
              <p className="text-sm text-gray-600">
                Image selected: {selectedFile?.name}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={analyzeImage}
            disabled={!selectedFile || isLoading}
            className="flex-1"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Analyzing...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Analyze Image
              </div>
            )}
          </Button>
          
          {selectedFile && (
            <Button variant="outline" onClick={clearSelection}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Analysis Results */}
        {analysisResults && (
          <div className="space-y-4">
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-500" />
                Analysis Results
              </h3>
              
              {/* Detected Objects */}
              {analysisResults.objects.length > 0 && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <Tag className="h-4 w-4" />
                    Detected Objects
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {analysisResults.objects.map((obj, index) => (
                      <Badge key={index} variant="secondary">
                        {obj.class} ({Math.round(obj.score * 100)}%)
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Dominant Colors */}
              {analysisResults.colors.length > 0 && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <Palette className="h-4 w-4" />
                    Dominant Colors
                  </Label>
                  <div className="flex gap-2">
                    {analysisResults.colors.map((color, index) => (
                      <div
                        key={index}
                        className="w-8 h-8 rounded-full border-2 border-gray-200"
                        style={{
                          backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})`
                        }}
                        title={`RGB(${color[0]}, ${color[1]}, ${color[2]})`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Generated Search Terms */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Search className="h-4 w-4" />
                  Suggested Search Terms
                </Label>
                <div className="flex flex-wrap gap-2">
                  {analysisResults.searchTerms.map((term, index) => (
                    <Badge key={index} variant="outline" className="cursor-pointer hover:bg-purple-50">
                      {term}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hidden canvas for image processing */}
        <canvas ref={canvasRef} className="hidden" />
      </CardContent>
    </Card>
  );
};

export default AdvancedImageAnalysis; 