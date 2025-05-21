const db = require('./models');

async function seed() {
  await db.sequelize.sync({ force: true }); // WARNING: This will clear all data!

  // Create categories
  const categories = await db.Category.bulkCreate([
    { name: 'Laptops' },
    { name: 'Desktops' },
    { name: 'Monitors' },
    { name: 'Accessories' }
  ]);

  // Create products (PCs)
  await db.Product.bulkCreate([
    { name: 'Gaming Laptop', price: 1500, categoryId: categories[0].id },
    { name: 'Business Laptop', price: 1200, categoryId: categories[0].id },
    { name: 'All-in-One Desktop', price: 1000, categoryId: categories[1].id },
    { name: '4K Monitor', price: 400, categoryId: categories[2].id },
    { name: 'Mechanical Keyboard', price: 120, categoryId: categories[3].id },
    { name: 'Wireless Mouse', price: 60, categoryId: categories[3].id }
  ]);

  console.log('Database seeded!');
  process.exit();
}

seed();