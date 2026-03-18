import WorkoutExercisesList from '@/components/shared/workout-exercises-list'
import WorkoutSessionHeader from '@/components/shared/workout-session-header'
import { createClient } from '@/lib/supabase/server'

export default async function WorkoutSessionPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	const supabase = createClient()

	const sessionId = Number(id)

	const { data: session } = await (await supabase)
		.from('workout_session')
		.select('id, workout_id')
		.eq('id', sessionId)
		.single()

	if (!session) {
		throw new Error('Workout session not found')
	}

	const { data: workoutExercises } = await (
		await supabase
	)
		.from('workout_exercises')
		.select(
			`
	exercise:exercises (
	  id,
	  exercise_name
	)
  `,
		)
		.eq('workout_id', session.workout_id)

	const exercises =
		workoutExercises?.map(item => ({
			id: item.exercise.id,
			name: item.exercise.exercise_name,
		})) ?? []

	return (
		<div>
			<WorkoutSessionHeader sessionId={id} workoutLabel={`Workout ${id}`} exercises={exercises} />
			<div className='w-full space-y-6 p-4 max-w-7xl mx-auto'>
				<WorkoutExercisesList exercises={exercises} />
			</div>
		</div>
	)
}
