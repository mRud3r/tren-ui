import { fireEvent, render, screen } from '@testing-library/react'
import { AddWorkoutSelectedExercises } from '@/components/workouts/builder/add-workout-selected-exercises'
import { useCreateWorkoutStore } from '@/stores/create-workout.store'
import type { ExerciseCardData } from '@/types/exercise.types'

jest.mock('@dnd-kit/core', () => ({
	DndContext: ({ children }: { children: React.ReactNode }) => <>{children}</>,
	closestCenter: jest.fn(),
	useSensor: jest.fn(),
	useSensors: jest.fn(() => []),
	PointerSensor: jest.fn(),
	KeyboardSensor: jest.fn(),
}))

jest.mock('@dnd-kit/sortable', () => ({
	SortableContext: ({ children }: { children: React.ReactNode }) => <>{children}</>,
	sortableKeyboardCoordinates: jest.fn(),
	useSortable: jest.fn(() => ({
		attributes: {},
		listeners: {},
		setNodeRef: jest.fn(),
		transform: null,
		transition: null,
		isDragging: false,
	})),
	verticalListSortingStrategy: jest.fn(),
}))

jest.mock('@dnd-kit/modifiers', () => ({
	restrictToParentElement: jest.fn(),
	restrictToVerticalAxis: jest.fn(),
}))

jest.mock('@dnd-kit/utilities', () => ({
	CSS: { Transform: { toString: jest.fn(() => '') } },
}))

const makeExercise = (id: number, name: string, muscle?: string): ExerciseCardData => ({
	id,
	name,
	primaryMuscle: muscle ? { id, name: muscle } : null,
	secondaryMuscles: [],
	type: 'strength',
	trackingType: 'reps',
	weightType: 'weighted',
	isUnilateral: false,
})

beforeEach(() => {
	useCreateWorkoutStore.getState().clear()
})

describe('AddWorkoutSelectedExercises', () => {
	describe('empty state', () => {
		it('shows placeholder when no exercises are selected', () => {
			render(<AddWorkoutSelectedExercises />)
			expect(screen.getByText('No exercises selected yet.')).toBeInTheDocument()
		})
	})

	describe('exercise list', () => {
		it('renders each selected exercise by name', () => {
			useCreateWorkoutStore.getState().addExercise(makeExercise(1, 'Squat', 'Quads'))
			useCreateWorkoutStore.getState().addExercise(makeExercise(2, 'Bench Press', 'Chest'))

			render(<AddWorkoutSelectedExercises />)

			expect(screen.getByText('Squat')).toBeInTheDocument()
			expect(screen.getByText('Bench Press')).toBeInTheDocument()
		})

		it('shows primary muscle name', () => {
			useCreateWorkoutStore.getState().addExercise(makeExercise(1, 'Squat', 'Quads'))

			render(<AddWorkoutSelectedExercises />)

			expect(screen.getByText('Quads')).toBeInTheDocument()
		})

		it('shows "No muscle group" when primary muscle is null', () => {
			useCreateWorkoutStore.getState().addExercise(makeExercise(1, 'Plank'))

			render(<AddWorkoutSelectedExercises />)

			expect(screen.getByText('No muscle group')).toBeInTheDocument()
		})

		it('renders exercises in exerciseOrder', () => {
			useCreateWorkoutStore.getState().addExercise(makeExercise(1, 'First'))
			useCreateWorkoutStore.getState().addExercise(makeExercise(2, 'Second'))
			useCreateWorkoutStore.getState().addExercise(makeExercise(3, 'Third'))

			render(<AddWorkoutSelectedExercises />)

			const items = screen.getAllByRole('paragraph').map(el => el.textContent)
			// Names are rendered inside <p> elements
			const names = screen.getAllByText(/First|Second|Third/).map(el => el.textContent)
			expect(names).toEqual(['First', 'Second', 'Third'])
		})
	})

	describe('remove exercise', () => {
		it('renders a remove button for each exercise', () => {
			useCreateWorkoutStore.getState().addExercise(makeExercise(1, 'Squat', 'Quads'))
			useCreateWorkoutStore.getState().addExercise(makeExercise(2, 'Deadlift', 'Back'))

			render(<AddWorkoutSelectedExercises />)

			expect(screen.getByRole('button', { name: 'Remove Squat from workout' })).toBeInTheDocument()
			expect(screen.getByRole('button', { name: 'Remove Deadlift from workout' })).toBeInTheDocument()
		})

		it('removes exercise from store when remove button is clicked', () => {
			useCreateWorkoutStore.getState().addExercise(makeExercise(1, 'Squat', 'Quads'))

			render(<AddWorkoutSelectedExercises />)
			fireEvent.click(screen.getByRole('button', { name: 'Remove Squat from workout' }))

			expect(useCreateWorkoutStore.getState().exerciseOrder).toHaveLength(0)
		})

		it('shows empty state after removing the last exercise', () => {
			useCreateWorkoutStore.getState().addExercise(makeExercise(1, 'Squat', 'Quads'))

			render(<AddWorkoutSelectedExercises />)
			fireEvent.click(screen.getByRole('button', { name: 'Remove Squat from workout' }))

			expect(screen.getByText('No exercises selected yet.')).toBeInTheDocument()
		})
	})
})
