import { INR_BALANCES } from "./store";

// Create new user 
export function addUserInInr(userId: string, balance: number) {
  if (INR_BALANCES[userId]) {
    throw new Error(`User ${userId} already exists.`);
  }
  INR_BALANCES[userId] = { balance, locked: 0 };
}

// Deduct Inr
export function deductInr(userId: string, amount: number) {
  if (!INR_BALANCES[userId]) {
    throw new Error(`User ${userId} does not exist.`);
  }
  const old_balance = INR_BALANCES[userId].balance;
  if (old_balance < amount) {
    throw new Error('Insufficient INR balance in wallet onramp at /onramp');
  }
  INR_BALANCES[userId].balance = old_balance - amount;
  return INR_BALANCES[userId].balance;
}

// Add inr
export function addInr(userId: string, amount: number) {
  if (!INR_BALANCES[userId]) {
    throw new Error(`User ${userId} does not exist.`);
  }
  const old_balance = INR_BALANCES[userId].balance;
  INR_BALANCES[userId].balance = old_balance + amount;
}

// Lock inr
export function lockInr(userId: string, amount: number) {
  if (!INR_BALANCES[userId]) {
    throw new Error(`User ${userId} does not exist.`);
  }
  const old_balance = INR_BALANCES[userId].balance;
  if (old_balance < amount) {
    throw new Error('Insufficient INR balance in wallet onramp at /onramp');
  }

  INR_BALANCES[userId].balance = old_balance - amount;
  INR_BALANCES[userId].locked += amount;
}

// Unlock inr
export function unlockInr(userId: string, amount: number) {
  if (!INR_BALANCES[userId]) {
    throw new Error(`User ${userId} does not exist.`);
  }
  const locked_balance = INR_BALANCES[userId].locked;
  if (locked_balance < amount) {
    throw new Error('Insufficient INR in locked balance');
  }

  INR_BALANCES[userId].locked = locked_balance - amount;
  INR_BALANCES[userId].balance += amount;

}

// Balance of specific user
export function getBalance(userId: string) {
  if (!INR_BALANCES[userId]) {
    throw new Error(`User ${userId} does not exist.`);
  }
  return (INR_BALANCES[userId].balance);
}

export default INR_BALANCES;
