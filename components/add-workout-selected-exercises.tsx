'use client'

import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCreateWorkoutStore } from '@/stores/createWorkout.store'
import { exerciseTypeConfig } from '@/lib/exerciseTypeIcons'

export function AddWorkoutSelectedExercises() {
	const selectedExercisesMap = useCreateWorkoutStore(state => state.exercises)
	const removeExercise = useCreateWorkoutStore(state => state.removeExercise)

	const selectedExercises = Object.values(selectedExercisesMap)

	if (selectedExercises.length === 0) {
		return <p className='text-sm text-muted-foreground'>No exercises selected yet.</p>
	}

	return (
		<div className='space-y-3'>
			<p className='text-sm text-muted-foreground'>Selected: {selectedExercises.length}</p>
			<div className='space-y-2'>
				{selectedExercises.map(exercise => {
					const ExerciseTypeIcon = exercise.type ? exerciseTypeConfig[exercise.type].icon : null

					return (
						<div key={exercise.id} className='flex items-center justify-between gap-3 rounded-lg border p-2'>
							<div className='flex gap-2 items-center'>
								<div className='p-2 rounded-full bg-accent'>
									{ExerciseTypeIcon && <ExerciseTypeIcon className='w-4 h-4' />}
								</div>
								<div>
									<p className='text-sm font-medium leading-none flex items-center gap-2'>{exercise.name}</p>
									<p className='text-xs text-muted-foreground mt-1'>
										{exercise.primaryMuscle?.name ?? 'No muscle group'}
									</p>
								</div>
							</div>
							<Button
								type='button'
								variant='ghost'
								size='icon'
								onClick={() => removeExercise(exercise.id)}
								aria-label={`Remove ${exercise.name} from workout`}>
								<X className='h-4 w-4' />
							</Button>
						</div>
					)
				})}
			</div>
		</div>
	)
}
