const express = require('express');
const router = express.Router();
const { setId, getCost } = require('../utils');

const entity = 'products';
/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - descripition 
 *         - price
 *       properties:
 *         id:
 *           type: string
 *           descripition: auto-generated id of the product
 *         name:
 *           type: string
 *           descripition: the name of product
 *         descripition:
 *           type: string
 *           descripition: about product
 *         price:
 *           type: number
 *           format: double
 *           descripition: price of product
 *       example:
 *         id: iRTY587384_
 *         name: product 1_
 *         description: about product 1
 *         price: 1234.56
 *   parameters:
 *     idParam:
 *       name: id
 *       query: path
 *       description: id of item
 *       required: true
 *       schema:
 *         type: string
 *         default: ''
 */ 

/**
 * @swagger
 * tags:
 *   name: Catalog
 *   description: The catalog managing API
 */

/**
 * @swagger
 * /products:
 *   get:
 *     tags:
 *     - Catalog
 *     summary: Returns the list of all the products
 *     responses:
 *       200:
 *         description: The list of the products
 *         content: 
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Product"
 */

router.get('/', (req, res) => {
  const data = req.app.db.get(entity).value();
  res.send(data);
});

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Catalog]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: The product was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       500:
 *         description: Some server error
 */

router.post('/', (req, res) => {
  try {
    const product = {
      id: setId(),
      ...req.body
    };
    req.app.db.get(entity)
      .push(product)
      .write();
    res.json({ id: product.id });
  } catch (err) {
    return res.sendStatus(500);
  }
});

/**
 * @swagger
 * /products/cost:
 *   post:
 *     summary: Return products cost
 *     tags: [Catalog]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids: 
 *                type: array
 *                items:
 *                  type: string
 *     responses:
 *       200:
 *         description: Products cost
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cost:
 *                   type: number
 *                   format: double
 *       400:
 *         description: Bad request
 */

router.post('/cost', (req, res) => {  
  const filtered = [];
  if (req.body.ids) {
    const ids = req.body.ids;
    if (Array.isArray(ids) && ids.length) {
      for (let i = 0; i < ids.length; i++) {
        const product = req.app.db.get(entity).find({ id: ids[i] }).value();
        filtered.push(product);
      }
      const cost = getCost(filtered);
      res.send({ cost });
    }
  } else { res.status(400).send({erorr: 'Empty body or ids not array'}); }
});

/**
 * @swagger
 * /products/{productId}:
 *   get:
 *     tags:
 *     - Catalog
 *     summary: Returns the product by id
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: 
 *           type: string
 *     responses:
 *       200:
 *         description: The product by id
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Product"
 *       404:
 *         description: Product not found
 */

router.get('/:id', (req, res) => {
  console.log(req.params.id);
  const product = req.app.db.get(entity).find({ id: req.params.id }).value();

  if(!product){
    res.sendStatus(404)
  }
  res.send(product);
});

/**
 * @swagger
 * /products/{id}:
 *  put:
 *    summary: Update the product by the id
 *    tags: [Catalog]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The product id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Product'
 *    responses:
 *      200:
 *        description: The product was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Product'
 *      404:
 *        description: The product was not found
 *      500:
 *        description: Some error happened
 */

router.put('/:id', (req, res) => {
  try {
    req.app.db.get(entity)
      .find({ id: req.params.id })
      .assign(req.body)
      .write();
    res.status(204).send(req.app.db.get(entity).find({ id: req.params.id }));
  } catch (err) {
    return res.status(500).send(error);
  }
});

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Remove the product by id
 *     tags: [Catalog]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product id
 * 
 *     responses:
 *       200:
 *         description: The product was deleted
 *       404:
 *         description: The product was not found
 */

router.delete('/:id', (req, res) => {
  req.app.db.get(entity).remove({ id: req.params.id }).write();

  res.sendStatus(200);
});

module.exports = router;
