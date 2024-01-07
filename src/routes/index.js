import Home from '~/pages/Home/Home';
import Message from '~/pages/Message/Message';
import Schedule from '~/pages/Schedule/Schedule';
import PostDetail from '~/pages/PostDetail';

const publicRoute = [
    { path: '/', component: Home },
    { path: '/post', component: PostDetail },
    { path: '/schedule', component: Schedule },
    { path: '/message', component: Message },
];
const privateRoute = [];
export { publicRoute, privateRoute };
