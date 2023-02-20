import "dotenv/config";
import { ContractInterface, BytesLike } from "ethers";
import { Hexable } from "ethers/lib/utils";
export declare const isValidEip1271Signature: (walletAddress: string, messageBytes: number | BytesLike | Hexable, signedMessage: string, abi?: ContractInterface, oldVersion?: boolean) => Promise<boolean>;
