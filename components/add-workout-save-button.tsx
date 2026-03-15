'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useCreateWorkoutStore } from '@/stores/createWorkout.store'

export function AddWorkoutSaveButton() {
	const router = useRouter()
	const supabase = createClient()

	const name = useCreateWorkoutStore(state => state.name)
	const exercisesMap = useCreateWorkoutStore(state => state.exercises)
	const clear = useCreateWorkoutStore(state => state.clear)

	const [loading, setLoading] = useState(false)
	const [errorMessage, setErrorMessage] = useState<string | null>(null)

	const selectedExercises = Object.values(exercisesMap)
	const canSave = name.trim().length > 0 && selectedExercises.length > 0 && !loading

	async function saveWorkout() {
		if (!canSave) return

		setLoading(true)
		setErrorMessage(null)

		try {
			const { data: workout, error: workoutError } = await supabase
				.from('workouts')
				.insert({
					name: name.trim(),
				})
				.select('id')
				.single()

			if (workoutError || !workout) {
				throw workoutError ?? new Error('Failed to create workout.')
			}

			const rows = selectedExercises.map(exercise => ({
				workout_id: workout.id,
				exercise_id: exercise.id,
			}))

			const { error: exercisesError } = await supabase.from('workout_exercises').insert(rows)

			if (exercisesError) {
				await supabase.from('workouts').delete().eq('id', workout.id)
				throw exercisesError
			}

			clear()
			router.push('/dashboard/workouts')
			router.refresh()
		} catch (error) {
			console.error('Failed to save workout:', error)
			setErrorMessage(error instanceof Error ? error.message : 'Failed to save workout.')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className='flex flex-col items-end gap-1'>
			<Button type='button' onClick={saveWorkout} disabled={!canSave}>
				<Save className='h-4 w-4' />
				{loading ? 'Saving...' : 'Save workout'}
			</Button>
			{errorMessage && <p className='text-xs text-destructive'>{errorMessage}</p>}
		</div>
	)
}
