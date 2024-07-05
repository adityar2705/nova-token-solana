import { mintTo } from "@solana/spl-token";
import "dotenv/config";
import {
  getExplorerLink,
  getKeypairFromEnvironment,
} from "@solana-developers/helpers";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";

//getting the new devnet connection
const connection = new Connection(clusterApiUrl("devnet"));
const user = getKeypairFromEnvironment('SECRET_KEY');

//our token has two decimal places
const MINOR_UNITS_PER_MAJOR_UNITS = Math.pow(10,2);

//getting the mint and ATA accounts
const novaMintAccount = new PublicKey('6b5XVw9FRGjjtXPR4wqUj5Z6pFF3iUHGycDTUrFH4bTJ');
const associatedTokenAcount = new PublicKey('8Ceexa1Y4REZg2wa7Jupfog2Hd8cHqdHyjJdViujsiA');

//minting the tokens
const transactionSignature = await mintTo(
    connection,
    user,
    novaMintAccount,
    associatedTokenAcount,
    user,
    10*MINOR_UNITS_PER_MAJOR_UNITS
);

//generating the Solana Explorer link
const link = getExplorerLink("transaction", transactionSignature, "devnet");

console.log(`✅ Success! Mint Token Transaction: ${link}`);

