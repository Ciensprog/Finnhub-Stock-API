import { Graph } from '@/components/Graph'
import { ManageSubscriptions } from '@/components/ManageSubscriptions'
import { SearchWithProviders } from '@/components/Search'
import { Stocks } from '@/components/Stocks'

export default function Page() {
  return (
    <main className="min-h-screen p-5">
      <SearchWithProviders />
      <Graph />
      <Stocks />
      <ManageSubscriptions />
    </main>
  )
}
