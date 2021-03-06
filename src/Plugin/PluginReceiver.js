import {appLogoutLocal, getAppSession, getLocalUsername, getLocalUsernameHash} from "../reducers/actions";
import sessionContract from "../Lib/get-login/sessionContract";

export default class PluginReceiver {
    /**
     *
     * @type {Web3|null}
     */
    web3 = null;
    appId = null;
    accessToken = null;

    constructor(web3) {
        this.web3 = web3;
        this.allowedMethods = [
            'getUserInfo',
            'callContractMethod',
            'sendTransaction',
            'logout',
        ];
    }

    getWeb3() {
        return this.web3;
    }

    setWeb3(web3) {
        this.web3 = web3;
    }

    _listener = (event) => {
        //console.log(event);
        if (typeof event.data !== 'object' || event.data.app !== 'get_login') {
            return;
        }

        this.appId = event.data.appId;
        this.accessToken = event.data.accessToken;

        // todo check access_token and appId
        if (!event.data.method || !this.allowedMethods.includes(event.data.method)) {
            event.source.postMessage({
                id: event.data.id,
                error: 'Method not allowed'
            }, event.origin);
            return;
        }

        this[event.data.method](event.data.params)
            .then(result => {
                event.source.postMessage({
                    id: event.data.id,
                    result
                }, event.origin);
            })
            .catch(e => {
                event.source.postMessage({
                    id: event.data.id,
                    error: 'Error on execution: ' + e.message,
                }, event.origin);
            });
    };

    async getUserInfo() {
        return {
            username: getLocalUsername(),
            usernameHash: getLocalUsernameHash()
        };
    }

    async sendTransaction(data) {
        const {abi, address, method, txParams, params} = data;
        const app = await getAppSession(this.appId);
        if (!app) {
            throw new Error('Access token not found');
        }
        /**
         *
         * @type {sessionContract}
         */
            // todo move 'rinkeby' to global scope
            // const mainContract = new contract(this.web3, 'rinkeby', address, abi);
        const mainContract = new sessionContract({web3: this.web3, network: 'rinkeby', address, abi});
        await mainContract.setPrivateKey(app.privateKey);

        return await mainContract.sendTx({method, params: txParams, settings: params});
    }

    async callContractMethod({abi, address, method, params}) {
        const contract = new this.web3.eth.Contract(abi, address);

        return contract.methods[method](params).call();
    }

    init(clientId = null, accessToken = null) {
        const params = new URLSearchParams(window.location.search);

        if (!clientId) {
            clientId = params.get('client_id');
        }

        if (!clientId) {
            throw new Error('Incorrect client_id');
        }

        if (!accessToken) {
            accessToken = params.get('access_token');
        }

        if (!accessToken) {
            throw new Error('Incorrect accessToken');
        }

        window.addEventListener('message', this._listener);
        getAppSession(clientId)
            .then(info => {
                console.log(info);
                let is_client_allowed = false;
                let result = {
                    type: 'get_login_init',
                    client_id: clientId,
                };

                if (info && info.transactionHash === accessToken) {
                    result.access_token = info.transactionHash;
                    is_client_allowed = true;
                }

                result.is_client_allowed = is_client_allowed;

                window.parent.postMessage(result, '*');
            });
    }

    async logout() {
        return await appLogoutLocal(this.appId)
    }
}
