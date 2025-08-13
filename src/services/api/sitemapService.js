// Mock sitemap service for demonstration
// In a real implementation, this would make actual HTTP requests

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class SitemapService {
  async parseSitemapFromUrl(url) {
    await delay(1000); // Simulate API call
    
    try {
      // Validate URL format
      if (!url || !url.startsWith('http')) {
        throw new Error('Please provide a valid HTTP/HTTPS URL');
      }

      // In a real implementation, you would fetch the sitemap from the URL
      // For now, return mock XML data based on common sitemap patterns
      const mockXmlData = this.generateMockSitemapXml(url);
      return mockXmlData;
    } catch (error) {
      throw new Error(`Failed to fetch sitemap: ${error.message}`);
    }
  }

  async parseSitemapFromFile(file) {
    await delay(500); // Simulate file processing
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const xmlContent = e.target.result;
          
          // Basic XML validation
          if (!xmlContent.includes('<urlset') && !xmlContent.includes('<sitemapindex')) {
            throw new Error('Invalid sitemap format. Please ensure the file is a valid XML sitemap.');
          }
          
          resolve(xmlContent);
        } catch (error) {
          reject(new Error('Failed to parse sitemap file: ' + error.message));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read the selected file'));
      };
      
      reader.readAsText(file);
    });
  }

  extractProductUrls(xmlContent) {
    try {
      // Parse XML and extract URLs
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
      
      // Check for parsing errors
      const parseError = xmlDoc.querySelector('parsererror');
      if (parseError) {
        throw new Error('Invalid XML format');
      }

      // Extract URLs from sitemap
      const urls = [];
      const urlElements = xmlDoc.querySelectorAll('url loc, sitemap loc');
      
      urlElements.forEach(locElement => {
        const url = locElement.textContent.trim();
        if (url && this.isProductUrl(url)) {
          urls.push(url);
        }
      });

      // Remove duplicates
      return [...new Set(urls)];
    } catch (error) {
      throw new Error('Failed to extract URLs from sitemap: ' + error.message);
    }
  }

  isProductUrl(url) {
    // Common product URL patterns
    const productPatterns = [
      /\/product[s]?\//i,
      /\/item[s]?\//i,
      /\/shop\//i,
      /\/store\//i,
      /\/buy\//i,
      /\/catalog\//i,
      /\/collection[s]?\//i,
      /\/category\//i,
      /\/p\//i,
      /\/prod\//i,
      /-p\d+/i, // Product IDs
      /\/([\w-]+)\.html$/i, // HTML product pages
      /\/[\w-]+-\d+$/i // Product with ID
    ];

    // Exclude common non-product patterns
    const excludePatterns = [
      /\/(about|contact|blog|news|faq|help|support|privacy|terms|policy)/i,
      /\.(css|js|png|jpg|jpeg|gif|svg|pdf|zip)$/i,
      /\/(admin|api|login|register|checkout|cart)/i
    ];

    // Check if URL matches exclude patterns
    if (excludePatterns.some(pattern => pattern.test(url))) {
      return false;
    }

    // Check if URL matches product patterns
    return productPatterns.some(pattern => pattern.test(url));
  }

  generateMockSitemapXml(baseUrl) {
    // Generate mock sitemap based on the provided URL
    const domain = new URL(baseUrl).origin;
    const sampleProducts = [
      'wireless-headphones-premium',
      'smartphone-case-protective',
      'laptop-stand-adjustable',
      'bluetooth-speaker-portable',
      'gaming-mouse-wireless',
      'keyboard-mechanical-rgb',
      'webcam-hd-streaming',
      'monitor-4k-gaming',
      'tablet-screen-protector',
      'phone-charger-fast'
    ];

    const urlEntries = sampleProducts.map(product => `
    <url>
      <loc>${domain}/products/${product}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>`).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urlEntries}
</urlset>`;
  }
}

const sitemapService = new SitemapService();
export default sitemapService;