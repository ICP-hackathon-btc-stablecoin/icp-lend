# ICP Lend

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

---

```bash
URL: <ICP_LEND_BACKEND_URL> + "&ii=" + <INTERNET_IDENTITY_CANISTER>

EX: <http://127.0.0.1:4943/?canisterId=b77ix-eeaaa-aaaaa-qaada-cai&id=br5f7-7uaaa-aaaaa-qaaca-cai&ii=http://bw4dl-smaaa-aaaaa-qaacq-cai.localhost:4943/>
```
