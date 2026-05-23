# TukTuk Escrow

A trustless token escrow program on Solana with **automated expiry refunds** powered by [TukTuk](https://www.tuktuk.fun) - a permissionless crank scheduler.

Alice (maker) deposits Token A and specifies how much Token B she wants in return. Bob (taker) can fulfill the trade before the escrow expires. If no taker shows up, the escrow automatically expires and TukTuk's crankers call `auto_refund` to return Alice's tokens - no manual intervention needed.

This is built on top of the standard escrow pattern with two additions: an `expires_at` timestamp on every escrow, and a `schedule` instruction that registers a TukTuk task to fire `auto_refund` at exactly that timestamp.

---
