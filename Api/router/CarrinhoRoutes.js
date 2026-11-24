const router = require('express').Router();
const CarrinhoController = require('../Controller/CarrinhoController.js');

router.post('/create', CarrinhoController.create);
router.get('/getByID/:id', CarrinhoController.getById);
router.post('/addItem/:id', CarrinhoController.addItem);
router.put('/updateItem/:id/:itemId', CarrinhoController.updateItem);
router.delete('/removeItem/:id/:itemId', CarrinhoController.removeItem);
router.delete('/clear/:id', CarrinhoController.clear);

module.exports = router;
