import { fireEvent, render, screen } from '@testing-library/react'
import { AddWorkoutNameInput } from '@/components/workouts/builder/add-workout-name-input'
import { useCreateWorkoutStore } from '@/stores/create-workout.store'

beforeEach(() => {
	useCreateWorkoutStore.getState().clear()
})

describe('AddWorkoutNameInput', () => {
	it('renders placeholder text', () => {
		render(<AddWorkoutNameInput />)
		expect(screen.getByPlaceholderText('Workout name...')).toBeInTheDocument()
	})

	it('shows the current name from the store', () => {
		useCreateWorkoutStore.setState({ name: 'Leg Day' })
		render(<AddWorkoutNameInput />)
		expect(screen.getByDisplayValue('Leg Day')).toBeInTheDocument()
	})

	it('shows empty input when store name is empty', () => {
		render(<AddWorkoutNameInput />)
		expect(screen.getByRole('textbox')).toHaveValue('')
	})

	it('updates store name when user types', () => {
		render(<AddWorkoutNameInput />)
		fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Pull Day' } })
		expect(useCreateWorkoutStore.getState().name).toBe('Pull Day')
	})
})
