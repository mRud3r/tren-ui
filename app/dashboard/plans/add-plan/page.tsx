import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { fetchInitialWorkouts } from '@/features/workouts/queries/workouts.server'
import { AddPlanForm } from '@/features/plans/components/add-plan-form'

export default async function AddPlanPage() {
	const supabase = await createClient()

	const {
		data: { user },
		error,
	} = await supabase.auth.getUser()

	if (error || !user) redirect('/auth/login')

	const workouts = await fetchInitialWorkouts(supabase, user.id)

	return (
		<div className='w-full space-y-6 p-4'>
			<div>
				<h1 className='text-2xl font-medium'>New plan</h1>
				<p className='text-sm text-muted-foreground mt-1'>Build a weekly training schedule from your workouts.</p>
			</div>
			<AddPlanForm workouts={workouts} />
		</div>
	)
}
