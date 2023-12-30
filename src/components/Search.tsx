'use client'

import type { SelectInstance, SingleValue } from 'react-select'
import type { SymbolLookupInfo } from 'react-finnhub'
import type { OptionInfo } from '@/libs/formatter'
import type { StockData } from '@/states/stocks'

import { FormEvent, useRef } from 'react'
import { useFinnhub } from 'react-finnhub'
import { AsyncPaginate } from 'react-select-async-paginate'

import { parseOptions } from '@/libs/formatter'
import { Finnhub } from '@/providers/Finnhub'
import { useStocksStore } from '@/states/stocks'
import { useStore } from '@/states/store'

const defaultCurrentStockData: StockData = {
  lastPrice: 0,
  priceAlert: 0,
  raw: {},
}

export function Search() {
  const $form = useRef<HTMLFormElement>(null)
  const $select = useRef<SelectInstance<OptionInfo>>(null)

  const $tempCurrentStocks = useRef(defaultCurrentStockData)
  const $tempStocks = useRef<Array<SymbolLookupInfo>>([])

  const finnhub = useFinnhub()
  const rawStocks = useStore(useStocksStore, (state) => state.stocks)
  const addStock = useStocksStore((state) => state.addStock)

  const loadOptions = async (value: string) => {
    const defaultResponse = {
      options: [],
    }

    if (value.trim() === '') {
      return defaultResponse
    }

    try {
      const response = await finnhub.symbolSearch(value)

      if (response.data.result) {
        const parsedOptions = parseOptions(response.data.result)

        $tempStocks.current = response.data.result

        return {
          options: parsedOptions,
        }
      }
    } catch (error) {
      //
    }

    return defaultResponse
  }

  const onChangeOption = (option: SingleValue<OptionInfo>) => {
    const optionSelected = $tempStocks.current.find(
      (data) => data.symbol === option?.value
    )

    if (optionSelected) {
      $tempCurrentStocks.current.raw = optionSelected
    }
  }

  const registerStock = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = Object.fromEntries(new FormData(event.currentTarget))
    const priceAlert = parseInt(formData['priceAlert'] as string, 10)

    const currentStock =
      rawStocks?.[`${$tempCurrentStocks.current.raw.symbol}`]

    const newStockData = {
      ...$tempCurrentStocks.current,
      ...(currentStock ?? {}),
      priceAlert,
    }

    if (
      newStockData.priceAlert >= 0 &&
      Object.keys(newStockData.raw).length > 0
    ) {
      addStock(newStockData)

      $tempCurrentStocks.current = { ...defaultCurrentStockData }

      $select.current?.clearValue()
      $form.current?.reset()
    }
  }

  return (
    <form
      className="flex flex-wrap justify-center gap-2 mx-auto w-full max-w-80"
      ref={$form}
      onSubmit={registerStock}
    >
      <div className="flex flex-wrap gap-2">
        <AsyncPaginate
          className="text-gray-900 w-full"
          debounceTimeout={300}
          loadingMessage={() => 'Searching symbols...'}
          name="search"
          placeholder="Search by: symbol, name, isin or cusip"
          loadOptions={loadOptions}
          onChange={onChangeOption}
          instanceId="search"
          selectRef={$select}
        />
        <div className="flex flex-wrap gap-2 w-full">
          <label htmlFor="price-alert">Price Alert:</label>
          <input
            type="number"
            className="px-2 py-1 rounded text-gray-900 w-full"
            name="priceAlert"
            id="price-alert"
          />
        </div>
      </div>
      <button
        type="submit"
        className="bg-zinc-800/80 mt-5 px-5 py-2 rounded text-zinc-200 hover:opacity-75 dark:text-[var(--foreground-rgb)]"
      >
        Subscribe
      </button>
    </form>
  )
}

export function SearchWithProviders() {
  return (
    <Finnhub>
      <Search />
    </Finnhub>
  )
}
