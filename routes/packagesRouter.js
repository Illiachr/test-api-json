const express = require('express');
const router = express.Router();
const { setId, getAmount } = require('../utils');

const entity = 'packages';

/**
 * @swagger
 * components:
 *   schemas:
 *     Package:
 *       type: object
 *       required:
 *         - name
 *         - descripition 
 *         - products 
 *         - price
 *       properties:
 *         id:
 *           type: string
 *           descripition: auto-generated id of the package
 *         name:
 *           type: string
 *           descripition: the name of package
 *         descripition:
 *           type: string
 *           descripition: about package
 *         products:
 *           type: array
 *           items:
 *             type: string
 *           descripition: list of the products IDs
 *         price:
 *           type: number
 *           format: double
 *           descripition: price of package
 *       example:
 *         id: iRTY587384_
 *         name: package 1
 *         description: about package 1
 *         products: [produtcId_1, produtcId_2]
 *         price: 1234.56
 *     PackageInfo:
 *       type: object
 *       required:
 *         - name
 *         - descripition 
 *         - products 
 *         - price
 *       properties:
 *         id:
 *           type: string
 *           descripition: auto-generated id of the package
 *         name:
 *           type: string
 *           descripition: the name of package
 *         descripition:
 *           type: string
 *           descripition: about package
 *         products:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/Product"
 *           descripition: list of the products included
 *         price:
 *           type: number
 *           format: double
 *           descripition: price of package
 *       example:
 *         id: iRTY587384_
 *         name: package 1
 *         description: about package 1
 *         products: [Product 1, Product2]
 *         price: 1234.56
 */ 

/**
 * @swagger
 * tags:
 *   name: Packages
 *   description: The packages managing API
 */

/**
 * @swagger
 * /packages/base:
 *   get:
 *     tags: [Packages]
 *     summary: Returns the list of all the base packages
 *     responses:
 *       200:
 *         description: The list of the products
 *         content: 
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Package"
 */

router.get('/base', (req, res) => {
  const data = req.app.packageDb.get(entity).value();
  console.log(data);
  res.send(data);
});

/**
 * @swagger
 * /packages:
 *   post:
 *     summary: Create a new package
 *     tags: [Packages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Package'
 *     responses:
 *       200:
 *         description: The package was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Package'
 *       500:
 *         description: Some server error
 */

router.post('/', (req, res) => {
  try {
    const package = {
      id: setId(),
      products: req.body.ids
    };
    req.app.customPackageDb.get(entity)
      .push(package)
      .write();
    res.json({ id: package.id });
  } catch (err) {
    return res.sendStatus(500);
  }
});

/**
 * @swagger
 * /packages/{packageId}/info:
 *   get:
 *     tags: [Packages]
 *     summary: Returns the list of all the base packages
 *     parameters:
 *       - in: path
 *         name: packageId
 *         required: true
 *         schema: 
 *           type: string
 *     responses:
 *       200:
 *         description: All info about package
 *         content: 
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/PackageInfo"
 *       500:
 *         description: Internal error
 *         content: 
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error: 
 *                   type: string
 */

router.get('/:id/info', (req, res) => {
  const products = [];
  const { id } = req.params;
  const package = req.app.customPackageDb.get(entity).find({ id }).value();
  const ids = package.products;
  if (Array.isArray(ids) && ids.length) {
    for (let i = 0; i < ids.length; i++) {
      const product = req.app.db.get('products').find({ id: ids[i] }).value();
      products.push(product);
    }
    const price = getAmount(products);
    const packageInfo = {
      id: package.id,
      name: 'custom package',
      description: 'some description',
      products,
      price 
    };
    res.send(packageInfo);
  } else { res.sendStatus(500) }
});

module.exports = router;
