import Joi from "joi";
import { Activities, Industry, Source, Status, Temperature } from "./lead.model";

export const CreateLeadSchema = Joi.object({
    company: Joi.string()
        .min(2)
        .required()
        .messages({
            "string.base": "Company must be a string",
            "string.min": "Company must be at least 2 characters",
            "any.required": "Company required",
            "string.empty": "Company required",
        }),
    website: Joi.string().optional(),
    industry: Joi.string().valid(...Industry).optional(),
    address: Joi.string().optional(),
    city: Joi.string().optional(),
    emirate: Joi.string().optional(),
    country: Joi.string().optional(),
    source: Joi.string().valid(...Source).optional(),
    sourceDetails: Joi.string().optional(),
    contacts: Joi.array(Joi.object({
        name: Joi.string().optional(),
        designation: Joi.string().optional(),   
        phone: Joi.string().optional(),
        email: Joi.string().optional(),
        isPrimary: Joi.bool().default(false)
    })),
    hrContacts: Joi.array(Joi.object({
        name: Joi.string().optional(),
        phone: Joi.string().optional(),
        email: Joi.string().optional(),
    })),
    temperature: Joi.string().valid(...Object.values(Temperature)).default(Temperature.warm),
    score: Joi.number().min(0).max(100).optional().default(0),
    tags: Joi.array(Joi.string()).optional(),
    remarks: Joi.string().optional(),
    linkedinURL: Joi.string().optional(),
    companySize: Joi.string().optional(),  
})