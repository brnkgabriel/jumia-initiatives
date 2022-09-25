import { IDBConfig, IConstants } from "./interfaces/others";

export const config:IDBConfig = {
  apiKey: "AIzaSyAA8dQEt-yZnDyY3Lra8lndRJ3LWNYVW0o",
  authDomain: "jumia-c15a3.firebaseapp.com",
  databaseURL: "https://jumia-c15a3.firebaseio.com",
  projectId: "jumia-c15a3",
  storageBucket: "jumia-c15a3.appspot.com",
  messagingSenderId: "295115190934",
  appId: "1:295115190934:web:de0b33b53a514c3c"
}

export const constants:IConstants = {
  SHEETNAME: "campaign_calendar",
  NAME: "Campaign Calendar",
  TANDC: "Campaign Calendar T & Cs",
  FOCUS: "focus",
  BUILD: "build",
  RESET: "reset",
  TABLISTENER: "tab listener",
  FIRSTTAB: "first tab",
  INSESSION: "in session",
  AFTERSESSION: "after session",
  BTWORB4SESSION: "between or before session",
  TIMESLOTSTODISPLAY: 12,
  SKUROWCLASS: ".-sku_row",
  LIVECLASS: "-live",
  OOSCLASS: "-oos",
  TABCLASS: "-tab"
}

export const fxn = {
  idQuery: (query: string) => "#initiative " + query,
  timeQuery: (time: number) => '.-sku_row[data-time="' + time + '"]',
  tabQuery: (time: number) => '.-tab[data-time="' + time + '"]'
}