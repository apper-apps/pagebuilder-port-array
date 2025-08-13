import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Modal from '@/components/atoms/Modal';
import { exportService } from '@/services/api/exportService';

const ExportModal = ({ isOpen, onClose, page }) => {
  const [selectedPlatform, setSelectedPlatform] = useState('generic');
  const [copied, setCopied] = useState(false);

  const platforms = [
    { id: 'generic', name: 'Generic HTML', icon: 'Code2' },
    { id: 'shopify', name: 'Shopify', icon: 'ShoppingBag' },
    { id: 'woocommerce', name: 'WooCommerce', icon: 'Wordpress' }
  ];

  const generatedCode = page ? exportService.generateCode(page, selectedPlatform) : '';
  const platformInfo = exportService.getPlatformInfo(selectedPlatform);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      toast.success('Code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy code');
    }
  };

  const handleDownload = () => {
    const blob = new Blob([generatedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${page?.productName || 'product'}-${selectedPlatform}.${platformInfo.fileExtension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Code downloaded successfully!');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="6xl">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Export Code</h2>
            <p className="text-gray-600 mt-1">
              Generate ready-to-use code for your product page
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            icon="X"
          />
        </div>

        {/* Platform Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Choose Platform</h3>
          <div className="grid grid-cols-3 gap-3">
            {platforms.map((platform) => (
              <motion.button
                key={platform.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedPlatform(platform.id)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedPlatform === platform.id
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ApperIcon 
                    name={platform.icon} 
                    size={20}
                    className={selectedPlatform === platform.id ? 'text-primary' : 'text-gray-500'}
                  />
                  <span className={`font-medium ${
                    selectedPlatform === platform.id ? 'text-primary' : 'text-gray-700'
                  }`}>
                    {platform.name}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Platform Info */}
        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start gap-3">
            <ApperIcon name="Info" size={16} className="text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">{platformInfo.name}</h4>
              <p className="text-blue-700 text-sm">{platformInfo.description}</p>
            </div>
          </div>
        </div>

        {/* Code Display */}
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">Generated Code</h3>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                icon="Download"
              >
                Download
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleCopy}
                icon={copied ? "Check" : "Copy"}
                className={copied ? "bg-green-600 hover:bg-green-700" : ""}
              >
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <SyntaxHighlighter
              language={selectedPlatform === 'woocommerce' ? 'php' : selectedPlatform === 'shopify' ? 'liquid' : 'html'}
              style={tomorrow}
              customStyle={{
                margin: 0,
                padding: '20px',
                fontSize: '14px',
                lineHeight: '1.5',
                maxHeight: '500px'
              }}
              showLineNumbers
            >
              {generatedCode}
            </SyntaxHighlighter>
          </div>
        </div>

        {/* Platform Instructions */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Implementation Instructions</h4>
          <div className="text-sm text-gray-600 space-y-1">
            {selectedPlatform === 'generic' && (
              <>
                <p>• Save as an HTML file and open in any web browser</p>
                <p>• Replace placeholder images with your actual product images</p>
                <p>• Customize colors and styling in the CSS section</p>
              </>
            )}
            {selectedPlatform === 'shopify' && (
              <>
                <p>• Save as a new product template in your Shopify theme</p>
                <p>• Upload images through Shopify admin panel</p>
                <p>• Configure product variants and pricing in your store</p>
                <p>• Test the add to cart functionality</p>
              </>
            )}
            {selectedPlatform === 'woocommerce' && (
              <>
                <p>• Save as single-product-custom.php in your active theme</p>
                <p>• Upload images through WordPress Media Library</p>
                <p>• Set up product variations in WooCommerce admin</p>
                <p>• Configure shipping and tax settings</p>
              </>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ExportModal;