import classNames from 'classnames/bind';
import style from './PostDetail.module.scss';
import Button from '../../components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faHeart } from '@fortawesome/free-regular-svg-icons';

const cx = classNames.bind(style);
function PostDetail() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('row')}>
                <div className={cx('col-7')}>
                    <div className={cx('wrap-content')}>
                        <h2 className={cx('title-content')}>Ký sự ngày thứ 25 học ở F8 </h2>
                        <p className={cx('content')}>
                            Hí ae, tôi cũng tên Sơn nhưng mà là newbie còn ông Sơn kia thì trùm rồi :))). Tôi cũng vừa
                            mới đến với lập trình,tôi là sv năm 1. Sau khi nghe truyền thuyết thằng anh sinh năm 96 học
                            cơ khí bách khoa, tôi đã lao đầu ngay vào học code vì nghe bảo ngành được xã hội trọng dụng,
                            nhắc đến là gái chảy nước( một phần là sợ bị tụt hậu-nghe đồn là ngành IT đào thải nhanh
                            lắm). Khoảng thời gian trước đó việc tìm hiểu học về web tôi còn khá lơ mơ vì trên mạng
                            người ta chỉ loạn cả lên ( không có lộ trình rõ ràng). Đó là khi F8 của anh Sơn xuất hiện,
                            với lộ trình rõ ràng, bài học được chia ra rạch ròi, course-mate khá là tậm tâm giúp đỡ. Tôi
                            đã có câu hỏi ngớ ngấn nhu bao anh em khác, đó là web này trả phí hả anh Sơn. Tôi cũng khác
                            bất ngờ về việc một người bỏ khác nhiều công sức, làm việc nghiệm túc nhưng lại không thu
                            phí. F8 cho ta một con đường rõ ràng, không lan man, có thế tiết kiệm được vài tháng đến cả
                            năm. Tôi hy vọng ae học và phát triển cộng đồng này nhiệt tình đề không phí công ông anh Sơn
                            Đặng nhé. Nếu ai hỏi tôi nên học khóa front-end nào cho begginer tôi chắc chắn sẽ recommend
                            F8. Tus này mục đích chủ yếu test thử tính năng Blog :).
                        </p>
                    </div>
                </div>
                <div className={cx('col-3')}>
                    <div className={cx('wrap-user')}>
                        <img
                            className={cx('img-user')}
                            src="https://scontent.fsgn21-1.fna.fbcdn.net/v/t39.30808-1/378393423_1307195950164637_4310189808608344293_n.jpg?stp=dst-jpg_p320x320&_nc_cat=111&ccb=1-7&_nc_sid=5740b7&_nc_ohc=U09W18M-OjwAX_slAx0&_nc_ht=scontent.fsgn21-1.fna&oh=00_AfC1jP6GW7_QiyA41u2IbYRN_ieOoic9f09hdxTx8OGY9w&oe=659EC722"
                        />
                        <div className={cx('wrap-info')}>
                            <h3 className={cx('name-user')}>Đặng Việt Quang</h3>
                            <h4 className={cx('date-post')}>2 năm trước</h4>
                        </div>
                    </div>
                    <div className={cx('wrap-action')}>
                        <Button
                            leftIcon={<FontAwesomeIcon icon={faHeart} className={cx('btn-icon')} />}
                            classNames={cx('btn-action')}
                        >
                            <span className={cx('count')}>500</span>
                        </Button>
                        <Button
                            leftIcon={
                                <FontAwesomeIcon
                                    icon={faComment}
                                    className={cx('btn-icon')}
                                    classNames={cx('btn-action')}
                                />
                            }
                        >
                            <span className={cx('count')}>500</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PostDetail;
