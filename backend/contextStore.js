import { createDefaultUserContext } from './userContext.js';

const userContexts = {};

export function getUserContext(userID) {
    if (!userContexts[userID]) {
        userContexts[userID] = createDefaultUserContext(userID);
    }
    return userContexts[userID];
}

export function saveUserContext(userID, context) {
    userContexts[userID] = context;
}