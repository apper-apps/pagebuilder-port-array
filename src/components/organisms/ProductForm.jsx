import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import SpecificationsBuilder from "@/components/organisms/SpecificationsBuilder";
import TemplateCustomizer from "@/components/organisms/TemplateCustomizer";
import Button from "@/components/atoms/Button";
import Textarea from "@/components/atoms/Textarea";
import ImageUpload from "@/components/atoms/ImageUpload";
import Input from "@/components/atoms/Input";
const ProductForm = ({ 
  onFormChange, 
  selectedTemplate, 
  templateCustomization,
  initialData = {},
  showCustomizer = false,
  onCustomizationChange,
  onExport
}) => {

const [formData, setFormData] = useState({
    productName: "",
    description: "",
    price: "",
    keyFeatures: [""],
    images: [],
    specifications: [],
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
    if (onFormChange) {
      onFormChange(formData);
    }
  }, [formData, onFormChange]);

const handleUrlScan = async () => {
    if (!(urlScannerData.url && typeof urlScannerData.url === 'string' && urlScannerData.url.trim())) {
      return;
    }
    setUrlScannerData(prev => ({ ...prev, isScanning: true }));

try {
      // Import the service dynamically to avoid circular imports
      const productPagesService = (await import("@/services/api/productPagesService")).default;
      const extractedData = await productPagesService.scanProductUrl(urlScannerData.url || "");
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
        lastScannedUrl: urlScannerData.url || "" 
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
    // Only accept string values for URL input
    if (typeof value === 'string') {
      setUrlScannerData(prev => ({ ...prev, url: value }));
    }
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
const handleSpecificationsChange = (specifications) => {
    const updatedData = { ...formData, specifications };
    setFormData(updatedData);
    onFormChange?.(updatedData);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.productName?.trim()) {
      newErrors.productName = "Product name is required";
    }
    
    if (!formData.description?.trim()) {
      newErrors.description = "Product description is required";
    }
    
    if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = "Please enter a valid price";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};

const handleExport = () => {
    if (!validateForm()) {
      if (typeof window !== 'undefined' && window.toast) {
        window.toast.error("Please fix the form errors before exporting");
      }
      return;
    }

    if (onExport) {
      // Create a temporary page object with current form data
      const currentPageData = {
        productName: formData.productName,
        description: formData.description,
        price: formData.price,
        features: formData.keyFeatures || [],
        specifications: formData.specifications || [],
        images: formData.images || []
      };
      onExport(currentPageData);
    } else {
      // Default export behavior - could show a modal or copy to clipboard
      if (typeof window !== 'undefined' && window.toast) {
        window.toast.info("Export functionality not configured");
      }
    }
  };

  return (
    <div className="space-y-6">
      {showCustomizer && (
        <TemplateCustomizer
          selectedTemplate={selectedTemplate}
          onCustomizationChange={onCustomizationChange}
          initialCustomization={templateCustomization}
        />
      )}

      {!showCustomizer && (
        <>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-lg">
                <ApperIcon 
                  name={selectedTemplate?.type === "advanced" ? "Crown" : "Package"} 
                  size={20} 
                  className="text-blue-600"
                />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">
                  {selectedTemplate?.name || "Product Template"}
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
                    onChange={(value) => handleUrlChange(value)}
                    disabled={urlScannerData.isScanning}
                    className={!isValidUrl(urlScannerData.url) && urlScannerData.url ? "border-red-300 focus:border-red-500 focus:ring-red-200" : ""}
                  />
                </div>
<Button
                  onClick={handleUrlScan}
                  disabled={!(urlScannerData.url && typeof urlScannerData.url === 'string' && urlScannerData.url.trim()) || !isValidUrl(urlScannerData.url || "") || urlScannerData.isScanning}
                  variant="outline"
                  className={urlScannerData.isScanning ? "animate-pulse" : ""}
                >
                  {urlScannerData.isScanning ? (
                    <>
                      <ApperIcon name="Loader" size={16} className="animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Search" size={16} />
                      Scan URL
                    </>
                  )}
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
              onChange={(value) => handleInputChange("productName", value)}
              error={errors.productName}
              required
            />

            <Textarea
              label="Product Description"
              placeholder="Describe your product and its benefits..."
              value={formData.description}
              onChange={(value) => handleInputChange("description", value)}
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
              onChange={(value) => handleInputChange("price", value)}
              prefix="$"
              error={errors.price}
              required
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Key Features
                </label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addFeature}
                  type="button"
                >
                  <ApperIcon name="Plus" size={16} />
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
                      onChange={(value) => handleFeatureChange(index, value)}
                      className="flex-1"
                    />
                    
                    {formData.keyFeatures.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeFeature(index)}
                        type="button"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <ApperIcon name="X" size={16} />
                      </Button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <SpecificationsBuilder
              specifications={formData.specifications}
              onChange={handleSpecificationsChange}
            />

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Product Images
              </label>
              <ImageUpload
                images={formData.images}
                onChange={handleImageChange}
                maxImages={5}
              />
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

            {/* Export Section */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Export Code</h3>
                  <p className="text-sm text-gray-600">Generate HTML/CSS code for your product page</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleExport}
                  icon="Code2"
                >
                  Export Code
                </Button>
              </div>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default ProductForm;