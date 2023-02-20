import "dotenv/config";
import { ethers, utils, providers, ContractInterface, BytesLike } from "ethers";
import { Hexable } from "ethers/lib/utils";

import { abiEip1271Json, abiEip1271OldJson } from "@constants/abi";
import { NetworkNames, supportedNetworks } from "@constants/chain-constants";

const isCaseInsensitiveMatch = (val1: string, val2: string) => val1.toLowerCase() === val2.toLowerCase();

const createProvider = (rpcUrl: string) => {
  return new ethers.providers.JsonRpcProvider(rpcUrl);
};

const checkSignature = async (
  walletAddress: string,
  data: number | BytesLike | Hexable,
  signature: string,
  provider: providers.Provider,
  network: string = "",
  abi: ContractInterface = abiEip1271Json.abi,
  magicValue: string = abiEip1271Json.magicValue
): Promise<boolean> => {
  let returnedValue;
  try {
    returnedValue = await new ethers.Contract(walletAddress, abi, provider).isValidSignature(
      utils.arrayify(data),
      signature
    );
  } catch (e) {
    if (magicValue === abiEip1271Json.magicValue)
      return await checkSignature(
        walletAddress,
        data,
        signature,
        provider,
        network,
        abiEip1271OldJson.abi,
        abiEip1271OldJson.magicValue
      );
  }

  return returnedValue && isCaseInsensitiveMatch(returnedValue, magicValue);
};

type INetworkValidSig = { name: NetworkNames; valid: boolean };

/**
 * @param {string} walletAddress The signer address to verify the signature against
 * @param {number | BytesLike | Hexable} hash Hashed data used for the signature to verify. The dApp will need to pre-compute this as no hashing will occur in the function, and this will be directly used in isValidEip1271Signature
 * @param {string} signature The signature to verify as a hex string
 * @returns {Promise<INetworkSigValid>} INetworkValidSig is an array of objects { name: NetworksNames, valid: boolean }
 */
export const isValidEip1271SignatureForAllNetworks = async (
  walletAddress: string,
  hash: number | BytesLike | Hexable,
  signature: string
): Promise<INetworkValidSig[]> => {
  return Promise.all(
    Object.values(supportedNetworks).map(async (network) => {
      const provider = createProvider(network.rpcUrl);
      const valid = await checkSignature(walletAddress, hash, signature, provider, network.name);
      return { name: network.name, valid };
    })
  );
};

/**
 * @param {string} walletAddress The signer address to verify the signature against
 * @param {number | BytesLike | Hexable} hash Hashed data used for the signature to verify. The dApp will need to pre-compute this as no hashing will occur in the function, and this will be directly used in isValidEip1271Signature
 * @param {string} signature The signature to verify as a hex string
 * @param {providers.Provider} provider Compatible provider to perform smart contract wallet validation with EIP 1271 (window.ethereum, web3.currentProvider, ethers provider... )
 * @returns {Promise<boolean>}
 */
export const isValidEip1271Signature = async (
  walletAddress: string,
  hash: number | BytesLike | Hexable,
  signature: string,
  provider: providers.Provider
): Promise<boolean> => {
  // const validArr = await isValidEip1271SignatureForAllNetworks(walletAddress, hash, signature);
  // return validArr.filter((item) => !!item.valid).length > 0;

  const valid = await checkSignature(walletAddress, hash, signature, provider);
  return !!valid;
};
