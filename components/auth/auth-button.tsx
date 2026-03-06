import Link from 'next/link'
import { Button } from '../ui/button'

// TODO: Replace with real auth session check
export async function AuthButton() {
	const user = null as { email: string } | null

	return user ? (
		<div className='flex items-center gap-4'>
			Hey, {user.email}!
			<Button variant='secondary'>
				<Link href='/dashboard'>Dashboard</Link>
			</Button>
		</div>
	) : (
		<div className='flex gap-2'>
			<Button asChild size='sm' variant={'outline'}>
				<Link href='/auth/login'>Sign in</Link>
			</Button>
			<Button asChild size='sm' variant={'default'}>
				<Link href='/auth/sign-up'>Sign up</Link>
			</Button>
		</div>
	)
}
