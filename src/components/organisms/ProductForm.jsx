import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ImageUpload from "@/components/atoms/ImageUpload";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const ProductForm = ({ onFormChange, selectedTemplate, initialData = {} }) => {
const [formData, setFormData] = useState({
    productName: "",
    description: "",
    price: "",
    keyFeatures: [""],
    images: [],
    ...initialData
  });

  const [urlScannerData, setUrlScannerData] = useState({
    url: "",
    isScanning: false,
    lastScannedUrl: null
  });

  const [errors, setErrors] = useState({});
const handleImageChange = (images) => {
    const updatedData = { ...formData, images };
    setFormData(updatedData);
    onFormChange && onFormChange(updatedData);
  };
useEffect(() => {
    onFormChange(formData);
  }, [formData, onFormChange]);

  const handleUrlScan = async () => {
    if (!urlScannerData.url.trim()) {
      return;
    }

    setUrlScannerData(prev => ({ ...prev, isScanning: true }));

    try {
      // Import the service dynamically to avoid circular imports
      const productPagesService = (await import("@/services/api/productPagesService")).default;
      const extractedData = await productPagesService.scanProductUrl(urlScannerData.url);
      
      // Merge extracted data with existing form data, keeping user edits
      const updatedFormData = {
        productName: extractedData.productName || formData.productName,
        description: extractedData.description || formData.description,
        price: extractedData.price || formData.price,
        keyFeatures: extractedData.keyFeatures?.length ? extractedData.keyFeatures : formData.keyFeatures,
        images: extractedData.images?.length ? extractedData.images : formData.images
      };

      setFormData(updatedFormData);
      setUrlScannerData(prev => ({ 
        ...prev, 
        isScanning: false, 
        lastScannedUrl: urlScannerData.url 
      }));

      // Show success toast
      if (typeof window !== 'undefined' && window.toast) {
        window.toast.success("Product information extracted successfully!");
      }

    } catch (error) {
      setUrlScannerData(prev => ({ ...prev, isScanning: false }));
      
      // Show error toast
      if (typeof window !== 'undefined' && window.toast) {
        window.toast.error(error.message || "Failed to scan URL. Please check the URL and try again.");
      }
    }
  };

  const handleUrlChange = (value) => {
    setUrlScannerData(prev => ({ ...prev, url: value }));
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.keyFeatures];
    newFeatures[index] = value;
    handleInputChange("keyFeatures", newFeatures);
  };

  const addFeature = () => {
    handleInputChange("keyFeatures", [...formData.keyFeatures, ""]);
  };

  const removeFeature = (index) => {
    if (formData.keyFeatures.length > 1) {
      const newFeatures = formData.keyFeatures.filter((_, i) => i !== index);
      handleInputChange("keyFeatures", newFeatures);
    }
  };
<ImageUpload
          images={formData.images}
          onChange={handleImageChange}
          maxImages={5}
          error={formData.images?.length === 0 ? "At least one product image is required" : ""}
        />
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.productName.trim()) {
      newErrors.productName = "Product name is required";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Product description is required";
    }
    
    if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = "Please enter a valid price";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-lg">
            <ApperIcon 
              name={selectedTemplate?.type === "advanced" ? "Crown" : "Package"} 
              size={20} 
              className="text-primary"
            />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">
              {selectedTemplate?.name || "Template"}
            </h3>
            <p className="text-sm text-gray-600">
              Fill in your product details below
            </p>
          </div>
        </div>
      </div>

      {/* URL Scanner Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-50 p-2 rounded-lg">
            <ApperIcon name="Link" size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Quick Import</h3>
            <p className="text-sm text-gray-600">Paste a product URL to auto-fill details</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder="Paste product URL here (e.g., https://amazon.com/product-url)"
                value={urlScannerData.url}
                onChange={(e) => handleUrlChange(e.target.value)}
                disabled={urlScannerData.isScanning}
                className={!isValidUrl(urlScannerData.url) && urlScannerData.url ? "border-red-300 focus:border-red-500 focus:ring-red-200" : ""}
              />
            </div>
            <Button
              onClick={handleUrlScan}
              disabled={!urlScannerData.url.trim() || !isValidUrl(urlScannerData.url) || urlScannerData.isScanning}
              icon={urlScannerData.isScanning ? "Loader" : "Search"}
              className={urlScannerData.isScanning ? "animate-pulse" : ""}
            >
              {urlScannerData.isScanning ? "Scanning..." : "Scan URL"}
            </Button>
          </div>

          {urlScannerData.url && !isValidUrl(urlScannerData.url) && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <ApperIcon name="AlertCircle" size={16} />
              <span>Please enter a valid URL</span>
            </div>
          )}

          {urlScannerData.lastScannedUrl && (
            <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 p-2 rounded-lg">
              <ApperIcon name="CheckCircle" size={16} />
              <span>Successfully scanned: {urlScannerData.lastScannedUrl}</span>
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <ApperIcon name="Info" size={16} className="text-gray-500 mt-0.5" />
              <div className="text-sm text-gray-600">
                <p className="font-medium mb-1">Supported platforms:</p>
                <p>Amazon, eBay, Shopify stores, and other major e-commerce sites</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <Input
          label="Product Name"
          placeholder="Enter your product name"
          value={formData.productName}
          onChange={(e) => handleInputChange("productName", e.target.value)}
          error={errors.productName}
          required
        />

        <Textarea
          label="Product Description"
          placeholder="Describe your product and its benefits..."
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          error={errors.description}
          rows={4}
          required
        />

        <Input
          label="Price"
          type="number"
          step="0.01"
          placeholder="0.00"
          value={formData.price}
          onChange={(e) => handleInputChange("price", e.target.value)}
          error={errors.price}
          required
/>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Key Features
            </label>
            <Button
              variant="ghost"
              size="sm"
              onClick={addFeature}
              icon="Plus"
              type="button"
            >
              Add Feature
            </Button>
          </div>

          <AnimatePresence>
            {formData.keyFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex gap-3"
              >
                <Input
                  placeholder={`Feature ${index + 1}`}
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  className="flex-1"
                />
                
                {formData.keyFeatures.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFeature(index)}
                    icon="X"
                    type="button"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <ApperIcon name="Info" size={16} className="text-blue-500" />
            <span className="text-sm font-medium text-gray-900">Preview Tips</span>
          </div>
          <p className="text-sm text-gray-600">
            Your page preview updates automatically as you type. Check the preview panel 
            to see how your product page will look to customers.
          </p>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;