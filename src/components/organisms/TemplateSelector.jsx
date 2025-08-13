import React, { useState } from "react";
import TemplateCard from "@/components/molecules/TemplateCard";
import Button from "@/components/atoms/Button";
import Modal from "@/components/atoms/Modal";

const TemplateSelector = ({ isOpen, onClose, onSelectTemplate, mode }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  
const productTemplates = [
    {
      id: "basic",
      name: "Basic Product Template",
      type: "basic",
      description: "Perfect for simple product pages with essential information",
      preview: "/preview-basic.jpg"
    },
    {
      id: "advanced",
      name: "Advanced High-Ticket Template",
      type: "advanced",
      description: "Comprehensive template for premium products with detailed features",
      preview: "/preview-advanced.jpg"
    }
  ];

  const collectionTemplates = [
    {
      id: "wirecutter",
      name: "Wirecutter-style Comparison",
      type: "comparison",
      description: "Side-by-side product comparisons with detailed analysis and recommendations",
      preview: "/preview-comparison.jpg"
    },
    {
      id: "popular",
      name: "Popular Collection",
      type: "gallery",
      description: "Showcase curated products in an attractive gallery format",
      preview: "/preview-gallery.jpg"
    }
  ];

  const templates = mode === "collection" ? collectionTemplates : productTemplates;

  const handleContinue = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Choose Your Template"
      size="lg"
    >
      <div className="space-y-6">
        <p className="text-gray-600">
          Select a template that best fits your product type and conversion goals.
        </p>
        
        <div className="grid md:grid-cols-2 gap-6">
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              selected={selectedTemplate?.id === template.id}
              onSelect={setSelectedTemplate}
            />
          ))}
        </div>
        
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleContinue} 
            disabled={!selectedTemplate}
            icon="ArrowRight"
          >
            Continue with Template
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default TemplateSelector;