import { useState, useRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const ImageUpload = ({ 
  images = [], 
  onChange, 
  maxImages = 5, 
  className,
  error 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef(null);

  const handleFileSelect = (files) => {
    const fileArray = Array.from(files);
    const validFiles = [];
    let errorMessage = "";

    fileArray.forEach(file => {
      if (!file.type.startsWith('image/')) {
        errorMessage = "Only image files are allowed";
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        errorMessage = "Image size should be less than 5MB";
        return;
      }

      if (images.length + validFiles.length < maxImages) {
        validFiles.push(file);
      } else {
        errorMessage = `Maximum ${maxImages} images allowed`;
      }
    });

    if (errorMessage) {
      setUploadError(errorMessage);
      setTimeout(() => setUploadError(""), 3000);
      return;
    }

    setUploadError("");
    
    // Convert files to base64 for preview
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage = {
          id: Date.now() + Math.random(),
          file: file,
          dataUrl: e.target.result,
          name: file.name,
          isPrimary: images.length === 0 // First image is primary by default
        };
        
        onChange([...images, newImage]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files?.length) {
      handleFileSelect(files);
    }
  };

  const removeImage = (imageId) => {
    const updatedImages = images.filter(img => img.id !== imageId);
    
    // If removed image was primary, make first remaining image primary
    if (updatedImages.length > 0 && !updatedImages.some(img => img.isPrimary)) {
      updatedImages[0].isPrimary = true;
    }
    
    onChange(updatedImages);
  };

  const setPrimaryImage = (imageId) => {
    const updatedImages = images.map(img => ({
      ...img,
      isPrimary: img.id === imageId
    }));
    onChange(updatedImages);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Product Images
          <span className="text-red-500 ml-1">*</span>
        </label>
        <span className="text-xs text-gray-500">
          {images.length}/{maxImages} images
        </span>
      </div>

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200",
          isDragging 
            ? "border-primary bg-primary/5" 
            : "border-gray-300 hover:border-primary/50 hover:bg-gray-50",
          images.length >= maxImages && "opacity-50 cursor-not-allowed"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={images.length >= maxImages}
        />
        
        <div className="space-y-3">
          <ApperIcon 
            name="Upload" 
            size={48} 
            className={cn(
              "mx-auto",
              isDragging ? "text-primary" : "text-gray-400"
            )} 
          />
          <div>
            <p className="text-sm font-medium text-gray-700">
              {images.length >= maxImages 
                ? "Maximum images reached" 
                : "Drop images here or click to browse"
              }
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG, JPEG up to 5MB each
            </p>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {(uploadError || error) && (
        <p className="text-sm text-red-600">{uploadError || error}</p>
      )}

      {/* Image Thumbnails */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((image) => (
            <div key={image.id} className="relative group">
              <div className={cn(
                "aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200",
                image.isPrimary 
                  ? "border-primary shadow-lg" 
                  : "border-gray-200 group-hover:border-gray-300"
              )}>
                <img
                  src={image.dataUrl}
                  alt={image.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Primary Badge */}
                {image.isPrimary && (
                  <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-md font-medium">
                    Primary
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                  {!image.isPrimary && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPrimaryImage(image.id);
                      }}
                      className="bg-white/90 hover:bg-white text-gray-700 text-xs"
                    >
                      Set Primary
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(image.id);
                    }}
                    className="bg-red-500/90 hover:bg-red-600 text-white"
                  >
                    <ApperIcon name="X" size={14} />
                  </Button>
                </div>
              </div>
              
              <p className="text-xs text-gray-600 mt-1 truncate">
                {image.name}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Instructions */}
      {images.length > 0 && (
        <div className="text-xs text-gray-500 space-y-1">
          <p>• Click "Set Primary" to choose the main product image</p>
          <p>• Primary image will be displayed prominently in previews</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;