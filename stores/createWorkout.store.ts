import { create } from 'zustand'
import type { ExerciseCardData } from '@/types/view'

type CreateWorkoutState = {
	name: string
	exercises: Record<number, ExerciseCardData>

	setName: (name: string) => void
	addExercise: (exercise: ExerciseCardData) => void
	removeExercise: (exerciseId: number) => void
	clear: () => void
}

export const useCreateWorkoutStore = create<CreateWorkoutState>(set => ({
	name: '',
	exercises: {},

	setName: name => set({ name }),

	addExercise: exercise =>
		set(state => ({
			exercises: {
				...state.exercises,
				[exercise.id]: exercise,
			},
		})),

	removeExercise: exerciseId =>
		set(state => {
			const nextExercises = { ...state.exercises }
			delete nextExercises[exerciseId]

			return { exercises: nextExercises }
		}),

	clear: () => set({ name: '', exercises: {} }),
}))
