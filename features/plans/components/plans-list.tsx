import { createClient } from '@/lib/supabase/server'
import { fetchPlans } from '../queries/plans.server'
import { PlanCard } from './plan-card'

export async function PlansList() {
	const supabase = await createClient()
	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser()

	if (userError || !user) {
		return <p className='text-sm text-destructive'>Error: User not authenticated.</p>
	}

	let plans: Awaited<ReturnType<typeof fetchPlans>>
	try {
		plans = await fetchPlans(supabase, user.id)
	} catch (err) {
		const message = err instanceof Error ? err.message : 'Unknown error'
		return <p className='text-sm text-destructive'>Error: {message}</p>
	}

	if (plans.length === 0) {
		return (
			<div className='flex flex-col items-center gap-3 py-16 text-center'>
				<p className='text-sm text-muted-foreground'>No plans yet. Create your first training plan.</p>
			</div>
		)
	}

	return (
		<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
			{plans.map(plan => (
				<PlanCard key={plan.id} plan={plan} />
			))}
		</div>
	)
}
