
let isAuthenticatedAdmin = false;

export const setAuthenticatedAdmin = (value) => {
isAuthenticatedAdmin = value;
};

export const getAuthenticatedAdmin = () => {
return isAuthenticatedAdmin;
};
