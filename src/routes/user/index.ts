import express from 'express'
import { addUser, buyNo, buyYes, createSymbol, inr_balance, inr_balances, mint, onramp, orderbook, orders, sellNo, sellYes, stock_balance, stock_balances } from '../../controller/user';

export const router = express.Router();

// Create a user
router.post('/user/create/:userId', addUser);

// Get INR balances
router.get('/balances/inr', inr_balances);

// Get STOCK balances
router.get('/balances/stock', stock_balances);

//Get INR Balance
router.get('/balance/inr/:userId', inr_balance);

// Onramp INR
router.post('/onramp/inr', onramp)

// Create a Symbol
router.post('/symbol/create/:stockSymbol', createSymbol);

// Get orderbook
router.get('/orderbook', orderbook);


// Get Stock Balance
router.get('/balance/stock/:userId', stock_balance)

// Buy the yes stock
router.post('/order/buy/yes', buyYes)

// 5. Place Sell Order for yes
router.post('/order/sell/yes', sellYes)

// Buy the no stock
router.post('/order/buy/no', buyNo)


// 5. Place Sell Order for no
router.post('/order/sell/no', sellNo)

// View Orderbook
router.get('/orderbook/:stockSymbol', orders)

// Mint fresh tokens
router.post('/trade/mint', mint)
