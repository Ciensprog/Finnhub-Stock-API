import { finnhubClient, FinnhubProvider } from 'react-finnhub'

import { FINNHUB_API_KEY } from '@/constants/config'

const client = finnhubClient(FINNHUB_API_KEY)

export function Finnhub({ children }: React.PropsWithChildren) {
  return <FinnhubProvider client={client}>{children}</FinnhubProvider>
}
