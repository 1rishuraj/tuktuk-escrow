/**
 * Creates a TukTuk task queue owned by your wallet and prints its public key.
 * Run once, then paste the printed key into TASK_QUEUE in setup-and-run.ts.
 *
 * Usage:
 *   ANCHOR_PROVIDER_URL=https://api.devnet.solana.com \
 *   ANCHOR_WALLET=$HOME/.config/solana/id.json \
 *   ts-node -P tsconfig.json scripts/create-task-queue.ts
 */

import * as anchor from "@coral-xyz/anchor";
import { BN } from "@coral-xyz/anchor";
import {
  init as initTuktuk,
  createTaskQueue,
  TUKTUK_CONFIG,
  taskQueueKey,
} from "@helium/tuktuk-sdk";

async function main() {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  console.log("Wallet:", provider.wallet.publicKey.toBase58());
  console.log("Cluster:", (provider.connection as any)._rpcEndpoint ?? "devnet");

  const tuktukProgram = await initTuktuk(provider);

  // Read the current queue counter so we can predict the resulting address.
  const config = await tuktukProgram.account.tuktukConfigV0.fetch(TUKTUK_CONFIG);
  const nextId: number = (config as any).nextTaskQueueId;
  const [expectedQueue] = taskQueueKey(TUKTUK_CONFIG, nextId);

  console.log("\nCreating task queue...");
  console.log("Expected address:", expectedQueue.toBase58());

  const queueName = `escrow-queue-${nextId}`;
  const builder = await createTaskQueue(tuktukProgram, {
    name: queueName,
    capacity: 10,
    minCrankReward: new BN(5_000),     // 5000 lamports per executed task
    lookupTables: [],
  } as any);

  const tx = await builder.rpc({ skipPreflight: false, commitment: "confirmed" });
  console.log("tx:", tx);
  console.log("\n✓ Task queue created!");
  console.log("TASK_QUEUE =", expectedQueue.toBase58());
  console.log(
    `\n>>> https://explorer.solana.com/address/${expectedQueue.toBase58()}?cluster=devnet`
  );
  console.log(
    "\nPaste the TASK_QUEUE value above into scripts/setup-and-run.ts line 23."
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
