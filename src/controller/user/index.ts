import { Request, Response } from 'express';
import INR_BALANCES, { addInr, deductInr, lockInr } from '../../db/inr';
import { addUserInInr, getBalance } from "../../db/inr";
import STOCK_BALANCES, { addStockInUser, topupStock } from '../../db/stock';
import ORDERBOOK, { addSymbolInOrderBook, orderBuyNo, orderBuyYes, orderSellNo, orderSellYes } from '../../db/orderbook';


export function addUser(req: Request, res: Response) {
  const { userId } = req.params;
  try {
    addUserInInr(userId, 0)
    res.status(201).json({ message: `User ${userId} created` });
  }
  catch (err) {
    res.status(500).send({ message: err })
  }
}

export function inr_balances(req: Request, res: Response) {
  res.send(INR_BALANCES);
}

export function stock_balances(req: Request, res: Response) {
  res.send(STOCK_BALANCES);
}

export function inr_balance(req: Request, res: Response) {
  const { userId } = req.params;
  try {
    const balance = getBalance(userId);
    res.send({ balance: balance });
  }
  catch (err) {
    console.log("error = ", err);
    res.send(err);
  }
}

export function onramp(req: Request, res: Response) {
  console.log(req.body);
  const { userId, amount } = req.body;
  addInr(userId, parseInt(amount));
  res.send({ message: `Onramped ${userId} with amount ${amount}` });
}

export function createSymbol(req: Request, res: Response) {
  const { stockSymbol } = req.params;
  addSymbolInOrderBook(stockSymbol);
  res.status(201).json({ message: `Symbol ${stockSymbol} created` });
}

export function orderbook(req: Request, res: Response) {
  res.send(ORDERBOOK);
}

export function stock_balance(req: Request, res: Response) {
  const { userId } = req.params;
  if (!STOCK_BALANCES[userId]) {
    res.send({ message: "start trading to see balance" });
  }
  res.send(STOCK_BALANCES[userId]);
}

export function buyYes(req: Request, res: Response) {
  const { userId, stockSymbol, price, quantity } = req.body;
  orderBuyYes(userId, stockSymbol, price, quantity);
  res.send(ORDERBOOK)
}

export function buyNo(req: Request, res: Response) {
  const { userId, stockSymbol, quantity, price } = req.body;
  orderBuyNo(userId, stockSymbol, price, quantity);
  res.send(ORDERBOOK)

}

export function sellYes(req: Request, res: Response) {
  const { userId, stockSymbol, quantity, price } = req.body;
  orderSellYes(userId, stockSymbol, price, quantity);
  res.send({ message: `Sell order placed for ${quantity} 'yes' options at price ${price}.` });
}

export function sellNo(req: Request, res: Response) {
  const { userId, stockSymbol, quantity, price } = req.body;
  orderSellNo(userId, stockSymbol, parseInt(price), parseInt(quantity))
  res.send({ message: `Sell order placed for ${quantity} 'no' options at price ${price}.` });
}

export function orders(req: Request, res: Response) {
  const { stockSymbol } = req.params;
  res.send(ORDERBOOK[stockSymbol]);
}

export function mint(req: Request, res: Response) {
  const { userId, stockSymbol, quantity } = req.body;

  const price = parseInt(quantity) * 1000;
  const balance = deductInr(userId, price);

  topupStock(userId, stockSymbol, 'yes', parseInt(quantity))
  topupStock(userId, stockSymbol, 'no', parseInt(quantity))

  res.send({ message: `Minted ${quantity} 'yes' and 'no' tokens for user ${userId}, remaining balance is ${balance}` });
}
