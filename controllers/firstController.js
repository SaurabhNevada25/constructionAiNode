import * as first_store from "../stores/firstStore.js";

export async function startRoute(users_question) {
    try {
        const resp = await first_store.startRoute(users_question);
        return resp;
    }
    catch (err) {
        throw err;
    }
}