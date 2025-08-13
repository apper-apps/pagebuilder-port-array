import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const ProductCard = ({ page, onEdit, onDelete, onView }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "published": return "bg-emerald-100 text-emerald-800";
      case "draft": return "bg-amber-100 text-amber-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="card card-hover p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
            {page.productName || page.name}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {page.description}
          </p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(page.status)}`}>
          {page.status}
        </span>
      </div>
      
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <ApperIcon name="Template" size={14} />
          <span>{page.template}</span>
        </div>
        
        {page.price && (
          <div className="flex items-center gap-2 text-sm text-gray-900 font-medium">
            <ApperIcon name="DollarSign" size={14} />
            <span>${page.price}</span>
          </div>
        )}
        
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <ApperIcon name="Clock" size={14} />
          <span>Updated {formatDistanceToNow(new Date(page.updatedAt))} ago</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onView(page)}
          icon="Eye"
          className="flex-1"
        >
          Preview
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(page)}
          icon="Edit2"
        />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(page)}
          icon="Trash2"
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        />
      </div>
    </motion.div>
  );
};

export default ProductCard;