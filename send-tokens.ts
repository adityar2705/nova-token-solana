import "dotenv/config";
import {
  getExplorerLink,
  getKeypairFromEnvironment,
} from "@solana-developers/helpers";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

//getting the connection and setting the sender
const connection = new Connection(clusterApiUrl('devnet'));
const sender = getKeypairFromEnvironment('SECRET_KEY');

console.log(
    `🔑 Loaded our keypair securely, using an env file! Our public key is: ${sender.publicKey.toBase58()}`
  );

//recipient of the Nova token transfer
const recipient = new PublicKey('MJKqp326RZCHnAAbew9MDdui3iCKWco7fsK9sVuZTX2');

//getting the mint and ATA accounts
const novaMintAccount = new PublicKey('6b5XVw9FRGjjtXPR4wqUj5Z6pFF3iUHGycDTUrFH4bTJ');

// Our token has two decimal places
const MINOR_UNITS_PER_MAJOR_UNITS = Math.pow(10, 2);
console.log(`💸 Attempting to send 1 token to ${recipient.toBase58()}...`);

//get or create the source and the destination
const source = await getOrCreateAssociatedTokenAccount(
    connection,

    //payer if any SOL is deducted
    sender,
    novaMintAccount,

    //sender
    sender.publicKey
);

const destination = await getOrCreateAssociatedTokenAccount(
    connection,
    sender,
    novaMintAccount,

    //receiver
    recipient
);

//transfer of tokens
const signature = await transfer(
    connection,
    sender,
    source.address,
    destination.address,
    sender,
    1*MINOR_UNITS_PER_MAJOR_UNITS
);

const explorerLink = getExplorerLink("transaction", signature, "devnet");

console.log(`✅ Transaction confirmed, explorer link is: ${explorerLink}!`);
