import { Horizon } from '@stellar/stellar-sdk';
import { AddressBook } from '../utils/address_book.ts';
import { airdropAccount, deployContract, installContract} from '../utils/contract.ts';
import { config } from '../utils/env_config.ts';

const network = "standalone";
const loadedConfig = config(network);
const addressBook = AddressBook.loadFromFile(network,loadedConfig);
const contracts_to_deploy = ["soroban_token_contract"]

export async function deployContracts(admin: string, tokenName: string, tokenSymb: string) {

  await airdropAccount(loadedConfig.admin);
  // if (network === "standalone") await loadedConfig.initializeChildAccounts();

  let account = await loadedConfig.horizonRpc.loadAccount(loadedConfig.admin.publicKey())
  let balance = account.balances.filter((asset) => asset.asset_type === 'native')[0].balance
  console.log('Current Admin account balance:', balance);
  
  console.log('-------------------------------------------------------');
  console.log('Deploying Contracts');
  console.log('-------------------------------------------------------');
  for (var contract_name of contracts_to_deploy) {
    console.log(`Deploying ${contract_name}: `)
    await installContract(contract_name, addressBook, loadedConfig.admin);
    let contractId = await deployContract(contract_name,contract_name, addressBook, loadedConfig.admin, admin, tokenName, tokenSymb)
    
    console.log(`Contract ID of ${contract_name} is ${contractId}\n\n`)
  }
  addressBook.writeToFile();
}


// try {
//   await deployContracts(addressBook, contracts_to_deploy);
// }
// catch (e) {
//   console.error(e)
// }
// addressBook.writeToFile();
