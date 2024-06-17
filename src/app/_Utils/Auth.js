let isAuthenticated = false;

export const setAuthenticated = (value) => {
    isAuthenticated = value;
};

export const getAuthenticated = () => {
    return isAuthenticated;
};
