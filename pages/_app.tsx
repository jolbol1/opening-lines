/* eslint-disable  */
import { Analytics } from '@vercel/analytics/react'
import type { AppProps } from 'next/app'
import '../styles/globals.css'
import { Inter } from '@next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <main className={`${inter.variable} font-sans bg-zinc-900`}>
      <Component {...pageProps} />
      <Analytics />
    </main>
  )
}

export default MyApp
