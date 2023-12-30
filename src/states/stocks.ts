import type { SymbolLookupInfo } from 'react-finnhub'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type StockData = {
  lastPrice: number
  priceAlert: number
  raw: SymbolLookupInfo
}

export type StockList = {
  [key: string]: StockData
}

export type StocksInfo = {
  stocks: StockList

  addStock: (stock: StockData) => void
}

export const useStocksStore = create<StocksInfo>()(
  persist(
    (set, get) => ({
      stocks: {},

      addStock: (stock) =>
        set({
          stocks: { ...get().stocks, [`${stock.raw.symbol}`]: stock },
        }),
    }),
    {
      name: 'stocks',
    }
  )
)
