import mongoose, { Schema } from 'mongoose';
import validator from 'validator';
import { passwordReg } from './user.validation.js';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import Post from '../posts/post.model.js';
dotenv.config();

const UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        trim: true,
        required: [true, 'Email is required'],
        validate: {
            validator(email) {
                return validator.isEmail(email);
            },
            message: '{VALUE} is not a valid email'
        }
    },
    firstName: {
        type: String,
        required: [true, 'FirstName is required'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'LastName is required'],
        trim: true
    },
    userName: {
        type: String,
        required: [true, 'UserName is required'],
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        trim: true,
        minlength: [6, 'Password need to be longer'],
        validate: {
            validator(password) {
                return passwordReg.test(password);
            },
            message: '{ VALUE} is not a valid password'
        }
    },
    favorites: {
        posts: [{
            type: Schema.Types.ObjectId,
            ref: 'Post'
        }]
    }
}, { timestamps: true })

UserSchema.pre('save', async function (next) {
    const user = this;

    if (!user.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        user.password = hashedPassword;
        next();
    } catch (err) {
        return next(err);
    }
});

UserSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};
UserSchema.methods = {
    async matchPassword(password) {
        return await bcrypt.compare(password, this.password);
    },
    createToken() {
        return jwt.sign({
            _id: this._id,
        }, process.env.JWT_SECRET)
    },
    toAuthJSON() {
        return {
            _id: this._id,
            userName: this.username,
            token: `JWT ${this.createToken()}`
        }
    },
    toJSON() {
        return {
            _id: this._id,
            userName: this.userName
        }
    },
    _favorites: {
        async posts(postId) {
            const index = this.favorites.posts.indexOf(postId);
            if (index >= 0) {
                this.favorites.posts.splice(index, 1);
                await Post.decFavoriteCount(postId);
            } else {
                this.favorites.posts.push(postId);
                await Post.incFavoriteCount(postId);
            }
            return this.save();
        },
        isPostIsFavorite(postId) {
            if (this.favorites.posts.indexOf(postId) >= 0) {
                return true;
            }
            return false;
        }
    }
}
export default mongoose.model('User', UserSchema);