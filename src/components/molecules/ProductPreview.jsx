import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const ProductPreview = ({ formData, template = "basic" }) => {
  const { productName, description, price, keyFeatures = [], images = [] } = formData;
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
        
        <div className="prose prose-sm max-w-none mb-6">
          <p className="text-gray-700">
            {description || "Product description will appear here. Add your compelling product details to engage customers."}
          </p>
        </div>
        
        {keyFeatures.length > 0 && (
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
          {description || "Premium product description with compelling value proposition."}
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
            
            {keyFeatures.length > 0 && (
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