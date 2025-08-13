import mockData from "@/services/mockData/productPages.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ProductPagesService {
  constructor() {
    this.data = [...mockData];
  }

  async getAll() {
    await delay(300);
    return [...this.data];
  }

  async getById(id) {
    await delay(250);
    const item = this.data.find(item => item.Id === parseInt(id));
    if (!item) {
      throw new Error("Product page not found");
    }
    return { ...item };
  }

async create(item) {
    await delay(400);
    const maxId = Math.max(...this.data.map(item => item.Id), 0);
    const newItem = {
      ...item,
      Id: maxId + 1,
      images: item.images || [],
      specifications: item.specifications || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.push(newItem);
    return { ...newItem };
  }

async update(id, data) {
    await delay(350);
    const index = this.data.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Product page not found");
    }
    const updatedItem = {
      ...this.data[index],
      ...data,
      Id: parseInt(id),
      images: data.images || this.data[index].images || [],
      specifications: data.specifications || this.data[index].specifications || [],
      updatedAt: new Date().toISOString()
    };
    this.data[index] = updatedItem;
    return { ...updatedItem };
  }

  async delete(id) {
    await delay(250);
    const index = this.data.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Product page not found");
    }
    this.data.splice(index, 1);
return { success: true };
  }

  async scanProductUrl(url) {
    await delay(1500); // Simulate network request
    
    if (!url || typeof url !== 'string') {
      throw new Error("Please provide a valid URL");
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      throw new Error("Invalid URL format");
    }

    const urlLower = url.toLowerCase();
    
    // Mock different responses based on URL patterns
    if (urlLower.includes('amazon.com')) {
      return {
        productName: "Wireless Bluetooth Headphones - Premium Sound Quality",
        description: "Experience exceptional audio quality with these premium wireless Bluetooth headphones. Featuring active noise cancellation, 30-hour battery life, and comfortable over-ear design perfect for music, calls, and entertainment.",
        price: "129.99",
        keyFeatures: [
          "Active Noise Cancellation",
          "30-hour Battery Life", 
          "Wireless Bluetooth 5.0",
          "Premium Sound Quality",
          "Comfortable Over-ear Design"
        ],
        images: [
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
          "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop"
        ]
      };
    }
    
    if (urlLower.includes('ebay.com')) {
      return {
        productName: "Vintage Leather Messenger Bag - Handcrafted",
        description: "Authentic vintage leather messenger bag, handcrafted with premium materials. Perfect for professionals and students alike. Features multiple compartments and adjustable strap for comfort and convenience.",
        price: "89.50",
        keyFeatures: [
          "Genuine Leather Construction",
          "Multiple Compartments",
          "Adjustable Shoulder Strap",
          "Vintage Design",
          "Handcrafted Quality"
        ],
        images: [
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
          "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop"
        ]
      };
    }

    if (urlLower.includes('shopify.com') || urlLower.includes('myshopify.com')) {
      return {
        productName: "Eco-Friendly Water Bottle - Stainless Steel",
        description: "Stay hydrated sustainably with this premium eco-friendly water bottle. Made from high-grade stainless steel with double-wall insulation to keep drinks cold for 24 hours or hot for 12 hours.",
        price: "34.99",
        keyFeatures: [
          "Eco-Friendly Materials",
          "Double-Wall Insulation",
          "24hr Cold / 12hr Hot",
          "BPA-Free Construction",
          "Leak-Proof Design"
        ],
        images: [
          "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop",
          "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&h=400&fit=crop"
        ]
      };
    }

    // Generic product for other URLs
    if (urlLower.includes('.com') || urlLower.includes('.org') || urlLower.includes('.net')) {
      return {
        productName: "Smart Fitness Tracker - Advanced Health Monitoring",
        description: "Take control of your health with this advanced smart fitness tracker. Monitor heart rate, track workouts, analyze sleep patterns, and stay connected with smart notifications. Water-resistant design perfect for active lifestyles.",
        price: "199.00",
        keyFeatures: [
          "Heart Rate Monitoring",
          "Workout Tracking",
          "Sleep Analysis",
          "Smart Notifications",
          "Water Resistant"
        ],
        images: [
          "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=400&fit=crop",
          "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop"
        ]
      };
    }
// Enhanced error handling for sitemap-extracted URLs
    if (url.includes('/products/') || url.includes('/product/') || url.includes('/shop/')) {
      // For sitemap URLs, provide basic information extraction
      const urlParts = url.split('/');
      const productSlug = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2];
      
      if (productSlug) {
        const title = productSlug
          .replace(/[-_]/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase())
          .replace(/\.(html?|php)$/i, '');
          
        return {
          title: title || 'Imported Product',
          description: `Product imported from ${new URL(url).hostname}`,
          image: '',
          price: '',
          category: 'Imported',
          brand: new URL(url).hostname.replace('www.', ''),
          availability: 'unknown'
        };
      }
    }

    // If URL doesn't match any pattern, return error
    throw new Error("Unable to extract product information from this URL. Please try a different product page or enter details manually.");
  }
}

export default new ProductPagesService();