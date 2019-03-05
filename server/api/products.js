const router = require('express').Router()
const {adminOnly} = require('./utilities')
const {Product, Review, Category, User} = require('../db/models')

module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const allProducts = await Product.findAll({
      include: [Review, Category]
    })
    res.json(allProducts)
  } catch (err) {
    next(err)
  }
})

router.get('/categories', async (req, res, next) => {
  try {
    const categories = await Category.findAll()
    res.json(categories)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.find({
      where: {
        id: req.params.id
      },
      include: [
        {
          model: Review,
          include: [
            {
              model: User,
              attributes: ['name']
            }
          ]
        }
      ]
    })
    res.json(product)
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  const {title, price, quantity, description, imgUrl} = req.body
  try {
    const newProduct = await Product.create({
      title,
      price,
      quantity,
      description,
      imgUrl
    })
    res.json(newProduct)
  } catch (err) {
    next(err)
  }
})

router.post('/categories', adminOnly, async (req, res, next) => {
  try {
    const newCategory = await Category.create(req.body)
    res.json(newCategory)
  } catch (err) {
    next(err)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    const productToUpdate = await Product.findById(req.params.id)
    await productToUpdate.update(req.body)
    res.json(productToUpdate)
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    await Product.findById(req.params.id)
    res.sendStatus(202)
  } catch (err) {
    next(err)
  }
})
