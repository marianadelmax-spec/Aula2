const router = require('express').Router();
const VendaController = require('../Controller/VendaController.js');

router.post('/create', VendaController.create);
router.get('/getAll', VendaController.getAll);
router.get('/getByID/:id', VendaController.getById);

module.exports = router;
