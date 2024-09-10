import Arweave from 'arweave';
import {StorageType, WalletWithType, SupportedSymbols, IConnector} from '../types/index';
import {getWalletFromConnector} from "../common/wallet-helper";

interface IBaseStorage {
  submitData(data: string | Uint8Array | ArrayBuffer, symbol: SupportedSymbols): Promise<string>;

  getData(transactionId: string): Promise<Uint8Array>;
}

const ARConfig = {
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
};

export default class BaseStorage implements IBaseStorage {
  storageType: StorageType;
  wallet: WalletWithType;
  arweave: Arweave;
  connector: IConnector;


  constructor(storageType: StorageType, connector: IConnector) {
    this.storageType = storageType;
    this.connector = connector;
    this.arweave = Arweave.init(ARConfig);
    this.wallet = getWalletFromConnector(connector);
  }

  async submitData(data: Uint8Array, symbol: SupportedSymbols): Promise<string> {
    return Promise.resolve('');
  }

  async getData(transactionId: string): Promise<Uint8Array> {
    return Promise.resolve(new Uint8Array());
  }
}