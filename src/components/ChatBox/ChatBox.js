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
import {io} from 'socket.io-client'
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
    const [currentChatUser, setcurrentChatUser] = useState(user);
    //load dữ liệu users
    useEffect(()=>{
        const getUser = async ()=>{
            try {
                const res = await axios.get(baseURL + `v1/auth/get/users`);
                setusers(res.data);
            } catch (error) {
                
            }
        }
        getUser();
    })
    //user add null
    const [arrUsersAdded, setArrUsersAdded] = useState([]);
    const [keywords, setKeywords] = useState('');
    const [keywordsGroup, setKeywordsGroup] = useState('');
    const [groupName, setGroupName] = useState('');
    const [groupChats, setGroupChats] = useState([]);
    //new
    

    //search for modal: dữ liệu mẫu
    
    const [filteredUsers, setFilteredUsers] = useState(users);
    const [filteredUsersGroup, setFilteredUsersGroup] = useState(users);
    // function search user
    const searchUsers = (keywords) => {
        if (keywords.trim() !== '') {
            const filteredUsers = users.filter((user) => {
                return (
                    !arrUsersAdded.find((addedUser) => addedUser.id === user.id) &&
                    (user.name.toLowerCase().includes(keywords.toLowerCase()) ||
                        user.name.toLowerCase().startsWith(keywords.toLowerCase()))
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
        if (keywords.trim() !== '') {
            const filteredUsersGroup = users.filter((user) => {
                return (
                    !arrUsersAdded.find((addedUser) => addedUser.id === user.id) &&
                    (user.name.toLowerCase().includes(keywords.toLowerCase()) ||
                        user.name.toLowerCase().startsWith(keywords.toLowerCase()))
                );
            });
            setFilteredUsersGroup(filteredUsersGroup);
        } else {
            // Nếu không có từ khóa, hiển thị toàn bộ danh sách người dùng
            setFilteredUsersGroup(users);
        }
    };

    // add users to list
    const addToArrUsersAdded = (user) => {
        setArrUsersAdded((prevArrUsersAdded) => [...prevArrUsersAdded, user]);
        setKeywordsGroup('');
    };
    //deleted user added
    const removeFromArrUsersAdded = (user) => {
        setArrUsersAdded((prevArrUsersAdded) => prevArrUsersAdded.filter((u) => u.id !== user.id));
    };
   

    const handleInputChange = (e) => {
        const { value } = e.target;
        setKeywords(value);
        // Gọi hàm tìm kiếm với debounce

    };
    const handleInputChangeGroup = (e) => {
        const { value } = e.target;
        setKeywordsGroup(value);
        // Gọi hàm tìm kiếm với debounce

    };
    // Tạo nhóm chat
    const [isGroupCreated, setIsGroupCreated] = useState(false);

    // Tạo nhóm chat
    const createGroupChat = () => {

        // Lưu thông tin nhóm chat vào state
        const newGroup = {
            id: String(Date.now()), // Tạo một id duy nhất cho nhóm chat
            name: groupName,
            members: arrUsersAdded,
            // Các thông tin khác nếu cần
        };

        // Thêm nhóm chat mới vào danh sách nhóm chat
        setGroupChats((prevGroupChats) => [...prevGroupChats, newGroup]);

        // Đóng modal và làm sạch trạng thái
        setModalOpen(false);
        setArrUsersAdded([]);
        setKeywords('');
        setGroupName('');

        // Cập nhật danh sách người dùng sau khi tạo nhóm
        updateFilteredUsers();

        // Đánh dấu rằng đã có nhóm chat mới được tạo
        setIsGroupCreated(true);
    };
    // Cập nhật danh sách người dùng
    const updateFilteredUsers = () => {
        // Chỉ thêm các thành viên mới vào danh sách người dùng
        const updatedUsers = arrUsersAdded.filter(
            (addedUser) => !filteredUsers.find((user) => user.id === addedUser.id)
        );
    
        setFilteredUsers([...filteredUsers, ...updatedUsers]);
    };

    // modal
    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };
    //
    const [selectedUser, setSelectedUser] = useState({});

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    // nhập tin nhắn và bấm entert
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Ngăn chặn việc thêm dòng mới vào input
            handleSendMessage();
        }
    };
    //click vào user
    const handleUserSelect = (user) => {
        setSelectedUser(user);
        setcurrentChatUser(user);
        setSelectedUserId(user._id);
    };

    //load dữ liệu chat
    useEffect(()=>{
        const getmessage = async ()=>{
            try {
                const res = await axios.get(baseURL + `get/chats/${id}/${currentChatUser._id}`,{
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                setMessages(res.data);
            } catch (error) {
                
            }
        }
        getmessage();
    },[currentChatUser?._id])

    //socket
    const socket = useRef();
    useEffect(()=>{
        if(currentChatUser!==''){
            socket.current = io(baseURL);
            socket.current.emit("addUser", id);
        }
    },[id]);
    
    // khi nhập tin nhắn mới sẽ tự scroll xuống cuối
    const scrollRef = useRef();
    useEffect(()=>{
        scrollRef.current?.scrollIntoView({behavior:"smooth"})
    },[messages])

    const handleSendMessage = () => {
        const messageschat = {
            myself: true,
            message: newMessage
        }
        socket.current.emit("send-mess",{
            to: currentChatUser._id,
            from: id,
            message: newMessage
        });
        fetch(baseURL+`api/chats/create`,{method:"POST", headers:{'Content-Type':'application/JSON', Authorization: `Bearer ${accessToken}`},body:JSON.stringify({
            from: id,
            to: currentChatUser._id,
            message: newMessage
        })});
        setMessages(messages.concat(messageschat));
        setNewMessage('');
    };
    useEffect(()=>{
        if(socket.current){
            socket.current.on("mess-receive",(msg)=>{
                console.log("msg:", msg);
                setarrivalMessage({myself:false,message:msg});
            })
        }
    },[arrivalMessage]);
    useEffect(()=>{
        arrivalMessage && setMessages((pre)=>[...pre, arrivalMessage])
    },[arrivalMessage]);
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
                    {users?.map((user) => (
                        <UserChatComp
                            key={user._id}
                            imageUrl={user.avatar}
                            name={user.username}
                            lastMessage={'Chúc ngủ ngon'}
                            onUserClick={() => handleUserSelect(user)}
                            isActive={user._id === selectedUserId}
                        />
                    ))}

                    {/* Hiển thị danh sách nhóm chat */}
                    {groupChats.map((groupChat) => (
                        <UserChatComp
                            key={groupChat.id} // Đảm bảo key là duy nhất
                            imageUrl={groupChat.members[0].url} // Sử dụng avatar của thành viên đầu tiên làm hình ảnh nhóm
                            name={groupChat.name}
                            lastMessage={`Nhóm mới tạo: ${groupChat.members.map(member => member.name).join(', ')}`}
                            onUserClick={()=>handleUserSelect(groupChat)}
                            isActive={isGroupCreated && groupChat.id === groupChats[groupChats.length - 1].id}
                        />
                    ))}
                </div>
                
            </div>
            {/**Chat */}
            <div className={cx('right-side-chat-box')}>
                {selectedUser && (
                    <div className={cx('header-chat')}>
                        <img className={cx('img-header-chat')} src={selectedUser.avatar} alt="" />
                        <h2 className={cx('name-header-chat')}>{selectedUser.username}</h2>
                    </div>
                )}
                {/** Content-Chat */}
                <div className={cx('content-message')}>
                    {messages.map((item, index) => (
                        <div ref={scrollRef}>
                            {item.myself===false?
                                <div key={index} className={cx('content-chat')}>
                                    <img src={`${currentChatUser?.avatar}`} className={cx('userprofile')} alt='' />
                                    <p className={cx('chat-text')}>
                                        {item?.message}
                                    </p>
                                </div>:
                                <div className={cx('content-chat')} style={{marginLeft:730}}> 
                                    <p className={cx('chat-text')}>
                                        {item?.message}
                                    </p>
                                </div>
                            }
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
                                        {filteredUsersGroup.map((user) => (
                                            <UserGroup
                                                key={user.id}
                                                imgURL={user.url}
                                                name={user.name}
                                                onAdd={() => addToArrUsersAdded(user)}
                                            />
                                        ))}
                                    </PopperWrapper>
                                </div>
                            )}
                        >
                            <div className={cx('modal-wrap-input')}>
                                <FontAwesomeIcon icon={faSearch} className={cx('icon-search')} onClick={searchUsersGroup}/>
                                <input
                                    type="text"
                                    value={keywordsGroup}
                                    onChange={handleInputChangeGroup}
                                    placeholder="Nhập người dùng muốn thêm"
                                    className={cx('input-search')}
                                />
                            </div>
                        </Tippy>
                        <h4 className={cx('title-add')}>Người dùng đã thêm</h4>
                        <div className={cx('wrap-user-added')}>
                            {arrUsersAdded.map((user) => (
                                <UserGroup
                                    key={user.id}
                                    imgURL={user.url}
                                    name={user.name}
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
