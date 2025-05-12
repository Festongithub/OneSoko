const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorcontroller');

// Vendor Routes
router.get('/', vendorController.vendors_list);
router.get('/:id', vendorController.vendor_detail);
router.post('/', vendorController.vendor_create);
router.put('/:id', vendorController.vendor_update);
router.delete('/:id', vendorController.vendor_delete);
router.post('/assign-shop', vendorController.vendor_assign_shop);
router.post('/remove-shop', vendorController.vendor_remove_shop);

module.exports = router;