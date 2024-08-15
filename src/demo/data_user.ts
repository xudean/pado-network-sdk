import { readFileSync } from 'node:fs';
import { exit } from 'node:process';
import './proxy.js';
import PadoNetworkContractClient from 'pado-network-contract-client/index';
import { StorageType, TaskType } from '../types';
import Utils from 'common/utils';

/**
 * Usage:
 *   node /path/to/data_user.js <your-wallet-path> <data-id>
 */
async function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.log('args: <walletpath> <dataId>');
    exit(2);
  }
  let walletpath = args[0];
  let dataId = args[1];
  console.log(`walletpath=${walletpath}`);
  console.log(`    dataId=${dataId}`);

  // load your arweave wallet
  const wallet = JSON.parse(readFileSync(walletpath).toString());
  const wallets = {
    wallet: wallet,
    storageWallet: wallet
  };

  const keyInfo = await new Utils().generateKey();
  const padoNetworkClient = new PadoNetworkContractClient('ao', StorageType.ARWEAVE, wallet);
  // submit a task to ao process
  const taskId = await padoNetworkClient.submitTask(TaskType.DATA_SHARING,dataId,keyInfo.pk);
  console.log(`TASKID=${taskId}`);
  // timeout is 10s
  const timeout = 10 * 1000;
  // get the result (If you want to do a local test, refer to the README to initialize arweave and then pass it to getResult)
  const [err, data] = await padoNetworkClient.getTaskResult(taskId,keyInfo.sk, timeout).then(data => [null, data]).catch((err: any) => [err, null]);
  console.log(`err=${err}`);
  console.log(`data=${data}`);

  // You can also easily combine submitTask and getResult by calling submitTaskAndGetResult, as follows:
  /*{
    const [err, data] = await submitTaskAndGetResult(dataId, key.pk, key.sk, wallet, arweave).then(data => [null, data]).catch(err => [err, null]);
    console.log(`err=${err}`);
    console.log(`data=${data}`);
  }*/
}

main();
