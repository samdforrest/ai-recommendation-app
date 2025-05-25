export function createDefaultUserContext(userID) {
    return {
        userID,
        preferences: {
            genres: [],
            actors: [],
            platforms: [],
            rejected: [],
        },
        history: [] // { title, type, liked media }
    };
}