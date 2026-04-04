import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { AddWorkoutSaveButton } from '@/components/workouts/builder/add-workout-save-button'
import { useCreateWorkoutStore } from '@/stores/create-workout.store'
import type { ExerciseCardData } from '@/types/exercise.types'

const pushMock = jest.fn()
const refreshMock = jest.fn()

jest.mock('next/navigation', () => ({
	useRouter: () => ({ push: pushMock, refresh: refreshMock }),
}))

const createWorkoutMock = jest.fn()
jest.mock('@/data/workouts.actions', () => ({
	createWorkout: (...args: unknown[]) => createWorkoutMock(...args),
}))

jest.mock('sonner', () => ({
	toast: { success: jest.fn(), error: jest.fn() },
}))

const exercise: ExerciseCardData = {
	id: 1,
	name: 'Squat',
	primaryMuscle: { id: 1, name: 'Quads' },
	secondaryMuscles: [],
	type: 'strength',
	trackingType: 'reps',
	weightType: 'weighted',
	isUnilateral: false,
}

beforeEach(() => {
	jest.clearAllMocks()
	useCreateWorkoutStore.getState().clear()
})

describe('AddWorkoutSaveButton', () => {
	describe('disabled state', () => {
		it('is disabled when name and exercises are both empty', () => {
			render(<AddWorkoutSaveButton />)
			expect(screen.getByRole('button', { name: /save workout/i })).toBeDisabled()
		})

		it('is disabled when name is empty but exercises are selected', () => {
			useCreateWorkoutStore.getState().addExercise(exercise)
			render(<AddWorkoutSaveButton />)
			expect(screen.getByRole('button', { name: /save workout/i })).toBeDisabled()
		})

		it('is disabled when name is set but no exercises are selected', () => {
			useCreateWorkoutStore.setState({ name: 'My Workout' })
			render(<AddWorkoutSaveButton />)
			expect(screen.getByRole('button', { name: /save workout/i })).toBeDisabled()
		})

		it('is disabled when name is only whitespace', () => {
			useCreateWorkoutStore.setState({ name: '   ' })
			useCreateWorkoutStore.getState().addExercise(exercise)
			render(<AddWorkoutSaveButton />)
			expect(screen.getByRole('button', { name: /save workout/i })).toBeDisabled()
		})
	})

	describe('enabled state', () => {
		it('is enabled when name and at least one exercise are set', () => {
			useCreateWorkoutStore.setState({ name: 'Push Day' })
			useCreateWorkoutStore.getState().addExercise(exercise)
			render(<AddWorkoutSaveButton />)
			expect(screen.getByRole('button', { name: /save workout/i })).toBeEnabled()
		})
	})

	describe('save flow', () => {
		beforeEach(() => {
			useCreateWorkoutStore.setState({ name: 'Push Day' })
			useCreateWorkoutStore.getState().addExercise(exercise)
			createWorkoutMock.mockResolvedValue(undefined)
		})

		it('shows "Saving..." while the request is in-flight', async () => {
			createWorkoutMock.mockReturnValue(new Promise(() => {})) // never resolves

			render(<AddWorkoutSaveButton />)
			fireEvent.click(screen.getByRole('button', { name: /save workout/i }))

			expect(await screen.findByText('Saving...')).toBeInTheDocument()
		})

		it('calls createWorkout with name and ordered exercises', async () => {
			render(<AddWorkoutSaveButton />)
			fireEvent.click(screen.getByRole('button', { name: /save workout/i }))

			await waitFor(() => {
				expect(createWorkoutMock).toHaveBeenCalledWith({
					name: 'Push Day',
					exercises: [exercise],
				})
			})
		})

		it('clears the store after successful save', async () => {
			render(<AddWorkoutSaveButton />)
			fireEvent.click(screen.getByRole('button', { name: /save workout/i }))

			await waitFor(() => {
				const state = useCreateWorkoutStore.getState()
				expect(state.name).toBe('')
				expect(state.exerciseOrder).toHaveLength(0)
			})
		})

		it('redirects to /dashboard/workouts after save', async () => {
			render(<AddWorkoutSaveButton />)
			fireEvent.click(screen.getByRole('button', { name: /save workout/i }))

			await waitFor(() => {
				expect(pushMock).toHaveBeenCalledWith('/dashboard/workouts')
			})
		})
	})

	describe('error handling', () => {
		it('shows error message when createWorkout throws', async () => {
			useCreateWorkoutStore.setState({ name: 'Push Day' })
			useCreateWorkoutStore.getState().addExercise(exercise)
			createWorkoutMock.mockRejectedValue(new Error('Network error'))

			render(<AddWorkoutSaveButton />)
			fireEvent.click(screen.getByRole('button', { name: /save workout/i }))

			await waitFor(() => {
				expect(screen.getByText('Network error')).toBeInTheDocument()
			})
		})
	})
})
