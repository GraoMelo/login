export const LOG_PREFIX = 'get_login_';
export const LOG_SIGN_IN_START = 'sign_in_start';
export const LOG_SIGN_IN_COMPLETE = 'sign_in_complete';
export const LOG_SIGN_UP_START = 'sign_up_start';
export const LOG_SIGN_UP_COMPLETE = 'sign_up_complete';

export const SIGN_IN_LOGIN_PASSWORD = 'login_password';
export const SIGN_IN_BROWSER_DATA = 'sign_in_browser_data';
export const SIGN_IN_WEB3 = 'sign_in_web3';
export const SIGN_IN_TREZOR = 'sign_in_trezor';

export const SIGN_IN_RESULT_SUCCESS = 'success';
export const SIGN_IN_RESULT_ERROR = 'error';
export const SIGN_IN_ERROR_METHOD_NOT_SUPPORTED = 'Method ot supported';

export const SIGN_UP_INVITE = 'sign_up_invite';
export const SIGN_UP_WEB3 = 'sign_up_web3';
export const SIGN_UP_TREZOR = 'sign_up_trezor';

export const SIGN_UP_RESULT_SUCCESS = 'success';
export const SIGN_UP_RESULT_ERROR = 'error';
export const SIGN_UP_ERROR_METHOD_NOT_SUPPORTED = 'Method ot supported';

export default class GetLogin {
    constructor() {
        this.logger = null;
    }

    setLogger(logger) {
        this.logger = logger;
    }

    getLogger() {
        return this.logger;
    }

    log(type, data = {}) {
        if (this.logger) {
            this.logger.log(LOG_PREFIX + type, data);
        }
    }

    async createInvite() {

    }

    /**
     * Sign in user
     * @param method
     * @param data
     * @returns {Promise<void>}
     */
    async signIn(method, data = {}) {
        this.log(LOG_SIGN_IN_START, {method});
        let returnResult = {};
        const setResult = (result, text = '') => {
            returnResult = {result, text};
        };

        setResult(SIGN_IN_RESULT_ERROR, SIGN_IN_ERROR_METHOD_NOT_SUPPORTED);
        switch (method) {
            case SIGN_IN_LOGIN_PASSWORD:
                setResult(SIGN_IN_RESULT_SUCCESS);

                break;
            case SIGN_IN_BROWSER_DATA:
                setResult(SIGN_IN_RESULT_SUCCESS);

                break;
            /*case SIGN_IN_METAMASK:
                break;
            case SIGN_IN_TREZOR:
                break;*/
            default:
                break;
        }

        this.log(LOG_SIGN_IN_COMPLETE, returnResult);

        return returnResult;
    }

    async signUp(method, username, password = '', invite = '') {
        this.log(LOG_SIGN_UP_START, {method});
        let returnResult = {};
        const setResult = (result, text = '') => {
            returnResult = {result, text};
        };

        setResult(SIGN_UP_RESULT_ERROR, SIGN_UP_ERROR_METHOD_NOT_SUPPORTED);
        switch (method) {
            case SIGN_UP_INVITE:
                setResult(SIGN_UP_RESULT_SUCCESS);

                break;
            case SIGN_UP_TREZOR:
                setResult(SIGN_UP_RESULT_SUCCESS);

                break;
            default:
                break;
        }

        this.log(LOG_SIGN_UP_COMPLETE, returnResult);

        return returnResult;
    }
}