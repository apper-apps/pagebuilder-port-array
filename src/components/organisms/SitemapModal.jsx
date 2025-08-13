import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '@/components/atoms/Modal';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import sitemapService from '@/services/api/sitemapService';
import productPagesService from '@/services/api/productPagesService';
import collectionsService from '@/services/api/collectionsService';
import { toast } from 'react-toastify';

const SitemapModal = ({ isOpen, onClose, onImportComplete }) => {
  const [activeTab, setActiveTab] = useState('url'); // 'url' or 'file'
  const [sitemapUrl, setSitemapUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Input, 2: Product Selection, 3: Collection Creation
  const [extractedProducts, setExtractedProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [collectionName, setCollectionName] = useState('');

  const handleReset = () => {
    setStep(1);
    setSitemapUrl('');
    setSelectedFile(null);
    setExtractedProducts([]);
    setSelectedProducts([]);
    setSearchTerm('');
    setCollectionName('');
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/xml') {
      setSelectedFile(file);
    } else {
      toast.error('Please select a valid XML sitemap file');
    }
  };

  const parseSitemap = async () => {
    setLoading(true);
    try {
      let sitemapContent;
      
      if (activeTab === 'url') {
        if (!sitemapUrl) {
          toast.error('Please enter a sitemap URL');
          return;
        }
        sitemapContent = await sitemapService.parseSitemapFromUrl(sitemapUrl);
      } else {
        if (!selectedFile) {
          toast.error('Please select a sitemap file');
          return;
        }
        sitemapContent = await sitemapService.parseSitemapFromFile(selectedFile);
      }

      const productUrls = sitemapService.extractProductUrls(sitemapContent);
      
      if (productUrls.length === 0) {
        toast.error('No product URLs found in the sitemap');
        return;
      }

      // Extract product information from URLs
      const products = [];
      for (const url of productUrls.slice(0, 50)) { // Limit to 50 for performance
        try {
          const productInfo = await productPagesService.scanProductUrl(url);
          products.push({
            url,
            title: productInfo.title || extractTitleFromUrl(url),
            description: productInfo.description || '',
            image: productInfo.image || '',
            price: productInfo.price || '',
            category: productInfo.category || 'Uncategorized',
            selected: false
          });
        } catch (error) {
          // If scanning fails, create basic product info
          products.push({
            url,
            title: extractTitleFromUrl(url),
            description: '',
            image: '',
            price: '',
            category: 'Uncategorized',
            selected: false
          });
        }
      }

      setExtractedProducts(products);
      setCollectionName(`Imported Collection - ${new Date().toLocaleDateString()}`);
      setStep(2);
      toast.success(`Found ${products.length} products in sitemap`);
    } catch (error) {
      toast.error(error.message || 'Failed to parse sitemap');
    } finally {
      setLoading(false);
    }
  };

  const extractTitleFromUrl = (url) => {
    const parts = url.split('/').filter(part => part);
    const lastPart = parts[parts.length - 1] || parts[parts.length - 2] || 'Product';
    return lastPart.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const toggleProductSelection = (index) => {
    setExtractedProducts(prev => 
      prev.map((product, i) => 
        i === index ? { ...product, selected: !product.selected } : product
      )
    );
  };

  const toggleSelectAll = () => {
    const filteredProducts = getFilteredProducts();
    const allSelected = filteredProducts.every(product => product.selected);
    
    setExtractedProducts(prev => 
      prev.map(product => 
        filteredProducts.includes(product) 
          ? { ...product, selected: !allSelected }
          : product
      )
    );
  };

  const getFilteredProducts = () => {
    return extractedProducts.filter(product =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.url.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleImport = async () => {
    const selectedProductsList = extractedProducts.filter(product => product.selected);
    
    if (selectedProductsList.length === 0) {
      toast.error('Please select at least one product to import');
      return;
    }

    if (!collectionName.trim()) {
      toast.error('Please enter a collection name');
      return;
    }

    setLoading(true);
    try {
      // Create product pages for selected products
      const createdProductIds = [];
      
      for (const product of selectedProductsList) {
        try {
          const productPage = await productPagesService.create({
            title: product.title,
            description: product.description,
            url: product.url,
            image: product.image,
            price: product.price,
            category: product.category,
            status: 'draft',
            template: 'ecommerce-product'
          });
          createdProductIds.push(productPage.Id);
        } catch (error) {
          console.warn(`Failed to create product page for ${product.title}:`, error);
        }
      }

      if (createdProductIds.length === 0) {
        toast.error('Failed to create any product pages');
        return;
      }

      // Create collection with the imported products
      const collection = await collectionsService.create({
        name: collectionName.trim(),
        title: collectionName.trim(),
        description: `Collection imported from sitemap with ${createdProductIds.length} products`,
        productIds: createdProductIds,
        status: 'draft',
        template: 'product-grid'
      });

      onImportComplete([collection]);
      handleClose();
    } catch (error) {
      toast.error('Failed to import products: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = getFilteredProducts();
  const selectedCount = extractedProducts.filter(p => p.selected).length;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="4xl">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Import from Sitemap</h2>
          <Button variant="ghost" onClick={handleClose} icon="X" />
        </div>

        {step === 1 && (
          <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('url')}
                className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'url'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <ApperIcon name="Link" size={16} className="inline mr-2" />
                Sitemap URL
              </button>
              <button
                onClick={() => setActiveTab('file')}
                className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'file'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <ApperIcon name="Upload" size={16} className="inline mr-2" />
                Upload File
              </button>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'url' && (
                <motion.div
                  key="url"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sitemap URL
                    </label>
                    <Input
                      type="url"
                      placeholder="https://example.com/sitemap.xml"
                      value={sitemapUrl}
                      onChange={(e) => setSitemapUrl(e.target.value)}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Enter the URL to your sitemap.xml file
                    </p>
                  </div>
                </motion.div>
              )}

              {activeTab === 'file' && (
                <motion.div
                  key="file"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Sitemap File
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      <ApperIcon name="Upload" size={32} className="mx-auto text-gray-400 mb-2" />
                      <div className="text-sm text-gray-600">
                        <label className="cursor-pointer text-primary hover:text-primary-dark">
                          Click to upload
                          <input
                            type="file"
                            accept=".xml"
                            onChange={handleFileSelect}
                            className="hidden"
                          />
                        </label>
                        <span> or drag and drop</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">XML files only</p>
                      {selectedFile && (
                        <p className="text-sm text-green-600 mt-2">
                          Selected: {selectedFile.name}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                onClick={parseSitemap}
                disabled={loading || (activeTab === 'url' ? !sitemapUrl : !selectedFile)}
                icon={loading ? undefined : "Search"}
              >
                {loading ? <Loading size="sm" /> : 'Parse Sitemap'}
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Select Products to Import</h3>
                <p className="text-sm text-gray-600">
                  Found {extractedProducts.length} products • {selectedCount} selected
                </p>
              </div>
              <Button
                variant="ghost"
                onClick={() => setStep(1)}
                icon="ArrowLeft"
              >
                Back
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon="Search"
                className="flex-1"
              />
              <Button
                variant="secondary"
                onClick={toggleSelectAll}
                icon={filteredProducts.every(p => p.selected) ? "Square" : "CheckSquare"}
              >
                {filteredProducts.every(p => p.selected) ? 'Deselect All' : 'Select All'}
              </Button>
            </div>

            <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
              {filteredProducts.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No products found matching your search
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredProducts.map((product, index) => {
                    const originalIndex = extractedProducts.indexOf(product);
                    return (
                      <div
                        key={originalIndex}
                        className={`p-4 hover:bg-gray-50 transition-colors ${
                          product.selected ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={product.selected}
                            onChange={() => toggleProductSelection(originalIndex)}
                            className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900 truncate">
                                  {product.title}
                                </h4>
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                  {product.description || 'No description available'}
                                </p>
                                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <ApperIcon name="Link" size={12} />
                                    {product.url}
                                  </span>
                                  {product.category && (
                                    <span className="flex items-center gap-1">
                                      <ApperIcon name="Tag" size={12} />
                                      {product.category}
                                    </span>
                                  )}
                                  {product.price && (
                                    <span className="flex items-center gap-1">
                                      <ApperIcon name="DollarSign" size={12} />
                                      {product.price}
                                    </span>
                                  )}
                                </div>
                              </div>
                              {product.image && (
                                <img
                                  src={product.image}
                                  alt={product.title}
                                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center gap-4 mb-4">
                <label className="text-sm font-medium text-gray-700">Collection Name:</label>
                <Input
                  value={collectionName}
                  onChange={(e) => setCollectionName(e.target.value)}
                  placeholder="Enter collection name"
                  className="flex-1 max-w-md"
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <Button variant="secondary" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button
                  onClick={handleImport}
                  disabled={loading || selectedCount === 0 || !collectionName.trim()}
                  icon={loading ? undefined : "Download"}
                >
                  {loading ? <Loading size="sm" /> : `Import ${selectedCount} Products`}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default SitemapModal;