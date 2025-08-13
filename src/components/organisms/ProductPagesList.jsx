import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import productPagesService from "@/services/api/productPagesService";
import ProductCard from "@/components/molecules/ProductCard";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const ProductPagesList = ({ onCreateNew, onEdit }) => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPages = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await productPagesService.getAll();
      setPages(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPages();
  }, []);

  const handleDelete = async (page) => {
    if (window.confirm(`Are you sure you want to delete "${page.productName || page.name}"?`)) {
      try {
        await productPagesService.delete(page.Id);
        setPages(prev => prev.filter(p => p.Id !== page.Id));
        toast.success("Product page deleted successfully");
      } catch (err) {
        toast.error("Failed to delete product page");
      }
    }
  };

  const handleView = (page) => {
    toast.info("Preview functionality would open in a new window");
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadPages} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Product Pages
          </h1>
          <p className="text-gray-600">
            Manage your high-converting product pages
          </p>
        </div>
        
        <Button
          onClick={onCreateNew}
          icon="Plus"
          size="lg"
        >
          Create New Product Page
        </Button>
      </div>

      {pages.length === 0 ? (
        <Empty
          title="No product pages yet"
          description="Start building your first high-converting product page with our professional templates"
          actionLabel="Create Your First Page"
          onAction={onCreateNew}
          icon="Package"
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {pages.map((page) => (
            <ProductCard
              key={page.Id}
              page={page}
              onEdit={onEdit}
              onDelete={handleDelete}
              onView={handleView}
            />
          ))}
        </motion.div>
      )}

      <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="bg-white p-3 rounded-xl">
            <ApperIcon name="Lightbulb" size={24} className="text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Pro Tips for High-Converting Pages
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Use clear, benefit-focused headlines</li>
              <li>• Include social proof and testimonials</li>
              <li>• Optimize for mobile viewing</li>
              <li>• Test different templates for better conversion</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPagesList;