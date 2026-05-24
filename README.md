# TukTuk Escrow

A trustless token escrow program on Solana with **automated expiry refunds** powered by [TukTuk](https://www.tuktuk.fun) - a permissionless crank scheduler.

Alice (maker) deposits Token A and specifies how much Token B she wants in return. Bob (taker) can fulfill the trade before the escrow expires. If no taker shows up, the escrow automatically expires and Alice's tokens are refunded without any centralized intervention.

This is built on top of the standard escrow pattern with two additions: an `expires_at` timestamp on every escrow, and a `schedule` instruction that registers a TukTuk task to fire `auto_refund` at expiry time.

---

## 📋 Program Details

### Program ID
```
EqS5XP2XknR8tQ3P3uZAy2xBEisWETVhis6apCKvGWQJ
```
### Task Queue
```
DichuacXzx3KC2uRz8kEXjkyEnafuhdQgEWUoJyd776G
```

### Key Features
- **Trustless Escrow**: No intermediaries required
- **Automated Refunds**: Uses TukTuk scheduler for automatic expiry refunds
- **Flexible Tokens**: Supports any SPL tokens
- **On-chain Timestamps**: Configurable expiry times

---

## 🏗️ Architecture

### Core Instructions

1. **`make`** - Create an escrow
   - Deposit Token A into escrow
   - Specify desired Token B amount and expiry time
   - Seeds the escrow PDA

2. **`take`** - Fulfill the escrow
   - Taker deposits Token B
   - Escrow releases Token A to taker
   - Vault closes

3. **`refund`** - Manual refund
   - Escrow maker can manually refund before expiry
   - Closes the vault

4. **`auto_refund`** - Automatic refund on expiry
   - Called by TukTuk crank at scheduled time
   - Automatically refunds maker after expiry
   - Closes the vault

5. **`schedule`** - Register with TukTuk
   - Registers `auto_refund` task with TukTuk scheduler
   - Ensures automatic execution at expiry time

---

## 🔧 Task Queue Setup

The program integrates with TukTuk's task queue system for scheduling automated refunds.

### Creating a Task Queue

Run the provided setup script to create your task queue:

```bash
ANCHOR_PROVIDER_URL=https://api.devnet.solana.com \
ANCHOR_WALLET=$HOME/.config/solana/id.json \
npm run create:queue
```

This script will:
- Initialize the TukTuk program
- Create a new task queue with 10-task capacity
- Set crank reward to 5000 lamports per task
- Output the **Task Queue Public Key** to paste into your configuration

The task queue public key should be added to your scripts configuration for runtime use.

---

## 📊 Tech Stack

- **Rust** (51.2%) - Smart contract
- **TypeScript** (48.1%) - Off-chain utilities and testing
- **Anchor Framework** - Program framework
- **Solana SPL Token** - Token operations
- **TukTuk SDK** - Task scheduling

---

## 📦 Dependencies

### Core
- `@coral-xyz/anchor` - Framework
- `@solana/spl-token` - SPL token support
- `@helium/tuktuk-sdk` - Task queue integration

### Development
- TypeScript
- ts-mocha & Mocha - Testing
- Prettier - Code formatting

---

## 🚀 Getting Started

### Prerequisites
- Node.js & npm/yarn
- Rust & Cargo
- Solana CLI
- Anchor CLI

### Installation

```bash
# Clone the repository
git clone https://github.com/1rishuraj/tuktuk-escrow.git
cd tuktuk-escrow

# Install dependencies
yarn install

# Build the program
cargo build-bpf
```

### Testing on Devnet

```bash
ANCHOR_PROVIDER_URL=https://api.devnet.solana.com \
ANCHOR_WALLET=$HOME/.config/solana/id.json \
npm run test:devnet
```

### Linting

```bash
# Check code style
npm run lint

# Fix formatting issues
npm run lint:fix
```

---

## 📝 Configuration

### Anchor.toml
- **Cluster**: Devnet (configurable)
- **Wallet**: `~/.config/solana/id.json`
- **Package Manager**: Yarn

### Constants
- `ESCROW_SEED` - PDA seed for escrow accounts
- `QUEUE_AUTHORITY_SEED` - PDA seed for queue authority
- `TIME` - Default time unit (20 seconds)

---

## 🔐 Security Considerations

- **Signer Validation**: All instructions validate signers
- **Token Vault**: Deposits held in PDA-controlled vaults
- **Expiry Safety**: Automatic refunds ensure funds aren't locked indefinitely
- **TukTuk Integration**: Leverages decentralized scheduling

---

## 📚 References

- [Solana Documentation](https://docs.solana.com)
- [Anchor Book](https://book.anchor-lang.com)
- [TukTuk](https://www.tuktuk.fun)
- [SPL Token Program](https://spl.solana.com/token)

---

## 📄 License

ISC
