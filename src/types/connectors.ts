import { ConnectorType, IConnector } from './index';

export class EthereumMetamaskConnector implements IConnector {
  wallet: any;

  constructor(wallet: any) {
    this.wallet = wallet;
  }

  getConnectType(): ConnectorType {
    return ConnectorType.ETHEREUM_METAMASK_CONNECTOR;
  }
}

export class EthereumPrivateKeyConnector implements IConnector {
  privateKey: string;
  rpcUrl: string;

  constructor(privateKey: string, rpcUrl: string) {
    this.privateKey = privateKey;
    this.rpcUrl = rpcUrl;
  }

  getConnectType(): ConnectorType {
    return ConnectorType.ETHEREUM_PRIVATE_KEY_CONNECTOR;
  }
}

export class ArweaveArConnectConnector implements IConnector {
  wallet: any;

  constructor(wallet: any) {
    this.wallet = wallet;
  }

  getConnectType(): ConnectorType {
    return ConnectorType.ARWEAVE_ARCONNECT_CONNECTOR;
  }
}

export class  ArweaveKeystoreConnector implements IConnector {
  keystore: any;

  constructor(keystore: any) {
    this.keystore = keystore;
  }

  getConnectType(): ConnectorType {
    return ConnectorType.ARWEAVE_KEYSTORE_CONNECTOR;
  }
}
