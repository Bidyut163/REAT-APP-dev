import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import {
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    AUTH_ERROR,
    USER_LOADED,
    LOGOUT,
    GET_ERRORS,
} from './types';

// Load user
export const loadUser = () => async (dispatch) => {
    if (localStorage.token) {
        setAuthToken(localStorage.token);
    }

    try {
        const res = await axios.get('/api/auth');

        dispatch({
            type: USER_LOADED,
            payload: res.data,
        });
    } catch (err) {
        dispatch({ type: AUTH_ERROR });
    }
};

// Login User
export const login = (email, password) => async (dispatch) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const body = JSON.stringify({
        email,
        password,
    });

    try {
        const res = await axios.post('/api/auth', body, config);
        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data,
        });

        dispatch(loadUser());
    } catch (err) {
        const errors = err.response.data;

        if (errors) {
            // errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));

            dispatch({ type: GET_ERRORS, payload: errors });
        }

        dispatch({
            type: LOGIN_FAIL,
        });
    }
};

// logout a user
export const logout = () => (dispatch) => {
    dispatch({
        type: LOGOUT,
    });
};
