import * as StellarSDK from "@stellar/stellar-sdk";
import fs from "fs";

const server = new StellarSDK.rpc.Server(
    "https://soroban-testnet.stellar.org:443",
  );
  const sourceKeypair = StellarSDK.Keypair.fromSecret(process.env.ADMIN_SECRET_KEY ? process.env.ADMIN_SECRET_KEY : "");

async function uploadWasm(filePath) {
  const bytecode = fs.readFileSync(filePath);
  const account = await server.getAccount(sourceKeypair.publicKey());
  const operation = StellarSDK.Operation.uploadContractWasm({ wasm: bytecode });
  return await buildAndSendTransaction(account, operation);
}

async function deployContract(response, admin, tokenName, tokenSymb) {
  const account = await server.getAccount(sourceKeypair.publicKey());
  const constructorArgs = [
    StellarSDK.nativeToScVal(admin),
    StellarSDK.nativeToScVal(1000000000),
    StellarSDK.nativeToScVal(tokenName),
    StellarSDK.nativeToScVal(tokenSymb)
  ];
  const operation = StellarSDK.Operation.createCustomContract({
    wasmHash: response.returnValue.bytes(),
    address: StellarSDK.Address.fromString(sourceKeypair.publicKey()),
    salt: response.hash,
    ...constructorArgs
  });
  const responseDeploy = await buildAndSendTransaction(account, operation);
  const contractAddress = StellarSDK.StrKey.encodeContract(
    StellarSDK.Address.fromScAddress(
        // @ts-ignore
      responseDeploy.returnValue.address(),
    ).toBuffer(),
  );
  console.log(contractAddress);
}

async function buildAndSendTransaction(account, operations) {
  const transaction = new StellarSDK.TransactionBuilder(account, {
    fee: StellarSDK.BASE_FEE,
    networkPassphrase: StellarSDK.Networks.TESTNET,
  })
    .addOperation(operations)
    .setTimeout(30)
    .build();

  const tx = await server.prepareTransaction(transaction);
  tx.sign(sourceKeypair);

  console.log("Submitting transaction...");
  let response = await server.sendTransaction(tx);
  const hash = response.hash;
  console.log(`Transaction hash: ${hash}`);
  console.log("Awaiting confirmation...");

  while (true) {
            // @ts-ignore
    response = await server.getTransaction(hash);
            // @ts-ignore
    if (response.status !== "NOT_FOUND") {
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
        // @ts-ignore
  if (response.status === "SUCCESS") {
    console.log("Transaction successful.");
    return response;
  } else {
    console.log("Transaction failed.");
    throw new Error("Transaction failed");
  }
}


// const launchDeployment = async () => {
//       const wasmFilePath =
//         "../token/target/wasm32-unknown-unknown/release/soroban_token_contract.wasm"; 
//       try {
//         let uploadResponse = await uploadWasm(wasmFilePath);
//         await deployContract(uploadResponse);
//       } catch (error) {
//         console.error(error);
//       }
// }