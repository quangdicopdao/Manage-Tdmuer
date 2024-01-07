import React, { useState } from 'react';
import classNames from 'classnames/bind';
import style from './ChatBox.module.scss';
import UserChatComp from './UserChat/UserChatComp';
import { formatDistanceToNow } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faPaperclip, faSearch, faUserPlus } from '@fortawesome/free-solid-svg-icons';
const cx = classNames.bind(style);

function ChatBox() {
    const [isActive, setIsActive] = useState(false);

    const handleClick = () => {
        setIsActive(!isActive);
    };
    //test giao diện
    const [selectedUser, setSelectedUser] = useState({
        name: 'Đặng Việt Quang',
        imageUrl:
            'https://scontent.fsgn21-1.fna.fbcdn.net/v/t39.30808-1/378393423_1307195950164637_4310189808608344293_n.jpg?stp=dst-jpg_p320x320&_nc_cat=111&ccb=1-7&_nc_sid=5740b7&_nc_ohc=qidZAFIJwWMAX91ujIV&_nc_oc=AQkn_EYpnJOyZI1QRuDQ1Fn6G3Cekfumfr-g4PLK5xca1AZik2eiKWo7kwlFxhP_l8o&_nc_ht=scontent.fsgn21-1.fna&oh=00_AfCgVGSawwBMnZC7cZGq0f3zBJuXeX7mYxjemzLLpDBlZA&oe=659AD2A2',
    });

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Ngăn chặn việc thêm dòng mới vào input
            handleSendMessage();
        }
    };
    const handleSendMessage = () => {
        if (newMessage.trim() !== '') {
            const newMessageObj = {
                id: String(Date.now()),
                content: newMessage,
                timestamp: new Date().getTime(),
                sender: {
                    name: 'Đặng Việt Quang',
                    imageUrl:
                        'https://scontent.fsgn21-1.fna.fbcdn.net/v/t39.30808-1/378393423_1307195950164637_4310189808608344293_n.jpg?stp=dst-jpg_p320x320&_nc_cat=111&ccb=1-7&_nc_sid=5740b7&_nc_ohc=qidZAFIJwWMAX91ujIV&_nc_oc=AQkn_EYpnJOyZI1QRuDQ1Fn6G3Cekfumfr-g4PLK5xca1AZik2eiKWo7kwlFxhP_l8o&_nc_ht=scontent.fsgn21-1.fna&oh=00_AfCgVGSawwBMnZC7cZGq0f3zBJuXeX7mYxjemzLLpDBlZA&oe=659AD2A2',
                },
            };

            setMessages((prevMessages) => [...prevMessages, newMessageObj]);
            setNewMessage('');
        }
    };
    const handleUserSelect = (user) => {
        setSelectedUser(user);
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('left-side-box-chat')}>
                <h2>Đoạn chat</h2>
                <div className={cx('wrap-btn')}>
                    <div className={cx('wrap-search')}>
                        <FontAwesomeIcon icon={faSearch} className={cx('icon-search')} />
                        <input className={cx('input-search')} type="text" placeholder="Tìm kiếm" />
                    </div>
                    <button className={cx('btn-plus')}>
                        <FontAwesomeIcon icon={faUserPlus} />
                    </button>
                </div>
                <div className={cx('wrap-all-user')}>
                    <UserChatComp
                        imageUrl={
                            'https://scontent.fsgn21-1.fna.fbcdn.net/v/t39.30808-1/378393423_1307195950164637_4310189808608344293_n.jpg?stp=dst-jpg_p320x320&_nc_cat=111&ccb=1-7&_nc_sid=5740b7&_nc_ohc=qidZAFIJwWMAX91ujIV&_nc_oc=AQkn_EYpnJOyZI1QRuDQ1Fn6G3Cekfumfr-g4PLK5xca1AZik2eiKWo7kwlFxhP_l8o&_nc_ht=scontent.fsgn21-1.fna&oh=00_AfCgVGSawwBMnZC7cZGq0f3zBJuXeX7mYxjemzLLpDBlZA&oe=659AD2A2'
                        }
                        name={'Đặng Việt Quang'}
                        lastMessage={'Chúc ngủ ngon'}
                        onUserClick={() =>
                            handleUserSelect({
                                name: 'Đặng Việt Quang',
                                imageUrl:
                                    'https://scontent.fsgn21-1.fna.fbcdn.net/v/t39.30808-1/378393423_1307195950164637_4310189808608344293_n.jpg?stp=dst-jpg_p320x320&_nc_cat=111&ccb=1-7&_nc_sid=5740b7&_nc_ohc=qidZAFIJwWMAX91ujIV&_nc_oc=AQkn_EYpnJOyZI1QRuDQ1Fn6G3Cekfumfr-g4PLK5xca1AZik2eiKWo7kwlFxhP_l8o&_nc_ht=scontent.fsgn21-1.fna&oh=00_AfCgVGSawwBMnZC7cZGq0f3zBJuXeX7mYxjemzLLpDBlZA&oe=659AD2A2',
                            })
                        }
                        isActive={isActive}
                    />

                    <UserChatComp
                        imageUrl={
                            'https://scontent.fsgn21-1.fna.fbcdn.net/v/t39.30808-1/416323643_762292415939747_877860037475857663_n.jpg?stp=dst-jpg_s320x320&_nc_cat=102&ccb=1-7&_nc_sid=5740b7&_nc_ohc=0R4-ioUBDwAAX_Xkmob&_nc_ht=scontent.fsgn21-1.fna&oh=00_AfDNk2U5Z1RJ9hTs8VAQjRS2UoIAn2h80eJPVZtEfrIQyQ&oe=659D00D8'
                        }
                        name={'Nguyễn Thúy An'}
                        lastMessage={'Chúc ngủ ngon'}
                        onUserClick={() =>
                            handleUserSelect({
                                name: 'Nguyễn Thúy An',
                                imageUrl:
                                    'https://scontent.fsgn21-1.fna.fbcdn.net/v/t39.30808-1/416323643_762292415939747_877860037475857663_n.jpg?stp=dst-jpg_s320x320&_nc_cat=102&ccb=1-7&_nc_sid=5740b7&_nc_ohc=0R4-ioUBDwAAX_Xkmob&_nc_ht=scontent.fsgn21-1.fna&oh=00_AfDNk2U5Z1RJ9hTs8VAQjRS2UoIAn2h80eJPVZtEfrIQyQ&oe=659D00D8',
                            })
                        }
                        isActive={isActive}
                    />
                    <UserChatComp
                        imageUrl={
                            'https://scontent.fsgn21-1.fna.fbcdn.net/v/t1.6435-9/102326557_658139238246076_1608374780314545293_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=be3454&_nc_ohc=5P7hKQNyWAwAX9-O6EB&_nc_ht=scontent.fsgn21-1.fna&oh=00_AfDLtBLqD6yQWT9U1lsOT4gnv5-EwOfhBMhF97Rb5TraXg&oe=65C0509F'
                        }
                        name={'Nhân moi'}
                        lastMessage={'Chúc ngủ ngon'}
                        onUserClick={() =>
                            handleUserSelect({
                                name: 'Nhân moi',
                                imageUrl:
                                    'https://scontent.fsgn21-1.fna.fbcdn.net/v/t1.6435-9/102326557_658139238246076_1608374780314545293_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=be3454&_nc_ohc=5P7hKQNyWAwAX9-O6EB&_nc_ht=scontent.fsgn21-1.fna&oh=00_AfDLtBLqD6yQWT9U1lsOT4gnv5-EwOfhBMhF97Rb5TraXg&oe=65C0509F',
                            })
                        }
                        isActive={isActive}
                    />
                </div>
            </div>
            <div className={cx('right-side-chat-box')}>
                {selectedUser && (
                    <div className={cx('header-chat')}>
                        <img className={cx('img-header-chat')} src={selectedUser.imageUrl} alt="" />
                        <h2 className={cx('name-header-chat')}>{selectedUser.name}</h2>
                    </div>
                )}
                <div className={cx('content-chat')}>
                    {messages.map((message) => (
                        <div key={message.id} className={cx('message')}>
                            <div className={cx('sender-details')}>
                                <img
                                    className={cx('img-sender')}
                                    src={message.sender.imageUrl}
                                    alt={`${message.sender.name}'s avatar`}
                                />
                                <span className={cx('name-sender')}>{message.sender.name}</span>
                                <div className={cx('sender-info')}>
                                    {`Sent ${formatDistanceToNow(message.timestamp, { addSuffix: true })}`}
                                </div>
                            </div>
                            {message.content}
                        </div>
                    ))}
                </div>
                <div className={cx('footer-chat')}>
                    <button className={cx('btn-footer')}>
                        <FontAwesomeIcon icon={faPaperclip} />
                    </button>
                    <input
                        type="text"
                        placeholder="Nhập tin nhắn..."
                        className={cx('input-footer')}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <button className={cx('btn-footer')} onClick={handleSendMessage}>
                        <FontAwesomeIcon icon={faPaperPlane} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ChatBox;
