import axios from 'axios';
import { loginFailed, loginStart, loginSuccess, createPostFailed, createPostSuccess } from './authSlice';
import { baseURL } from '~/utils/api';

// apiRequest.js
export const loginUser = async (user, dispatch, navigate, closeModal) => {
    console.log('Attempting login with user:', user);
    dispatch(loginStart());
    try {
        const res = await axios.post(baseURL + 'v1/auth/login', user);
        console.log('Login success:', res.data);
        dispatch(loginSuccess(res.data));
        navigate('/');
        closeModal();
    } catch (error) {
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
