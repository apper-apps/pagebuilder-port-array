import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const ProductPreview = ({ formData, template = "basic", templateCustomization }) => {
const { productName, description, price, keyFeatures = [], images = [], specifications = [], generatedContent = {} } = formData;
  const primaryImage = images.find(img => img.isPrimary) || images[0];

  // Get customization settings
  const customColors = templateCustomization?.styling?.colors || {
    primary: "#6B46C1",
    secondary: "#3B82F6",
    text: "#1F2937", 
    background: "#FFFFFF"
  };
  
  const customFonts = templateCustomization?.styling?.fonts || {
    heading: "Plus Jakarta Sans",
    body: "Inter"
  };

  const visibleSections = templateCustomization?.sections?.filter(s => s.visible)?.map(s => s.id) || 
["hero", "description", "features", "specifications", "pricing", "cta"];

  const sectionOrder = templateCustomization?.sections?.sort((a, b) => a.order - b.order)?.map(s => s.id) || 
    ["hero", "description", "features", "specifications", "pricing", "cta"];

  // Helper function to render sections in order
const renderSection = (sectionId) => {
    if (!visibleSections.includes(sectionId)) return null;

    switch (sectionId) {
      case "hero":
        return (
          <div key="hero" className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
            {primaryImage ? (
              <img 
                src={primaryImage.dataUrl} 
                alt={productName || "Product"} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center">
                <ApperIcon name="Image" size={48} className="text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Product Image</p>
              </div>
            )}
          </div>
        );
        
      case "description":
        return (
          <div key="description" className="prose prose-sm max-w-none mb-6">
            <p style={{ color: customColors.text, fontFamily: customFonts.body }}>
              {generatedContent.seoDescription || description || "Product description will appear here. Add your compelling product details to engage customers."}
            </p>
          </div>
        );

      case "features":
        if (generatedContent.featureSections && generatedContent.featureSections.length > 0) {
          return (
            <div key="features" className="mb-6">
              <h3 
                className="font-semibold mb-4"
                style={{ color: customColors.text, fontFamily: customFonts.heading }}
              >
                Features & Benefits
              </h3>
              <div className="space-y-4">
                {generatedContent.featureSections.map((section, index) => (
                  <div 
                    key={index} 
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: `${customColors.primary}10` }}
                  >
                    <h4 
                      className="font-medium mb-2"
                      style={{ color: customColors.primary, fontFamily: customFonts.heading }}
                    >
                      {section.title}
                    </h4>
                    <p 
                      className="text-sm"
                      style={{ color: customColors.text, fontFamily: customFonts.body }}
                    >
                      {section.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        } else if (keyFeatures.length > 0) {
          return (
            <div key="features" className="mb-6">
              <h3 
                className="font-semibold mb-3"
                style={{ color: customColors.text, fontFamily: customFonts.heading }}
              >
                Key Features
              </h3>
              <ul className="space-y-2">
                {keyFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <ApperIcon name="Check" size={16} style={{ color: customColors.secondary }} className="mt-0.5" />
                    <span style={{ color: customColors.text, fontFamily: customFonts.body }}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        }
        return null;

      case "specifications":
        if (specifications.length > 0) {
          const groupedSpecs = specifications.reduce((groups, spec) => {
            const key = `${spec.type}-${spec.category}`;
            if (!groups[key]) {
              groups[key] = {
                type: spec.type,
                category: spec.category,
                specs: []
              };
            }
            groups[key].specs.push(spec);
            return groups;
          }, {});

          const getTypeIcon = (type) => {
            const icons = {
              general: "Info",
              dimensions: "Ruler",
              technical: "Settings",
              package: "Package"
            };
            return icons[type] || "Info";
          };

          return (
            <div key="specifications" className="mb-6">
              <h3 
                className="font-semibold mb-4"
                style={{ color: customColors.text, fontFamily: customFonts.heading }}
              >
                Specifications
              </h3>
              <div className="space-y-4">
                {Object.values(groupedSpecs).map((group, index) => (
                  <div 
                    key={`${group.type}-${group.category}`}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <div 
                      className="px-4 py-3 border-b border-gray-200"
                      style={{ backgroundColor: `${customColors.primary}05` }}
                    >
                      <div className="flex items-center gap-2">
                        <ApperIcon 
                          name={getTypeIcon(group.type)} 
                          size={16} 
                          style={{ color: customColors.primary }}
                        />
                        <h4 
                          className="font-medium"
                          style={{ color: customColors.text, fontFamily: customFonts.heading }}
                        >
                          {group.category}
                        </h4>
                      </div>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {group.specs.map((spec, specIndex) => (
                        <div key={spec.id} className="px-4 py-3">
                          <div className="flex justify-between items-center">
                            <span 
                              className="text-sm font-medium"
                              style={{ color: customColors.text, fontFamily: customFonts.body }}
                            >
                              {spec.name}
                            </span>
                            <span 
                              className="text-sm"
                              style={{ color: customColors.text, fontFamily: customFonts.body }}
                            >
                              {spec.value}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }
        return null;

      case "pricing":
        return (
          <div key="pricing" className="flex items-baseline gap-4 mb-6">
            <span 
              className="text-3xl font-bold"
              style={{ color: customColors.primary, fontFamily: customFonts.heading }}
            >
              ${price || "0.00"}
            </span>
          </div>
        );

      case "cta":
        return (
          <Button 
            key="cta"
            className="w-full" 
            size="lg"
            style={{ 
              backgroundColor: customColors.primary,
              fontFamily: customFonts.body
            }}
          >
            Add to Cart
          </Button>
        );

      default:
        return null;
    }
  };
const BasicTemplate = () => (
    <div 
      className="rounded-xl border shadow-sm overflow-hidden"
      style={{ backgroundColor: customColors.background }}
    >
      <div className="p-6">
        <h1 
          className="text-2xl font-bold mb-4"
          style={{ color: customColors.text, fontFamily: customFonts.heading }}
        >
          {productName || "Product Name"}
        </h1>
        
        {sectionOrder.map(sectionId => renderSection(sectionId))}
        
        {/* Use Cases */}
{visibleSections.includes("usecases") && generatedContent.useCases && generatedContent.useCases.length > 0 && (
          <div className="mb-6">
            <h3 
              className="font-semibold mb-3"
              style={{ color: customColors.text, fontFamily: customFonts.heading }}
            >
              Perfect For
            </h3>
            <div className="grid gap-3">
              {generatedContent.useCases.map((useCase, index) => (
                <div 
                  key={index} 
                  className="p-3 rounded-lg border"
                  style={{ borderColor: `${customColors.primary}30` }}
                >
                  <h4 
                    className="font-medium text-sm mb-1"
                    style={{ color: customColors.primary, fontFamily: customFonts.heading }}
                  >
                    {useCase.title}
                  </h4>
                  <p 
                    className="text-sm"
                    style={{ color: customColors.text, fontFamily: customFonts.body }}
                  >
                    {useCase.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Selling Points */}
        {visibleSections.includes("social_proof") && generatedContent.sellingPoints && generatedContent.sellingPoints.length > 0 && (
          <div className="mb-6">
            <h3 
              className="font-semibold mb-3"
              style={{ color: customColors.text, fontFamily: customFonts.heading }}
            >
              Why Choose This Product
            </h3>
            <ul className="space-y-2">
              {generatedContent.sellingPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-2">
                  <ApperIcon name="Star" size={16} style={{ color: customColors.secondary }} className="mt-0.5" />
                  <span style={{ color: customColors.text, fontFamily: customFonts.body }} className="text-sm">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );

const AdvancedTemplate = () => (
    <div 
      className="rounded-xl border shadow-lg overflow-hidden"
      style={{ backgroundColor: customColors.background }}
    >
      <div 
        className="p-6 text-white"
        style={{ backgroundColor: customColors.primary }}
      >
        <div className="flex items-center gap-2 mb-2">
          <ApperIcon name="Star" size={16} className="text-yellow-300" />
          <span className="text-sm opacity-90">Premium Product</span>
        </div>
        <h1 
          className="text-3xl font-bold mb-2"
          style={{ fontFamily: customFonts.heading }}
        >
          {productName || "Premium Product Name"}
        </h1>
        <p 
          className="opacity-90"
          style={{ fontFamily: customFonts.body }}
        >
          {generatedContent.seoDescription || description || "Premium product description with compelling value proposition."}
        </p>
      </div>
      
      <div className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {visibleSections.includes("images") && (
              <>
                {/* Primary Image */}
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center overflow-hidden">
                  {primaryImage ? (
                    <img 
                      src={primaryImage.dataUrl} 
                      alt={productName || "Product"} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <ApperIcon name="Image" size={64} className="text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">Premium Product Image</p>
                    </div>
                  )}
                </div>
                
                {/* Additional Images */}
                {images.length > 1 && (
                  <div className="grid grid-cols-3 gap-2">
                    {images.slice(1, 4).map((image, index) => (
                      <div key={image.id} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <img 
                          src={image.dataUrl} 
                          alt={`${productName} ${index + 2}`} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Use Cases in Advanced Template */}
            {visibleSections.includes("specifications") && generatedContent.useCases && generatedContent.useCases.length > 0 && (
              <div className="mt-6">
                <h3 
                  className="font-semibold mb-3"
                  style={{ color: customColors.text, fontFamily: customFonts.heading }}
                >
                  Use Cases
                </h3>
                <div className="space-y-3">
                  {generatedContent.useCases.map((useCase, index) => (
                    <div 
                      key={index} 
                      className="p-3 rounded-lg border"
                      style={{ 
                        backgroundColor: `${customColors.secondary}20`,
                        borderColor: `${customColors.secondary}40`
                      }}
                    >
                      <h4 
                        className="font-medium text-sm mb-1"
                        style={{ color: customColors.secondary, fontFamily: customFonts.heading }}
                      >
                        {useCase.title}
                      </h4>
                      <p 
                        className="text-xs"
                        style={{ color: customColors.text, fontFamily: customFonts.body }}
                      >
                        {useCase.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            {visibleSections.includes("pricing") && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span 
                    className="text-sm line-through"
                    style={{ color: `${customColors.text}80` }}
                  >
                    ${((parseFloat(price) || 0) * 1.3).toFixed(2)}
                  </span>
                  <span 
                    className="px-2 py-1 rounded text-sm font-medium text-white"
                    style={{ backgroundColor: customColors.secondary }}
                  >
                    23% OFF
                  </span>
                </div>
                <div 
                  className="text-4xl font-bold mb-4"
                  style={{ color: customColors.primary, fontFamily: customFonts.heading }}
                >
                  ${price || "0.00"}
                </div>
              </div>
            )}

{sectionOrder.filter(id => visibleSections.includes(id) && ['features', 'specifications'].includes(id)).map(sectionId => renderSection(sectionId))}

            {/* Key Selling Points */}
            {visibleSections.includes("social_proof") && generatedContent.sellingPoints && generatedContent.sellingPoints.length > 0 && (
              <div>
                <h3 
                  className="font-semibold mb-3"
                  style={{ color: customColors.text, fontFamily: customFonts.heading }}
                >
                  Why Choose This
                </h3>
                <div className="space-y-2">
                  {generatedContent.sellingPoints.slice(0, 3).map((point, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <ApperIcon name="Star" size={14} style={{ color: customColors.secondary }} className="mt-1" />
                      <span 
                        className="text-sm"
                        style={{ color: customColors.text, fontFamily: customFonts.body }}
                      >
                        {point}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {visibleSections.includes("cta") && (
              <div className="space-y-3">
                <Button 
                  className="w-full" 
                  size="lg"
                  style={{ backgroundColor: customColors.primary, fontFamily: customFonts.body }}
                >
                  <ApperIcon name="ShoppingCart" size={18} />
                  Add to Cart - ${price || "0.00"}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  size="lg"
                  style={{ 
                    borderColor: customColors.secondary,
                    color: customColors.secondary,
                    fontFamily: customFonts.body
                  }}
                >
                  <ApperIcon name="Heart" size={18} />
                  Save for Later
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Additional selling points at bottom */}
        {visibleSections.includes("social_proof") && generatedContent.sellingPoints && generatedContent.sellingPoints.length > 3 && (
          <div 
            className="mt-6 pt-6 border-t"
            style={{ borderColor: `${customColors.text}20` }}
          >
            <div className="grid md:grid-cols-2 gap-3">
              {generatedContent.sellingPoints.slice(3).map((point, index) => (
                <div 
                  key={index + 3} 
                  className="flex items-start gap-2 p-3 rounded-lg"
                  style={{ backgroundColor: `${customColors.primary}10` }}
                >
                  <ApperIcon name="Shield" size={14} style={{ color: customColors.primary }} className="mt-0.5" />
                  <span 
                    className="text-sm"
                    style={{ color: customColors.text, fontFamily: customFonts.body }}
                  >
                    {point}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <motion.div
      key={JSON.stringify(formData)}
      initial={{ opacity: 0.8 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <div className="bg-gray-50 rounded-xl p-4 h-full overflow-auto">
        <div className="flex items-center gap-2 mb-4">
          <ApperIcon name="Monitor" size={16} className="text-gray-500" />
          <span className="text-sm text-gray-600">Live Preview</span>
        </div>
        
        <div className="bg-gray-100 rounded-lg p-2">
          <div className="bg-white rounded border border-gray-200 min-h-[500px] p-4">
            {template === "advanced" ? <AdvancedTemplate /> : <BasicTemplate />}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductPreview;