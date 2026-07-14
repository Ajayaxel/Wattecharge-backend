import { User } from '../auth/auth.model.js';
import { Transaction } from './transaction.model.js';

export const getBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: {
        balance: user.walletBalance,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching wallet balance',
    });
  }
};

export const topupWallet = async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid top-up amount' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.walletBalance += amount;
    await user.save();

    // Create transaction record
    await Transaction.create({
      user: user._id,
      type: 'topup',
      amount: amount,
      status: 'success',
      reference: `topup_${Date.now()}`
    });

    res.status(200).json({
      success: true,
      data: {
        balance: user.walletBalance,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error topping up wallet',
    });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching transactions',
    });
  }
};
