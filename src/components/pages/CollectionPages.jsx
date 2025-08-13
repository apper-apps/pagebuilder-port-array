import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import collectionsService from '@/services/api/collectionsService';
import productPagesService from '@/services/api/productPagesService';
import CreateCollectionPage from '@/components/organisms/CreateCollectionPage';
import CollectionCard from '@/components/molecules/CollectionCard';
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import Button from '@/components/atoms/Button';
import Modal from '@/components/atoms/Modal';
import { toast } from 'react-toastify';
const CollectionPages = () => {
  const [collections, setCollections] = useState([]);
  const [productPages, setProductPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateCollection, setShowCreateCollection] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, collection: null });

  useEffect(() => {
    loadCollections();
    loadProductPages();
  }, []);

  const loadCollections = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await collectionsService.getAll();
      setCollections(data);
    } catch (err) {
      setError('Failed to load collections. Please try again.');
      toast.error('Failed to load collections');
    } finally {
      setLoading(false);
    }
  };

  const loadProductPages = async () => {
    try {
      const data = await productPagesService.getAll();
      setProductPages(data);
    } catch (err) {
      console.error('Failed to load product pages:', err);
    }
  };

  const getProductCount = (collection) => {
    return collection.productIds?.length || 0;
  };

  const handleCreateCollection = () => {
    setShowCreateCollection(true);
  };

  const handleBackFromCreate = () => {
    setShowCreateCollection(false);
    loadCollections(); // Refresh the list
  };

  const handleEditCollection = (collection) => {
    // For now, redirect to create with edit mode
    // This would typically open an edit modal or navigate to edit page
    toast.info('Edit functionality coming soon!');
  };

  const handleDeleteCollection = (collection) => {
    setDeleteModal({ open: true, collection });
  };

  const confirmDelete = async () => {
    try {
      await collectionsService.delete(deleteModal.collection.Id);
      setCollections(prev => prev.filter(c => c.Id !== deleteModal.collection.Id));
      toast.success('Collection deleted successfully');
    } catch (error) {
      toast.error('Failed to delete collection');
    } finally {
      setDeleteModal({ open: false, collection: null });
    }
  };

  const handleDuplicateCollection = async (collection) => {
    try {
      const duplicatedData = {
        ...collection,
        name: `${collection.name} (Copy)`,
        title: `${collection.title} (Copy)`,
        status: 'draft'
      };
      delete duplicatedData.Id;
      delete duplicatedData.createdAt;
      delete duplicatedData.updatedAt;

      await collectionsService.create(duplicatedData);
      loadCollections();
      toast.success('Collection duplicated successfully');
    } catch (error) {
      toast.error('Failed to duplicate collection');
    }
  };

  if (showCreateCollection) {
    return <CreateCollectionPage onBack={handleBackFromCreate} />;
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Collection Pages
            </h1>
            <p className="text-gray-600">
              Create beautiful collection pages to showcase multiple products
            </p>
          </div>
        </div>
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Collection Pages
            </h1>
            <p className="text-gray-600">
              Create beautiful collection pages to showcase multiple products
            </p>
          </div>
        </div>
        <Error message={error} onRetry={loadCollections} />
      </div>
    );
  }
  return (
    <div className="space-y-6">
<div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Collection Pages
          </h1>
          <p className="text-gray-600">
            Create beautiful collection pages to showcase multiple products
          </p>
        </div>
        <Button onClick={handleCreateCollection} icon="Plus">
          Create New Collection
        </Button>
      </div>

{collections.length === 0 ? (
        <Empty
          title="No Collections Yet"
          description="Create your first collection to showcase and compare multiple products together. Perfect for building product catalogs, comparison guides, and curated selections."
          actionLabel="Create Your First Collection"
          onAction={handleCreateCollection}
          icon="Grid3X3"
        />
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <ApperIcon name="Grid3X3" size={16} />
                <span>{collections.length} collection{collections.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {collections.map((collection) => (
              <CollectionCard
                key={collection.Id}
                collection={collection}
                productCount={getProductCount(collection)}
                onEdit={handleEditCollection}
                onDelete={handleDeleteCollection}
                onDuplicate={handleDuplicateCollection}
              />
            ))}
          </div>
        </>
      )}

      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, collection: null })}
        title="Delete Collection"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="bg-red-100 p-2 rounded-lg">
              <ApperIcon name="AlertTriangle" size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-gray-900">
                Are you sure you want to delete "{deleteModal.collection?.title || deleteModal.collection?.name}"?
              </p>
              <p className="text-sm text-gray-600 mt-1">
                This action cannot be undone. The collection will be permanently removed.
              </p>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ open: false, collection: null })}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Collection
            </Button>
          </div>
        </div>
      </Modal>

      <div className="bg-gradient-to-br from-secondary/5 to-primary/5 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="bg-white p-3 rounded-xl">
            <ApperIcon name="Sparkles" size={24} className="text-secondary" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              What's Coming in Collection Pages
            </h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-center gap-2">
                <ApperIcon name="Check" size={14} className="text-emerald-500" />
                <span>Drag & drop collection builder</span>
              </li>
              <li className="flex items-center gap-2">
                <ApperIcon name="Check" size={14} className="text-emerald-500" />
                <span>Multiple layout templates</span>
              </li>
              <li className="flex items-center gap-2">
                <ApperIcon name="Check" size={14} className="text-emerald-500" />
                <span>Smart product filtering</span>
              </li>
              <li className="flex items-center gap-2">
                <ApperIcon name="Check" size={14} className="text-emerald-500" />
                <span>Automated product recommendations</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {[
          {
            title: "Category Collections",
            description: "Group products by category with smart filtering",
            icon: "Grid3X3",
            color: "primary"
          },
          {
            title: "Featured Collections",
            description: "Showcase your best products in curated lists",
            icon: "Star",
            color: "secondary"
          },
          {
            title: "Seasonal Collections",
            description: "Create time-sensitive product groupings",
            icon: "Calendar",
            color: "accent"
          }
        ].map((item, index) => (
          <div key={index} className="card p-6 opacity-60">
            <div className={`bg-${item.color}/10 p-3 rounded-xl w-fit mb-4`}>
              <ApperIcon 
                name={item.icon} 
                size={24} 
                className={`text-${item.color}`}
              />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              {item.title}
            </h3>
            <p className="text-sm text-gray-600">
              {item.description}
            </p>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <span className="text-xs text-gray-500 font-medium">
                COMING SOON
              </span>
            </div>
          </div>
        ))}
      </motion.div>
</div>
  );
};

export default CollectionPages;