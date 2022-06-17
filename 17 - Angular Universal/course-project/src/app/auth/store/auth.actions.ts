import { createAction, props } from '@ngrx/store';

export const loginStart = createAction(
    '[Auth] Login Start',
    props<{
        email: string;
        password: string;
    }>(),
);

export const singUpStart = createAction(
    '[Auth] Sing Up Start',
    props<{
        email: string;
        password: string;
    }>(),
);

export const autoLogin = createAction('[Auth] Auto Login');

export const authenticateFail = createAction(
    '[Auth] Authenticate Fail',
    props<{
        error: string;
    }>(),
);

export const clearError = createAction('[Auth] Clear Error');

export const authenticateSuccess = createAction(
    '[Auth] Authenticate Success',
    props<{
        id: number;
        email: string;
        token: string;
        expirationDate: Date;
        redirect: boolean;
    }>(),
);

export const logout = createAction('[Auth] Logout');
