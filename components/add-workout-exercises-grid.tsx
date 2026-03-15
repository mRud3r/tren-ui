'use client'

import { ExerciseCard } from '@/components/exercise-card'
import { useCreateWorkoutStore } from '@/stores/createWorkout.store'
import type { ExerciseCardData } from '@/types/view'

type Props = {
	exercises: ExerciseCardData[]
}

export function AddWorkoutExercisesGrid({ exercises }: Props) {
	const selectedExercises = useCreateWorkoutStore(state => state.exercises)
	const addExercise = useCreateWorkoutStore(state => state.addExercise)
	const removeExercise = useCreateWorkoutStore(state => state.removeExercise)

	return (
		<div className='grid sm:grid-cols-1 xl:grid-cols-2 gap-4'>
			{exercises.map(exercise => {
				const isSelected = Boolean(selectedExercises[exercise.id])

				return (
					<button
						key={exercise.id}
						type='button'
						onClick={() => {
							if (isSelected) {
								removeExercise(exercise.id)
								return
							}

							addExercise(exercise)
						}}
						aria-pressed={isSelected}
						className='text-left rounded-xl'>
						<ExerciseCard exercise={exercise} variant='workout' selected={isSelected} />
					</button>
				)
			})}
		</div>
	)
}
