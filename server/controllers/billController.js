const { extractTextFromImage, extractTextFromPDF } = require('../services/ocrService');
const { analyzeBill } = require('../services/groqService');
const Bill = require('../models/Bill');

const uploadBill = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const mimeType = req.file.mimetype;
    let ocrText = '';

    // Step 1: Text extraction based on file type
    if (mimeType === 'application/pdf') {
      ocrText = await extractTextFromPDF(filePath);
      // Fallback for scanned/image-based PDFs if extracted text is empty or under 20 chars
      if (!ocrText || ocrText.trim().length === 0) {
        ocrText = await extractTextFromImage(filePath);
      }
    } else if (mimeType && mimeType.startsWith('image/')) {
      ocrText = await extractTextFromImage(filePath);
    } else {
      return res.status(400).json({ message: 'Invalid file type. Only images and PDF files are supported.' });
    }

    if (!ocrText || ocrText.trim().length === 0) {
      return res.status(422).json({ message: 'Could not extract text from the uploaded file' });
    }

    // Step 2: Send extracted text to Groq for analysis
    const analysis = await analyzeBill(ocrText);

    // Step 3: Create a new Bill document and save to MongoDB
    const newBill = new Bill({
      ...analysis,
      ocrText,
      originalFileName: req.file.originalname,
    });

    const savedBill = await newBill.save();

    res.status(200).json({
      message: 'Bill analyzed successfully',
      _id: savedBill._id,
      ocrText,
      analysis,
    });
  } catch (error) {
    console.error('Error processing bill:', error);
    res.status(500).json({ message: 'Something went wrong while processing the bill', error: error.message });
  }
};

// GET /api/bills - Summary list for performance
const getBills = async (req, res) => {
  try {
    const bills = await Bill.find()
      .select('bill_type provider_name total_amount due_date createdAt _id')
      .sort({ createdAt: -1 });
    res.status(200).json(bills);
  } catch (error) {
    console.error('Error fetching bills:', error);
    res.status(500).json({ message: 'Failed to fetch bills', error: error.message });
  }
};

// GET /api/bills/:id - Full bill document
const getBillById = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }
    res.status(200).json(bill);
  } catch (error) {
    console.error('Error fetching bill details:', error);
    res.status(500).json({ message: 'Failed to fetch bill details', error: error.message });
  }
};

// DELETE /api/bills/:id - Delete bill by id
const deleteBill = async (req, res) => {
  try {
    const deletedBill = await Bill.findByIdAndDelete(req.params.id);
    if (!deletedBill) {
      return res.status(404).json({ message: 'Bill not found' });
    }
    res.status(200).json({ message: 'Bill deleted successfully', _id: req.params.id });
  } catch (error) {
    console.error('Error deleting bill:', error);
    res.status(500).json({ message: 'Failed to delete bill', error: error.message });
  }
};

module.exports = {
  uploadBill,
  getBills,
  getBillById,
  deleteBill,
};