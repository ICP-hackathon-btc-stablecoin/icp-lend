#!/bin/bash

dfx deploy icp --argument "
  (variant {
    Init = record {
      token_name = \"Token ICP\";
      token_symbol = \"ICP\";
      minting_account = record {
        owner = principal \"$OWNER\";
      };
      initial_balances = vec {
        record {
          record {
            owner = principal \"$OWNER\";
          };
          100_000_000_000;
        };
      };
      metadata = vec {};
      transfer_fee = 10_000;
      archive_options = record {
        trigger_threshold = 2000;
        num_blocks_to_archive = 1000;
        controller_id = principal \"$OWNER\";
      };
      feature_flags = opt record {
        icrc2 = true;
      };
    }
  })
"