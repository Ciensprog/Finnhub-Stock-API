import clsx from 'clsx'

export function Card({ children }: React.PropsWithChildren) {
  return (
    <div
      className={clsx(
        'border inline-flex p-4 rounded-xl text-sm',
        'bg-gradient-to-b border-gray-300 from-zinc-200 lg:bg-gray-200',
        'dark:bg-zinc-800/30 dark:border-neutral-800 dark:from-inherit lg:dark:bg-zinc-800/30'
      )}
    >
      {children}
    </div>
  )
}
