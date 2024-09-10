import { ArweaveArConnectConnector, EthereumMetamaskConnector } from '../src';
describe('listData function', () => {
  jest.setTimeout(50000);
  it('should ', () => {
    const ethereumMetamaskConnector =new EthereumMetamaskConnector({});
    const arweaveArConnectConnector = new ArweaveArConnectConnector({});
    console.log(ethereumMetamaskConnector instanceof EthereumMetamaskConnector);
    console.log(arweaveArConnectConnector instanceof EthereumMetamaskConnector);
    console.log(arweaveArConnectConnector instanceof ArweaveArConnectConnector);
  });
});
