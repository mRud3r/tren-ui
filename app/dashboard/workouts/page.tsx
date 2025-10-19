import { WorkoutsList } from '@/components/workouts-list'

export default async function WorkoutsPage() {
	return (
		<>
			<h1 className='text-2xl font-medium'>Workouts</h1>
			<p>Create and manage your training routines</p>
			<WorkoutsList />
		</>
	)
}
