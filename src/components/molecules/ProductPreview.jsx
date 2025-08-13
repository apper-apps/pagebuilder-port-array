import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const ProductPreview = ({ formData, template = "basic" }) => {
  const { productName, description, price, keyFeatures = [], images = [], generatedContent = {} } = formData;
  const primaryImage = images.find(img => img.isPrimary) || images[0];

const BasicTemplate = () => (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
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
      
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {productName || "Product Name"}
        </h1>
        
        <div className="flex items-baseline gap-4 mb-6">
          <span className="text-3xl font-bold text-primary">
            ${price || "0.00"}
          </span>
        </div>
        
        {/* SEO Description or Regular Description */}
        <div className="prose prose-sm max-w-none mb-6">
          <p className="text-gray-700">
            {generatedContent.seoDescription || description || "Product description will appear here. Add your compelling product details to engage customers."}
          </p>
        </div>
        
        {/* Generated Feature Sections or Key Features */}
        {generatedContent.featureSections && generatedContent.featureSections.length > 0 ? (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Features & Benefits</h3>
            <div className="space-y-4">
              {generatedContent.featureSections.map((section, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">{section.title}</h4>
                  <p className="text-gray-700 text-sm">{section.description}</p>
                </div>
              ))}
            </div>
          </div>
        ) : keyFeatures.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Key Features</h3>
            <ul className="space-y-2">
              {keyFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <ApperIcon name="Check" size={16} className="text-emerald-500 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Use Cases */}
        {generatedContent.useCases && generatedContent.useCases.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Perfect For</h3>
            <div className="grid gap-3">
              {generatedContent.useCases.map((useCase, index) => (
                <div key={index} className="border border-gray-200 p-3 rounded-lg">
                  <h4 className="font-medium text-gray-900 text-sm mb-1">{useCase.title}</h4>
                  <p className="text-gray-600 text-sm">{useCase.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Selling Points */}
        {generatedContent.sellingPoints && generatedContent.sellingPoints.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Why Choose This Product</h3>
            <ul className="space-y-2">
              {generatedContent.sellingPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-2">
                  <ApperIcon name="Star" size={16} className="text-yellow-500 mt-0.5" />
                  <span className="text-gray-700 text-sm">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <Button className="w-full" size="lg">
          Add to Cart
        </Button>
      </div>
    </div>
  );

  const AdvancedTemplate = () => (
<div className="bg-white rounded-xl border shadow-lg overflow-hidden">
      <div className="bg-gradient-primary p-6 text-white">
        <div className="flex items-center gap-2 mb-2">
          <ApperIcon name="Star" size={16} className="text-yellow-300" />
          <span className="text-sm opacity-90">Premium Product</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">
          {productName || "Premium Product Name"}
        </h1>
        <p className="opacity-90">
          {generatedContent.seoDescription || description || "Premium product description with compelling value proposition."}
        </p>
      </div>
      
      <div className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
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

            {/* Use Cases in Advanced Template */}
            {generatedContent.useCases && generatedContent.useCases.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Use Cases</h3>
                <div className="space-y-3">
                  {generatedContent.useCases.map((useCase, index) => (
                    <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-100">
                      <h4 className="font-medium text-blue-900 text-sm mb-1">{useCase.title}</h4>
                      <p className="text-blue-800 text-xs">{useCase.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-gray-500 line-through">
                  ${((parseFloat(price) || 0) * 1.3).toFixed(2)}
                </span>
                <span className="bg-accent text-white px-2 py-1 rounded text-sm font-medium">
                  23% OFF
                </span>
              </div>
              <div className="text-4xl font-bold text-primary mb-4">
                ${price || "0.00"}
              </div>
            </div>

            {/* Generated Feature Sections or Key Features */}
            {generatedContent.featureSections && generatedContent.featureSections.length > 0 ? (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Premium Features</h3>
                <div className="space-y-3">
                  {generatedContent.featureSections.map((section, index) => (
                    <div key={index} className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                      <div className="flex items-start gap-3">
                        <div className="bg-emerald-100 p-1 rounded-full">
                          <ApperIcon name="Check" size={14} className="text-emerald-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-emerald-900 text-sm">{section.title}</h4>
                          <p className="text-emerald-800 text-xs mt-1">{section.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : keyFeatures.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">What You Get</h3>
                <ul className="space-y-3">
                  {keyFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="bg-emerald-100 p-1 rounded-full">
                        <ApperIcon name="Check" size={14} className="text-emerald-600" />
                      </div>
                      <span className="text-gray-700 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Key Selling Points */}
            {generatedContent.sellingPoints && generatedContent.sellingPoints.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Why Choose This</h3>
                <div className="space-y-2">
                  {generatedContent.sellingPoints.slice(0, 3).map((point, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <ApperIcon name="Star" size={14} className="text-yellow-500 mt-1" />
                      <span className="text-gray-700 text-sm">{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="space-y-3">
              <Button className="w-full" size="lg">
                <ApperIcon name="ShoppingCart" size={18} />
                Add to Cart - ${price || "0.00"}
              </Button>
              <Button variant="outline" className="w-full" size="lg">
                <ApperIcon name="Heart" size={18} />
                Save for Later
              </Button>
            </div>
          </div>
        </div>

        {/* Additional selling points at bottom */}
        {generatedContent.sellingPoints && generatedContent.sellingPoints.length > 3 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid md:grid-cols-2 gap-3">
              {generatedContent.sellingPoints.slice(3).map((point, index) => (
                <div key={index + 3} className="flex items-start gap-2 bg-gray-50 p-3 rounded-lg">
                  <ApperIcon name="Shield" size={14} className="text-primary mt-0.5" />
                  <span className="text-gray-700 text-sm">{point}</span>
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