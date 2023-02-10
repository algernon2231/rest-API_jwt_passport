import { authJWT } from "../services/auth.services.js";
import postRoute from "./posts/post.route.js";
import userRoute from "./user/user.route.js";

export default app => {
    app.use('/api/v1/users', userRoute);
    app.use('/api/v1/posts', postRoute);
    app.get('/hello', authJWT, (req, res) => {
        res.send('This is private route');
    });

}