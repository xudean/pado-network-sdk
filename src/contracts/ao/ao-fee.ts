import { dryrun } from '@permaweb/aoconnect';
import { TASKS_PROCESS_ID } from '../../config';
import type { Address, Uint256 } from 'types';


export  class AoFee {
  constructor() {
  }

  /**
   * Asynchronously retrieves a completed task by its ID within a specified timeout.
   *
   * @param {string} taskId - The unique identifier of the task to retrieve.
   * @param {number} timeout - The maximum time in milliseconds to wait for the task before timing out.
   * @returns {Promise<string>} A promise that resolves with the task as a string or rejects with a 'timeout' message.
   */
  async getComputationPrice(symbol: string) {
    const { Messages } = await dryrun({
      process: TASKS_PROCESS_ID,
      tags: [
        { name: 'Action', value: 'ComputationPrice' },
        { name: 'PriceSymbol', value: symbol }
      ]
    });
    const res = Messages[0].Data;
    return res;
  }

  /**
   * @notice Get balance of token which can withdraw.
   * @param userAddress user wallet address
   * @param tokenSymbol token symbol
   */
  async getBalance(userAddress: Address, tokenSymbol: string) {
    //not supported, return 0 default
    return 0;
  }

  /**
   * withdraw token
   * @param userAddress
   * @param tokenSymbol
   * @param amount
   */
  async withdrawToken(userAddress: Address, tokenSymbol: string, amount: Uint256) {
    //empty
    return;
  }
}