import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    wasteRecords: [
      {
        henwaste: { type: Number, default: 0 },
        cattlewaste: { type: Number, default: 0 },
        sheepwaste: { type: Number, default: 0 },
        neemPlantation: { type: Number, default: 0 },
        dateAdded: { type: Date, default: Date.now },
      }
    ],

    pendingPayment: { type: Boolean, default: false },
    pendingPaymentAmount: { type: Number, default: 0 },

    totalPaid: [
      {
        date: { type: Date, required: true },
        amount: { type: Number, required: true },
      }
    ],
    
    totalAmountPaid: { type: Number, default: 0 },

    loanProvided: { type: Number, default: 0 },
    loanApprovedDate: { type: Date },

    sheeploan: { type: Number, default: 0 },
    cattleloan: { type: Number, default: 0 },
    farmLoan: { type: Number, default: 0 },
    poultryLoan: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);


const Customer = mongoose.model('Customer', customerSchema);

export default Customer;
