import { Service } from './service.model.js';

/**
 * Gets all active services for mobile client, or all services for admin panel.
 */
export const getServices = async (req, res) => {
  try {
    const isAdmin = req.query.isAdmin === 'true';
    const filter = isAdmin ? {} : { isActive: true };
    const list = await Service.find(filter).sort({ category: 1, createdAt: 1 });
    
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
 * Creates a new service definer in the database.
 */
export const createService = async (req, res) => {
  try {
    const { name, subtitle, icon, category, isActive, cost } = req.body;
    
    if (!name || !subtitle || !icon || !category) {
      return res.status(400).json({
        success: false,
        message: 'Name, subtitle, icon, and category are required.',
      });
    }

    const service = await Service.create({
      name: name.trim(),
      subtitle: subtitle.trim(),
      icon: icon.trim(),
      category,
      cost: Number(cost) || 0,
      isActive: isActive !== false,
    });

    return res.status(201).json({
      success: true,
      data: service,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Updates a service configuration parameters.
 */
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, subtitle, icon, category, isActive, cost } = req.body;

    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service definition not found.',
      });
    }

    if (name) service.name = name.trim();
    if (subtitle) service.subtitle = subtitle.trim();
    if (icon) service.icon = icon.trim();
    if (category) service.category = category;
    if (isActive !== undefined) service.isActive = isActive;
    if (cost !== undefined) service.cost = Number(cost);

    await service.save();

    return res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Deletes a service definition.
 */
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findByIdAndDelete(id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service definition not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Service definition deleted successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
