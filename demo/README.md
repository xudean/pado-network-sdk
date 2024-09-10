# Pado Network SDK Demo
## Overview

Here, we will introduce the steps for using the [PADO NETWORK SDK](https://github.com/pado-labs/pado-network-sdk/) with examples.

## Preparations
- **Node.js >= 18**

  **MetaMask** (if the chain is `ethereum` or `holesky`)

  - Ensure you have enough `ETH` in your wallet for gas and computation fees.
  - everypay
    - Ensure you have enough `ETH` in EverPay to cover storage fees. You can refer to the [SDK Documentation](https://github.com/pado-labs/pado-network-sdk?tab=readme-ov-file#instantiate-client) for more information.

  **ArConnect** (if the chain is `ao`)

  - Ensure you have enough `wAR` in your wallet.

## How to run demo
- clone the repo
```shell
git clone https://github.com/pado-labs/pado-network-sdk.git
cd  pado-network-sdk
cd demo
```
- install packages 
```shell
npm install
```
- run demo
```shell
npm run dev
```
- The demo will be served at http://localhost:5173.
## Usage
### Installation

```shell
npm install --save @padolabs/pado-network-sdk
```

### Init Client

####  chain is `ao`

Make sure that you have installed the [Arconnect](https://chromewebstore.google.com/detail/arconnect/einnioafmpimabjcddiinlhmijaionap) in chrome and that you have enough AR

```javascript
const wallet = window.arweaveWallet;
const padoNetworkClient = new PadoNetworkContractClient('ao', wallet, 'arweave');
```

#### chain is `ethereum` or `holesky`

Make sure you have installed `MetaMask` in Chrome and have enough `ETH` to cover computation and gas fees, as well as enough `ETH` in `EverPay` to pay for storage.

```javascript
const wallet = window.ethereum;
const padoNetworkClient = new PadoNetworkContractClient('holesky', wallet, 'arseeding');
```

### Data Provider

#### Upload Data

##### prepare data

```javascript
// data in Uint8Array format
const data = new Uint8Array(fileContent);
//for example
//const data = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
//or read from file
```

##### tag for the data

```javascript
// tag for the data, you can save filename and subffix here
const dataTag = {'name': 'test','subffix':'txt'};
```

##### price for the data

###### if chainName is `holesky` or `ethereum`

```javascript
//this means price of the data is 0.0000001ETH
const priceInfo = {
    price: 1_000_000_000_000,
    symbol: 'ETH'
};
```

###### if chainName is `ao` 

> ```
> NOTE: Currently, only wAR(the Wrapped AR in AO) is supported. In the example, 200000000 means 0.0002 wAR.
> ```

```javascript
// price for the data
const priceInfo = {
    price: '200000000',
    symbol: 'wAR'
};
```

###### dataPermissions
```javascript
//The addresses of the checkers. If you have no checkers, you can pass an empty array.
const dataPermissions=[]
```

###### encryption schema

```javascript
//Parameters required for data encryption
//n: Number of nodes involved in the computing
//t: Minimum number of nodes required to report task results
//Make sure that, n>=t>1
//Default is: {t:2,n:3}
const schema = {
  t:2,
  n:3
}
```

######  upload data

<a id="upload_data"></a>

```javascript
const dataId = await padoNetworkClient.uploadData(data, dataTag, priceInfo, dataPermissions, schema);
```

If everything is fine and there are no exceptions, you will get the <a id='data_id'>`dataId`</a>, and you can query the data you uploaded based on that ID.

#### Retrieve the withdrawable balance and proceed with the withdrawal.

When data is purchased, the data provider is able to receive a token reward, you can check the withdrawable balance and withdraw it in the following ways.

>  ***Note:*** 
>
> Currently,  `getBalance` and `withdrawToken` are only supported on the ***Holesky*** and ***Ethereum*** chains is supported, and only ***ETH*** is supported.

##### Get balance

```javascript
const balance = await padoNetworkClient.getBalance(address, 'ETH');
console.log(balance.locked.toString());
console.log(balance.free.toString());
const transaction = await padoNetworkClient.withdrawToken(metamaskAddress, 'ETH', balance.free);
console.log(transaction);
```




### Data User
#### Generate key pair

You should generates a pair of public and secret keys for encryption and decryption.

```javascript
import {Utils} from "@padolabs/pado-network-sdk";

const keyInfo = await new Utils().generateKey();
```

#### Submit task

Here, you need a [dataId](#data_id), which is returned by the Data Provider through the [`uploadData`](#upload_data).

```javascript
const taskId = await padoNetworkClient.submitTask(TaskType.DATA_SHARING, userDataId, keyInfo.pk)
```

This will return a task id which used for getting the result.


#### Get task result

```javascript
//If you don't get the result after the timeout(default 60000 milesconds), a timeout error will be returned and you can re-call this method until you get the result.
//Ensure that the keyInfo is the same object as the parameter passed to submitTask
const data = await padoNetworkClient.getTaskResult(taskId, keyInfo.sk);
```

If nothing goes wrong, you will get the `data` of the Data Provider. The data type returned is Uint8Array, you can do further processing.

