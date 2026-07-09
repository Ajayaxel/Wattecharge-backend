import { Booking } from './booking.model.js';

/**
 * Creates a new service request/booking.
 */
export const createBooking = async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId; // Support auth middleware or direct payload fallback
    const { serviceType, serviceName, latitude, longitude, address, paymentMethod, amount, details } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized. User session profile missing.',
      });
    }

    if (!serviceType || !serviceName || latitude === undefined || longitude === undefined || !paymentMethod || amount === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required checkout transaction properties.',
      });
    }

    const booking = await Booking.create({
      userId,
      serviceType,
      serviceName,
      location: {
        latitude,
        longitude,
        address: address || 'Hanover St 24, New York',
      },
      payment: {
        method: paymentMethod,
        amount,
        status: paymentMethod === 'wallet' || paymentMethod === 'card' ? 'paid' : 'unpaid',
      },
      details: details || {},
    });

    return res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Fetches booking logs list submitted by the active user session.
 */
export const getMyBookings = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized.',
      });
    }

    const list = await Booking.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: list,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Admin: Fetches logs list of all customer bookings on the platform.
 */
export const getAllBookings = async (req, res) => {
  try {
    const list = await Booking.find()
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: list,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Admin: Updates ticket status and payment properties.
 */
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking request file not found.',
      });
    }

    if (status) booking.status = status;
    if (paymentStatus) booking.payment.status = paymentStatus;

    await booking.save();

    return res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
