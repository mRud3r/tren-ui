'use client'

import { useState } from 'react'
import { Button } from '../ui/button'
import { createClient } from '@/lib/supabase/client'
import { useWorkoutSessionStore } from '@/stores/workoutSession.store'
import { Save } from 'lucide-react'

type FinishWorkoutButtonProps = {
	sessionId: string
	canSave?: boolean
}

export default function FinishWorkoutButton({ sessionId, canSave = true }: FinishWorkoutButtonProps) {
	const supabase = createClient()
	const [loading, setLoading] = useState(false)
	const [finished, setFinished] = useState(false)

	async function finishWorkout() {
		if (!canSave || loading || finished) return

		try {
			setLoading(true)

			const exercises = Object.values(useWorkoutSessionStore.getState().exercises)

			if (exercises.length > 0) {
				const exerciseRows = exercises.map(exercise => ({
					session_id: Number(sessionId),
					exercise_id: exercise.exerciseId,
					notes: exercise.notes ?? null,
				}))

				const { data: insertedExerciseSessions, error: exerciseSessionError } = await supabase
					.from('exercise_session')
					.insert(exerciseRows)
					.select('id, exercise_id')

				if (exerciseSessionError) throw exerciseSessionError

				const exercisesById = new Map(exercises.map(exercise => [exercise.exerciseId, exercise]))

				const setRows = (insertedExerciseSessions ?? []).flatMap(insertedSession => {
					const exercise = exercisesById.get(insertedSession.exercise_id)

					if (!exercise) return []

					return exercise.sets.map(set => ({
						session_id: insertedSession.id,
						reps: set.reps,
						weight: set.weight ?? null,
						inensity: set.intensity ?? null,
					}))
				})

				if (setRows.length > 0) {
					const { error: exerciseSetError } = await supabase.from('exercise_set').insert(setRows)

					if (exerciseSetError) throw exerciseSetError
				}
			}

			useWorkoutSessionStore.getState().clear()
			setFinished(true)
		} catch (err) {
			console.error('Failed to finish workout:', err)
		} finally {
			setLoading(false)
		}
	}

	return (
		<Button onClick={finishWorkout} disabled={loading || finished || !canSave}>
			<Save className='ml-1 h-4 w-4' />
			{finished ? 'Workout Saved' : loading ? 'Saving…' : canSave ? 'Save workout' : 'Complete all sets'}
		</Button>
	)
}
