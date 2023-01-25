import Link from 'next/link'

export function Header() {
  return (
    <header className="flex justify-center items-center w-full mt-5 border-b-2 pb-7 sm:px-4 px-2">
      <Link href="/">
        <h1 className="font-sans font-extrabold sm:text-6xl text-4xl pb-2 tracking-tight bg-gradient-to-r from-rose-500 to-orange-500 text-transparent bg-clip-text">
          OpeningLines.io
        </h1>
      </Link>
    </header>
  )
}
