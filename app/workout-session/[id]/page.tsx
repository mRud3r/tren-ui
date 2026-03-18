import WorkoutExercisesList from '@/components/shared/workout-exercises-list'
import WorkoutSessionHeader from '@/components/shared/workout-session-header'
import { createClient } from '@/lib/supabase/server'

export default async function WorkoutSessionPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	const supabase = createClient()

	const workoutId = Number(id)

	const { data: workout } = await (await supabase).from('workouts').select('id, name').eq('id', workoutId).single()

	if (!workout) {
		throw new Error('Workout not found')
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
		.eq('workout_id', workout.id)

	const exercises =
		workoutExercises?.map(item => ({
			id: item.exercise.id,
			name: item.exercise.exercise_name,
		})) ?? []

	return (
		<div>
			<WorkoutSessionHeader workoutId={id} workoutLabel={workout.name} exercises={exercises} />
			<div className='w-full space-y-6 p-4 max-w-7xl mx-auto'>
				<WorkoutExercisesList exercises={exercises} />
			</div>
		</div>
	)
}
