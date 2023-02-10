import Post from "./post.model.js";
import { schema, schemaUpdatePost } from "./post.validation.js";
import httpStatus from "http-status";
import User from "../user/user.model.js";

export async function createPost(req, res) {
    const validation = schema.validate(req.body);
    if (validation.error) {
        return res.status(httpStatus.BAD_REQUEST).send(validation.error.details[0].message);
    }
    try {
        const post = await Post.createPost(req.body, req.user._id);
        return res.status(httpStatus.CREATED).json(post.toJSON())
    } catch (error) {
        return res.status(httpStatus.BAD_REQUEST).json(error);
    }
}
export async function getPostById(req, res) {
    try {
        Promise.all([
            Post.findById(req.params.id),
            User.findById(req.user._id)
        ]).then(([post, user]) => {
            const favorite = user._favorites.isPostIsFavorite(req.params.id);
            return res.status(httpStatus.OK).json({
                ...post.toJSON(),
                favorite
            })
        })
    } catch (error) {
        return res.status(httpStatus.BAD_REQUEST).json(error);
    }
}
export async function getPostsList(req, res) {
    const { page = 1, limit = 4 } = req.query;
    try {
        Promise.all([
            User.findById(req.user._id),
            Post.paginate({ page, limit })
        ]).then(([user, posts]) => {
            const newPosts = posts.map(post => {
                const favorite = user._favorites.isPostIsFavorite(post._id);
                return { ...post.toJSON(), favorite }
            })
            return res.status(httpStatus.OK).json(newPosts);
        })
            .catch((error) => {
                return res.status(httpStatus.BAD_REQUEST).json(error);
            });

    } catch (error) {
        return res.status(httpStatus.BAD_REQUEST).json(error);
    }
}

export async function updatePost(req, res) {
    const validation = schemaUpdatePost.validate(req.body);
    if (validation.error) {
        return res.status(httpStatus.BAD_REQUEST).send(validation.error.details[0].message);
    }
    try {
        const post = await Post.findById(req.params.id);
        if (!post.user.equals(req.user._id)) {
            return res.sendStatus(httpStatus.UNAUTHORIZED);
        }
        Object.keys(req.body).forEach(key => {
            post[key] = req.body[key];
        });
        return res.status(httpStatus.OK).json(await post.save());
    } catch (error) {
        return res.status(httpStatus.BAD_REQUEST).json(error);
    }
}

export async function delPost(req, res) {

    try {
        const post = await Post.findById(req.params.id);
        if (!post.user.equals(req.user._id)) {
            return res.sendStatus(httpStatus.UNAUTHORIZED);
        }
        await post.remove();
        return res.status(httpStatus.OK).json({ message: 'Del post successfully' })
    } catch (error) {
        return res.status(httpStatus.BAD_REQUEST).json(error);
    }
}

export async function favoritePost(req, res) {
    try {
        const user = await User.findById(req.user._id);
        await user._favorites.posts(req.params.id);
        return res.sendStatus(httpStatus.OK);
    } catch (error) {
        return res.status(httpStatus.BAD_REQUEST).json(error)
    }
}