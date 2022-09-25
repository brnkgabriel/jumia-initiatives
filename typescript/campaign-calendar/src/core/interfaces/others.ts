export interface IDBConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export interface IConstants {
  SHEETNAME: string;
  NAME: string;
  TANDC: string;
  FOCUS: string;
  BUILD: string;
  RESET: string;
  TABLISTENER: string;
  FIRSTTAB: string;
  INSESSION: string;
  AFTERSESSION: string;
  BTWORB4SESSION: string;
  TIMESLOTSTODISPLAY: number;
  SKUROWCLASS: string;
  LIVECLASS: string;
  OOSCLASS: string;
  TABCLASS: string;
}

type KeyType = "Vote Deals" | "14 Days 14 Surprises" | "Wheel of Fortune" | "Treasure Hunt" | "Userneed" | "Shopper's Prize Draw" | "Jumia Food" | "What Do You Need" | "Tag" | "Solve & Win" | "Delivery Timelines" | "Pickup Stations" | "Help - Mall FAQs" | "Service Centers" | "Return FAQs" | "Return Timelines" | "Return Overview" | "Return Eligible Items" | "Jumia Express" | "Jumia Express FAQs" | "Jumdle" | "Jumdle T & Cs" | "Spot The Difference" | "Spot The Difference Images" | "Place Order" | "Track Order" | "Predict & Win" | "Winners" | "Mastercard" | "Standard Chartered" | "Gift Finder" | "International Shipping" | "International Shipping Stations" | "Jumia Prime" | "Surprises" | "Legal" | "Flash Sale" | "Campaign Calendar" | "Vote Deals T & C" | "WOF T & C" | "Treasure Hunt T & C" | "Solve & Win T & C" | "Quiz T & C" | "Spot The Difference T & C" | "Predict & Win T & C" | "Jumdle T & Cs" | "Surprises T & Cs" | "Flash Sale T & C" | "Campaign Calendar T & Cs";

export interface IGetDataOptions {
  key: string;
  name: string;
}