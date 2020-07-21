const UP_TO_DATE = "Up to date";

// ---------------------------------------------------------------------------------------
// errors

const TOKEN_EXPIRED_ERROR_NAME = "TokenExpiredError";

// ---------------------------------------------------------------------------------------
// token lifetimes

const ACCESS_TOKEN_LIFETIME = '5m';
const REFRESH_TOKEN_LIFETIME = '7d';
const RESET_PASSWORD_TOKEN_LIFETIME = '5m';
const VERIFY_USER_TOKEN_LIFETIME = '5m';

// ---------------------------------------------------------------------------------------
// relative paths

const POST_IMAGES_DIR = './media/post_image';
const USER_DP_DIR = './media/user_dp';
const MEDIA_DIR = "./media";

// ---------------------------------------------------------------------------------------
// client urls

const CLIENT_BASE = "http://localhost:8080";
const RESET_PASSWORD_CLIENT_URL = `${ CLIENT_BASE }/reset_password`;
const VERIFY_USER_CLIENT_URL = `${ CLIENT_BASE }/verify_user`;

// ---------------------------------------------------------------------------------------
// lengths

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 20;

/**
 * length of the shortDescription virtual field on post model
 */
const POST_SHORT_DESCRIPTION_LENGTH = 30;

const USER_BIO_MAX_LENGTH = 150;

const USER_FIRSTNAME_MIN_LENGTH = 3;

const COMMENT_DESC_MAX_CHAR = 300;

// ---------------------------------------------------------------------------------------
// messages

const PASSWORD_MIN_LENGTH_MSG = `Length of password should be greater than or equal to ${ PASSWORD_MIN_LENGTH }.`;

// ---------------------------------------------------------------------------------------
// exports

export {
    UP_TO_DATE,
    ACCESS_TOKEN_LIFETIME,
    REFRESH_TOKEN_LIFETIME,
    RESET_PASSWORD_TOKEN_LIFETIME,
    POST_IMAGES_DIR,
    USER_DP_DIR,
    MEDIA_DIR,
    POST_SHORT_DESCRIPTION_LENGTH,
    RESET_PASSWORD_CLIENT_URL,
    PASSWORD_MIN_LENGTH,
    PASSWORD_MAX_LENGTH,
    USER_BIO_MAX_LENGTH,
    USER_FIRSTNAME_MIN_LENGTH,
    COMMENT_DESC_MAX_CHAR,
    PASSWORD_MIN_LENGTH_MSG,
    TOKEN_EXPIRED_ERROR_NAME,
    VERIFY_USER_CLIENT_URL,
    VERIFY_USER_TOKEN_LIFETIME
};