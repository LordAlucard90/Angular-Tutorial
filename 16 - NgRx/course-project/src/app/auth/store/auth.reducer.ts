import { createReducer, createSelector, on } from '@ngrx/store';
import { User } from '../user.model';
import * as AuthActions from './auth.actions';

export interface State {
    user?: User;
    error?: string;
    loading: boolean;
}

export interface AppState {
    auth: State;
}

export const selectAuth = (state: AppState) => state.auth;

export const selectAuthUser = createSelector(selectAuth, (state: State) => state.user);

export const selectAuthError = createSelector(selectAuth, (state: State) => state.error);

export const selectAuthLoading = createSelector(selectAuth, (state: State) => state.loading);

const initialState: State = {
    loading: false,
};

export const authReducer = createReducer(
    initialState,
    on(AuthActions.loginStart, state => {
        return {
            ...state,
            error: undefined,
            loading: true,
        };
    }),
    on(AuthActions.singUpStart, state => {
        return {
            ...state,
            error: undefined,
            loading: true,
        };
    }),
    on(AuthActions.authenticateFail, (state, { error }) => {
        return {
            ...state,
            user: undefined,
            error: error,
            loading: false,
        };
    }),
    on(AuthActions.clearError, state => {
        return {
            ...state,
            error: undefined,
        };
    }),
    on(AuthActions.authenticateSuccess, (state, { id, email, token, expirationDate }) => {
        return {
            ...state,
            error: undefined,
            user: new User(id, email, token, expirationDate),
            loading: false,
        };
    }),
    on(AuthActions.logout, state => {
        return {
            ...state,
            user: undefined,
        };
    }),
);
