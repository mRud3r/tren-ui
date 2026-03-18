'use client'

import { useState } from 'react'
import type { WorkoutExercise } from '@/types/view'
import WorkoutExerciseCard from './workout-exercise-card'

type WorkoutExercisesListProps = {
	exercises: WorkoutExercise[]
}

export default function WorkoutExercisesList({ exercises }: WorkoutExercisesListProps) {
	const [openExerciseId, setOpenExerciseId] = useState<number | null>(exercises[0]?.id ?? null)

	const handleExerciseCompleted = (exerciseId: number) => {
		const currentIndex = exercises.findIndex(exercise => exercise.id === exerciseId)

		if (currentIndex === -1) {
			setOpenExerciseId(null)
			return
		}

		const nextExercise = exercises[currentIndex + 1]
		setOpenExerciseId(nextExercise?.id ?? null)
	}

	return (
		<div className='space-y-2 overflow-hidden'>
			{exercises.map(exercise => (
				<WorkoutExerciseCard
					key={exercise.id}
					exercise={exercise}
					isOpen={openExerciseId === exercise.id}
					onOpenChange={isOpen => setOpenExerciseId(isOpen ? exercise.id : null)}
					onExerciseCompleted={() => handleExerciseCompleted(exercise.id)}
				/>
			))}
		</div>
	)
}
