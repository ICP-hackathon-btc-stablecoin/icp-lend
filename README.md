# ICP Lend

ICP Lend stands at the forefront of decentralized finance (DeFi) protocols tailored specifically for the Internet Computer Protocol (ICP) ecosystem.

Harnessing the distinctive capabilities of ICP, such as its support for [HTTP requests](https://internetcomputer.org/docs/current/developer-docs/smart-contracts/advanced-features/https-outcalls/https-outcalls-how-to-use/) and [Timers](https://internetcomputer.org/docs/current/motoko/main/timers/), ICP Lend seamlessly integrates price feeds and executes automated liquidations and real-time price updates with unparalleled efficiency.

## How it works

ICP boasts an over-collateralization ratio of 50%, offering lenders an attractive Annual Percentage Yield (APY) of 5% and borrowers a competitive APY of 10%.

Lenders are incentivized to provide stablecoin liquidity, with the flexibility to withdraw their deposits at any time. Their rewards are calculated based on the duration of their deposit, rewarding patience with a formula of reward = 0.05 * year_fraction * deposit.

Borrowers have the opportunity to secure stablecoin loans, provided they pledge collateral exceeding 150% of the borrowed amount. Upon repayment, borrowers incur a fee based on the duration of the loan, calculated as fee = 0.1 * year_fraction * borrowed_funds.

Borrowers retain the ability to withdraw collateral as long as they maintain an over-collateralization level of at least 50%.

Liquidation occurs automatically if a borrower's collateralization ratio drops below 50%, resulting in the forfeiture of their collateral funds.

ICP Lend represents a paradigm shift in DeFi, offering a robust lending protocol tailored to the unique capabilities of the ICP network, while empowering users with enhanced flexibility, security, and efficiency.

## Getting started

To run ICP Lend, follow these steps.

Initialize replica:

```bash
dfx stop
dfx start --clean
```

In another terminal, initialize the OWNER variable:

```bash
export OWNER=$(dfx identity get-principal)
```

Deploy the lending token canister:

```bash
./deploy-lending-token.sh
```

Deploy the collateral token canister:

```bash
./deploy-collateral-token.sh
```

Deploy the backend canister:

```bash
./deploy-backend.sh
```

Deploy internet identity canister:

```bash
dfx deploy internet_identity
```

On another terminal, install frontend dependencies and launch it:

```bash
npm install
npm start
```

Open your browser, log in, and copy your internet identity.

Fund your identity with tokens:

```bash
./fund-identity.sh <YOUR_IDENTITY>
```
