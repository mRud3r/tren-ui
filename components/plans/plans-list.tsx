import { getCurrentUserId } from '@/lib/auth'
import { fetchPlans } from '@/data/plans.server'
import { PlanCard } from './plan-card'

export async function PlansList() {
	const userId = await getCurrentUserId()

	let plans: Awaited<ReturnType<typeof fetchPlans>>
	try {
		plans = await fetchPlans(userId)
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
