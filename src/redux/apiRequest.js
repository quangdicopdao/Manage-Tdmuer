import axios from 'axios';
import {
    loginFailed,
    loginStart,
    loginSuccess,
    registerFailed,
    registerStart,
    registerSuccess,
    logoutStart,
    logoutSuccess,
    logoutFailed,
} from './authSlice';
import { baseURL } from '~/utils/api';
import {
    createScheduleFailer,
    createScheduleSuccess,
    getScheduleFailer,
    getScheduleStart,
    getScheduleSuccess,
    getMyScheduleFailer,
    getMyScheduleStart,
    getMyScheduleSuccess,
} from './scheduleSlice';

import { getProfileFailer, getProfileStart, getProfileSuccess } from './profileSlice';

import { createPostFailer, createPostSuccess, getPostFailer, getPostStart, getPostSuccess } from './postSlice';
import { toast } from 'react-toastify';

// authenication
export const loginUser = async (user, dispatch, navigate, closeModal) => {
    dispatch(loginStart());
    try {
        const res = await axios.post(baseURL + 'v1/auth/login', user, {
            withCredentials: true,
        });
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
export const registerUser = async (user, dispatch, navigate, openModalLogin) => {
    dispatch(registerStart());
    try {
        await axios.post(baseURL + 'v1/auth/register', user);
        dispatch(registerSuccess());
        navigate('/');
        openModalLogin();
    } catch (err) {
        dispatch(registerFailed());
    }
};
export const logoutUser = async (dispatch, navigate) => {
    dispatch(logoutStart());
    try {
        dispatch(logoutSuccess());
        navigate('/');
    } catch (error) {
        dispatch(logoutFailed());
    }
};

//post
export const showPosts = async (dispatch, data) => {
    dispatch(getPostStart());
    try {
        const res = await axios.get(baseURL + 'post', {
            params: data,
        });
        dispatch(getPostSuccess(res.data));
    } catch (error) {
        console.error('Error fetching posts:', error);
        dispatch(getPostFailer(error));
    }
};
export const createPost = async (data, dispatch, navigate, accessToken) => {
    try {
        const res = await axios.post(baseURL + 'post/create', data, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        dispatch(createPostSuccess(res.data));
        navigate('/post');
    } catch (error) {
        console.error('Error:', error.response.data);
        dispatch(createPostFailer(error.response.data));
    }
};

export const searchPost = async (query) => {
    try {
        const res = await axios.get(baseURL + `post/search?q=${query}`);
        return res.data;
    } catch (error) {
        console.error('Error searching:', error);
    }
};

export const savedPosts = async (data) => {
    try {
        const res = await axios.post(baseURL + 'post/save-post', data);
        toast.success('Lưu bài viết thành công');
        return res;
    } catch (error) {
        console.error('Error saving post:', error);
        toast.error('Lưu bài viết thất bại');
    }
};

//schedule
export const createSchedule = async (data, dispatch, accessToken, closeModal) => {
    try {
        const res = await axios.post(baseURL + 'schedule/api/create', data, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        dispatch(createScheduleSuccess(res.data));
        closeModal();
        toast.success('Tạo lịch thành công');
    } catch (error) {
        console.error('Error:', error.response.data);
        toast.error('Lỗi khi tạo lịch');
        dispatch(createScheduleFailer(error.response.data));
    }
};
// filter show schedule by status

export const showSchedule = async (dispatch, axiosJWT, data, accessToken) => {
    dispatch(getScheduleStart());
    try {
        const res = await axiosJWT.get(baseURL + 'schedule/api/show', {
            params: data,
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        dispatch(getScheduleSuccess(res.data));
    } catch (error) {
        dispatch(getScheduleFailer(error));
    }
};

export const overviewSchedule = async (dispatch, axiosJWT, accessToken, convert) => {
    dispatch(getMyScheduleStart());
    try {
        const res = await axiosJWT.get(baseURL + 'schedule/api/overview', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        dispatch(getMyScheduleSuccess(convert(res.data)));
    } catch (error) {
        dispatch(getMyScheduleFailer(error));
    }
};
//profile
export const getMyPost = async (dispatch, axiosJWT, accessToken, userId) => {
    dispatch(getProfileStart());
    try {
        const res = await axiosJWT.get(baseURL + `profile/posts/${userId}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        dispatch(getProfileSuccess(res.data));
    } catch (error) {
        dispatch(getProfileFailer(error));
    }
};
