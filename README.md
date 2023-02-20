# EIP1271 Module

A simple library to validate EIP1271 signatures.

### Usage

Simple usage

```ts
import ethers from "ethers";
import { isValidEip1271Signature } from "@etherspot/eip1271-module";
import { MNEMONIC } from "./constants";

const checkSig = async () => {
  const provider = new ethers.providers.JsonRpcProvider(RPC.polygon);
  const signer = ethers.Wallet.fromMnemonic(MNEMONIC);
  const data = "0x123456";

  const walletAddress = signer.address; // The signer address to verify the signature against
  const signature = await signer.signMessage(ethers.utils.arrayify(hexxed)); // The signature to verify as a hex string
  const hash = ethers.utils.hashMessage(ethers.utils.arrayify(hexxed)); // Hashed data used for the signature to verify. The dApp will need to pre-compute this as no hashing will occur in the function, and this will be directly used in isValidEip1271Signature

  const isValidSig = await isValidEip1271Signature(
    walletAddress,
    hash,
    signature
  );

  console.log("is signature valid:", isValid);
};
```
