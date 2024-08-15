# pado-ao-sdk

## Overview

The pado-ao-sdk helps developers use PADO Network, which provides trustless and confidential computing capabilities. You can learn more about [PADO Network](https://github.com/pado-labs/pado-network).

## Quick Start

- Demos

## Usage

### Installation

#### Install package by npm

```shell
npm install --save @padolabs/pado-ao-sdk
```

#### import wasm

Introduce `lhe.js` into the HTML file as follows:

```html
<!--    When the JS is introduced, the WASM will automatically load. -->
<script type="text/javascript" src="https://pado-online.s3.ap-northeast-1.amazonaws.com/resources/v2/lhe.js"></script>

```

The WASM version and SDK version have a strict correspondence. The specific relationship is as follows:

| Wasm Version | SDK Version           | Wasm Link                                                    |
| ------------ | --------------------- | ------------------------------------------------------------ |
| v2           | >=0.2.0               | https://pado-online.s3.ap-northeast-1.amazonaws.com/resources/v2/lhe.js |
| V1           | 0.0.1<= version<0.2.0 | https://pado-online.s3.ap-northeast-1.amazonaws.com/resources/v1/lhe.js |

If you meet the following error in your browser's console:

```shell
_stream_writable.js:57 Uncaught ReferenceError: process is not defined
    at node_modules/readable-stream/lib/_stream_writable.js (_stream_writable.js:57:18)
    at __require2 (chunk-BYPFWIQ6.js?v=4d6312bd:19:50)
```

You can refer to project using vite. [link](https://github.com/pado-labs/pado-ao-demo/blob/main/vite.config.ts)

### Getting Started
#### Utils

##### Generate Key

<a id="generate_key"></a>

Generate public-private key pairs for submitting tasks and retrieving task results.

```
generateKey(param_obj?: any): Promise<KeyInfo>;
```

- Example

```javascript
import {Utils} from "@padolabs/pado-ao-sdk";

//The generated key pair will be used for submitTask() and `getTaskResult()
const keyInfo = await new Utils().generateKey();
```



#### PadoNetworkContractClient

##### Import Client

```javascript
import {PadoNetworkContractClient} from '@padolabs/pado-ao-sdk'
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

> By default, `StorageType` is `ARWEAVE` when `chainName` is `ao`, and `ARSEEDING` when `chainName` is `holesky` or `ethereum`.

| chainName | storageType | Wallet               |
| --------- | ----------- | -------------------- |
| ao        | ARWEAVE     | window.arweaveWallet |
| holesky   | ARSEEDING   | window.ethereum      |
| ethereum  | ARSEEDING   | window.ethereum      |

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



##### Submit Task

<a id="submit_task"></a>

Submit a task to the PADO Network. You must pay both the data fee corresponding to the `data provider` and the computing fee for the `workers`.

```javascript
submitTask(taskType: TaskType, dataId: string, publicKey: string): Promise<string>;
```

- **Parameters**
  - **taskType:** The type of the task. Just support `TaskType.DATA_SHARING` now. Leran more about [TaskType](#task_type_enum)
  
  - **dataId:** The `dataId` returned by the `uploadData` interface.
  
  - **publicKey:** Public key used to encrypt task results
  
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
getTaskResult(taskId: string, privateKey: string, timeout?: number): Promise<Uint8Array>;
```

- **Parameters**
  - **taskId**: taskId returned by `submitTask` 
  - **privateKey**: The private key is used to decrypt the task result
  - **timeout(optional)**: The timeout in milliseconds for getting the result, if you wait longer than this time a `timeout` exception will be thrown. ***Default  10000(10 seconds).***
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

> You need to make sure that the private key used and the public key used by the [submitTask](#) are part of the same key pair. keyInfo is generated at [Generate Key](#generate_key)

#### Type And Enum

##### KeyInfo

<a id="key_info_enum"></a>

```javascript
type KeyInfo = {
		//publick key
    pk: string;
    //private key
    sk: string;
};
```

##### ChainName

<a id="chain_name_enum"></a>

```javascript
type ChainName = 'ao' | 'holesky' | 'ethereum';
```

##### StorageType

<a id="storage_type_enum"></a>

```javascript
enum StorageType {
    ARWEAVE = "arweave",
    ARSEEDING = "arseeding"
}
```

##### PriceInfo 

<a id="price_info_enum"></a>

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

##### TaskType

<a id="task_type_enum"></a>

```javascript
export enum TaskType{
  DATA_SHARING = 'dataSharing'
}
```
