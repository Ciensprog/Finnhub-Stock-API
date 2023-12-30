import { useState, useEffect } from 'react'

export const useStore = <State, Callback>(
  store: (callback: (state: State) => unknown) => unknown,
  callback: (state: State) => Callback
) => {
  const result = store(callback) as Callback
  const [data, setData] = useState<Callback>()

  useEffect(() => {
    setData(result)
  }, [result])

  return data
}
