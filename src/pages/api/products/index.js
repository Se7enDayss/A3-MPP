const db = require('../../../../models');

export default async function handler(req, res) {
  await db.sequelize.sync();

  if (req.method === 'GET') {
    const { sortBy = 'id', order = 'ASC', categoryId } = req.query;
    
    const where = {};
    if (categoryId) {
      where.categoryId = categoryId;
    }

    const products = await db.Product.findAll({
      where,
      order: [[sortBy, order]],
      include: [db.Category]
    });
    
    return res.status(200).json(products);
  }

  if (req.method === 'POST') {
    const { name, price, categoryId } = req.body;
    const product = await db.Product.create({ name, price, categoryId });
    return res.status(201).json(product);
  }

  if (req.method === 'PUT') {
    const { id, name, price, categoryId } = req.body;
    const product = await db.Product.findByPk(id);
    if (!product) return res.status(404).json({ error: 'Not found' });
    
    product.name = name;
    product.price = price;
    product.categoryId = categoryId;
    await product.save();
    
    return res.status(200).json(product);
  }

  if (req.method === 'DELETE') {
    const { id } = req.body;
    const product = await db.Product.findByPk(id);
    if (!product) return res.status(404).json({ error: 'Not found' });
    await product.destroy();
    return res.status(200).json({ success: true });
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}