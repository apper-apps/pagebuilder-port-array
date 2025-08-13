import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const TemplateCard = ({ template, onSelect, selected = false }) => {
  const getTemplatePreview = (type) => {
    switch (type) {
      case "basic":
        return (
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="h-2 bg-gray-300 rounded w-3/4"></div>
            <div className="h-1 bg-gray-200 rounded w-full"></div>
            <div className="h-1 bg-gray-200 rounded w-2/3"></div>
            <div className="h-6 bg-primary rounded w-1/3 mt-3"></div>
          </div>
        );
      case "advanced":
        return (
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-4 space-y-2">
            <div className="h-3 bg-gradient-primary rounded w-3/4"></div>
            <div className="h-1 bg-gray-300 rounded w-full"></div>
            <div className="h-1 bg-gray-300 rounded w-4/5"></div>
            <div className="flex gap-2 mt-3">
              <div className="h-4 bg-accent rounded w-1/4"></div>
              <div className="h-4 bg-secondary rounded w-1/4"></div>
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="h-2 bg-gray-300 rounded w-3/4"></div>
            <div className="h-1 bg-gray-200 rounded w-full"></div>
          </div>
        );
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(template)}
      className={`card cursor-pointer transition-all duration-200 ${
        selected 
          ? "ring-2 ring-primary border-primary/20 shadow-lg" 
          : "hover:border-primary/30"
      }`}
    >
      <div className="p-6">
        <div className="mb-4">
          {getTemplatePreview(template.type)}
        </div>
        
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                {template.name}
              </h3>
              <p className="text-sm text-gray-600">
                {template.type === "basic" 
                  ? "Simple, clean layout perfect for most products"
                  : "Premium layout with enhanced features for high-value products"
                }
              </p>
            </div>
            
            {selected && (
              <div className="bg-primary text-white rounded-full p-1">
                <ApperIcon name="Check" size={14} />
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <ApperIcon name="Layout" size={14} />
              <span>{template.type === "basic" ? "Basic" : "Advanced"}</span>
            </div>
            <div className="flex items-center gap-1">
              <ApperIcon name="Zap" size={14} />
              <span>High Converting</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="px-6 pb-6">
        <Button
          variant={selected ? "primary" : "outline"}
          size="sm"
          className="w-full"
          icon={selected ? "Check" : "ArrowRight"}
        >
          {selected ? "Selected" : "Use Template"}
        </Button>
      </div>
    </motion.div>
  );
};

export default TemplateCard;