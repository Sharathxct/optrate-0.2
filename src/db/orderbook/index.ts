import { getBalance, lockInr } from "../inr";
import STOCK_BALANCES, { addUserInStock, getStockBalance, lockStock } from "../stock";
import { ORDERBOOK } from "./store";

function addPriceInStock(stockId: string, stock_type: string, price: number) {
  if (stock_type !== "yes" && stock_type !== "no") {
    throw new Error('Invalid stock type. Use "yes" or "no".');
  }
  if (!ORDERBOOK[stockId]) {
    throw new Error('Invalid stock id');
  }
  if (ORDERBOOK[stockId][stock_type].hasOwnProperty(price)) {
    return;
  }
  ORDERBOOK[stockId][stock_type][price] = {
    total: 0,
    orders: {}
  }
}

function addUsertoOrders(userId: string, stockId: string, stock_type: string, price: number) {
  if (stock_type !== "yes" && stock_type !== "no") {
    throw new Error('Invalid stock type. Use "yes" or "no".');
  }
  if (!ORDERBOOK[stockId]) {
    throw new Error('Invalid stock id');
  }
  if (ORDERBOOK[stockId][stock_type][price]['orders'].hasOwnProperty(userId)) {
    return;
  }
  ORDERBOOK[stockId][stock_type][price]['orders'][userId] = 0;
}

// Create new symbol
export function addSymbolInOrderBook(symbol: string) {
  if (ORDERBOOK[symbol]) {
    throw new Error('id already taken')
  }
  ORDERBOOK[symbol] = {
    yes: {

    },
    no: {

    }
  }
}

function addOrder(userId: string, stockId: string, stock_type: string, price: number, quantity: number) {
  if (stock_type !== 'yes' && stock_type !== 'no') {
    throw new Error('Invalid stock');
  }
  if (!ORDERBOOK[stockId]) {
    addSymbolInOrderBook(stockId);
  }
  if (!ORDERBOOK[stockId][stock_type].hasOwnProperty(price)) {
    addPriceInStock(stockId, stock_type, price);
  }
  ORDERBOOK[stockId][stock_type][price].total += quantity;
  ORDERBOOK[stockId][stock_type][price]['orders'][userId] += quantity;
}

// Buy yes
export function orderBuyYes(userId: string, stock_id: string, price: number, quantity: number) {
  const user_bal = getBalance(userId);
  if (user_bal < (price * quantity)) {
    throw new Error('Inr is not sufficient');
  }
  if (!ORDERBOOK[stock_id]) {
    throw new Error('Stock id invalid');
  }
  const no_price = 1000 - price;
  if (!ORDERBOOK[stock_id]['no'].hasOwnProperty(no_price)) {
    addPriceInStock(stock_id, 'no', no_price);
  }
  if (!ORDERBOOK[stock_id]['no'][no_price]['orders'].hasOwnProperty(userId)) {
    addUsertoOrders(userId, stock_id, 'no', no_price)
  }
  try {
    lockInr(userId, price * quantity)
    addOrder(userId, stock_id, 'no', no_price, quantity)
  } catch (err) {
    throw err;
  }
}

// Sell yes
export function orderSellYes(userId: string, stock_id: string, price: number, quantity: number) {
  const stocks = getStockBalance(userId, stock_id, 'yes');
  if (stocks < quantity) {
    throw new Error('Not sufficient');
  }
  if (!ORDERBOOK[stock_id]['yes'].hasOwnProperty(price)) {
    addPriceInStock(stock_id, 'yes', price);
  }

  if (!ORDERBOOK[stock_id]['yes'][price]['orders'].hasOwnProperty(userId)) {
    addUsertoOrders(userId, stock_id, 'yes', price)
  }

  try {
    lockStock(userId, stock_id, 'yes', quantity);
    addOrder(userId, stock_id, 'yes', price, quantity);
  }
  catch (err) {
    throw err;
  }
}

// Buy no
export function orderBuyNo(userId: string, stock_id: string, price: number, quantity: number) {
  const user_bal = getBalance(userId);
  if (user_bal < price * quantity) {
    throw new Error('Inr is not sufficient');
  }
  if (!ORDERBOOK[stock_id]) {
    throw new Error('Stock id invalid');
  }
  const yes_price = 1000 - price;
  if (!ORDERBOOK[stock_id]['yes'].hasOwnProperty(yes_price)) {
    addPriceInStock(stock_id, 'yes', yes_price);
  }
  if (!ORDERBOOK[stock_id]['yes'][yes_price]['orders'].hasOwnProperty(userId)) {
    addUsertoOrders(userId, stock_id, 'yes', yes_price)
  }
  try {
    lockInr(userId, price * quantity)
    addOrder(userId, stock_id, 'yes', yes_price, quantity)
  } catch (err) {
    throw err;
  }

}

// Sell no
export function orderSellNo(userId: string, stock_id: string, price: number, quantity: number) {
  const stocks = getStockBalance(userId, stock_id, 'yes');
  if (stocks < quantity) {
    throw new Error('Not sufficient');
  }
  if (!ORDERBOOK[stock_id]['no'].hasOwnProperty(price)) {
    addPriceInStock(stock_id, 'no', price);
  }

  if (!ORDERBOOK[stock_id]['no'][price]['orders'].hasOwnProperty(userId)) {
    addUsertoOrders(userId, stock_id, 'no', price)
  }
  try {
    lockStock(userId, stock_id, 'no', quantity);
    addOrder(userId, stock_id, 'no', price, quantity);
  }
  catch (err) {
    throw err;
  }

}

export default ORDERBOOK;
