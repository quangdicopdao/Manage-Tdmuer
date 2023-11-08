import Home from '~/pages/Home/Home';
import Blog from '~/pages/Blog/Blog';
import Schedule from '~/pages/Schedule/Schedule';

const publicRoute = [
    { path: '/', component: Home },
    { path: '/blog', component: Blog },
    { path: '/schedule', component: Schedule },
];
const privateRoute = [];
export { publicRoute, privateRoute };
