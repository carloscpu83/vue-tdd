import Vuex from 'vuex';
import storage from "../state/storage.js";

const store = new Vuex.Store({
    state(){
        return {
            isLogedIn: false,
            userId: null,
            username: null,
            image: null
        };
    },
    mutations: {
        loginSuccess(state){
            state.isLogedIn = true;
        },
        storeUserData(state, data){
            state.userId = data.id;
            state.username = data.username;
            state.image = data.image;
            state.header = data.header;
        }
    }
});

store.subscribe((mutation, state)=>{
    storage.setItem("auth", state);
});

export default store;