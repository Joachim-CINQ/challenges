import Analytics from '@/components/Analytics'
import '@/styles/tailwind.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7420123397062174"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body>{children}</body>
      <Analytics />
    </html>
  )
}
