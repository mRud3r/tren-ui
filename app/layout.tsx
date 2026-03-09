import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { authClient } from '@/lib/auth/client'
import { NeonAuthUIProvider } from '@neondatabase/auth/react'
import './globals.css'

const defaultUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'

export const metadata: Metadata = {
	metadataBase: new URL(defaultUrl),
	title: 'TrenUI',
	description: 'Description',
}

const geistSans = Geist({
	variable: '--font-geist-sans',
	display: 'swap',
	subsets: ['latin'],
})

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body className={`${geistSans.className} antialiased`}>
				<ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
					{/* @ts-expect-error — beta SDK internal type mismatch between better-auth versions */}
					<NeonAuthUIProvider authClient={authClient} redirectTo='/dashboard'>
						{children}
					</NeonAuthUIProvider>
				</ThemeProvider>
			</body>
		</html>
	)
}
