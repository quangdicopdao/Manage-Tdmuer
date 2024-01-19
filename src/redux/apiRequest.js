import axios from 'axios';
import { loginFailed, loginStart, loginSuccess, createPostFailed, createPostSuccess } from './authSlice';
import { baseURL } from '~/utils/api';
import { createScheduleSuccess } from './scheduleSlice';
import { toast } from 'react-toastify';

// apiRequest.js
export const loginUser = async (user, dispatch, navigate, closeModal) => {
    dispatch(loginStart());
    try {
        const res = await axios.post(baseURL + 'v1/auth/login', user);
        console.log('Login success:', res.data);
        dispatch(loginSuccess(res.data));
        navigate('/');
        toast.success('Đăng nhập thành công');
        closeModal();
    } catch (error) {
        toast.error('Sai tài khoản hoặc mật khẩu');
        console.log('Login failed:', error.response.data);
        dispatch(loginFailed(error.response.data));
    }
};

export const createPost = async (data, dispatch, navigate, accessToken) => {
    try {
        const res = await axios.post(baseURL + 'api/posts/create', data, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        dispatch(createPostSuccess(res.data));
        navigate('/');
    } catch (error) {
        console.error('Error:', error.response.data);
        dispatch(createPostFailed(error.response.data));
    }
};

export const createSchedule = async (data, dispatch, navigate, accessToken) => {
    try {
        const res = await axios.post(baseURL + 'schedule/api/create', data, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        dispatch(createScheduleSuccess(res.data));
        navigate('/schedule');
    } catch (error) {
        console.error('Error:', error.response.data);
        dispatch(createPostFailed(error.response.data));
    }
};
