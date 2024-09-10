import Utils from '../common/utils';
import PadoNetworkStorageClient from '../pado-network-storage-client';
import { ConnectorType, IConnector, StorageType, Wallets, WalletWithType } from '../types/index';
import {getWalletFromConnector} from '../common/wallet-helper';

interface IBaseContract {
  // uploadData(data: string | Uint8Array | ArrayBuffer, wallet: any): Promise<string>;
  // getDataById(dataId: string): Promise<Uint8Array>;
  // getDataList(): Promise<Uint8Array>;
  // submitTask(): Promise<string>;
  // getTaskResult(): Promise<string>;
}

export default class BaseContract extends Utils implements IBaseContract {
  storageType: StorageType;
  storage: any;
  wallet: any;
  connector: IConnector;
  chainName: any;

  constructor(chainName: any, storageType: StorageType, connector: IConnector) {
    super();
    this.chainName = chainName;
    this.storage = new PadoNetworkStorageClient(storageType, getWalletFromConnector(connector));
    this.storageType = this.storage.storageType;
    this.connector = connector;
  }

}
