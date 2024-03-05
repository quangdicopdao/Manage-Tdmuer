import classNames from 'classnames/bind';
import style from './create.module.scss';
import Editor from '~/components/Editor';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPost } from '~/redux/apiRequest';
import { useNavigate } from 'react-router-dom';
const cx = classNames.bind(style);

function CreateBlog() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const user = useSelector((state) => state.auth.login.currentUser);
    const id = user._id;
    const accsessToken = user.accessToken;
    console.log('accsessToken: ' + accsessToken);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleContentChange = (newContent) => {
        setContent(newContent);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            title,
            content,
            id,
        };
        console.log('data: ' + data);
        await createPost(data, dispatch, navigate, accsessToken);
    };

    return (
        <div className={cx('wrapper')}>
            <form onSubmit={handleSubmit}>
                <div className={cx('wrap-input')}>
                    <input type="text" placeholder="Nhập tiêu đề" value={title} onChange={handleTitleChange} />
                    <button type="submit">Lưu</button>
                </div>
                <div className={cx('wrap-editor')}>
                    <Editor value={content} onChange={handleContentChange} />
                </div>
            </form>
        </div>
    );
}

export default CreateBlog;
