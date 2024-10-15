interface UserBalance {
  balance: number;
  locked: number;
}

interface INR_BALANCE {
  [userId: string]: UserBalance;
}

export const INR_BALANCES: INR_BALANCE = {

};

