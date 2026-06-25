import Joi from 'joi';

export const createLocationSchema = Joi.object({
  title: Joi.string().trim().required().messages({
    'string.empty': 'Title cannot be empty',
    'any.required': 'Title is required',
  }),
  address: Joi.string().trim().required().messages({
    'string.empty': 'Address cannot be empty',
    'any.required': 'Address is required',
  }),
  landmark: Joi.string().trim().allow('').optional(),
  receiver: Joi.string().trim().required().messages({
    'string.empty': 'Receiver name cannot be empty',
    'any.required': 'Receiver name is required',
  }),
  parkingFloor: Joi.string().trim().allow('').optional(),
  parkingNumber: Joi.string().trim().allow('').optional(),
  phone: Joi.string().trim().required().messages({
    'string.empty': 'Phone number cannot be empty',
    'any.required': 'Phone number is required',
  }),
  latitude: Joi.number().required().messages({
    'any.required': 'Latitude is required',
  }),
  longitude: Joi.number().required().messages({
    'any.required': 'Longitude is required',
  }),
});

export const updateLocationSchema = Joi.object({
  title: Joi.string().trim().optional(),
  address: Joi.string().trim().optional(),
  landmark: Joi.string().trim().allow('').optional(),
  receiver: Joi.string().trim().optional(),
  parkingFloor: Joi.string().trim().allow('').optional(),
  parkingNumber: Joi.string().trim().allow('').optional(),
  phone: Joi.string().trim().optional(),
  latitude: Joi.number().optional(),
  longitude: Joi.number().optional(),
});
