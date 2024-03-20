import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import style from './ChatBox.module.scss';
import UserChatComp from './UserChat/UserChatComp';
import { formatDistanceToNow } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faPaperclip, faSearch, faUserPlus, faUsers } from '@fortawesome/free-solid-svg-icons';
import Modal from '../Modal/Modal';
import Button from '../Button';
import Tippy from '@tippyjs/react/headless';
import 'tippy.js/dist/tippy.css'; // optional
import { Wrapper as PopperWrapper } from '~/components/Popper';
import UserGroup from '../User/UserGroup';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { baseURL } from '~/utils/api';
import { io } from 'socket.io-client';
const cx = classNames.bind(style);

function ChatBox() {
    //const userDetails = useSelector((state)=>state.user)
    const user = useSelector((state) => state.auth.login.currentUser);
    let id = user._id;
    const accessToken = user.accessToken;
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);

    const [arrivalMessage, setarrivalMessage] = useState(null);
    //
    const [users, setusers] = useState();
    //const [currentChatUser, setcurrentChatUser] = useState(user);
    //load dữ liệu users
    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await axios.get(baseURL + `chat/following/${id}`);
                setusers(res.data);
                setFilteredUsers(res.data);
                setFilteredUsersGroup(res.data);
            } catch (error) {}
        };
        getUser();
    }, []);
    //user add null
    const [arrUsersAdded, setArrUsersAdded] = useState([]);
    const [keywords, setKeywords] = useState('');
    const [keywordsGroup, setKeywordsGroup] = useState('');
    const [groupName, setGroupName] = useState('');
    const [groupChats, setGroupChats] = useState([]);
    //new

    console.log('arrayuser:', users);
    //search for modal: dữ liệu mẫu

    const [filteredUsers, setFilteredUsers] = useState([]);
    console.log('user:', filteredUsers);
    const [filteredUsersGroup, setFilteredUsersGroup] = useState([]);
    console.log('usergroup:', filteredUsersGroup);
    // function search user
    const searchUsers = (keywords) => {
        if (!users) {
            // Nếu dữ liệu users chưa được tải lên từ API, không thực hiện tìm kiếm
            return;
        }
        if (keywords.trim() !== '') {
            const filteredUsers = users.filter((user) => {
                return (
                    user.username.toLowerCase().includes(keywords.toLowerCase()) ||
                    user.username.toLowerCase().startsWith(keywords.toLowerCase())
                );
            });
            setFilteredUsers(filteredUsers);
        } else {
            // Nếu không có từ khóa, hiển thị toàn bộ danh sách người dùng
            setFilteredUsers(users);
        }
    };

    // Thay đổi phần cập nhật filteredUsersGroup
    const searchUsersGroup = (keywords) => {
        if (!users) {
            // Nếu dữ liệu users chưa được tải lên từ API, không thực hiện tìm kiếm
            return;
        }

        if (keywords.trim() !== '') {
            const filteredUsersGroup = users.filter((user) => {
                return (
                    user.username.toLowerCase().includes(keywords.toLowerCase()) ||
                    user.username.toLowerCase().startsWith(keywords.toLowerCase())
                );
            });
            setFilteredUsersGroup(filteredUsersGroup);
        } else {
            // Nếu không có từ khóa, hiển thị toàn bộ danh sách người dùng
            setFilteredUsersGroup(users);
        }
    };

    // Thêm người dùng vào danh sách đã thêm
    const addToArrUsersAdded = (user) => {
        setArrUsersAdded((prevArrUsersAdded) => [...prevArrUsersAdded, user]);
        setFilteredUsersGroup((prevFilteredUsersGroup) => prevFilteredUsersGroup.filter((u) => u.id !== user.id)); // Loại bỏ người dùng đã thêm khỏi danh sách tìm kiếm
        setKeywordsGroup(''); // Đặt từ khóa tìm kiếm về trạng thái ban đầu
    };

    // Xóa người dùng khỏi danh sách đã thêm
    const removeFromArrUsersAdded = (user) => {
        setArrUsersAdded((prevArrUsersAdded) => prevArrUsersAdded.filter((u) => u.id !== user.id));
        if (keywordsGroup.trim() !== '') {
            // Nếu có từ khóa tìm kiếm, cập nhật danh sách tìm kiếm để bao gồm người dùng đã xóa
            setFilteredUsersGroup((prevFilteredUsersGroup) => [...prevFilteredUsersGroup, user]);
        }
    };

    const handleInputChange = (e) => {
        const { value } = e.target;
        setKeywords(value);
        // Gọi hàm tìm kiếm với debounce
    };
    const handleInputChangeGroup = (e) => {
        const { value } = e.target;
        setKeywordsGroup(value);
        searchUsersGroup(value); // Gọi hàm searchUsersGroup với từ khóa mới
    };

    // Tạo nhóm chat
    const createGroupChat = async () => {
        try {
            if (!groupName.trim()) {
                console.error('Tên nhóm không được để trống');
                return;
            }

            // Thêm thông tin của người tạo nhóm vào danh sách arrUsersAdded
            const currentUser = {
                _id: user._id,
            };
            const updatedArrUsersAdded = [currentUser, ...arrUsersAdded];

            const response = await axios.post(baseURL + 'chat/api/creategroup', {
                name: groupName,
                members: updatedArrUsersAdded.map((user) => user._id),
            });

            if (response.data) {
                // Yêu cầu tạo nhóm chat thành công
                // Cập nhật giao diện người dùng hoặc thực hiện các hành động khác
                console.log('Nhóm chat đã được tạo:', response.data);
                // Ví dụ: Cập nhật danh sách nhóm chat hoặc hiển thị thông báo thành công
            }
            await fetchGroupChats();
            // Đóng modal và làm sạch trạng thái
            setModalOpen(false);
            setArrUsersAdded([]);
            setKeywords('');
            setGroupName('');
        } catch (error) {
            console.error('Lỗi khi tạo nhóm chat:', error);
            // Xử lý lỗi và thông báo cho người dùng (có thể sử dụng Modal hoặc toast notification)
        }
    };

    // modal
    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };
    //
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    // nhập tin nhắn và bấm entert
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSendMessage();
        }
    };
    // //click vào user
    // const handleUserSelect = (user) => {
    //     setSelectedUser(user);
    //     setcurrentChatUser(user);
    //     setSelectedUserId(user._id);
    // };

    // Khai báo hàm getMessages trước useEffect
    const getMessages = async (item) => {
        try {
            let response = await axios.get(baseURL + `chat/getchat/${id}/${selectedUser._id}`);
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleUserOrGroupSelect = (item) => {
        setSelectedUser(item);
        setSelectedUserId(item._id);
    };
    console.log('Selected:', selectedUser);

    //load dữ liệu chat
    useEffect(() => {
        if (selectedUser) {
            // Kiểm tra selectedUser có tồn tại hay không
            getMessages(selectedUser);
        }
    }, [selectedUser]);

    //socket

    const socket = useRef();
    useEffect(() => {
        if (id) {
            socket.current = io(baseURL);
            socket.current.emit('addUser', id);
        }
    }, [id]);
    // khi nhập tin nhắn mới sẽ tự scroll xuống cuối
    const scrollRef = useRef();

    useEffect(() => {

        if (selectedUser && scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [selectedUser, messages]);
    

    // const handleSendMessage = () => {
    //     const messageschat = {
    //         myself: true,
    //         message: newMessage
    //     }
    //     socket.current.emit("send-mess",{
    //         to: currentChatUser._id,
    //         from: id,
    //         message: newMessage
    //     });
    //     fetch(baseURL+`chat/api/create`,{method:"POST", headers:{'Content-Type':'application/JSON', Authorization: `Bearer ${accessToken}`},body:JSON.stringify({
    //         from: id,
    //         to: currentChatUser._id,
    //         message: newMessage
    //     })});
    //     setMessages(messages.concat(messageschat));
    //     setNewMessage('');
    // };

    const handleSendMessage = async () => {
        if (!newMessage.trim()) {
            return;
        }

        try {
            let requestData;
            if (selectedUser.hasOwnProperty('members')) {
                // Tin nhắn cho nhóm chat
                requestData = {
                    from: id,
                    groupId: selectedUser._id,
                    message: newMessage,
                };
            } else {
                // Tin nhắn cho người dùng đơn
                requestData = {
                    from: id,
                    to: selectedUser._id,
                    message: newMessage,
                };
            }

            const response = await axios.post(baseURL + 'chat/api/create', requestData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (response.data) {
                if (selectedUser.hasOwnProperty('members')) {
                    // Tin nhắn cho nhóm chat
                    socket.current.emit('send-mess', {
                        groupId: selectedUser._id,
                        message: newMessage,
                        groupMembers: selectedUser.members,
                        senderAvatar: user.avatar,
                        namesend: user.username,
                    });
                } else {
                    // Tin nhắn cho người dùng đơn
                    socket.current.emit('send-mess', { to: selectedUser._id, message: newMessage });
                }

                // Thêm tin nhắn mới vào danh sách tin nhắn
                setMessages((prevMessages) => [...prevMessages, { myself: true, message: newMessage }]);
                // Xóa nội dung tin nhắn khỏi input
                setNewMessage('');
            } else {
                console.error('Failed to create message.');
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    useEffect(() => {
        if (socket.current) {
            socket.current.on('mess-receive', (msg) => {
                console.log('msg:', msg);
                if (selectedUser && selectedUser.hasOwnProperty('members')) {
                    const { message, senderAvatar, namesend } = msg;
                    const receivedMessage = { myself: false, message, senderAvatar, namesend }; // Tạo đối tượng tin nhắn mới với các giá trị đã trích xuất
                    setarrivalMessage(receivedMessage); // Cập nhật tin nhắn nhận được
                } else {
                    setarrivalMessage({ myself: false, message: msg });
                }
            });
        }
        // Thêm hàm cleanup để ngăn chặn việc gắn kết nhiều lần cho cùng một sự kiện
        return () => {
            if (socket.current) {
                socket.current.off('mess-receive');
            }
        };
    }, [selectedUser]); // Thêm selectedUser vào dependency array để useEffect re-run khi selectedUser thay đổi

    // Sau đó, bạn cần cập nhật danh sách tin nhắn với tin nhắn nhận được trong useEffect khác
    useEffect(() => {
        arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage]);

    //group chat
    const fetchGroupChats = async () => {
        try {
            const response = await axios.get(baseURL + `chat/api/getgroup/${id}`); // Thay đổi đường dẫn API tương ứng
            setGroupChats(response.data);
        } catch (error) {
            console.error('Error fetching group chats:', error);
        }
    };
    useEffect(() => {
        fetchGroupChats();
    }, []);
    return (
        <div className={cx('wrapper')}>
            <div className={cx('left-side-box-chat')}>
                <h2>Đoạn chat</h2>
                <div className={cx('wrap-btn')}>
                    <div className={cx('wrap-search')}>
                        <FontAwesomeIcon icon={faSearch} className={cx('icon-search')} />
                        <input
                            className={cx('input-search')}
                            type="text"
                            placeholder="Tìm kiếm người dùng..."
                            value={keywords}
                            onChange={(e) => {
                                handleInputChange(e);
                                searchUsers(e.target.value);
                            }}
                        />
                    </div>
                    <button className={cx('btn-plus')} onClick={openModal}>
                        <FontAwesomeIcon icon={faUserPlus} />
                    </button>
                </div>

                <div className={cx('wrap-all-user')}>
                    {/* Hiển thị danh sách người dùng */}
                    {filteredUsers?.map((user) => (
                        <UserChatComp
                            key={user._id}
                            imageUrl={user.avatar}
                            name={user.username}
                            lastMessage={'Chúc ngủ ngon'}
                            onUserClick={() => handleUserOrGroupSelect(user)}
                            isActive={user._id === selectedUserId}
                        />
                    ))}

                    {/* Hiển thị danh sách nhóm chat */}
                    {groupChats?.map((groupChat) => (
                        <UserChatComp
                            key={groupChat._id} // Đảm bảo key là duy nhất
                            imageUrl={groupChat.avatar} // Sử dụng avatar của thành viên đầu tiên làm hình ảnh nhóm
                            name={groupChat.name}
                            lastMessage={`Nhóm mới tạo: ${groupChat.members.length} thành viên`}
                            onUserClick={() => handleUserOrGroupSelect(groupChat)}
                            //isActive={isGroupCreated && groupChat.id === groupChats[groupChats.length - 1].id}
                        />
                    ))}
                </div>
            </div>
            {/**Chat */}
            <div className={cx('right-side-chat-box')}>
                {selectedUser && (
                    <div className={cx('header-chat')}>
                        <img className={cx('img-header-chat')} src={selectedUser.avatar} alt="" />
                        <h2 className={cx('name-header-chat')}>
                            {selectedUser.hasOwnProperty('members') ? selectedUser.name : selectedUser.username}
                        </h2>
                    </div>
                )}
                {/** Content-Chat */}
                <div className={cx('content-message')}>
                    {messages.map((item, index) => (
                        <div ref={scrollRef}>
                            {item.myself === false ? (
                                <div key={index} className={cx('member-content-chat')}>
                                    {selectedUser.hasOwnProperty('members') ? (
                                        <div className={cx('user-profile')}>
                                            <img
                                                src={`${item.senderAvatar}`}
                                                className={cx('img-user-chat')}
                                                alt={item?.namesend}
                                            />
                                            <div className={cx('username-overlay')}>
                                                <span className={cx('username')}>{item?.namesend}</span>
                                            </div>
                                            {/* <p>{item?.namesend}</p> */}
                                        </div>
                                    ) : (
                                        <img
                                            src={`${selectedUser.avatar}`}
                                            className={cx('img-user-chat')}
                                            alt={item?.namesend}
                                        />
                                    )}

                                    <p className={cx('chat-text')}>{item?.message}</p>
                                </div>
                            ) : (
                                <div className={cx('my-content-chat')}>
                                    <p className={cx('chat-text')}>{item?.message}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/**Footer-Chat */}
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

            {/**Thêm nhóm chat */}
            {modalOpen && (
                <Modal onClose={closeModal}>
                    <div className={cx('wrap-modal')}>
                        <h2 className={cx('title')}>Thêm nhóm chat mới</h2>
                        <Tippy
                            visible={keywordsGroup.length > 0}
                            interactive
                            placement="bottom"
                            render={(attrs) => (
                                <div className={cx('search-result')} tabIndex="-1" {...attrs}>
                                    <PopperWrapper>
                                        {filteredUsersGroup?.map((user) => (
                                            <UserGroup
                                                key={user._id}
                                                imgURL={user.avatar}
                                                name={user.username}
                                                onAdd={() => addToArrUsersAdded(user)}
                                            />
                                        ))}
                                    </PopperWrapper>
                                </div>
                            )}
                        >
                            <div className={cx('modal-wrap-input')}>
                                <FontAwesomeIcon
                                    icon={faSearch}
                                    className={cx('icon-search')}
                                    onClick={searchUsersGroup}
                                />
                                <input
                                    type="text"
                                    value={keywordsGroup}
                                    //onChange={handleInputChangeGroup}
                                    onChange={(e) => {
                                        handleInputChangeGroup(e);
                                        searchUsersGroup(e.target.value);
                                    }}
                                    placeholder="Nhập người dùng muốn thêm"
                                    className={cx('input-search')}
                                />
                            </div>
                        </Tippy>
                        <h4 className={cx('title-add')}>Người dùng đã thêm</h4>
                        <div className={cx('wrap-user-added')}>
                            {arrUsersAdded.map((user) => (
                                <UserGroup
                                    key={user._id}
                                    imgURL={user.avatar}
                                    name={user.username}
                                    btn
                                    isAdded
                                    onDelete={() => removeFromArrUsersAdded(user)}
                                />
                            ))}
                        </div>
                        <div className={cx('modal-wrap-input')}>
                            <FontAwesomeIcon icon={faUsers} className={cx('icon-search')} />
                            <input
                                type="text"
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                placeholder="Nhập tên nhóm mới"
                                className={cx('input-search')}
                            />
                        </div>
                        <Button outline className={cx('btn-submit')} onClick={createGroupChat}>
                            Tạo nhóm
                        </Button>
                    </div>
                </Modal>
            )}
        </div>
    );
}

export default ChatBox;