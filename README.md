# ICP Lend

## Getting started

To run ICP Lend, follow these steps.

Initialize replica:

```bash
dfx stop
dfx start --clean
```

On another terminal, initialize the OWNER variable:

```bash
export OWNER=$(dfx identity get-principal)
```

Deploy the lending token canister:

```bash
./deploy-lending-token
```

Deploy the collateral token canister:

```bash
./deploy-collateral-token
```

Deploy the backend canister:

```bash
./deploy-backend
```

Deploy internet identity canister:

```bash
dfx deploy internet_identity
```

Deploy the frontend canister:

```bash
dfx deploy icp_lend_frontend
```

Open browser with internet identity:

```bash
URL: <ICP_LEND_BACKEND_URL> + "&ii=" + <INTERNET_IDENTITY_CANISTER>

EX: <http://127.0.0.1:4943/?canisterId=b77ix-eeaaa-aaaaa-qaada-cai&id=br5f7-7uaaa-aaaaa-qaaca-cai&ii=http://bw4dl-smaaa-aaaaa-qaacq-cai.localhost:4943/>
```

Log in and paste identity

Fund identity with tokens:

```bash
dfx canister call icp icrc1_transfer '(
record {
to = record {
owner = principal "kz7ef-wjxdo-kj7vo-kq366-nombe-2psyz-4e7ct-uptnb-p77lk-ors6o-2qe";
subaccount = null;
};
fee = null;
memo = null;
from_subaccount = null;
created_at_time = null;
amount = 100_000_000;
},
)'

dfx canister call usdt icrc1_transfer '(
record {
to = record {
owner = principal <IDENTITY>;
subaccount = null;
};
fee = null;
memo = null;
from_subaccount = null;
created_at_time = null;
amount = 100_000_000;
},
)'
```
