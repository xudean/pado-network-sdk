import {ConnectorType, IConnector} from '../types';
import {
    ArweaveArConnectConnector,
    ArweaveKeystoreConnector,
    EthereumMetamaskConnector,
    EthereumPrivateKeyConnector
} from '../types/connectors';
import {ethers} from 'ethers';

export const getWalletFromConnector = (connector: IConnector)=> {
    switch (connector.getConnectType()) {
        case ConnectorType.ARWEAVE_ARCONNECT_CONNECTOR:
            return (<ArweaveArConnectConnector>connector).wallet;
        case ConnectorType.ARWEAVE_KEYSTORE_CONNECTOR:
            return JSON.parse((<ArweaveKeystoreConnector>connector).keystore);
        case ConnectorType.ETHEREUM_METAMASK_CONNECTOR:
            return (<EthereumMetamaskConnector>connector).wallet;
        case ConnectorType.ETHEREUM_PRIVATE_KEY_CONNECTOR:
            const privateKey = (<EthereumPrivateKeyConnector>connector).privateKey;
            return new ethers.Wallet(privateKey);
        default:
            throw new Error('Unsupported connector type');
    }
};

