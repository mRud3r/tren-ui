'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { signUpWithEmail } from './actions'

export default function SignUpPage() {
	const [state, formAction, isPending] = useActionState(signUpWithEmail, null)

	return (
		<div className='min-h-screen flex items-center justify-center p-4'>
			<Card className='w-full max-w-sm'>
				<CardHeader>
					<CardTitle>Create account</CardTitle>
					<CardDescription>Sign up to start tracking your workouts.</CardDescription>
				</CardHeader>
				<CardContent>
					<form action={formAction} className='flex flex-col gap-4'>
						<div className='flex flex-col gap-1.5'>
							<Label htmlFor='name'>Name</Label>
							<Input id='name' name='name' type='text' required placeholder='John Doe' />
						</div>

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
							{isPending ? 'Creating account...' : 'Create account'}
						</Button>

						<p className='text-sm text-center text-muted-foreground'>
							Already have an account?{' '}
							<Link href='/auth/sign-in' className='underline underline-offset-4 text-foreground'>
								Sign in
							</Link>
						</p>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}
