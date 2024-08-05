export const generateUserErrorInfo = (user) => {
    return `One or more properties were incomplete or not valid.
    List of required properties:
    * first_name: needs to be a String, received ${typeof user.first_name}
    * last_name : needs to be a String, received ${typeof user.last_name}
    * email     : needs to be a String, received ${typeof user.email}
    * age       : needs to be a Number, received ${typeof user.age}
    * password  : needs to be a String, received ${typeof user.password}
    * username  : needs to be a String, received ${typeof user.username}`;
};

export const generateUserIdErrorInfo = (uid) => {
    return `One or more properties were incomplete or not valid.
    List of required properties:
    * user_id: must be a valid User ID, received '${uid}'.
    Explanation:
    The 'user_id' parameter must be a valid identifier for a user.
    Please make sure to provide a valid user ID.`;
};

export const generateLoginErrorInfo = (email, cause) => {
    return `Invalid login attempt.
    Cause: ${cause}
    * email: ${email ? `received '${email}'` : 'not provided'}
    * password: ${email ? 'provided' : 'not provided'}
    Please provide valid credentials.`;
};


export const generateProductErrorInfo = (product) => {
    return `One or more properties were incomplete or not valid.
    List of required properties:
    * title       : needs to be a String, received ${typeof product.title}
    * description : needs to be a String, received ${typeof product.description}
    * code        : needs to be a String, received ${typeof product.code}
    * price       : needs to be a Number, received ${typeof product.price}
    * stock       : needs to be a Number, received ${typeof product.stock}
    * category    : needs to be a String, received ${typeof product.category}`;
};

export const generateProductIdErrorInfo = (pid) => {
    return `One or more properties were incomplete or not valid.
    List of required properties:
    * product_id: must be a valid Product ID, received '${pid}'.
    Explanation:
    The 'product_id' parameter must be a valid identifier for a product.
    Please make sure to provide a valid product ID.`;
};

export const generateMessageError = (userData) => {
    return `One or more properties were incomplete or not valid.
    List of required properties and types:
    * user    : must be a valid user object, received ${typeof userData.user}
    * message : must be a string, received ${typeof userData.message}`;
};


export const generateCartIdErrorInfo = (cid) => {
    return `One or more properties were incomplete or not valid.
    List of required properties:
    * cart_id: must be a valid Cart ID, received '${cid}'.
    Explanation:
    The 'cart_id' parameter must be a valid identifier for a cart.
    Please make sure to provide a valid cart ID.`;
};