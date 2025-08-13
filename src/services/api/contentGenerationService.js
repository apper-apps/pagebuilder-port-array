// Content Generation Service
// Simulates AI-powered content generation for SEO optimization

const contentGenerationService = {
  async generateContent(productData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const { productName, description, price, keyFeatures = [] } = productData;
    
    // Generate SEO-optimized description
    const seoDescription = this.generateSEODescription(productName, description, keyFeatures);
    
    // Generate feature sections
    const featureSections = this.generateFeatureSections(keyFeatures, productName);
    
    // Generate use cases
    const useCases = this.generateUseCases(productName, keyFeatures);
    
    // Generate selling points
    const sellingPoints = this.generateSellingPoints(productName, price, keyFeatures);
    
    return {
      seoDescription,
      featureSections,
      useCases,
      sellingPoints
    };
  },
  
  generateSEODescription(productName, description, keyFeatures) {
    const featuresList = keyFeatures.slice(0, 3).join(', ');
    const variations = [
      `Discover the ${productName} - ${description} Featuring ${featuresList}, this premium product delivers exceptional value and performance. Shop now for the best deals and fast shipping.`,
      `Transform your experience with ${productName}. ${description} With ${featuresList}, you get unmatched quality and reliability. Order today and see the difference!`,
      `Experience the ultimate ${productName} designed for modern needs. ${description} Key highlights include ${featuresList}. Get yours now with free shipping and warranty protection.`
    ];
    return variations[Math.floor(Math.random() * variations.length)];
  },
  
  generateFeatureSections(keyFeatures, productName) {
    return keyFeatures.map((feature, index) => {
      const benefits = [
        `Enhanced performance and reliability`,
        `Improved user experience and satisfaction`,
        `Advanced technology for superior results`,
        `Professional-grade quality and durability`,
        `Innovative design meets practical functionality`
      ];
      
      return {
        title: feature,
        description: `The ${feature.toLowerCase()} in ${productName} provides ${benefits[index % benefits.length]}. This carefully engineered feature ensures you get maximum value from your investment.`
      };
    });
  },
  
  generateUseCases(productName, keyFeatures) {
    const categories = [
      'Professional Use',
      'Personal Projects',
      'Business Applications',
      'Creative Work',
      'Daily Activities'
    ];
    
    return categories.slice(0, 3).map((category, index) => ({
      title: category,
      description: `Perfect for ${category.toLowerCase()}, ${productName} excels with its ${keyFeatures[index % keyFeatures.length]?.toLowerCase() || 'advanced features'}. Whether you're a beginner or expert, this product adapts to your needs and delivers consistent results.`
    }));
  },
  
  generateSellingPoints(productName, price, keyFeatures) {
    const points = [
      `Premium Quality at Competitive Price - Get professional-grade ${productName} without breaking the bank`,
      `Proven Performance - Join thousands of satisfied customers who trust ${productName} for their needs`,
      `Complete Solution - Everything you need in one package, saving you time and money`,
      `Expert Support - Our team is here to help you get the most from your ${productName}`,
      `Risk-Free Purchase - 30-day money-back guarantee ensures your complete satisfaction`
    ];
    
    // Add price-specific point
    if (price && parseFloat(price) > 100) {
      points.unshift(`Investment-Grade Value - At $${price}, you're getting enterprise-level quality that pays for itself`);
    } else if (price) {
      points.unshift(`Unbeatable Value - Premium features at just $${price} makes this an easy choice`);
    }
    
    return points.slice(0, 4);
  }
};

export default contentGenerationService;