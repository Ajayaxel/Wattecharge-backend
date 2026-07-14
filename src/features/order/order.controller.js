import { Order } from './order.model.js';
import { Product } from '../product/product.model.js';

export const createOrder = async (req, res) => {
  try {
    const { items, paymentMethod, userId } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in order' });
    }

    let totalAmount = 0;
    const orderItems = [];

    // Verify products and calculate total
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product ${item.productId} not found` });
      }
      
      const price = product.price;
      const quantity = item.quantity;
      totalAmount += (price * quantity);
      
      orderItems.push({
        product: product._id,
        quantity,
        price
      });
    }

    // Determine payment status
    let paymentStatus = 'pending';
    if (paymentMethod === 'wallet' || paymentMethod === 'paymob') {
      // Assuming successful synchronous charge for prototype
      paymentStatus = 'paid';
    }

    const order = await Order.create({
      userId,
      items: orderItems,
      totalAmount,
      paymentMethod,
      paymentStatus,
    });

    res.status(201).json({
      success: true,
      data: order,
      message: 'Order created successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating order',
    });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('items.product').sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching orders',
    });
  }
};
