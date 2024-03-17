#!/bin/bash

source .env

echo ICP CANISTER:
echo $CANISTER_ID_ICP
echo USDT CANISTER:
echo $CANISTER_ID_USDT

dfx deploy icp_lend_backend --upgrade-unchanged --argument "
  (record {
    collateralToken = principal \"$CANISTER_ID_ICP\";
    lendingToken = principal \"$CANISTER_ID_USDT\";
  })"