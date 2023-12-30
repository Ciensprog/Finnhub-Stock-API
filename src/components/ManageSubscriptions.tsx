'use client'

import type { StockList } from '@/states/stocks'

import { useEffect, useRef, useState } from 'react'

import { FINNHUB_API_KEY } from '@/constants/config'
import { useStocksStore } from '@/states/stocks'
import { useStore } from '@/states/store'

export function ManageSubscriptions() {
  const $socket = useRef<WebSocket | null>(null)
  const $currentSubscriptions = useRef<StockList>({})

  const [statusOpen, setStatusOpen] = useState(false)

  const rawStocks = useStore(useStocksStore, (state) => state.stocks)
  const addStock = useStocksStore((state) => state.addStock)

  useEffect(() => {
    // Manage WebSocket

    if (!$socket.current) {
      $socket.current = new WebSocket(
        `wss://ws.finnhub.io?token=${FINNHUB_API_KEY}`
      )

      $socket.current?.addEventListener('open', () => {
        setStatusOpen(true)
      })

      $socket.current?.addEventListener('message', (event) => {
        const { data, type } = JSON.parse(event.data)

        if (type !== 'ping' && !!data[0]) {
          const current = data[0]
          const stockSymbol = current['s']

          if (!!$currentSubscriptions.current[stockSymbol]) {
            const subscription = $currentSubscriptions.current[stockSymbol]

            addStock({
              ...subscription,
              lastPrice: current['p'],
            })
          }
        }
      })

      $socket.current?.addEventListener('close', () => {
        setStatusOpen(false)
      })
    }

    const wsCurrent = $socket.current

    return () => {
      if (wsCurrent.readyState === WebSocket.OPEN) {
        wsCurrent.close()
        $socket.current = null
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const stocks = Object.values(rawStocks || {})

    if (!!stocks && statusOpen) {
      stocks.forEach((stock) => {
        // Update existing subscription
        if (!!$currentSubscriptions.current[`${stock.raw.symbol}`]) {
          $currentSubscriptions.current[`${stock.raw.symbol}`] = stock
        }

        if (
          $currentSubscriptions.current[`${stock.raw.symbol}`] ===
          undefined
        ) {
          $socket.current?.send(
            JSON.stringify({
              symbol: stock.raw.symbol,
              type: 'subscribe',
            })
          )
          $currentSubscriptions.current[`${stock.raw.symbol}`] = stock
        }
      })
    }
  }, [rawStocks, statusOpen])

  return null
}
