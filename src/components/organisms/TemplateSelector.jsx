import { useState } from "react";
import Modal from "@/components/atoms/Modal";
import TemplateCard from "@/components/molecules/TemplateCard";
import Button from "@/components/atoms/Button";

const TemplateSelector = ({ isOpen, onClose, onSelectTemplate }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  
  const templates = [
    {
      id: "basic",
      name: "Basic Product Template",
      type: "basic",
      preview: "/preview-basic.jpg"
    },
    {
      id: "advanced",
      name: "Advanced High-Ticket Template",
      type: "advanced",
      preview: "/preview-advanced.jpg"
    }
  ];

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