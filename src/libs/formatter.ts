import type { SymbolLookupInfo } from 'react-finnhub'

export type OptionInfo = {
  label: string
  value: string
}

export function parseOptions(
  response?: Array<SymbolLookupInfo>
): Array<OptionInfo> {
  return (
    response
      ?.filter(
        (data) =>
          data.displaySymbol?.trim() !== '' && data.symbol?.trim() !== ''
      )
      .map((data) => ({
        label: `${data.displaySymbol} (${data.description})`,
        value: `${data.symbol}`,
      })) || []
  )
}
