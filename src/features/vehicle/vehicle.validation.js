import Joi from 'joi';

export const createVehicleSchema = Joi.object({
  brand: Joi.string().trim().required().messages({
    'string.empty': 'Brand cannot be empty',
    'any.required': 'Brand is required',
  }),
  modelName: Joi.string().trim().required().messages({
    'string.empty': 'Model name cannot be empty',
    'any.required': 'Model name is required',
  }),
  imageUrl: Joi.string().trim().uri().optional().messages({
    'string.uri': 'Image URL must be a valid URI',
  }),
  type: Joi.string().trim().required().messages({
    'string.empty': 'Type cannot be empty',
    'any.required': 'Type is required',
  }),
});

export const updateVehicleSchema = Joi.object({
  brand: Joi.string().trim().optional(),
  modelName: Joi.string().trim().optional(),
  imageUrl: Joi.string().trim().uri().optional(),
  type: Joi.string().trim().optional(),
});
