import { loginSuccess, loginFailure } from './action';

export const loginUser = (username, password) => async (dispatch) => {
    try {
        const response = await fetch('http://localhost:5000/v1/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            dispatch(loginSuccess(data));
        } else {
            dispatch(loginFailure(data.message));
        }
    } catch (error) {
        dispatch(loginFailure('Đã xảy ra lỗi'));
    }
};
