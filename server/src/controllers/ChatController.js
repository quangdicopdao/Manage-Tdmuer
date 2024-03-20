const Chat = require('../models/Chat.js');
const User = require('../models/User.js');
const Group = require('../models/Group.js');
const gravatar = require('gravatar');
class ChatController {
    async createChat(req, res) {
        try {
            const { from, to, groupId, message } = req.body;
            //const { from, to, message } = req.body;
            let participants = [];
            if (groupId) {
                // Nếu groupId được cung cấp, lấy tất cả các thành viên trong nhóm
                const group = await Group.findById(groupId);
                if (!group) {
                    return res.status(404).json({ message: 'Group not found' });
                }
                participants = group.members;
            } else {
                // Nếu không, chỉ có hai người tham gia
                participants = [from, to];
            }

            const newChat = await Chat.create({
                message: message,
                Chatusers: participants,
                Sender: from,
                group: groupId,
            });
            return res.status(200).json(newChat);
        } catch (error) {
            console.error(error);
            return res.status(500).json('Internal server error');
        }
    }

    async getChat(req, res) {
        try {
            const { userId, groupId } = req.params;
            let query = {};

            // Kiểm tra xem groupId có tồn tại trong cơ sở dữ liệu không
            const groupExists = await Group.findById(groupId);

            if (groupExists) {
                // Nếu groupId tồn tại trong cơ sở dữ liệu, truy xuất dữ liệu nhóm
                query = { group: groupId };
            } else {
                // Nếu không, lấy tin nhắn giữa userId và groupId (lúc này là id của người dùng đã chọn)
                query = { Chatusers: { $all: [userId, groupId] } };
            }

            const chats = await Chat.find(query).sort({ updatedAt: 1 });
            const allMessages = await Promise.all(
                chats.map(async (msg) => {
                    // Lấy thông tin về người gửi tin nhắn
                    const sender = await User.findById(msg.Sender);
                    const senderAvatar = sender.avatar;
                    const namesend = sender.username;

                    return {
                        myself: msg.Sender.toString() === userId, // Kiểm tra xem người gửi tin nhắn có phải là userId không
                        message: msg.message,
                        senderAvatar: senderAvatar,
                        namesend: namesend,
                    };
                }),
            );

            return res.status(200).json(allMessages);
        } catch (error) {
            console.error(error);
            return res.status(500).json('Internal server error');
        }
    }

    //get user following
    async following(req, res) {
        try {
            const user = await User.findById(req.params.id);
            const followinguser = await Promise.all(
                user.following.map((item) => {
                    return User.findById(item);
                }),
            );

            let followingList = [];
            followinguser.map((person) => {
                const { email, password, isAdmin, following, ...others } = person._doc;
                followingList.push(others);
            });

            res.status(200).json(followingList);
        } catch (error) {
            return res.status(500).json('Internal server error');
        }
    }
    async addfollow(req, res) {
        const { userId } = req.params;
        const { followingUserId } = req.body;

        try {
            // Tìm người dùng trong collection User và cập nhật mảng following
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Thêm followingUserId vào mảng following nếu chưa tồn tại
            if (!user.following.includes(followingUserId)) {
                user.following.push(followingUserId);
                await user.save();
                return res.status(200).json({ message: 'User followed successfully' });
            } else {
                return res.status(400).json({ message: 'User is already followed' });
            }
        } catch (error) {
            console.error('Error following user:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    // Phương thức để tạo nhóm chat mới
    async createGroupChat(req, res) {
        try {
            const { name, members } = req.body;
            const avatar = gravatar.url(name, { s: '200', r: 'pg', d: 'identicon' });
    
            // Tạo một bản ghi mới cho nhóm chat
            const newGroupChat = new Group({
                name: name,
                members: members,
                avatar: avatar,
            });
            // Lưu nhóm chat vào cơ sở dữ liệu
            const savedGroupChat = await newGroupChat.save();
    

            // Trả về nhóm chat đã được lưu trong cơ sở dữ liệu
            return res.status(201).json(savedGroupChat);
        } catch (error) {
            console.error(error); // In ra thông báo lỗi
            return res.status(500).json({ error: 'Internal server error' });
        }

    };
    
    

    async getGroup(req, res) {
        try {
            const { userId } = req.params;

            // Tìm các nhóm mà người dùng tham gia dựa trên mảng members
            const groups = await Group.find({ members: userId });

            return res.status(200).json(groups);
        } catch (error) {
            console.error('Error getting groups:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}
module.exports = new ChatController();

// async createChat (req, res){
//     try {
//         const {from , to , message} = req.body;
//         const newChat = await Chat.create({
//             message: message,
//             Chatusers:[from, to],
//             Sender:from
//         })
//         return res.status(200).json(newChat);
//     } catch (error) {
//         return res.status(500).json('Intenal server error')
//     }
// }
// async getChat(req, res){
//     try {
//         const from = req.params.user1Id;
//         const to = req.params.user2Id;
//         const newChat = await Chat.find({
//             Chatusers:{
//                 $all: [from, to],
//             }
//         }).sort({updateAt:1});
//         const allmessage = newChat.map((msg)=>{
//             return {
//                 myself: msg.Sender.toString()===from,
//                 message: msg.message
//             }
//         })
//         return res.status(200).json(allmessage);
//     } catch (error) {
//         return res.status(500).json('Intenal server error')
//     }
// }
