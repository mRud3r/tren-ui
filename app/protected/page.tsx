import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'

export default async function ProtectedPage() {
	const supabase = await createClient()

	const { data, error } = await supabase.auth.getClaims()
	if (error || !data?.claims) {
		redirect('/auth/login')
	}

	return (
		<div className='flex-1 w-full flex flex-col gap-12'>
			<Button className='bg-accent text-accent-foreground'>Test</Button>
		</div>
	)
}
