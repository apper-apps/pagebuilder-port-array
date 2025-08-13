import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { cn } from '@/utils/cn';

const ComparisonTable = ({ 
  collection, 
  products, 
  onEdit,
  onBack,
  className 
}) => {
  const [selectedCriteria, setSelectedCriteria] = useState([
    'price', 'features', 'ratings'
  ]);
  
  const availableCriteria = [
    { id: 'price', label: 'Price', icon: 'DollarSign' },
    { id: 'features', label: 'Key Features', icon: 'List' },
    { id: 'ratings', label: 'Ratings', icon: 'Star' },
    { id: 'brand', label: 'Brand', icon: 'Tag' },
    { id: 'availability', label: 'Availability', icon: 'Package' },
    { id: 'warranty', label: 'Warranty', icon: 'Shield' }
  ];

  const comparisonProducts = useMemo(() => {
    if (!products || !collection?.productIds) return [];
    return products.filter(product => 
      collection.productIds.includes(product.Id)
    );
  }, [products, collection]);

  const toggleCriteria = (criteriaId) => {
    setSelectedCriteria(prev => 
      prev.includes(criteriaId) 
        ? prev.filter(id => id !== criteriaId)
        : [...prev, criteriaId]
    );
  };

  const renderCriteriaValue = (product, criteriaId) => {
    switch (criteriaId) {
      case 'price':
        return product.price ? `$${product.price}` : 'N/A';
      case 'features':
        return (
          <ul className="text-sm space-y-1">
            {product.keyFeatures?.slice(0, 3).map((feature, idx) => (
              <li key={idx} className="flex items-center gap-1">
                <ApperIcon name="Check" size={12} className="text-emerald-500 flex-shrink-0" />
                <span className="truncate">{feature}</span>
              </li>
            ))}
            {product.keyFeatures?.length > 3 && (
              <li className="text-gray-500">+{product.keyFeatures.length - 3} more</li>
            )}
          </ul>
        );
      case 'ratings':
        const rating = 4.2 + (product.Id * 0.3) % 1.3; // Mock rating calculation
        return (
          <div className="flex items-center gap-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <ApperIcon 
                  key={i} 
                  name="Star" 
                  size={14}
                  className={cn(
                    i < Math.floor(rating) 
                      ? "text-yellow-400 fill-yellow-400" 
                      : "text-gray-300"
                  )}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">{rating.toFixed(1)}</span>
          </div>
        );
      case 'brand':
        return product.brand || 'Unknown';
      case 'availability':
        return product.availability || 'In Stock';
      case 'warranty':
        return product.warranty || '1 Year';
      default:
        return 'N/A';
    }
  };

  const findBestValue = (criteriaId) => {
    if (criteriaId === 'price') {
      const prices = comparisonProducts.map(p => parseFloat(p.price) || Infinity);
      const minPrice = Math.min(...prices);
      return comparisonProducts.findIndex(p => parseFloat(p.price) === minPrice);
    }
    if (criteriaId === 'ratings') {
      const ratings = comparisonProducts.map(p => 4.2 + (p.Id * 0.3) % 1.3);
      const maxRating = Math.max(...ratings);
      return comparisonProducts.findIndex((p, idx) => ratings[idx] === maxRating);
    }
    return -1;
  };

  if (!collection || !comparisonProducts.length) {
    return (
      <div className="text-center py-12">
        <ApperIcon name="BarChart3" size={48} className="text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Products to Compare</h3>
        <p className="text-gray-600 mb-6">Add products to this collection to start comparing them.</p>
        <Button onClick={onBack} variant="secondary">
          Back to Collections
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button onClick={onBack} variant="ghost" icon="ArrowLeft" size="sm" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{collection.name}</h1>
            <p className="text-gray-600">Compare {comparisonProducts.length} products</p>
          </div>
        </div>
        <Button onClick={onEdit} icon="Edit" variant="secondary">
          Edit Comparison
        </Button>
      </div>

      {/* Criteria Selector */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <h3 className="font-medium text-gray-900 mb-3">Comparison Criteria</h3>
        <div className="flex flex-wrap gap-2">
          {availableCriteria.map((criteria) => (
            <button
              key={criteria.id}
              onClick={() => toggleCriteria(criteria.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                selectedCriteria.includes(criteria.id)
                  ? "bg-primary text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              <ApperIcon name={criteria.icon} size={14} />
              {criteria.label}
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 font-medium text-gray-900 min-w-[150px]">
                  Criteria
                </th>
                {comparisonProducts.map((product) => (
                  <th key={product.Id} className="text-center p-4 min-w-[200px]">
                    <div className="space-y-2">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto flex items-center justify-center">
                        {product.images?.[0] ? (
                          <img 
                            src={product.images[0]} 
                            alt={product.productName}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <ApperIcon name="Package" size={24} className="text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm leading-tight">
                          {product.productName || product.name}
                        </h4>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {selectedCriteria.map((criteriaId) => {
                const criteria = availableCriteria.find(c => c.id === criteriaId);
                const bestValueIndex = findBestValue(criteriaId);
                
                return (
                  <tr key={criteriaId} className="border-t border-gray-100">
                    <td className="p-4 font-medium text-gray-900 bg-gray-50/50">
                      <div className="flex items-center gap-2">
                        <ApperIcon name={criteria.icon} size={16} className="text-gray-500" />
                        {criteria.label}
                      </div>
                    </td>
                    {comparisonProducts.map((product, productIndex) => (
                      <td key={`${product.Id}-${criteriaId}`} className="p-4 text-center">
                        <div className={cn(
                          "relative",
                          bestValueIndex === productIndex && "ring-2 ring-emerald-500 ring-opacity-50 rounded-lg bg-emerald-50"
                        )}>
                          {bestValueIndex === productIndex && (
                            <div className="absolute -top-2 -right-2">
                              <div className="bg-emerald-500 text-white rounded-full p-1">
                                <ApperIcon name="Crown" size={12} />
                              </div>
                            </div>
                          )}
                          <div className="p-2">
                            {renderCriteriaValue(product, criteriaId)}
                          </div>
                        </div>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile-Optimized Cards */}
      <div className="md:hidden space-y-4">
        <h3 className="font-medium text-gray-900">Mobile View</h3>
        {comparisonProducts.map((product) => (
          <motion.div
            key={product.Id}
            className="bg-white rounded-xl border border-gray-200 p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                {product.images?.[0] ? (
                  <img 
                    src={product.images[0]} 
                    alt={product.productName}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <ApperIcon name="Package" size={20} className="text-gray-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate">
                  {product.productName || product.name}
                </h4>
                <p className="text-sm text-gray-600">
                  {product.description?.substring(0, 100)}...
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              {selectedCriteria.map((criteriaId) => {
                const criteria = availableCriteria.find(c => c.id === criteriaId);
                return (
                  <div key={criteriaId} className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <ApperIcon name={criteria.icon} size={14} className="text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">
                        {criteria.label}
                      </span>
                    </div>
                    <div className="text-right text-sm">
                      {renderCriteriaValue(product, criteriaId)}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ComparisonTable;