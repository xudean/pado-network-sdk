# pado-network-sdk

## Overview

The pado-network-sdk helps developers use PADO Network, which provides trustless and confidential computing capabilities. You can learn more about [PADO Network](https://github.com/pado-labs/pado-network).

## Quick Start

- [Demos](https://github.com/pado-labs/pado-ao-sdk/tree/feature/v2/demo)

## Usage

### Installation

#### Install package by npm

```shell
npm install --save @padolabs/pado-network-sdk
```

#### import wasm

Introduce `lhe.js` into the HTML file as follows:

```html
<!--    When the JS is introduced, the WASM will automatically load. -->
<script type="text/javascript" src="https://pado-online.s3.ap-northeast-1.amazonaws.com/resources/v2/lhe.js"></script>

```

If you meet the following error in your browser's console:

```shell
_stream_writable.js:57 Uncaught ReferenceError: process is not defined
    at node_modules/readable-stream/lib/_stream_writable.js (_stream_writable.js:57:18)
    at __require2 (chunk-BYPFWIQ6.js?v=4d6312bd:19:50)
```

You can refer to project using vite. [link](https://github.com/pado-labs/pado-ao-demo/blob/main/vite.config.ts)

### Getting Started
#### Utils

##### Generate Key <a id="generate_key"></a>

Generate public-private key pairs for submitting tasks and retrieving task results.

```
generateKey(param_obj?: any): Promise<KeyInfo>;
```

- Example

```javascript
import {Utils} from "@padolabs/pado-network-sdk";

//The generated key pair will be used for submitTask() and `getTaskResult()
const keyInfo = await new Utils().generateKey();
```



#### PadoNetworkContractClient

##### Import Client

```javascript
import {PadoNetworkContractClient} from '@padolabs/pado-network-sdk'
```

##### Instantiate Client

The constructor for the `PadoNetworkContractClient`.

```javascript
  constructor(chainName: ChainName, wallet: any, storageType: StorageType = StorageType.ARSEEDING);
```

**Parameters**

- **chainName:** The blockchain the client wants to connect to. Learn more about [ChainName](#chain_name_enum)
- **wallet:** The wallet that interacts with the blockchain.
- **storageType (optional):** The storage option the client wants to use for data. The ***default*** is `StorageType.ARSEEDING`. Learn more about [StorageType](#storage_type_enum)

***Note:***

> - By default, `StorageType` is `ARWEAVE` when `chainName` is `ao`, and `ARSEEDING` when `chainName` is `holesky` or `ethereum`.
>
> - When using **ARSEEDING** as storage, user need to ***deposit ETH*** to ***EverPay*** to cover storage, computation, data, and other costs. You can learn more about EverPay at:
>   - **Homepage:** https://everpay.io/
>   - **Docs:** https://docs.everpay.io/en/docs/guide/overview
>   - **Deposit:** https://app.everpay.io/deposit/ethereum-eth-0x0000000000000000000000000000000000000000
> - When using **ARWEAVE** as storage, user will pay AR to cover storage, computation, data, and other costs by ArConnect.

| chainName | storageType | Wallet                          |
| --------- | ----------- | ------------------------------- |
| ao        | ARWEAVE     | window.arweaveWallet(ArConnect) |
| holesky   | ARSEEDING   | window.ethereum(metamask)       |
| ethereum  | ARSEEDING   | window.ethereum(metamask)       |

- **Returns**

- **Example **

```javascript
const chainName = 'holesky';
const storageType = StorageType.ARSEEDING;
//if chainName is holesky or ethereum, wallet should be window.ethereum;
//if chainName is ao, wallet should be window.arweaveWallet;
const wallet = window.ethereum;
const padoNetworkClient = new PadoNetworkContractClient(chainName, wallet, storageType);
```



##### Upload Data

Uploading data to the storage chain.

```
uploadData(data: Uint8Array, dataTag: CommonObject, priceInfo: PriceInfo, encryptionSchema?: EncryptionSchema): Promise<string>;
```

- **Parameters**

  - **data:** The data to be uploaded, which should be of type `Uint8Array`.

  - **dataTag:** The data's metadata object. **Note: Please use an object format, not a string.**

  - **priceInfo:** The data price symbol. Leran more bout [PriceInfo](#price_info_enum)  
    Different `chainName` values correspond to different symbols.
  
    | chainName | symbol                    | minimum price(1 means) |
    | --------- | ------------------------- | ---------------------- |
    | ao        | wAR(the Wrapped AR in AO) | 0.000000000001 wAR     |
    | holesky   | ETH                       | 1 wei                  |
    | ethereum  | ETH                       | 1 wei                  |
  

  - **encryptionSchema(optional)**: Parameters used by the algorithm. The default is:
  
    ```json
    {
      t: '2',
      n: '3'
    }
    ```
  
- **Returns**
  - **`dataId`**: A unique identifier for the data.
  
- **Example**

```javascript
//padoNetworkClient is the object instantiated in the previous section 
const data = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
const dataTag = { 'filename': 'testFileName' };
const priceInfo = { price: '200000000', symbol: 'wAR' };

const dataId = await padoNetworkClient.uploadData(data, dataTag, priceInfo);
```



##### Submit Task <a id="submit_task"></a>

Submit a task to the PADO Network. You must pay both the data fee corresponding to the `data provider` and the computing fee for the `workers`.

```javascript
submitTask(taskType: TaskType, dataId: string, dataUserPk: string): Promise<string>;
```

- **Parameters**
  - **taskType:** The type of the task. Just support `TaskType.DATA_SHARING` now. Leran more about [TaskType](#task_type_enum)
  
  - **dataId:** The `dataId` returned by the `uploadData` interface.
  
  - **dataUserPk:** The The user's public key generated by generateKey of Utils..
  
- **Returns**
  - **`taskId`**: The ID of the task.
- **Example**

```javascript
const userDataId = 'returned by the uploadData';

const taskId = await padoNetworkClient.submitTask(TaskType.DATA_SHARING, userDataId, keyInfo.pk);
```

***Note:***

> keyInfo is generated at [Generate Key](#generate_key)

##### Get Task Result

Get the result of the task.

```javascript
getTaskResult(taskId: string, dataUserSk: string, timeout?: number): Promise<Uint8Array>;
```

- **Parameters**
  - **taskId**: taskId returned by `submitTask` 
  - **dataUserSk**: The user's secret key generated by generateKey of Utils
  - **timeout(optional)**: The timeout in milliseconds for getting the result, if you wait longer than this time a `timeout` exception will be thrown. ***Default  60000(60 seconds).***
- **Returns**
  - **Uint8Array**: The result of the task in plain text.
- **Example**

```javascript
const taskId = 'returned by the getTaskResult';
const timeout = 20000;//milliseconds
//The format of data is Uint8Array, you should handle this data additionally, such as saving it to a file etc.
const data = await padoNetworkClient.getTaskResult(taskId, keyInfo.sk, timeout);

```

***Note***

> You need to make sure that the dataUserSk used and the dataUserPk used by the [submitTask](#submit_task) are part of the same key pair. keyInfo is generated at [Generate Key](#generate_key)

##### Get balance can withdraw

Get the balance of your wallet that can be withdrawn

```
getBalance(userAddress: Address, tokenSymbol: string): Promise<Balance>;
```

- **Parameters**
  - **userAddress**: Address to search
  - **tokenSymbol**:  What token to search for. Now is `ETH`
- **Returns**
  - **Balance**: The token of the address. Leran more about [Balance](#balance_info)
- **Example**

```javascript
const balance = await padoNetworkClient.getBalance(address, 'ETH');
console.log(balance.locked.toString());
//The amount of free can be withdrawn
console.log(balance.free.toString());
```



#####  Withdraw token

Withdraw token.

```typescript
withdrawToken(toAddress: Address, tokenSymbol: string, amount: Uint256): Promise<Transaction>;
```

- **Parameters**
  - **toAddress**: Address to receive token
  - **tokenSymbol**:  Which token to withdraw. Now is `ETH`
  - **amoun**: The amount you want to withdraw needs to be less than `free` above.
- **Returns**
  - **Transaction**: Transaction infomation.
- **Example**

```javascript
const amount = balance.free;
debugger
const transaction = await padoNetworkClient.withdrawToken(address, 'ETH', amount);
console.log(transaction);
```



#### Type And Enum

##### KeyInfo <a id="key_info_enum"></a>

```javascript
type KeyInfo = {
		//publick key
    pk: string;
    //private key
    sk: string;
};
```

##### ChainName <a id="chain_name_enum"></a>

```javascript
type ChainName = 'ao' | 'holesky' | 'ethereum';
```

##### StorageType <a id="storage_type_enum"></a>

```javascript
enum StorageType {
    ARWEAVE = "arweave",
    ARSEEDING = "arseeding"
}
```

##### PriceInfo  <a id="price_info_enum"></a>

```javascript
/**
 * Price of data
 * if symbol is 'wAR'(chainName is ao), a price of 1 means that the data price is 0.000000000001 wAR.
 * if symbol is 'ETH'(chainName is holesky or ethereum)，a price of 1 means that the data price is 1wei
 * price: The price of data
 * symbol: The token symbol of price
 */
interface PriceInfo {
    price: string;
    symbol: string;
}
```

##### TaskType <a id="task_type_enum"></a>

```javascript
enum TaskType{
  DATA_SHARING = 'dataSharing'
}
```

#### Balance <a id="balance_info"></a>

```javascript
type Balance = {
  free: Uint256;
  locked: Uint256;
}
```
