import "dotenv/config";
import {
  getKeypairFromEnvironment,
  getExplorerLink,
} from "@solana-developers/helpers";
import {
  Connection,
  clusterApiUrl,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { createCreateMetadataAccountV3Instruction } from "@metaplex-foundation/mpl-token-metadata";

//take the user and create the connection
const user = getKeypairFromEnvironment("SECRET_KEY");
const connection = new Connection(clusterApiUrl("devnet"));

console.log(
    `🔑 We've loaded our keypair securely
    ,using an env file! Our public key is: ${user.publicKey.toBase58()}`);

//get the token metadata program id
const TOKEN_METADATA_PROGRAM_ID = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");

//get the Nova mint account
const novaMintAccount = new PublicKey('6b5XVw9FRGjjtXPR4wqUj5Z6pFF3iUHGycDTUrFH4bTJ');

//create the token metadat -> name, symbol and logo
const metadataData = {
    name: 'Nova',
    symbol : 'NOV',
    uri:'https://ipfs.io/ipfs/QmcEd1R1Qq7M6G7NnHxDXYdiYtJAn9A2FGjg94Ku75HgUD?filename=gamer_bull.png',
    sellerFeeBasisPoints:0,
    creators: null,
    collection:null,
    uses:null
};

//getting the PDA and the bump
const metadataPDAandBump = PublicKey.findProgramAddressSync([
    Buffer.from('metadata'),
    TOKEN_METADATA_PROGRAM_ID.toBuffer(),
    novaMintAccount.toBuffer()
],TOKEN_METADATA_PROGRAM_ID);

//this PDA stores our metadata for the Nova token
const metadataPDA = metadataPDAandBump[0];

//creating new transaction
const transaction = new Transaction();

//metadata account instruction
const createMetadataAccountInstruction = createCreateMetadataAccountV3Instruction(
    {
        metadata:metadataPDA,
        mint:novaMintAccount,
        mintAuthority:user.publicKey,
        payer:user.publicKey,
        updateAuthority:user.publicKey
    },
    {   
        //required for the metaplex instruction
        createMetadataAccountArgsV3: {
            collectionDetails: null,
            data: metadataData,
            isMutable: true,
          },
    }
);
transaction.add(createMetadataAccountInstruction);

//get the transaction signature
const transactionSignature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [user]
);

//get the Solana Explorer link
const transactionLink = getExplorerLink(
    "transaction",
    transactionSignature,
    "devnet"
);

console.log(`✅ Transaction confirmed, explorer link is: ${transactionLink}!`);

const tokenMintLink = getExplorerLink(
  "address",
  novaMintAccount.toString(),
  "devnet"
);

console.log(`✅ Look at the token mint again: ${tokenMintLink}!`);