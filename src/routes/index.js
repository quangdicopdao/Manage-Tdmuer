import Home from '~/pages/Home/Home';
import Message from '~/pages/Message/Message';
import Schedule from '~/pages/Schedule/Schedule';
import PostDetail from '~/pages/PostDetail';
import BlogCreate from '~/pages/Blog/create';
import Post from '~/pages/Blog';
import ManagePost from '~/pages/Blog/manage';
import Me from '~/pages/Me';
import Spending from '~/pages/Spending';
import { DetailLayout } from '~/Layout';

const publicRoute = [
    { path: '/', component: Home },
    { path: '/spending', component: Spending },
    { path: '/profile/:userId', component: Me, Layout: DetailLayout },
    { path: '/blog/create', component: BlogCreate, Layout: DetailLayout },
    { path: '/post/:postId', component: PostDetail },
    { path: '/post', component: Post },
    { path: '/post/manage-post', component: ManagePost },

    { path: '/schedule', component: Schedule },
    { path: '/message', component: Message },
];
const privateRoute = [];
export { publicRoute, privateRoute };
