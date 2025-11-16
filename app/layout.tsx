import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'WriteApp',
  description: 'A writing and blogging application',
  title: 'Butterfiles - Writing Portfolio',
  description: 'A portfolio of my writing',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
