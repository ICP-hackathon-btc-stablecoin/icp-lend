import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import TrieMap "mo:base/TrieMap";

import ICRC "./ICRC";

shared (init_msg) actor class Lend(
  init_args : {
    collateralToken : Principal;
    lendingToken : Principal;
  }
) = this {

  var liquidity : Nat = 0;
  var totalBorrowed : Nat = 0;
  var borrowedAmount = TrieMap.TrieMap<Principal, Nat>(Principal.equal, Principal.hash);
  var balances = TrieMap.TrieMap<Principal, Nat>(Principal.equal, Principal.hash);

  // --------------------------- GETTERS ---------------------------

  public query func getBalance(user : Principal) : async (Nat) {
    let currentBalance : ?Nat = balances.get(user);
    switch (currentBalance) {
      case (?natValue) { return natValue };
      case null {
        return 0;
      };
    };
  };

  public query func getBorrowedAmount(user : Principal) : async (Nat) {
    let currentBorrowedAmount : ?Nat = borrowedAmount.get(user);
    switch (currentBorrowedAmount) {
      case (?natValue) { return natValue };
      case null {
        return 0;
      };
    };
  };

  // --------------------------- DEPOSIT ---------------------------

  public type DepositError = {
    #TransferFromError : ICRC.TransferFromError;
  };

  public shared (msg) func deposit(amount : Nat) : async (Result.Result<Nat, DepositError>) {
    // Fetch token
    let token : ICRC.Actor = actor (Principal.toText(init_args.collateralToken));

    // Perform transaction
    let transfer_result = await token.icrc2_transfer_from({
      amount = amount;
      from = { owner = msg.caller; subaccount = null };
      to = { owner = Principal.fromActor(this); subaccount = null };
      spender_subaccount = null;
      fee = null;
      memo = null;
      created_at_time = null;
    });

    // Check for transfer error
    let block_height = switch (transfer_result) {
      case (#Ok(block_height)) { block_height };
      case (#Err(err)) {
        return #err(#TransferFromError(err));
      };
    };

    // Update liquidity
    liquidity += amount;

    // Update user's balance
    let currentBalance : Nat = await getBalance(msg.caller);
    balances.put(msg.caller, amount + currentBalance);

    return #ok(block_height);
  };

  // --------------------------- WITHDRAW ---------------------------

  public type WithdrawError = {
    #InsufficientFunds : { balance : Nat };
    #HasDebt : { borrowedAmount : Nat };
    #TransferError : ICRC.TransferError;
  };

  public shared (msg) func withdraw(amount : Nat) : async Result.Result<Nat, WithdrawError> {
    // Fetch token
    let token : ICRC.Actor = actor (Principal.toText(init_args.collateralToken));

    // Check if the user has no debt
    let borrowedAmount = await getBorrowedAmount(msg.caller);
    if (borrowedAmount != 0) {
      return #err(#HasDebt { borrowedAmount = borrowedAmount });
    };

    // Check if the user's balance is sufficient
    let old_balance = await getBalance(msg.caller);
    if (old_balance < amount) {
      return #err(#InsufficientFunds { balance = old_balance });
    };

    let new_balance = old_balance - amount;
    balances.put(msg.caller, new_balance);

    // Perform transfer
    let transfer_result = await token.icrc1_transfer({
      from_subaccount = null;
      from = { owner = Principal.fromActor(this); subaccount = null };
      to = { owner = msg.caller; subaccount = null };
      amount = amount;
      fee = null;
      memo = null;
      created_at_time = null;
    });

    // Check for transaction error, if so cancel balance debit
    let block_height = switch (transfer_result) {
      case (#Ok(block_height)) { block_height };
      case (#Err(err)) {
        let b = Option.get(balances.get(msg.caller), 0 : Nat);
        balances.put(msg.caller, b + amount);

        return #err(#TransferError(err));
      };
    };

    // Update liquidity
    liquidity -= amount;

    return #ok(block_height);
  };

  // --------------------------- BORROW ---------------------------

  // --------------------------- REPAY ---------------------------
};
