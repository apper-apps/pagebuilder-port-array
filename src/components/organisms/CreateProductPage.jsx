import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import productPagesService from "@/services/api/productPagesService";
import TemplateSelector from "@/components/organisms/TemplateSelector";
import ProductForm from "@/components/organisms/ProductForm";
import ProductPreview from "@/components/molecules/ProductPreview";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const CreateProductPage = ({ onBack }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState("template");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
const [formData, setFormData] = useState({
    productName: "",
    description: "",
    price: "",
    keyFeatures: [""],
    images: []
  });
  const [showTemplateModal, setShowTemplateModal] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setCurrentStep("details");
    setShowTemplateModal(false);
  };

  const handleFormChange = (data) => {
    setFormData(data);
  };

  const handleSave = async (status = "draft") => {
    // Validate form
if (!formData.productName.trim()) {
      toast.error("Product name is required");
      return;
    }
    
    if (!formData.description.trim()) {
      toast.error("Product description is required");
      return;
    }
    
    if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    if (!formData.images || formData.images.length === 0) {
      toast.error("At least one product image is required");
      return;
    }
    try {
      setSaving(true);
      
const pageData = {
        name: formData.productName,
        template: selectedTemplate.name,
        productName: formData.productName,
        description: formData.description,
        price: parseFloat(formData.price),
        keyFeatures: formData.keyFeatures.filter(feature => feature.trim()),
        images: formData.images.map(img => ({
          id: img.id,
          name: img.name,
          dataUrl: img.dataUrl,
          isPrimary: img.isPrimary
        })),
        status: status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await productPagesService.create(pageData);
      
      toast.success(status === "published" ? "Product page published successfully!" : "Product page saved as draft");
      navigate("/");
    } catch (err) {
      toast.error("Failed to save product page");
    } finally {
      setSaving(false);
    }
  };

const isFormValid = () => {
    return (
      formData.productName.trim() &&
      formData.description.trim() &&
      formData.price &&
      !isNaN(parseFloat(formData.price)) &&
      parseFloat(formData.price) > 0 &&
      formData.images &&
      formData.images.length > 0
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            icon="ArrowLeft"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Create Product Page
            </h1>
            <p className="text-gray-600">
              Build a high-converting product page
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={() => handleSave("draft")}
            disabled={!selectedTemplate || saving}
            loading={saving}
            icon="Save"
          >
            Save Draft
          </Button>
          <Button
            onClick={() => handleSave("published")}
            disabled={!selectedTemplate || !isFormValid() || saving}
            loading={saving}
            icon="Eye"
          >
            Publish Page
          </Button>
        </div>
      </div>

      {selectedTemplate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid lg:grid-cols-2 gap-8"
        >
          <div className="space-y-6">
            <div className="bg-white rounded-xl border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <ApperIcon name="Edit3" size={20} className="text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">Product Details</h2>
                  <p className="text-sm text-gray-600">Fill in your product information</p>
                </div>
              </div>
              
              <ProductForm
                onFormChange={handleFormChange}
                selectedTemplate={selectedTemplate}
                initialData={formData}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-secondary/10 p-2 rounded-lg">
                  <ApperIcon name="Monitor" size={20} className="text-secondary" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">Live Preview</h2>
                  <p className="text-sm text-gray-600">See how your page will look</p>
                </div>
              </div>
              
              <ProductPreview
                formData={formData}
                template={selectedTemplate.type}
              />
            </div>
          </div>
        </motion.div>
      )}

      <TemplateSelector
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        onSelectTemplate={handleTemplateSelect}
      />
    </div>
  );
};

export default CreateProductPage;