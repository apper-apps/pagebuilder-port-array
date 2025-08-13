const generateGenericHTML = (page) => {
  const specifications = page.specifications || [];
  const features = page.features || [];
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${page.productName || 'Product'}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f9f9f9;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .product-page {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .product-header {
      padding: 40px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-align: center;
    }
    
    .product-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 16px;
    }
    
    .product-description {
      font-size: 1.2rem;
      opacity: 0.9;
    }
    
    .product-content {
      padding: 40px;
    }
    
    .product-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-bottom: 40px;
    }
    
    .product-images {
      display: grid;
      gap: 16px;
    }
    
    .product-image {
      width: 100%;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .product-details h3 {
      font-size: 1.5rem;
      margin-bottom: 16px;
      color: #2d3748;
    }
    
    .price {
      font-size: 2rem;
      font-weight: 700;
      color: #e53e3e;
      margin-bottom: 20px;
    }
    
    .features-list {
      list-style: none;
      margin-bottom: 20px;
    }
    
    .features-list li {
      padding: 8px 0;
      padding-left: 24px;
      position: relative;
    }
    
    .features-list li::before {
      content: "✓";
      position: absolute;
      left: 0;
      color: #48bb78;
      font-weight: bold;
    }
    
    .specifications {
      background: #f7fafc;
      padding: 30px;
      border-radius: 8px;
      margin-top: 30px;
    }
    
    .specifications h3 {
      font-size: 1.5rem;
      margin-bottom: 20px;
      color: #2d3748;
    }
    
    .spec-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
    }
    
    .spec-item {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #e2e8f0;
    }
    
    .spec-label {
      font-weight: 600;
      color: #4a5568;
    }
    
    .spec-value {
      color: #2d3748;
    }
    
    .cta-section {
      text-align: center;
      margin-top: 40px;
      padding: 30px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 8px;
    }
    
    .cta-button {
      background: white;
      color: #667eea;
      border: none;
      padding: 16px 32px;
      font-size: 1.1rem;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      transition: transform 0.2s;
    }
    
    .cta-button:hover {
      transform: translateY(-2px);
    }
    
    @media (max-width: 768px) {
      .product-grid {
        grid-template-columns: 1fr;
        gap: 30px;
      }
      
      .product-title {
        font-size: 2rem;
      }
      
      .spec-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="product-page">
      <header class="product-header">
        <h1 class="product-title">${page.productName || 'Product Name'}</h1>
        <p class="product-description">${page.description || 'Product description goes here.'}</p>
      </header>
      
      <main class="product-content">
        <div class="product-grid">
          <div class="product-images">
            ${page.images && page.images.length > 0 
              ? page.images.map(img => `<img src="${img}" alt="${page.productName}" class="product-image">`).join('\n            ')
              : '<img src="https://via.placeholder.com/600x400" alt="Product Image" class="product-image">'
            }
          </div>
          
          <div class="product-details">
            <h3>Product Details</h3>
            ${page.price ? `<div class="price">$${page.price}</div>` : ''}
            
            ${features.length > 0 ? `
            <ul class="features-list">
              ${features.map(feature => `<li>${feature}</li>`).join('\n              ')}
            </ul>
            ` : ''}
          </div>
        </div>
        
        ${specifications.length > 0 ? `
        <section class="specifications">
          <h3>Specifications</h3>
          <div class="spec-grid">
            ${specifications.map(spec => `
            <div class="spec-item">
              <span class="spec-label">${spec.name}:</span>
              <span class="spec-value">${spec.value}</span>
            </div>
            `).join('')}
          </div>
        </section>
        ` : ''}
        
        <section class="cta-section">
          <button class="cta-button">Get This Product</button>
        </section>
      </main>
    </div>
  </div>
</body>
</html>`;
};

const generateShopifyHTML = (page) => {
  const specifications = page.specifications || [];
  const features = page.features || [];
  
  return `<!-- Shopify Product Template -->
<div class="product-page-custom">
  <style>
    .product-page-custom {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .product-hero {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 60px 40px;
      text-align: center;
      border-radius: 12px;
      margin-bottom: 40px;
    }
    
    .product-hero h1 {
      font-size: 3rem;
      font-weight: 700;
      margin-bottom: 20px;
    }
    
    .product-hero p {
      font-size: 1.3rem;
      opacity: 0.9;
    }
    
    .product-main {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 50px;
      margin-bottom: 50px;
    }
    
    .product-gallery img {
      width: 100%;
      border-radius: 8px;
      margin-bottom: 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    .product-info h2 {
      font-size: 1.8rem;
      margin-bottom: 20px;
      color: #2d3748;
    }
    
    .product-price {
      font-size: 2.5rem;
      font-weight: 700;
      color: #e53e3e;
      margin-bottom: 30px;
    }
    
    .shopify-features {
      list-style: none;
      margin-bottom: 30px;
    }
    
    .shopify-features li {
      padding: 10px 0;
      padding-left: 30px;
      position: relative;
      font-size: 1.1rem;
    }
    
    .shopify-features li::before {
      content: "✓";
      position: absolute;
      left: 0;
      color: #48bb78;
      font-size: 1.2rem;
      font-weight: bold;
    }
    
    .shopify-add-to-cart {
      background: #667eea;
      color: white;
      border: none;
      padding: 18px 36px;
      font-size: 1.2rem;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      width: 100%;
      transition: all 0.3s;
    }
    
    .shopify-add-to-cart:hover {
      background: #5a67d8;
      transform: translateY(-2px);
    }
    
    .product-specifications {
      background: #f8f9fa;
      padding: 40px;
      border-radius: 12px;
      margin-top: 40px;
    }
    
    .product-specifications h3 {
      font-size: 1.8rem;
      margin-bottom: 30px;
      color: #2d3748;
      text-align: center;
    }
    
    .specs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }
    
    .spec-row {
      display: flex;
      justify-content: space-between;
      padding: 15px 0;
      border-bottom: 2px solid #e2e8f0;
    }
    
    .spec-name {
      font-weight: 600;
      color: #4a5568;
      font-size: 1.1rem;
    }
    
    .spec-value {
      color: #2d3748;
      font-size: 1.1rem;
    }
    
    @media (max-width: 768px) {
      .product-main {
        grid-template-columns: 1fr;
        gap: 30px;
      }
      
      .product-hero h1 {
        font-size: 2.2rem;
      }
      
      .specs-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
  
  <div class="product-hero">
    <h1>{{ product.title | default: "${page.productName || 'Product Name'}" }}</h1>
    <p>{{ product.description | default: "${page.description || 'Product description'}" }}</p>
  </div>
  
  <div class="product-main">
    <div class="product-gallery">
      {% if product.images.size > 0 %}
        {% for image in product.images %}
          <img src="{{ image | img_url: '600x600' }}" alt="{{ product.title }}">
        {% endfor %}
      {% else %}
        ${page.images && page.images.length > 0 
          ? page.images.map(img => `<img src="${img}" alt="${page.productName}">`).join('\n        ')
          : '<img src="https://via.placeholder.com/600x600" alt="Product Image">'
        }
      {% endif %}
    </div>
    
    <div class="product-info">
      <h2>Product Details</h2>
      <div class="product-price">
        {{ product.price | money | default: "${page.price ? '$' + page.price : '$0.00'}" }}
      </div>
      
      ${features.length > 0 ? `
      <ul class="shopify-features">
        ${features.map(feature => `<li>${feature}</li>`).join('\n        ')}
      </ul>
      ` : ''}
      
      <form action="/cart/add" method="post" enctype="multipart/form-data">
        <select name="id" style="display: none;">
          {% for variant in product.variants %}
            <option value="{{ variant.id }}">{{ variant.title }}</option>
          {% endfor %}
        </select>
        <button type="submit" class="shopify-add-to-cart">Add to Cart</button>
      </form>
    </div>
  </div>
  
  ${specifications.length > 0 ? `
  <div class="product-specifications">
    <h3>Specifications</h3>
    <div class="specs-grid">
      ${specifications.map(spec => `
      <div class="spec-row">
        <span class="spec-name">${spec.name}:</span>
        <span class="spec-value">${spec.value}</span>
      </div>
      `).join('')}
    </div>
  </div>
  ` : ''}
</div>

<!-- Shopify Liquid Code Instructions -->
<!-- 
1. Save this as a new product template in your theme
2. Replace static content with Shopify Liquid variables
3. Upload images through Shopify admin
4. Configure product variants and pricing
5. Test the add to cart functionality
-->`;
};

const generateWooCommerceHTML = (page) => {
  const specifications = page.specifications || [];
  const features = page.features || [];
  
  return `<?php
/**
 * WooCommerce Single Product Template
 * Custom product page template
 */

defined( 'ABSPATH' ) || exit;

get_header( 'shop' ); ?>

<style>
.woocommerce-custom-product {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.woo-product-hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 50px 40px;
  text-align: center;
  border-radius: 12px;
  margin-bottom: 40px;
}

.woo-product-hero h1 {
  font-size: 2.8rem;
  font-weight: 700;
  margin-bottom: 16px;
}

.woo-product-hero .description {
  font-size: 1.2rem;
  opacity: 0.9;
}

.woo-product-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 40px;
}

.woo-product-images {
  display: grid;
  gap: 16px;
}

.woo-product-images img {
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.woo-product-summary h2 {
  font-size: 1.6rem;
  margin-bottom: 20px;
  color: #2d3748;
}

.woo-price {
  font-size: 2.2rem;
  font-weight: 700;
  color: #e53e3e;
  margin-bottom: 25px;
}

.woo-features {
  list-style: none;
  margin-bottom: 30px;
}

.woo-features li {
  padding: 8px 0;
  padding-left: 28px;
  position: relative;
  font-size: 1rem;
}

.woo-features li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: #48bb78;
  font-weight: bold;
}

.woo-add-to-cart-button {
  background: #667eea !important;
  border-color: #667eea !important;
  padding: 16px 32px !important;
  font-size: 1.1rem !important;
  font-weight: 600 !important;
  border-radius: 8px !important;
  transition: all 0.3s !important;
  width: 100% !important;
}

.woo-add-to-cart-button:hover {
  background: #5a67d8 !important;
  border-color: #5a67d8 !important;
  transform: translateY(-2px) !important;
}

.woo-specifications {
  background: #f8f9fa;
  padding: 35px;
  border-radius: 12px;
  margin-top: 40px;
}

.woo-specifications h3 {
  font-size: 1.6rem;
  margin-bottom: 25px;
  color: #2d3748;
  text-align: center;
}

.woo-specs-table {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 18px;
}

.woo-spec-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #e2e8f0;
}

.woo-spec-label {
  font-weight: 600;
  color: #4a5568;
}

.woo-spec-value {
  color: #2d3748;
}

@media (max-width: 768px) {
  .woo-product-content {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .woo-product-hero h1 {
    font-size: 2rem;
  }
  
  .woo-specs-table {
    grid-template-columns: 1fr;
  }
}
</style>

<div class="woocommerce-custom-product">
  <div class="woo-product-hero">
    <h1><?php the_title(); ?></h1>
    <div class="description">
      <?php echo wp_kses_post( get_the_excerpt() ?: "${page.description || 'Product description'}" ); ?>
    </div>
  </div>
  
  <div class="woo-product-content">
    <div class="woo-product-images">
      <?php
      global $product;
      $attachment_ids = $product->get_gallery_image_ids();
      
      if ( $attachment_ids ) {
        foreach ( $attachment_ids as $attachment_id ) {
          echo wp_get_attachment_image( $attachment_id, 'large' );
        }
      } else {
        // Fallback static images
        ${page.images && page.images.length > 0 
          ? page.images.map(img => `echo '<img src="${img}" alt="' . get_the_title() . '">';`).join('\n        ')
          : 'echo \'<img src="https://via.placeholder.com/600x400" alt="Product Image">\';'
        }
      }
      ?>
    </div>
    
    <div class="woo-product-summary">
      <h2>Product Details</h2>
      
      <div class="woo-price">
        <?php echo $product->get_price_html() ?: "${page.price ? '$' + page.price : '$0.00'}"; ?>
      </div>
      
      ${features.length > 0 ? `
      <ul class="woo-features">
        ${features.map(feature => `<li>${feature}</li>`).join('\n        ')}
      </ul>
      ` : ''}
      
      <?php woocommerce_template_single_add_to_cart(); ?>
    </div>
  </div>
  
  ${specifications.length > 0 ? `
  <div class="woo-specifications">
    <h3>Specifications</h3>
    <div class="woo-specs-table">
      ${specifications.map(spec => `
      <div class="woo-spec-item">
        <span class="woo-spec-label">${spec.name}:</span>
        <span class="woo-spec-value">${spec.value}</span>
      </div>
      `).join('')}
    </div>
  </div>
  ` : ''}
</div>

<?php
get_footer( 'shop' );

/* 
WooCommerce Integration Instructions:
1. Save this file as single-product-custom.php in your active theme
2. Upload images through WordPress Media Library
3. Set up product variations and pricing in WooCommerce admin
4. Configure shipping and tax settings
5. Test the add to cart and checkout process
6. Customize styling to match your theme
*/`;
};

export const exportService = {
  generateCode: (page, platform = 'generic') => {
    switch (platform) {
      case 'shopify':
        return generateShopifyHTML(page);
      case 'woocommerce':
        return generateWooCommerceHTML(page);
      default:
        return generateGenericHTML(page);
    }
  },

  getPlatformInfo: (platform) => {
    const platforms = {
      generic: {
        name: 'Generic HTML',
        description: 'Clean, semantic HTML with embedded CSS',
        fileExtension: 'html'
      },
      shopify: {
        name: 'Shopify Liquid',
        description: 'Shopify-compatible template with Liquid syntax',
        fileExtension: 'liquid'
      },
      woocommerce: {
        name: 'WooCommerce PHP',
        description: 'WordPress/WooCommerce template with PHP',
        fileExtension: 'php'
      }
    };
    
    return platforms[platform] || platforms.generic;
  }
};