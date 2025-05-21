const db = require('../../../../models');

export default async function handler(req, res) {
  await db.sequelize.sync();

  if (req.method === 'GET') {
    const categories = await db.Category.findAll();
    return res.status(200).json(categories);
  }

  if (req.method === 'POST') {
    const { name } = req.body;
    const category = await db.Category.create({ name });
    return res.status(201).json(category);
  }

  if (req.method === 'PUT') {
    const { id, name } = req.body;
    const category = await db.Category.findByPk(id);
    if (!category) return res.status(404).json({ error: 'Not found' });
    category.name = name;
    await category.save();
    return res.status(200).json(category);
  }

  if (req.method === 'DELETE') {
    const { id } = req.body;
    const category = await db.Category.findByPk(id);
    if (!category) return res.status(404).json({ error: 'Not found' });
    await category.destroy();
    return res.status(200).json({ success: true });
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
} 