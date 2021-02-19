import {
    createStore,
    createLogger,
} from 'vuex';
import { State, state } from './state';
import { mutations } from './mutations';
import { actions } from './actions';
import { getters } from './getters';

export const store = createStore<State>({
    plugins: process.env.NODE_ENV === 'development' ? [createLogger()] : [],
    state,
    mutations,
    actions,
    getters,
})

