import Float "mo:base/Float";
import Int "mo:base/Int";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Timer "mo:base/Timer";
import TrieMap "mo:base/TrieMap";

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
  var collateralPriceInUsd : Nat = 0;

  let lenderReward : Nat = 105000000;
  let borrowerFee : Nat = 110000000;
  let PRECISION : Nat = 100000000;

  type Time = Int;

  var borrowedLendingToken = TrieMap.TrieMap<Principal, (Nat, Time)>(Principal.equal, Principal.hash);
  var depositedLendingToken = TrieMap.TrieMap<Principal, (Nat, Time)>(Principal.equal, Principal.hash);
  var depositedCollateral = TrieMap.TrieMap<Principal, Nat>(Principal.equal, Principal.hash);

  public type TokenId = Nat;
  public type LatestTokenRow = ((TokenId, TokenId), Text, Float);

  let priceCanister = actor ("u45jl-liaaa-aaaam-abppa-cai") : actor {
    get_latest : shared query () -> async [LatestTokenRow];
  };

  private func updateCollateralPrice() : async () {
    // hardcoded for hackathon demo
    collateralPriceInUsd := 13; //(await priceCanister.get_latest())[2].2;
  };

  private func checkRandomBorrowerLiquidatable() : async () {

    for (borrower in borrowedLendingToken.keys()) {
      let borrowed = await getBorrowedLendingToken(borrower);
      let collateral = await getDepositedCollateral(borrower);

      if (not (await isHealthy(collateral, borrowed))) {
        let _ = liquidate(borrower);
      };

    };

  };

  // --------------------------- GETTERS ---------------------------

  public query func getCollateralPrice() : async (Nat) {
    return collateralPriceInUsd;
  };

  public query func getBorrowedLendingToken(user : Principal) : async (Nat) {
    let ?(balance, _) : ?(Nat, Time) = borrowedLendingToken.get(user);
    return balance;
  };

  public query func getDepositedLendingToken(user : Principal) : async (Nat) {
    let ?(balance, _) : ?(Nat, Time) = depositedLendingToken.get(user);
    return balance;
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
    return health > (1 * PRECISION);
  };

  func healthFactor(collateral : Nat, borrowed : Nat) : async (Nat) {
    return (collateralPriceInUsd * collateral * 5 * 10000000) / borrowed;
  };

  // amount * (fração do ano que passou) * 1.05
  func withdrawWithRewards(amount : Nat, timePassed : Nat) : async (Nat) {
    return (amount * (timePassed * PRECISION / 60 * 60 * 24 * 365) * lenderReward) / (PRECISION * PRECISION);
  };

  func withdrawWithFee(amount : Nat, timePassed : Nat) : async (Nat) {
    return (amount * (timePassed * PRECISION / 60 * 60 * 24 * 365) * borrowerFee) / (PRECISION * PRECISION);
  };

  //   func utilizationRatio() : (Nat) {
  //     return (totalBorrowed * PRECISION) / totalLendingToken;
  //   };

  //   func interestMultiplier() : (Nat) {
  //     return (fixedAnnualBorrowRate - baseRate) * PRECISION / utilizationRatio();
  //   };

  //   func borrowRate() : (Nat) {
  //     return utilizationRatio() * interestMultiplier() * baseRate;
  //   };

  //   func depositRate() : (Nat) {
  //     return utilizationRatio() * borrowRate();
  //   };

  //   func profitMultiplier() : (Nat) {
  //     return (totalLendingToken + totalReward)  * PRECISION / totalLendingToken;
  //   };

  //   func interestCalculator(amount : Nat) : (Nat) {
  //     return amount * borrowRate() - amount;
  //   };

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
    depositedLendingToken.put(msg.caller, (amount + balance, Time.now()));

    return #ok(block_height);
  };

  // withdrawLendingToken
  public type WithdrawLendingTokenError = {
    #InsufficientFunds : { balance : Nat };
    #TransferError : ICRC.TransferError;
  };

  public shared (msg) func withdrawLendingToken(amount : Nat) : async Result.Result<Nat, WithdrawLendingTokenError> {
    let token : ICRC.Actor = actor (Principal.toText(init_args.lendingToken));

    let currentTime = Time.now();
    let ?(old_balance, old_time) : ?(Nat, Time) = depositedLendingToken.get(msg.caller);

    let withdrawAmount = await withdrawWithRewards(amount, Int.abs(currentTime - old_time));

    if (old_balance < amount) {
      return #err(#InsufficientFunds { balance = old_balance });
    };

    let new_balance : Nat = old_balance - amount;

    // TODO: ADICIONAR JURO
    // amount * (fração do ano que passou) * 1.05
    let transfer_result = await token.icrc1_transfer({
      from_subaccount = null;
      from = { owner = Principal.fromActor(this); subaccount = null };
      to = { owner = msg.caller; subaccount = null };
      amount = withdrawAmount;
      fee = null;
      memo = null;
      created_at_time = null;
    });

    let block_height = switch (transfer_result) {
      case (#Ok(block_height)) { block_height };
      case (#Err(err)) {
        return #err(#TransferError(err));
      };
    };

    if (new_balance == 0) {
      depositedLendingToken.delete(msg.caller);
    } else {
      depositedLendingToken.put(msg.caller, (new_balance, Time.now()));
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
    #BadHealth : { old_collateral : Nat; borrowed : Nat; amount : Nat };
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
    let newCollateralBalance : Nat = old_collateral - amount;

    if (not (await isHealthy(newCollateralBalance, borrowed))) {
      return #err(
        #BadHealth {
          old_collateral = old_collateral;
          borrowed = borrowed;
          amount = amount;
        }
      );
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
        return #err(#TransferError(err));
      };
    };

    totalCollateral -= amount;
    return #ok(block_height);
  };

  // borrow
  public type BorrowError = {
    #InsufficientFunds : { balance : Nat };
    #BadHealth : { old_collateral : Nat; borrowed : Nat; amount : Nat };
    #TransferError : ICRC.TransferError;
  };

  public shared (msg) func borrow(amount : Nat) : async Result.Result<Nat, BorrowError> {
    let token : ICRC.Actor = actor (Principal.toText(init_args.lendingToken));

    let old_borrowedLendingToken = await getBorrowedLendingToken(msg.caller);
    let collateral = await getDepositedCollateral(msg.caller);
    let new_borrowedLendingToken = old_borrowedLendingToken + amount;

    // TODO check if there is enough to lending token to borrow
    if (not (await isHealthy(collateral, new_borrowedLendingToken))) {
      return #err(
        #BadHealth {
          old_collateral = collateral;
          borrowed = old_borrowedLendingToken;
          amount = amount;
        }
      );
    };

    // if its not on the map it adds it
    borrowedLendingToken.put(msg.caller, (new_borrowedLendingToken, Time.now()));

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
    #BadHealth : { old_collateral : Nat; borrowed : Nat; amount : Nat };
    #TransferError : ICRC.TransferFromError;
  };

  public shared (msg) func repay(amount : Nat) : async Result.Result<Nat, RepayError> {
    let token : ICRC.Actor = actor (Principal.toText(init_args.lendingToken));

    let ?(old_borrowedLendingToken, oldTime) = borrowedLendingToken.get(msg.caller);
    let currentTime = Time.now();

    let withdrawWithFeeAmt = await withdrawWithFee(amount, Int.abs(currentTime - oldTime));
    let new_borrowedLendingToken : Nat = old_borrowedLendingToken - amount;

    borrowedLendingToken.put(msg.caller, (new_borrowedLendingToken, Time.now()));

    let transfer_result = await token.icrc2_transfer_from({
      amount = withdrawWithFeeAmt;
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
        return #err(#TransferError(err));
        //we want to return an error of type TransferError
      };
    };

    // auto if payed everything remove from borrowersArray
    if (new_borrowedLendingToken == 0) {
      borrowedLendingToken.delete(msg.caller);
    };

    totalBorrowed -= amount;
    totalLendingToken += withdrawWithFeeAmt;

    return #ok(block_height);

  };

  // liquidate
  public type LiquidateError = {
    #InsufficientFunds : { balance : Nat };
    #IsHealthy : { collateral : Nat; borrowed : Nat };
    #TransferError : ICRC.TransferError;
  };

  public shared (msg) func liquidate(user : Principal) : async Result.Result<(), LiquidateError> {
    let borrowed = await getBorrowedLendingToken(user);
    let collateral = await getDepositedCollateral(msg.caller);

    if (await isHealthy(collateral, borrowed)) {
      // cant liquidate if is healthy
      return #err(#IsHealthy { collateral = collateral; borrowed = borrowed });
    };

    // we are leaving the collateral liquidated in the contract as overcollateral

    let old_collateral = await getDepositedCollateral(msg.caller);

    depositedCollateral.put(msg.caller, 0);
    depositedLendingToken.put(user, (0, Time.now() + 60 * 60 * 24 * 7 * 365 * 1000));

    return #ok();
  };

  // --------------------------- TIMERS ---------------------------

  public func startTimers() : async () {
    let _ = Timer.recurringTimer<system>(#seconds(60), updateCollateralPrice);
    let _ = Timer.recurringTimer<system>(#seconds(10 * 60), checkRandomBorrowerLiquidatable);
  };

};
