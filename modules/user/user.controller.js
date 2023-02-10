import User from "./user.model.js";
import { schema } from "./user.validation.js";
import httpStatus from "http-status";

export async function signUp(req, res) {
    const validation = schema.validate(req.body);
    if (validation.error) {
        return res.status(httpStatus.BAD_REQUEST).send(validation.error.details[0].message);
    }
    try {
        const user = await User.create(req.body);
        return res.status(httpStatus.CREATED).json(user.toAuthJSON());
    } catch (error) {
        return res.status(500).json(error);
    }
}
export function login(req, res, next) {
    res.status(httpStatus.OK).json(req.user.toAuthJSON());
    return next();
}