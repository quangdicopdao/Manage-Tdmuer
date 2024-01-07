import ChatBox from '~/components/ChatBox/ChatBox';
import classNames from 'classnames/bind';
import style from './Message.module.scss';

const cx = classNames.bind(style);

function Message() {
    return (
        <div className={cx('wrapper')}>
            <ChatBox />
        </div>
    );
}

export default Message;
