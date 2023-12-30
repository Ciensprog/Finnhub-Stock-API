'use client'

import { Card } from '@/components/Card'

import { useStocksStore } from '@/states/stocks'
import { useStore } from '@/states/store'
import clsx from 'clsx'

export function Stocks() {
  const rawStocks = useStore(useStocksStore, (state) => state.stocks)
  const stocks = Object.values(rawStocks || {})

  if (stocks.length === 0) {
    return (
      <Card className="justify-center mt-6 text-lg w-full">
        No data...
      </Card>
    )
  }

  return (
    <div className="gap-4 grid grid-cols-1 mt-6 min-[460px]:grid-cols-2 md:grid-cols-4 xl:grid-cols-5">
      {stocks.map((data) => (
        <Card
          className=""
          key={data.raw.symbol}
        >
          <div className="">
            <p className="w-full">
              {data.raw.displaySymbol} - {data.raw.description}
            </p>
            <p className="">
              <span
                className={clsx(
                  'text-2xl',
                  data.lastPrice >= data.priceAlert
                    ? 'text-green-600'
                    : 'text-red-600'
                )}
              >
                {Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(data.lastPrice)}{' '}
              </span>
            </p>
            <p className="">
              Price Alert:{' '}
              <span className="">
                {Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(data.priceAlert)}
              </span>
            </p>
          </div>
        </Card>
      ))}
    </div>
  )
}
