#!/bin/bash

# The argument $1 is your identity 

dfx canister call icp icrc1_transfer "
  (record {
    to = record {
      owner = principal \"$1\";
      subaccount = null;
    };
    fee = null;
    memo = null;
    from_subaccount = null;
    created_at_time = null;
    amount = 100_000_000;
  })"

dfx canister call usdt icrc1_transfer "
  (record {
    to = record {
      owner = principal \"$1\";
      subaccount = null;
    };
    fee = null;
    memo = null;
    from_subaccount = null;
    created_at_time = null;
    amount = 100_000_000;
  })"
