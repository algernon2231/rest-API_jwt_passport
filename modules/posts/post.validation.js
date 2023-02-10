import Joi from "joi";

export const schema = Joi.object({
    title: Joi.string().min(3).required(),
    text: Joi.string().min(10).required()
})
export const schemaUpdatePost = Joi.object({
    title: Joi.string().min(3),
    text: Joi.string().min(10)
})
