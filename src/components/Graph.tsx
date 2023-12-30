'use client'

import { useStocksStore } from '@/states/stocks'
import { useStore } from '@/states/store'

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

export function Graph() {
  const rawStocks = useStore(useStocksStore, (state) => state.stocks)
  const stocks = Object.values(rawStocks || {}).map((stock) => ({
    price: stock.lastPrice,
    name: stock.raw.displaySymbol,
  }))

  if (stocks.length === 0) {
    return null
  }

  return (
    <div className="h-[300px] mt-10 w-full">
      <ResponsiveContainer>
        <BarChart
          data={stocks}
          margin={{
            bottom: 25,
            left: 25,
            right: 25,
            top: 25,
          }}
        >
          <Bar
            dataKey="price"
            fill="rgb(39 39 42 / 0.8)"
          />
          <XAxis dataKey="name" />
          <YAxis />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
