import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const TemplateCustomizer = ({ 
  selectedTemplate, 
  onCustomizationChange, 
  initialCustomization = null 
}) => {
  const [activeTab, setActiveTab] = useState("sections");
  
  const [customization, setCustomization] = useState({
    sections: selectedTemplate?.layout?.sections?.map(section => ({
      id: section,
      name: getSectionName(section),
      visible: true,
      order: selectedTemplate?.layout?.sections?.indexOf(section) || 0
    })) || [],
    styling: {
      colors: {
        primary: "#6B46C1",
        secondary: "#3B82F6", 
        text: "#1F2937",
        background: "#FFFFFF"
      },
      fonts: {
        heading: "Plus Jakarta Sans",
        body: "Inter"
      },
      preset: "default"
    }
  });

  useEffect(() => {
    if (initialCustomization) {
      setCustomization(initialCustomization);
    }
  }, [initialCustomization]);

  useEffect(() => {
    if (onCustomizationChange) {
      onCustomizationChange(customization);
    }
  }, [customization, onCustomizationChange]);

  const handleSectionReorder = (newOrder) => {
    const reorderedSections = newOrder.map((section, index) => ({
      ...section,
      order: index
    }));
    
    setCustomization(prev => ({
      ...prev,
      sections: reorderedSections
    }));
  };

  const toggleSectionVisibility = (sectionId) => {
    setCustomization(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId 
          ? { ...section, visible: !section.visible }
          : section
      )
    }));
  };

  const handleColorChange = (colorType, value) => {
    setCustomization(prev => ({
      ...prev,
      styling: {
        ...prev.styling,
        colors: {
          ...prev.styling.colors,
          [colorType]: value
        }
      }
    }));
  };

  const handleFontChange = (fontType, value) => {
    setCustomization(prev => ({
      ...prev,
      styling: {
        ...prev.styling,
        fonts: {
          ...prev.styling.fonts,
          [fontType]: value
        }
      }
    }));
  };

  const applyPreset = (presetName) => {
    const presets = {
      default: {
        colors: { primary: "#6B46C1", secondary: "#3B82F6", text: "#1F2937", background: "#FFFFFF" },
        fonts: { heading: "Plus Jakarta Sans", body: "Inter" }
      },
      modern: {
        colors: { primary: "#0F172A", secondary: "#475569", text: "#334155", background: "#F8FAFC" },
        fonts: { heading: "Space Grotesk", body: "Inter" }
      },
      vibrant: {
        colors: { primary: "#EC4899", secondary: "#8B5CF6", text: "#1E293B", background: "#FFFFFF" },
        fonts: { heading: "Poppins", body: "Inter" }
      },
      minimal: {
        colors: { primary: "#374151", secondary: "#6B7280", text: "#111827", background: "#FFFFFF" },
        fonts: { heading: "Inter", body: "Inter" }
      }
    };

    setCustomization(prev => ({
      ...prev,
      styling: {
        ...presets[presetName],
        preset: presetName
      }
    }));
  };

  const tabs = [
    { id: "sections", name: "Sections", icon: "Layout" },
    { id: "styling", name: "Styling", icon: "Palette" }
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-50 p-2 rounded-lg">
            <ApperIcon name="Settings" size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Customize Template</h3>
            <p className="text-sm text-gray-600">
              Personalize your {selectedTemplate?.name || "template"}
            </p>
          </div>
        </div>

        <div className="flex bg-gray-100 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all",
                activeTab === tab.id
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              <ApperIcon name={tab.icon} size={16} />
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        <AnimatePresence mode="wait">
          {activeTab === "sections" && (
            <motion.div
              key="sections"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">Template Sections</h4>
                <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  <ApperIcon name="Move" size={12} />
                  Drag to reorder
                </div>
              </div>

              <Reorder.Group
                axis="y"
                values={customization.sections}
                onReorder={handleSectionReorder}
                className="space-y-2"
              >
                <AnimatePresence>
                  {customization.sections.map((section) => (
                    <Reorder.Item
                      key={section.id}
                      value={section}
                      className="bg-gray-50 rounded-lg border border-gray-200 p-3 cursor-grab active:cursor-grabbing"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <ApperIcon name="GripVertical" size={16} className="text-gray-400" />
                          <div className="flex items-center gap-2">
                            <ApperIcon 
                              name={getSectionIcon(section.id)} 
                              size={16} 
                              className={section.visible ? "text-blue-600" : "text-gray-400"}
                            />
                            <span className={cn(
                              "font-medium",
                              section.visible ? "text-gray-900" : "text-gray-400"
                            )}>
                              {section.name}
                            </span>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => toggleSectionVisibility(section.id)}
                          className={cn(
                            "flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors",
                            section.visible
                              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                          )}
                        >
                          <ApperIcon 
                            name={section.visible ? "Eye" : "EyeOff"} 
                            size={12} 
                          />
                          {section.visible ? "Visible" : "Hidden"}
                        </button>
                      </div>
                    </Reorder.Item>
                  ))}
                </AnimatePresence>
              </Reorder.Group>

              <div className="bg-blue-50 rounded-lg p-3 mt-4">
                <div className="flex items-start gap-2">
                  <ApperIcon name="Info" size={16} className="text-blue-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-blue-900 font-medium mb-1">Section Tips</p>
                    <p className="text-blue-800">
                      Drag sections to reorder them on your page. Toggle visibility to show/hide sections. 
                      Essential sections like Hero and CTA are recommended for better conversions.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "styling" && (
            <motion.div
              key="styling"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Style Presets */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Style Presets</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: "default", name: "Default", colors: ["#6B46C1", "#3B82F6"] },
                    { key: "modern", name: "Modern", colors: ["#0F172A", "#475569"] },
                    { key: "vibrant", name: "Vibrant", colors: ["#EC4899", "#8B5CF6"] },
                    { key: "minimal", name: "Minimal", colors: ["#374151", "#6B7280"] }
                  ].map((preset) => (
                    <button
                      key={preset.key}
                      onClick={() => applyPreset(preset.key)}
                      className={cn(
                        "p-3 rounded-lg border-2 transition-all text-left",
                        customization.styling.preset === preset.key
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {preset.colors.map((color, i) => (
                            <div
                              key={i}
                              className="w-3 h-3 rounded-full border border-white"
                              style={{ backgroundColor: color, marginLeft: i > 0 ? '-4px' : '0' }}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{preset.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Colors</h4>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: "primary", name: "Primary", description: "Main brand color" },
                    { key: "secondary", name: "Secondary", description: "Accent color" },
                    { key: "text", name: "Text", description: "Main text color" },
                    { key: "background", name: "Background", description: "Page background" }
                  ].map((color) => (
                    <div key={color.key} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{color.name}</p>
                          <p className="text-xs text-gray-500">{color.description}</p>
                        </div>
                        <div
                          className="w-8 h-8 rounded-lg border-2 border-gray-200"
                          style={{ backgroundColor: customization.styling.colors[color.key] }}
                        />
                      </div>
                      <input
                        type="color"
                        value={customization.styling.colors[color.key]}
                        onChange={(e) => handleColorChange(color.key, e.target.value)}
                        className="w-full h-8 rounded border border-gray-300"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Fonts */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Typography</h4>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { key: "heading", name: "Heading Font", description: "For titles and headings" },
                    { key: "body", name: "Body Font", description: "For paragraphs and content" }
                  ].map((font) => (
                    <div key={font.key} className="space-y-2">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{font.name}</p>
                        <p className="text-xs text-gray-500">{font.description}</p>
                      </div>
                      <select
                        value={customization.styling.fonts[font.key]}
                        onChange={(e) => handleFontChange(font.key, e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                      >
                        {[
                          "Inter",
                          "Plus Jakarta Sans",
                          "Poppins",
                          "Space Grotesk",
                          "Roboto",
                          "Open Sans",
                          "Lato",
                          "Montserrat"
                        ].map((fontOption) => (
                          <option key={fontOption} value={fontOption}>
                            {fontOption}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Style Preview</h4>
                <div 
                  className="bg-white rounded-lg p-4 border"
                  style={{ 
                    backgroundColor: customization.styling.colors.background,
                    color: customization.styling.colors.text 
                  }}
                >
                  <h3 
                    className="text-lg font-bold mb-2"
                    style={{ 
                      fontFamily: customization.styling.fonts.heading,
                      color: customization.styling.colors.primary 
                    }}
                  >
                    Sample Heading
                  </h3>
                  <p 
                    className="text-sm"
                    style={{ fontFamily: customization.styling.fonts.body }}
                  >
                    This is how your content will look with the selected styling options.
                  </p>
                  <button
                    className="mt-3 px-4 py-2 rounded-lg text-white text-sm font-medium"
                    style={{ backgroundColor: customization.styling.colors.secondary }}
                  >
                    Sample Button
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Helper functions
function getSectionName(sectionId) {
  const names = {
    hero: "Hero Section",
    description: "Product Description", 
    features: "Key Features",
    specifications: "Specifications",
    images: "Product Images",
    value_proposition: "Value Proposition",
    social_proof: "Social Proof",
    pricing: "Pricing & Offers",
    guarantee: "Money-Back Guarantee",
    cta: "Call to Action",
    testimonials: "Customer Reviews",
    faq: "FAQ Section"
  };
  return names[sectionId] || sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
}

function getSectionIcon(sectionId) {
  const icons = {
    hero: "Crown",
    description: "FileText",
    features: "CheckSquare",
    specifications: "List",
    images: "Image",
    value_proposition: "Target",
    social_proof: "Users",
    pricing: "DollarSign",
    guarantee: "Shield",
    cta: "ArrowRight",
    testimonials: "MessageSquare",
    faq: "HelpCircle"
  };
  return icons[sectionId] || "Square";
}

export default TemplateCustomizer;