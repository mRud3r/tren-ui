'use client'

import { useEffect } from 'react'
import { useCreateWorkoutStore } from '@/stores/create-workout.store'
import type { ExerciseCardData } from '@/types/exercise.types'

type Props = {
	name: string
	exercises: ExerciseCardData[]
}

export function EditWorkoutInitializer({ name, exercises }: Props) {
	const clear = useCreateWorkoutStore(state => state.clear)
	const setName = useCreateWorkoutStore(state => state.setName)
	const addExercise = useCreateWorkoutStore(state => state.addExercise)

	useEffect(() => {
		clear()
		setName(name)
		exercises.forEach(ex => addExercise(ex))
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return null
}
