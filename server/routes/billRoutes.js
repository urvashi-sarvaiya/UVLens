const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { uploadBill, getBills, getBillById, deleteBill } = require('../controllers/billController');

// GET all bills (summary list)
router.get('/', getBills);

// GET a single bill by ID (full details)
router.get('/:id', getBillById);

// DELETE a bill by ID
router.delete('/:id', deleteBill);

// POST upload and analyze bill
router.post('/upload', upload.single('bill'), uploadBill);

module.exports = router;