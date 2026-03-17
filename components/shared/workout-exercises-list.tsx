'use client'

import { useState } from 'react'
import type { WorkoutExercise } from '@/types/view'
import WorkoutExerciseCard from './workout-exercise-card'

type WorkoutExercisesListProps = {
	exercises: WorkoutExercise[]
}

export default function WorkoutExercisesList({ exercises }: WorkoutExercisesListProps) {
	const [openIndex, setOpenIndex] = useState(exercises.length > 0 ? 0 : -1)

	const handleExerciseCompleted = (exerciseIndex: number) => {
		const nextExerciseIndex = exerciseIndex + 1
		setOpenIndex(nextExerciseIndex < exercises.length ? nextExerciseIndex : -1)
	}

	return (
		<div className='space-y-6'>
			{exercises.map((exercise, index) => (
				<WorkoutExerciseCard
					key={exercise.id}
					exercise={exercise}
					isOpen={openIndex === index}
					onOpenChange={isOpen => setOpenIndex(isOpen ? index : -1)}
					onExerciseCompleted={() => handleExerciseCompleted(index)}
				/>
			))}
		</div>
	)
}
