import express from 'express';
import Customer from '../models/customer.model.js';
import { protectRoute } from '../middleware/auth.middleware.js'; 

const router = express.Router();


router.post('/add', protectRoute, async (req, res) => {
  try {
    const {
      name,
      email,
      phoneNumber,
      henwaste,
      cattlewaste,
      sheepwaste,
      neemPlantation,
      pendingPayment,
      loanProvided,
      loanApprovedDate,
    } = req.body;

    const userId = req.user._id;

    // Validate required fields
    if (!name || !email || !phoneNumber || henwaste === undefined || cattlewaste === undefined || sheepwaste === undefined) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const henwasteNum = Number(henwaste);
    const cattlewasteNum = Number(cattlewaste);
    const sheepwasteNum = Number(sheepwaste);
    const neemPlantationNum = Number(neemPlantation) || 0;

    const henwasteRate = 10;
    const cattlewasteRate = 15;
    const sheepwasteRate = 12;

    const henwasteCost = henwasteNum * henwasteRate;
    const cattlewasteCost = cattlewasteNum * cattlewasteRate;
    const sheepwasteCost = sheepwasteNum * sheepwasteRate;
    const newWasteCost = henwasteCost + cattlewasteCost + sheepwasteCost;

    let customer = await Customer.findOne({ email, userId });

    if (customer) {
      // Update existing customer
      customer.wasteRecords.push({
        henwaste: henwasteNum,
        cattlewaste: cattlewasteNum,
        sheepwaste: sheepwasteNum,
        neemPlantation: neemPlantationNum,
      });

      customer.henwaste += henwasteNum;
      customer.cattlewaste += cattlewasteNum;
      customer.sheepwaste += sheepwasteNum;
      customer.neemPlantation += neemPlantationNum;

      customer.pendingPaymentAmount = customer.pendingPayment
        ? customer.pendingPaymentAmount + newWasteCost
        : newWasteCost;

      customer.pendingPayment = true;

      customer.loanProvided = loanProvided;
      customer.loanApprovedDate = loanApprovedDate;

      await customer.save();
    } else {
      // Create new customer
      customer = new Customer({
        name,
        email,
        phoneNumber,
        userId,
        henwaste: henwasteNum,
        cattlewaste: cattlewasteNum,
        sheepwaste: sheepwasteNum,
        neemPlantation: neemPlantationNum,
        pendingPayment: true,
        pendingPaymentAmount: newWasteCost,
        loanProvided,
        loanApprovedDate,
        totalPaid: [],
        totalAmountPaid: 0,
        wasteRecords: [{
          henwaste: henwasteNum,
          cattlewaste: cattlewasteNum,
          sheepwaste: sheepwasteNum,
          neemPlantation: neemPlantationNum,
        }],
      });

      await customer.save();
    }

    res.status(200).json(customer);
  } catch (error) {
    console.error('Error adding customer:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Update Payment Status
router.put('/pay/:customerId', protectRoute, async (req, res) => {
  const { customerId } = req.params;
  const userId = req.user._id;

  try {
    const customer = await Customer.findOne({ _id: customerId, userId });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    if (!customer.pendingPayment) {
      return res.status(400).json({ message: 'No pending payment for this customer' });
    }

    // Ensure totalPaid is initialized as an empty array if it is undefined
    if (!customer.totalPaid) {
      customer.totalPaid = [];
    }

    // Create the payment record
    const paymentRecord = {
      date: new Date(),
      amount: customer.pendingPaymentAmount,
    };

    // Add the new payment to totalPaid
    customer.totalPaid.push(paymentRecord);

    // Update the totalAmountPaid with the new payment
    customer.totalAmountPaid += customer.pendingPaymentAmount;

    // Update the pending payment status
    customer.pendingPayment = false;
    customer.pendingPaymentAmount = 0;

    // Log the customer object before saving (for debugging)
    console.log('Customer before update:', customer);

    // Use updateOne to update the customer directly
    const updatedCustomer = await Customer.updateOne(
      { _id: customerId, userId }, 
      { $set: { 
          totalPaid: customer.totalPaid,
          totalAmountPaid: customer.totalAmountPaid, // Update the totalAmountPaid
          pendingPayment: false,
          pendingPaymentAmount: 0,
      }}
    );

    // Log the result of the update operation
    console.log('Customer after update:', updatedCustomer);

    // Fetch and return the updated customer from the database
    const finalCustomer = await Customer.findById(customerId);
    res.status(200).json(finalCustomer);
  } catch (error) {
    console.error('Error updating payment:', error);
    res.status(500).json({ message: `Internal server error: ${error.message}` });
  }
});

/// Get Customers by Most Recent Time
router.get('/recent', protectRoute, async (req, res) => {
  const userId = req.user._id; // User is set in the protectRoute middleware

  try {
    // Fetch customers sorted by creation time in descending order
    const customers = await Customer.find({ userId })
      .sort({ createdAt: -1 })  // Sort by the creation date (newest first)
      .exec();

    if (!customers.length) {
      return res.status(404).json({ message: 'No customers found' });
    }

    res.status(200).json(customers);
  } catch (error) {
    console.error('Error fetching recent customers:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// Get Top Sellers
// Get Customers Sorted by Total Amount Paid
router.get('/paid', protectRoute, async (req, res) => {
  const userId = req.user._id; // User is set in the protectRoute middleware

  try {
    // Fetch customers sorted by totalAmountPaid in descending order
    const customers = await Customer.find({ userId })
      .sort({ totalAmountPaid: -1 })  // Sort by totalAmountPaid (highest first)
      .exec();

    if (!customers.length) {
      return res.status(404).json({ message: 'No customers found' });
    }

    res.status(200).json(customers);
  } catch (error) {
    console.error('Error fetching customers sorted by totalAmountPaid:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// Search Customers by ID
router.get('/search', protectRoute, async (req, res) => {
  const { customerId } = req.query; // Getting customerId from query parameters

  // If customerId is not provided, return an error
  if (!customerId) {
    return res.status(400).json({ message: 'Please provide customerId' });
  }

  const userId = req.user._id; 

  try {
    const customer = await Customer.findOne({ _id: customerId, userId });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found by customerId' });
    }

    return res.json(customer);
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/loan-status/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;

    // Find customer by ID
    const customer = await Customer.findById(customerId);
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Check if loan is provided and its status
    const loanProvided = customer.loanProvided;
    const loanStatus = loanProvided > 0 ? 'Pending Loan' : 'No Loan to Clear';

    // Calculate the interest (Example: 10% interest per year)
    const interestRate = 0.1; // 10% interest
    const currentDate = new Date();
    const loanApprovedDate = customer.loanApprovedDate;

    // If the loan is provided and there's a loan approval date
    let loanAmountWithInterest = loanProvided;
    if (loanApprovedDate) {
      const monthsPassed = Math.floor((currentDate - new Date(loanApprovedDate)) / (1000 * 60 * 60 * 24 * 30)); // Rough estimate of months passed
      const interest = loanProvided * interestRate * (monthsPassed / 12); // Calculate interest for months passed
      loanAmountWithInterest += interest;
    }

    return res.status(200).json({
      loanStatus,
      loanProvided,
      loanAmountWithInterest: loanAmountWithInterest.toFixed(2), // Return the loan amount with interest
      monthsPassed: loanApprovedDate ? Math.floor((currentDate - new Date(loanApprovedDate)) / (1000 * 60 * 60 * 24 * 30)) : 0, // Return number of months passed
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/update-loan-status/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    const { loanAmount } = req.body;

    if (loanAmount < 0) {
      return res.status(400).json({ message: 'Loan amount cannot be negative' });
    }

    const customer = await Customer.findByIdAndUpdate(
      customerId,
      { loanProvided: loanAmount },
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const loanStatus = loanAmount > 0 ? 'Pending Loan' : 'No Loan to Clear';

    return res.status(200).json({ message: 'Loan status updated', loanStatus });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Customer Login (no auth needed)
router.post('/login', async (req, res) => {
  try {
    const { email, customerId } = req.body;

    if (!email || !customerId) {
      return res.status(400).json({ message: 'Email and Customer ID are required' });
    }

    const customer = await Customer.findOne({ _id: customerId, email });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // You can choose what data to send back, here sending full customer
    res.status(200).json({
      message: 'Login successful',
      customer,
    });
  } catch (error) {
    console.error('Customer login failed:', error);
    res.status(500).json({ message: 'Wrong cusomerId or Email' });
  }
});
// Get customer details (requires auth)
router.get('/details/:customerId', protectRoute, async (req, res) => {
  try {
    const { customerId } = req.params;
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: 'Email query param is required' });
    }

    const userId = req.user._id; // from protectRoute middleware

    const customer = await Customer.findOne({ _id: customerId, email, userId });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json({ customer });
  } catch (error) {
    console.error('Error fetching customer details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
