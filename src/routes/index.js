import Home from '~/pages/Home/Home';
import Message from '~/pages/Message/Message';
import Schedule from '~/pages/Schedule/Schedule';
import PostDetail from '~/pages/PostDetail';
import BlogCreate from '~/pages/Blog/create';
import { DetailLayout } from '~/Layout';

const publicRoute = [
    { path: '/', component: Home },
    { path: '/blog/create', component: BlogCreate, Layout: DetailLayout },
    { path: '/post/:postId', component: PostDetail },
    { path: '/schedule', component: Schedule },
    { path: '/message', component: Message },
];
const privateRoute = [];
export { publicRoute, privateRoute };
