import FinishWorkoutButton from '@/components/shared/finish-workout-button'

export default async function WorkoutPage({ params }: { params: { id: string } }) {
	const { id } = params

	return (
		<div>
			<h1>Workout {id}</h1>
			<FinishWorkoutButton sessionId={id} />
		</div>
	)
}
