import { getCurrentUserId } from '@/lib/auth'
import { fetchInitialWorkouts } from '@/data/workouts.server'
import { AddPlanForm } from '@/components/plans/add-plan-form'
import { Button } from '@/components/ui/button'

const FORM_ID = 'add-plan-form'

export default async function AddPlanPage() {
	const userId = await getCurrentUserId()
	const workouts = await fetchInitialWorkouts(userId)

	return (
		<div className='w-full space-y-6 p-4 h-full'>
			<div className='flex items-center justify-between'>
				<h1 className='text-2xl font-medium'>New Plan</h1>
				<Button type='submit' form={FORM_ID}>
					Save plan
				</Button>
			</div>
			<AddPlanForm workouts={workouts} id={FORM_ID} />
		</div>
	)
}
