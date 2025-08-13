import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const CollectionCard = ({ 
  collection, 
  onEdit, 
  onDelete, 
  onDuplicate,
  productCount = 0,
  className = "" 
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

const getTemplateIcon = (template) => {
    if (template?.includes('Comparison') || template?.includes('Wirecutter')) {
      return 'BarChart3';
    }
    return 'Grid3X3';
  };

  const isComparisonTemplate = template?.includes('Comparison') || template?.includes('Wirecutter');

  const handleViewComparison = (e) => {
    e.stopPropagation();
    if (onViewComparison) {
      onViewComparison(collection);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={`bg-white rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all duration-200 ${className}`}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-blue-50 p-1.5 rounded-lg">
                <ApperIcon 
                  name={getTemplateIcon(collection.template)} 
                  size={16} 
                  className="text-blue-600" 
                />
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(collection.status)}`}>
                {collection.status}
              </span>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
              {collection.title || collection.name}
            </h3>
            
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {collection.description}
            </p>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <ApperIcon name="Package" size={14} />
                <span>{productCount} product{productCount !== 1 ? 's' : ''}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <ApperIcon name="Layers" size={14} />
                <span>{collection.template}</span>
              </div>
              
<div className="flex items-center gap-1">
                <ApperIcon name="Clock" size={14} />
                <span>
                  {formatDistanceToNow(new Date(collection.updatedAt), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            {isComparisonTemplate && (
              <Button 
                onClick={handleViewComparison}
                size="sm" 
                variant="ghost" 
                icon="Eye"
                title="View Comparison"
              />
            )}
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                onEdit(collection);
              }}
              size="sm" 
              variant="ghost" 
              icon="Edit"
            />
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDuplicate?.(collection)}
            >
              <ApperIcon name="Copy" size={14} />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete?.(collection)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <ApperIcon name="Trash2" size={14} />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CollectionCard;