import { createMint } from "@solana/spl-token";
import "dotenv/config";
import { getKeypairFromEnvironment, getExplorerLink } from "@solana-developers/helpers";
import { Connection, clusterApiUrl } from "@solana/web3.js";

//creating a new connection
const connection = new Connection(clusterApiUrl('devnet'));
const user = getKeypairFromEnvironment('SECRET_KEY');

console.log(`🔑 Loaded our keypair securely
    ,using an env file! Our public key is: ${user.publicKey.toBase58()}`);

//create the Nova token mint -> user.publicKey is the mint authority
const novaTokenMint = await createMint(connection, user, user.publicKey, null, 2);
const link = getExplorerLink('address',novaTokenMint.toString(),'devnet');

console.log(`✅ Finished! Created token mint: ${link}`);