import { locationService } from './location.service.js';
import { sendSuccess } from '../../utils/response.js';

/**
 * Handles HTTP GET requests to retrieve user locations.
 */
export const getLocations = async (req, res, next) => {
  try {
    const locations = await locationService.getLocations(req.user._id);
    return sendSuccess(res, 'Locations retrieved successfully.', locations, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Handles HTTP POST requests to create a location.
 */
export const createLocation = async (req, res, next) => {
  try {
    const newLocation = await locationService.createLocation(req.user._id, req.body);
    return sendSuccess(res, 'Location created successfully.', newLocation, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Handles HTTP PUT requests to update a location.
 */
export const updateLocation = async (req, res, next) => {
  try {
    const updatedLocation = await locationService.updateLocation(req.params.id, req.user._id, req.body);
    return sendSuccess(res, 'Location updated successfully.', updatedLocation, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Handles HTTP DELETE requests to delete a location.
 */
export const deleteLocation = async (req, res, next) => {
  try {
    await locationService.deleteLocation(req.params.id, req.user._id);
    return sendSuccess(res, 'Location deleted successfully.', null, 200);
  } catch (error) {
    next(error);
  }
};
