import type { Metadata } from 'next'
import './globals.css'
import { DM_Sans } from 'next/font/google'

export const metadata: Metadata = {
  title: '',
  description: '',
}

const DMSans = DM_Sans({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${DMSans.className}`}>{children}</body>
    </html>
  )
}
