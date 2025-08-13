import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    ...initialData
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    onFormChange(formData);
  }, [formData, onFormChange]);

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