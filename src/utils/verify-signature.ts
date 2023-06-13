import { ethers, utils, providers, ContractInterface, BytesLike } from "ethers";
import { Hexable } from "ethers/lib/utils";

import { abiEip1271Json, abiEip1271OldJson } from "../constants/abi";

const isCaseInsensitiveMatch = (val1: string, val2: string) => val1.toLowerCase() === val2.toLowerCase();

const createProvider = (rpcUrl: string) => {
  const isWss = rpcUrl.startsWith("ws");
  if (isWss) return new ethers.providers.WebSocketProvider(rpcUrl);
  return new ethers.providers.JsonRpcProvider(rpcUrl);
};

const getProvidersFromRpcUrls = async (rpcUrls: string[]) => {
  return Promise.all(
    rpcUrls.map(async (rpcUrl) => {
      const provider = createProvider(rpcUrl);
      try {
        const network = await provider.getNetwork();
        const chainId = network?.chainId;
        if (!!chainId) return provider;
      } catch (e) {
        //
      }

      return null;
    })
  );
};

const checkSignature = async (
  provider: providers.JsonRpcProvider,
  walletAddress: string,
  hash: number | BytesLike | Hexable,
  signature: string,
  abi: ContractInterface = abiEip1271Json.abi,
  magicValue: string = abiEip1271Json.magicValue
): Promise<boolean> => {
  let returnedValue;
  try {
    returnedValue = await new ethers.Contract(walletAddress, abi, provider).isValidSignature(
      utils.arrayify(hash),
      signature
    );
  } catch (e) {
    if (magicValue === abiEip1271Json.magicValue)
      return await checkSignature(
        provider,
        walletAddress,
        hash,
        signature,
        abiEip1271OldJson.abi,
        abiEip1271OldJson.magicValue
      );
  }

  return returnedValue && isCaseInsensitiveMatch(returnedValue, magicValue);
};

type INetworkValidSig = { chainId: number | null; name: string | null; valid: boolean };

const checkSignatureForAllProviders = async (
  providers: providers.JsonRpcProvider[],
  walletAddress: string,
  hash: number | BytesLike | Hexable,
  signature: string
): Promise<(INetworkValidSig | null)[]> => {
  return Promise.all(
    providers.map(async (provider) => {
      const valid = await checkSignature(provider, walletAddress, hash, signature);

      try {
        const network = await provider.getNetwork();
        return { chainId: network?.chainId || null, name: network?.name || null, valid: !!valid };
      } catch (e) {
        //
      }

      return null;
    })
  );
};

/**
 * @param {string[]} rpcUrls Array of RPC URLs to create providers to perform smart contract wallet validation with EIP 1271
 * @param {string} walletAddress The signer address to verify the signature against
 * @param {number | BytesLike | Hexable} hash Hashed data used for the signature to verify. The dApp will need to pre-compute this as no hashing will occur in the function, and this will be directly used in isValidEip1271Signature
 * @param {string} signature The signature to verify as a hex string
 * @returns {Promise<INetworkSigValid>} INetworkValidSig is an array of objects { name: NetworksNames, valid: boolean }
 */
export const isValidEip1271SignatureForAllNetworks = async (
  rpcUrls: string[],
  walletAddress: string,
  hash: number | BytesLike | Hexable,
  signature: string
): Promise<INetworkValidSig[]> => {
  if (!rpcUrls.length || !walletAddress || !hash || !signature) return [];

  const providers = await getProvidersFromRpcUrls(rpcUrls);
  const validProviders = providers.flatMap((f) => (!!f ? [f] : [])); // Filter out unrecognized provider urls
  const networkValidSignatures = await checkSignatureForAllProviders(validProviders, walletAddress, hash, signature);
  return networkValidSignatures.flatMap((f) => (!!f?.chainId ? [f] : [])); // Filter out failed attempts
};

/**
 * @param {string[]} rpcUrls Array of RPC URLs to create providers to perform smart contract wallet validation with EIP 1271
 * @param {string} walletAddress The signer address to verify the signature against
 * @param {number | BytesLike | Hexable} hash Hashed data used for the signature to verify. The dApp will need to pre-compute this as no hashing will occur in the function, and this will be directly used in isValidEip1271Signature
 * @param {string} signature The signature to verify as a hex string
 * @returns {Promise<boolean>}
 */
export const isValidEip1271Signature = async (
  rpcUrls: string[],
  walletAddress: string,
  hash: number | BytesLike | Hexable,
  signature: string
): Promise<boolean> => {
  const validArr = await isValidEip1271SignatureForAllNetworks(rpcUrls, walletAddress, hash, signature);
  return validArr.some((item) => !!item.valid);
};
