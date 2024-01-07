import BlogItemForHome from '~/components/BlogItemForHome/BlogItemForHome';
import classNames from 'classnames/bind';
import style from './Home.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleChevronRight } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(style);

function Home() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('wrap-title')}>
                <h2 className={cx('post-title')}>Bài viết nổi bật</h2>
                <div className={cx('wrap-view-all')}>
                    <a href="/" className={cx('text-link')}>
                        Xem tất cả
                    </a>
                    <FontAwesomeIcon className={cx('text-link')} icon={faCircleChevronRight} />
                </div>
            </div>
            <div className={cx('row')}>
                <div className={cx('col')}>
                    <BlogItemForHome
                        title={'Cách đưa code lên GitHub và tạo GitHub Pages'}
                        imagePostUrl={'https://files.fullstack.edu.vn/f8-prod/blog_posts/279/6153f692d366e.jpg'}
                        imageUrl={'https://files.fullstack.edu.vn/f8-prod/user_avatars/18159/6466353972973.jpg'}
                        nameUser={'Đặng Việt Quang'}
                        to={'/post'}
                    />
                </div>
            </div>
        </div>
    );
}

export default Home;
