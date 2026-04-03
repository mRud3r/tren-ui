'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { signInWithEmail } from './actions'

export default function SignInPage() {
	const [state, formAction, isPending] = useActionState(signInWithEmail, null)

	return (
		<div className='min-h-screen flex items-center justify-center p-4'>
			<Card className='w-full max-w-sm'>
				<CardHeader>
					<CardTitle>Sign in</CardTitle>
					<CardDescription>Enter your credentials to access your account.</CardDescription>
				</CardHeader>
				<CardContent>
					<form action={formAction} className='flex flex-col gap-4'>
						<div className='flex flex-col gap-1.5'>
							<Label htmlFor='email'>Email</Label>
							<Input id='email' name='email' type='email' required placeholder='you@example.com' />
						</div>

						<div className='flex flex-col gap-1.5'>
							<Label htmlFor='password'>Password</Label>
							<Input id='password' name='password' type='password' required placeholder='••••••••' />
						</div>

						{state?.error && (
							<p className='text-sm text-destructive'>{state.error}</p>
						)}

						<Button type='submit' disabled={isPending} className='w-full'>
							{isPending ? 'Signing in...' : 'Sign in'}
						</Button>

						<p className='text-sm text-center text-muted-foreground'>
							Don&apos;t have an account?{' '}
							<Link href='/auth/sign-up' className='underline underline-offset-4 text-foreground'>
								Sign up
							</Link>
						</p>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}
