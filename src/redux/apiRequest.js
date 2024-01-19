import axios from 'axios';
import { loginFailed, loginStart, loginSuccess, createPostFailed, createPostSuccess,registerFailed, registerStart, registerSuccess, logoutStart,logoutSuccess,logoutFailed } from './authSlice';
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
export const registerUser = async (user, dispatch, navigate, openModalLogin) =>{
    dispatch(registerStart());
    try {
        await axios.post(baseURL + 'v1/auth/register',user);
        dispatch(registerSuccess());
        navigate("/");
        openModalLogin();
    } catch (err) {
        dispatch(registerFailed());
    }
}
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
export const logoutUser = async (dispatch, navigate)=>{
    dispatch(logoutStart());
    try {
        dispatch(logoutSuccess());
        navigate('/');
    } catch (error) {
        dispatch(logoutFailed());
    }
}
