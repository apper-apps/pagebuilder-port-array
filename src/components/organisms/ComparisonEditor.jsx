import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Modal from '@/components/atoms/Modal';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';
import { toast } from 'react-toastify';

const ComparisonEditor = ({ 
  isOpen, 
  onClose, 
  onSave, 
  collection, 
  availableProducts 
}) => {
  const [comparisonData, setComparisonData] = useState({
    name: '',
    description: '',
    productIds: [],
    criteria: ['price', 'features', 'ratings'],
    template: 'Wirecutter-style Comparison'
  });

  const availableCriteria = [
    { id: 'price', label: 'Price', icon: 'DollarSign' },
    { id: 'features', label: 'Key Features', icon: 'List' },
    { id: 'ratings', label: 'Ratings', icon: 'Star' },
    { id: 'brand', label: 'Brand', icon: 'Tag' },
    { id: 'availability', label: 'Availability', icon: 'Package' },
    { id: 'warranty', label: 'Warranty', icon: 'Shield' }
  ];

  useEffect(() => {
    if (collection && isOpen) {
      setComparisonData({
        name: collection.name || '',
        description: collection.description || '',
        productIds: collection.productIds || [],
        criteria: collection.comparisonCriteria || ['price', 'features', 'ratings'],
        template: collection.template || 'Wirecutter-style Comparison'
      });
    } else if (isOpen && !collection) {
      setComparisonData({
        name: '',
        description: '',
        productIds: [],
        criteria: ['price', 'features', 'ratings'],
        template: 'Wirecutter-style Comparison'
      });
    }
  }, [collection, isOpen]);

  const handleInputChange = (field, value) => {
    setComparisonData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleCriteria = (criteriaId) => {
    setComparisonData(prev => ({
      ...prev,
      criteria: prev.criteria.includes(criteriaId)
        ? prev.criteria.filter(id => id !== criteriaId)
        : [...prev.criteria, criteriaId]
    }));
  };

  const toggleProduct = (productId) => {
    setComparisonData(prev => ({
      ...prev,
      productIds: prev.productIds.includes(productId)
        ? prev.productIds.filter(id => id !== productId)
        : [...prev.productIds, productId]
    }));
  };

  const handleSave = async () => {
    if (!comparisonData.name.trim()) {
      toast.error('Please enter a comparison name');
      return;
    }

    if (comparisonData.productIds.length < 2) {
      toast.error('Please select at least 2 products to compare');
      return;
    }

    if (comparisonData.criteria.length === 0) {
      toast.error('Please select at least one comparison criteria');
      return;
    }

    try {
      const comparisonToSave = {
        ...comparisonData,
        comparisonCriteria: comparisonData.criteria,
        template: comparisonData.template
      };

      await onSave(comparisonToSave);
      toast.success('Comparison saved successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to save comparison');
      console.error('Error saving comparison:', error);
    }
  };

  const selectedProducts = availableProducts?.filter(product => 
    comparisonData.productIds.includes(product.Id)
  ) || [];

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={collection ? 'Edit Comparison' : 'Create Comparison Table'}
      size="lg"
    >
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Basic Information</h3>
          <div className="grid grid-cols-1 gap-4">
            <Input
              label="Comparison Name"
              value={comparisonData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="e.g., Best Wireless Headphones 2024"
              required
            />
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={comparisonData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe what this comparison covers..."
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Product Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">Products to Compare</h3>
            <span className="text-sm text-gray-600">
              {comparisonData.productIds.length} selected
            </span>
          </div>
          
          {availableProducts && availableProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
              {availableProducts.map((product) => (
                <motion.div
                  key={product.Id}
                  className={cn(
                    "p-3 rounded-lg border-2 cursor-pointer transition-all",
                    comparisonData.productIds.includes(product.Id)
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                  onClick={() => toggleProduct(product.Id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      {product.images?.[0] ? (
                        <img 
                          src={product.images[0]} 
                          alt={product.productName}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <ApperIcon name="Package" size={16} className="text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-gray-900 truncate">
                        {product.productName || product.name}
                      </h4>
                      <p className="text-xs text-gray-600 truncate">
                        {product.price ? `$${product.price}` : 'Price not set'}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      {comparisonData.productIds.includes(product.Id) ? (
                        <ApperIcon name="CheckCircle" size={16} className="text-primary" />
                      ) : (
                        <div className="w-4 h-4 border border-gray-300 rounded-full" />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <ApperIcon name="Package" size={32} className="mx-auto mb-2" />
              <p>No products available. Create some product pages first.</p>
            </div>
          )}
        </div>

        {/* Criteria Selection */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Comparison Criteria</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {availableCriteria.map((criteria) => (
              <button
                key={criteria.id}
                onClick={() => toggleCriteria(criteria.id)}
                className={cn(
                  "flex items-center gap-2 p-3 rounded-lg border-2 text-left transition-all",
                  comparisonData.criteria.includes(criteria.id)
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-gray-200 hover:border-gray-300 text-gray-700"
                )}
              >
                <ApperIcon name={criteria.icon} size={16} />
                <span className="text-sm font-medium">{criteria.label}</span>
                {comparisonData.criteria.includes(criteria.id) && (
                  <ApperIcon name="Check" size={14} className="ml-auto" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        {selectedProducts.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Preview</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-4 mb-3">
                <ApperIcon name="BarChart3" size={20} className="text-primary" />
                <div>
                  <h4 className="font-medium text-gray-900">{comparisonData.name}</h4>
                  <p className="text-sm text-gray-600">
                    Comparing {selectedProducts.length} products across {comparisonData.criteria.length} criteria
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedProducts.map((product) => (
                  <span 
                    key={product.Id}
                    className="px-2 py-1 bg-white rounded text-xs text-gray-700 border"
                  >
                    {product.productName || product.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
          <Button onClick={onClose} variant="secondary">
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!comparisonData.name.trim() || comparisonData.productIds.length < 2}
          >
            {collection ? 'Update Comparison' : 'Create Comparison'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ComparisonEditor;