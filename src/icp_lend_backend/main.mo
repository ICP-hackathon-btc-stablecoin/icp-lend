import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import TrieMap "mo:base/TrieMap";

import ICRC "./ICRC";

shared (init_msg) actor class (
  init_args : {
    collateralToken : Principal;
    lendingToken : Principal;
  }
) = this {
  // --------------------------- GLOBALS ---------------------------
  var totalLendingToken : Nat = 0;
  var totalCollateral : Nat = 0;
  var totalBorrowed : Nat = 0;
  var totalReward : Nat = 0;

  var borrowedLendingToken = TrieMap.TrieMap<Principal, Nat>(Principal.equal, Principal.hash);
  var depositedLendingToken = TrieMap.TrieMap<Principal, Nat>(Principal.equal, Principal.hash);
  var depositedCollateral = TrieMap.TrieMap<Principal, Nat>(Principal.equal, Principal.hash);

  // --------------------------- GETTERS ---------------------------

  public query func getBorrowedLendingToken(user : Principal) : async (Nat) {
    let balance : ?Nat = borrowedLendingToken.get(user);
    switch (balance) {
      case (?natValue) { return natValue };
      case null {
        return 0;
      };
    };
  };

  public query func getDepositedLendingToken(user : Principal) : async (Nat) {
    let balance : ?Nat = depositedLendingToken.get(user);
    switch (balance) {
      case (?natValue) { return natValue };
      case null {
        return 0;
      };
    };
  };

  public query func getDepositedCollateral(user : Principal) : async (Nat) {
    let balance : ?Nat = depositedCollateral.get(user);
    switch (balance) {
      case (?natValue) { return natValue };
      case null {
        return 0;
      };
    };
  };

  // --------------------------- MATH ---------------------------

  // --------------------------- FUNCTIONS ---------------------------

  // depositLendingToken
  public type DepositLendingTokenError = {
    #TransferFromError : ICRC.TransferFromError;
  };

  public shared (msg) func depositLendingToken(amount : Nat) : async (Result.Result<Nat, DepositLendingTokenError>) {
    let token : ICRC.Actor = actor (Principal.toText(init_args.lendingToken));

    let transfer_result = await token.icrc2_transfer_from({
      amount = amount;
      from = { owner = msg.caller; subaccount = null };
      to = { owner = Principal.fromActor(this); subaccount = null };
      spender_subaccount = null;
      fee = null;
      memo = null;
      created_at_time = null;
    });

    let block_height = switch (transfer_result) {
      case (#Ok(block_height)) { block_height };
      case (#Err(err)) {
        return #err(#TransferFromError(err));
      };
    };

    totalLendingToken += amount;

    let balance : Nat = await getDepositedLendingToken(msg.caller);
    depositedLendingToken.put(msg.caller, amount + balance);

    return #ok(block_height);
  };

  // withdrawLendingToken
  public type WithdrawLendingTokenError = {
    #InsufficientFunds : { balance : Nat };
    #TransferError : ICRC.TransferError;
  };

  // Não pode levantar mais do que o totalLendingToken - é possivel chegar a esse ponto?
  public shared (msg) func withdrawLendingToken(amount : Nat) : async Result.Result<Nat, WithdrawLendingTokenError> {
    let token : ICRC.Actor = actor (Principal.toText(init_args.lendingToken));

    let old_balance = await getDepositedLendingToken(msg.caller);
    if (old_balance < amount) {
      return #err(#InsufficientFunds { balance = old_balance });
    };

    let new_balance = old_balance - amount;
    depositedLendingToken.put(msg.caller, new_balance);

    // TODO: ADICIONAR JURO
    let transfer_result = await token.icrc1_transfer({
      from_subaccount = null;
      from = { owner = Principal.fromActor(this); subaccount = null };
      to = { owner = msg.caller; subaccount = null };
      amount = amount;
      fee = null;
      memo = null;
      created_at_time = null;
    });

    let block_height = switch (transfer_result) {
      case (#Ok(block_height)) { block_height };
      case (#Err(err)) {
        let b = Option.get(depositedLendingToken.get(msg.caller), 0 : Nat);
        depositedLendingToken.put(msg.caller, b + amount);

        return #err(#TransferError(err));
      };
    };

    totalLendingToken -= amount;

    return #ok(block_height);
  };

  // depositCollateral
  public type DepositCollateralError = {
    #TransferFromError : ICRC.TransferFromError;
  };

  public shared (msg) func depositCollateral(amount : Nat) : async (Result.Result<Nat, DepositCollateralError>) {
    let token : ICRC.Actor = actor (Principal.toText(init_args.collateralToken));

    let transfer_result = await token.icrc2_transfer_from({
      amount = amount;
      from = { owner = msg.caller; subaccount = null };
      to = { owner = Principal.fromActor(this); subaccount = null };
      spender_subaccount = null;
      fee = null;
      memo = null;
      created_at_time = null;
    });

    let block_height = switch (transfer_result) {
      case (#Ok(block_height)) { block_height };
      case (#Err(err)) {
        return #err(#TransferFromError(err));
      };
    };

    totalCollateral += amount;

    let balance : Nat = await getDepositedCollateral(msg.caller);
    depositedCollateral.put(msg.caller, amount + balance);

    return #ok(block_height);
  };

  // withdrawCollateral
  public type WithdrawCollateralError = {
    #InsufficientFunds : { balance : Nat };
    #HasDebt : { borrowedAmount : Nat };
    #TransferError : ICRC.TransferError;
  };

  // alterar
  public shared (msg) func withdrawCollateral(amount : Nat) : async Result.Result<Nat, WithdrawCollateralError> {
    let token : ICRC.Actor = actor (Principal.toText(init_args.collateralToken));

    let amount = await getBorrowedLendingToken(msg.caller);
    if (amount != 0) {
      return #err(#HasDebt { borrowedAmount = amount });
    };

    let old_balance = await getDepositedLendingToken(msg.caller);
    if (old_balance < amount) {
      return #err(#InsufficientFunds { balance = old_balance });
    };

    let new_balance = old_balance - amount;
    depositedLendingToken.put(msg.caller, new_balance);

    // TODO: ADICIONAR JURO
    let transfer_result = await token.icrc1_transfer({
      from_subaccount = null;
      from = { owner = Principal.fromActor(this); subaccount = null };
      to = { owner = msg.caller; subaccount = null };
      amount = amount;
      fee = null;
      memo = null;
      created_at_time = null;
    });

    let block_height = switch (transfer_result) {
      case (#Ok(block_height)) { block_height };
      case (#Err(err)) {
        let b = Option.get(depositedLendingToken.get(msg.caller), 0 : Nat);
        depositedLendingToken.put(msg.caller, b + amount);

        return #err(#TransferError(err));
      };
    };

    totalLendingToken -= amount;

    return #ok(block_height);
  };

  // borrow

  // repay

  // liquidate
};
