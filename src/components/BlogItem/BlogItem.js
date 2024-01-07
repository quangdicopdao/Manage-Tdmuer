import classNames from 'classnames/bind';
import styles from './BlogItem.module.scss';

const cx = classNames.bind(styles);

function BlogItem() {
    return (
        <div className={cx('wrapper')}>
            <img
                className={cx('avatar')}
                src="https://files.fullstack.edu.vn/f8-prod/blog_posts/791/615ddae5c5b7d.jpg"
                alt="title"
            />
            <div className={cx('content')}>
                <h4 className={cx('username')}>Học như thế nào là phù hợp?</h4>
            </div>
        </div>
    );
}

export default BlogItem;
