import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import TrieMap "mo:base/TrieMap";
import Float "mo:base/Float";
import Prelude "mo:base/Prelude";
import Time "mo:base/Time";
import Timer "mo:base/Timer";  

import ICRC "./ICRC";

//ryjl3-tyaaa-aaaaa-aaaba-cai

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
  var collateralPriceInUsd : Float = 0.0;

// AUTOMATIC RANDOM LIQUIDATION
// create array with borrowers
// get random number
// add timer to check if a random borrower is healthy

  var borrowedLendingToken = TrieMap.TrieMap<Principal, Nat>(Principal.equal, Principal.hash);
  var depositedLendingToken = TrieMap.TrieMap<Principal, Nat>(Principal.equal, Principal.hash);
  var depositedCollateral = TrieMap.TrieMap<Principal, Nat>(Principal.equal, Principal.hash);


  public type TokenId = Nat;
  public type LatestTokenRow = ((TokenId, TokenId), Text, Float);

  let priceCanister = actor("u45jl-liaaa-aaaam-abppa-cai") : actor {
    get_latest : shared query () -> async [LatestTokenRow];
  };


  // TIME
  private func updateCollateralPrice() : async () {
    collateralPriceInUsd := (await priceCanister.get_latest())[2].2;
  };

  public func startTimer() : async () {
    let _ = Timer.recurringTimer<system>(#seconds (60), updateCollateralPrice);
  };


  // --------------------------- GETTERS ---------------------------

  public query func getCollateralPrice() : async (Float) {
    return collateralPriceInUsd;
  };

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

  func isHealthy(collateral : Nat, borrowed : Nat) : async (Bool) {
      let health = await healthFactor(collateral, borrowed);
      return health > 1.0;
    };

  func healthFactor(collateral : Nat, borrowed : Nat) : async (Float) {
      return (collateralPriceInUsd * Float.fromInt(collateral) * 0.80) / Float.fromInt(borrowed);
    };
    
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
    #BadHealth : { old_collateral : Nat; borrowed : Nat; amount: Nat};
    #HasDebt : { borrowedAmount : Nat };
    #TransferError : ICRC.TransferError;
  };

  public shared (msg) func withdrawCollateral(amount : Nat) : async Result.Result<Nat, WithdrawCollateralError> {
    let token : ICRC.Actor = actor (Principal.toText(init_args.collateralToken));

    let old_collateral = await getDepositedCollateral(msg.caller);

    if (old_collateral < amount) {
      return #err(#InsufficientFunds { balance = old_collateral });
    };

    let borrowed = await getBorrowedLendingToken(msg.caller);
    let newCollateralBalance = old_collateral - amount;

    if (not (await isHealthy(newCollateralBalance, borrowed))) {
      return #err(#BadHealth { 
        old_collateral = old_collateral; 
        borrowed = borrowed; 
        amount = amount 
        });
    };

    depositedCollateral.put(msg.caller, newCollateralBalance);

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

    totalCollateral -= amount;
    return #ok(block_height);
  };

  // borrow
  public type BorrowError = {
    #InsufficientFunds : { balance : Nat };
    #BadHealth : { old_collateral : Nat; borrowed : Nat; amount: Nat};
    #TransferError : ICRC.TransferError;
  };

  public shared (msg) func borrow(amount : Nat) : async Result.Result<Nat, BorrowError> {
    let token : ICRC.Actor = actor (Principal.toText(init_args.lendingToken));

    let old_borrowedLendingToken = await getBorrowedLendingToken(msg.caller);
    let collateral = await getDepositedCollateral(msg.caller);
    let new_borrowedLendingToken = old_borrowedLendingToken + amount;

    // TODO check if there is enough to lending token to borrow
    if (not (await isHealthy(collateral, new_borrowedLendingToken))) {
      return #err(#BadHealth { 
        old_collateral = collateral; 
        borrowed = old_borrowedLendingToken; 
        amount = amount
        });
    };

    borrowedLendingToken.put(msg.caller, new_borrowedLendingToken);

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

    totalBorrowed += amount;
    totalLendingToken -= amount;

    return #ok(block_height);
  };

  // repay
  public type RepayError = {
    #InsufficientFunds : { balance : Nat };
    #BadHealth : { old_collateral : Nat; borrowed : Nat; amount: Nat};
    #TransferError : ICRC.TransferFromError;
  };

  public shared (msg) func repay(amount : Nat) : async Result.Result<Nat, RepayError> {
    let token : ICRC.Actor = actor (Principal.toText(init_args.lendingToken));

    let old_borrowedLendingToken = await getBorrowedLendingToken(msg.caller);

    // TODO ADD A FEE HERE
    let new_borrowedLendingToken = old_borrowedLendingToken - amount;

    borrowedLendingToken.put(msg.caller, new_borrowedLendingToken);

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
        //err here is a transferFromError
        let b = Option.get(borrowedLendingToken.get(msg.caller), 0 : Nat);
        borrowedLendingToken.put(msg.caller, b + amount);

        return #err(#TransferError(err));
        //we want to return an error of type TransferError
      };
    };

    totalBorrowed -= amount;
    totalLendingToken += amount;

    return #ok(block_height);

  };


  // liquidate
  public type LiquidateError = {
    #InsufficientFunds : { balance : Nat };
    #IsHealthy : { collateral : Nat; borrowed : Nat};
    #TransferError : ICRC.TransferError;
  };

  public shared (msg) func liquidate(user : Principal) : async Result.Result<(), LiquidateError> {
    let borrowed = await getBorrowedLendingToken(user);
    let collateral = await getDepositedCollateral(msg.caller);

    if (await isHealthy(collateral, borrowed)) { // cant liquidate if is healthy
      return #err(#IsHealthy { collateral = collateral; borrowed = borrowed });
    };

    // we are leaving the collateral liquidated in the contract as overcollateral

    let old_collateral = await getDepositedCollateral(msg.caller);

    depositedCollateral.put(msg.caller, 0);
    depositedLendingToken.put(user, 0);

    return #ok();
  };

};
