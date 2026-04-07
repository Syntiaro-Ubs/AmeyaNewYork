// Using native fetch in Node 22

async function testAddProduct() {
  const productData = {
    product_id: 'TEST-' + Date.now(),
    name: 'Test Product',
    price: '99.99',
    category: 'rings',
    collection: 'eleve',
    description: 'A test jewelry item',
    material: 'Gold',
    gemstone: 'Diamond',
    featured: 'false',
    in_stock: 'true',
    stock_quantity: '10'
  };

  const response = await fetch('http://localhost:5000/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData)
  });

  const result = await response.json();
  console.log('Status:', response.status);
  console.log('Result:', result);
}

testAddProduct();
