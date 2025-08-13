import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import collectionsService from '@/services/api/collectionsService';
import productPagesService from '@/services/api/productPagesService';
import TemplateSelector from '@/components/organisms/TemplateSelector';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Textarea from '@/components/atoms/Textarea';
import ApperIcon from '@/components/ApperIcon';
import { toast } from 'react-toastify';

const CreateCollectionPage = ({ onBack }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
    productIds: [],
    status: 'draft'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setProductsLoading(true);
      const products = await productPagesService.getAll();
      setAvailableProducts(products.filter(p => p.status === 'published'));
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setProductsLoading(false);
    }
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setCurrentStep(2);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleProductToggle = (productId) => {
    setFormData(prev => ({
      ...prev,
      productIds: prev.productIds.includes(productId)
        ? prev.productIds.filter(id => id !== productId)
        : [...prev.productIds, productId]
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = "Collection name is required";
    }
    
    if (!formData.title?.trim()) {
      newErrors.title = "Collection title is required";
    }
    
    if (!formData.description?.trim()) {
      newErrors.description = "Collection description is required";
    }

    if (formData.productIds.length === 0) {
      newErrors.products = "Please select at least one product";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (status = 'draft') => {
    if (!validateForm()) {
      toast.error('Please fix the form errors before saving');
      return;
    }

    try {
      setLoading(true);
      const collectionData = {
        ...formData,
        template: selectedTemplate.name,
        status
      };

      await collectionsService.create(collectionData);
      
      toast.success(`Collection ${status === 'published' ? 'published' : 'saved'} successfully!`);
      
      if (onBack) {
        onBack();
      } else {
        navigate('/collections');
      }
    } catch (error) {
      toast.error('Failed to save collection');
    } finally {
      setLoading(false);
    }
  };

  if (currentStep === 1) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={onBack} icon="ArrowLeft">
            Back to Collections
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Collection</h1>
            <p className="text-gray-600">Choose a template to get started</p>
          </div>
        </div>

        <TemplateSelector
          isOpen={true}
          onClose={onBack}
          onSelectTemplate={handleTemplateSelect}
          mode="collection"
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => setCurrentStep(1)} icon="ArrowLeft">
          Back to Templates
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Setup Collection</h1>
          <p className="text-gray-600">Configure your {selectedTemplate.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-lg">
                <ApperIcon 
                  name={selectedTemplate?.type === "comparison" ? "BarChart3" : "Grid3X3"} 
                  size={20} 
                  className="text-blue-600"
                />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">
                  {selectedTemplate?.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {selectedTemplate?.description}
                </p>
              </div>
            </div>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <Input
              label="Collection Name"
              placeholder="Internal name for your collection"
              value={formData.name}
              onChange={(value) => handleInputChange("name", value)}
              error={errors.name}
              required
            />

            <Input
              label="Collection Title"
              placeholder="Public title shown to visitors"
              value={formData.title}
              onChange={(value) => handleInputChange("title", value)}
              error={errors.title}
              required
            />

            <Textarea
              label="Collection Description"
              placeholder="Describe what this collection is about..."
              value={formData.description}
              onChange={(value) => handleInputChange("description", value)}
              error={errors.description}
              rows={4}
              required
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Select Products ({formData.productIds.length} selected)
                </label>
                {errors.products && (
                  <span className="text-sm text-red-600">{errors.products}</span>
                )}
              </div>

              {productsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <ApperIcon name="Loader" size={24} className="animate-spin text-blue-600" />
                </div>
              ) : availableProducts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ApperIcon name="Package" size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>No published products available</p>
                  <p className="text-sm">Create and publish some product pages first</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto">
                  {availableProducts.map((product) => (
                    <div
                      key={product.Id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        formData.productIds.includes(product.Id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleProductToggle(product.Id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{product.productName}</h4>
                          <p className="text-sm text-gray-600 line-clamp-1">{product.description}</p>
                          <p className="text-sm font-medium text-blue-600">${product.price}</p>
                        </div>
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          formData.productIds.includes(product.Id)
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        }`}>
                          {formData.productIds.includes(product.Id) && (
                            <ApperIcon name="Check" size={12} className="text-white" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </form>

          <div className="flex gap-3 pt-6 border-t">
            <Button
              onClick={() => handleSave('draft')}
              disabled={loading}
              variant="outline"
            >
              {loading ? <ApperIcon name="Loader" size={16} className="animate-spin" /> : null}
              Save Draft
            </Button>
            <Button
              onClick={() => handleSave('published')}
              disabled={loading}
            >
              {loading ? <ApperIcon name="Loader" size={16} className="animate-spin" /> : null}
              Publish Collection
            </Button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="font-medium text-gray-900 mb-4">Collection Preview</h3>
          <div className="bg-white rounded-lg p-4 space-y-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {formData.title || 'Collection Title'}
              </h2>
              <p className="text-gray-600 mt-2">
                {formData.description || 'Collection description will appear here...'}
              </p>
            </div>
            
            {formData.productIds.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-700">Selected Products:</h4>
                {formData.productIds.map(productId => {
                  const product = availableProducts.find(p => p.Id === productId);
                  return product ? (
                    <div key={productId} className="flex items-center gap-2 text-sm">
                      <ApperIcon name="Package" size={14} className="text-blue-600" />
                      <span>{product.productName}</span>
                    </div>
                  ) : null;
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CreateCollectionPage;