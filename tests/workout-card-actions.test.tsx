import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { WorkoutCardActions } from '@/components/workouts/workout-card-actions'

const refreshMock = jest.fn()

jest.mock('next/navigation', () => ({
	useRouter: () => ({ refresh: refreshMock }),
}))

const deleteWorkoutMock = jest.fn()
jest.mock('@/data/workouts.actions', () => ({
	deleteWorkout: (...args: unknown[]) => deleteWorkoutMock(...args),
}))

jest.mock('sonner', () => ({
	toast: { success: jest.fn(), error: jest.fn() },
}))

// Mock Radix DropdownMenu to avoid portal/pointer-event complexity
jest.mock('@/components/ui/dropdown-menu', () => ({
	DropdownMenu: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
	DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
	DropdownMenuContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
	DropdownMenuItem: ({
		children,
		onSelect,
		disabled,
		className,
	}: {
		children: React.ReactNode
		onSelect?: () => void
		disabled?: boolean
		className?: string
	}) => (
		<div role='menuitem' onClick={onSelect} aria-disabled={disabled} className={className}>
			{children}
		</div>
	),
}))

beforeEach(() => {
	jest.clearAllMocks()
	window.confirm = jest.fn(() => true)
})

describe('WorkoutCardActions', () => {
	describe('edit link', () => {
		it('renders a link to the edit page for the given workoutId', () => {
			render(<WorkoutCardActions workoutId={42} />)
			const link = screen.getByRole('link', { name: /edit/i })
			expect(link).toHaveAttribute('href', '/dashboard/workouts/edit/42')
		})
	})

	describe('delete', () => {
		it('shows confirm dialog when Delete is clicked', () => {
			render(<WorkoutCardActions workoutId={1} />)
			fireEvent.click(screen.getByText('Delete'))
			expect(window.confirm).toHaveBeenCalledWith(
				'Delete this workout and all related sessions?',
			)
		})

		it('calls deleteWorkout with the correct workoutId when confirmed', async () => {
			deleteWorkoutMock.mockResolvedValue(undefined)
			render(<WorkoutCardActions workoutId={7} />)

			fireEvent.click(screen.getByText('Delete'))

			await waitFor(() => {
				expect(deleteWorkoutMock).toHaveBeenCalledWith(7)
			})
		})

		it('does not call deleteWorkout when confirm is cancelled', async () => {
			window.confirm = jest.fn(() => false)
			render(<WorkoutCardActions workoutId={1} />)

			fireEvent.click(screen.getByText('Delete'))

			expect(deleteWorkoutMock).not.toHaveBeenCalled()
		})

		it('shows error message when deleteWorkout throws', async () => {
			deleteWorkoutMock.mockRejectedValue(new Error('Server error'))
			render(<WorkoutCardActions workoutId={1} />)

			await act(async () => {
				fireEvent.click(screen.getByText('Delete'))
			})

			expect(screen.getByText('Server error')).toBeInTheDocument()
		})

		it('calls router.refresh after successful delete', async () => {
			deleteWorkoutMock.mockResolvedValue(undefined)
			render(<WorkoutCardActions workoutId={1} />)

			fireEvent.click(screen.getByText('Delete'))

			await waitFor(() => {
				expect(refreshMock).toHaveBeenCalled()
			})
		})
	})
})
