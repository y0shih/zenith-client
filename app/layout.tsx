import type { Metadata } from 'next'
import { Space_Grotesk, DM_Sans } from 'next/font/google'
import { SessionProvider } from '@/components/layout/session-provider'
import { ThemeProvider } from '@/components/layout/theme-provider'
import { AppHeader } from '@/components/layout/app-header'
import { GlobalChat } from '@/components/features/chat/global-chat'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: '--font-space-grotesk' });
const dmSans = DM_Sans({ subsets: ["latin"], variable: '--font-dm-sans' });

export const metadata: Metadata = {
  title: 'Zenith',
  description: 'Discover your next opportunity with Zenith-Go',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dmSans.variable} ${spaceGrotesk.variable} font-sans antialiased bg-background text-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <SessionProvider>
            <AppHeader />
            {children}
            <GlobalChat />
            <Toaster richColors position="top-right" />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
