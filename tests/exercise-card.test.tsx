import { render, screen } from '@testing-library/react'
import { ExerciseCard } from '@/components/exercises/exercise-card'
import type { ExerciseCardData } from '@/types/exercise.types'

const base: ExerciseCardData = {
	id: 1,
	name: 'Bench Press',
	primaryMuscle: { id: 1, name: 'Chest' },
	secondaryMuscles: [],
	type: 'strength',
	trackingType: 'reps',
	weightType: 'weighted',
	isUnilateral: false,
}

describe('ExerciseCard', () => {
	describe('content', () => {
		it('renders the exercise name', () => {
			render(<ExerciseCard exercise={base} />)
			expect(screen.getByText('Bench Press')).toBeInTheDocument()
		})

		it('renders primary muscle name', () => {
			render(<ExerciseCard exercise={base} />)
			expect(screen.getByText('Chest')).toBeInTheDocument()
		})

		it('renders "None" when primary muscle is null', () => {
			render(<ExerciseCard exercise={{ ...base, primaryMuscle: null }} />)
			expect(screen.getByText('None')).toBeInTheDocument()
		})
	})

	describe('type icon', () => {
		it('shows the icon area when type is set', () => {
			render(<ExerciseCard exercise={base} />)
			expect(document.querySelector('[data-slot="item-media"]')).toBeInTheDocument()
		})

		it('hides the icon area when type is null', () => {
			render(<ExerciseCard exercise={{ ...base, type: null }} />)
			expect(document.querySelector('[data-slot="item-media"]')).not.toBeInTheDocument()
		})
	})

	describe('variant="default"', () => {
		it('does not render the actions area', () => {
			render(<ExerciseCard exercise={base} />)
			expect(document.querySelector('[data-slot="item-actions"]')).not.toBeInTheDocument()
		})
	})

	describe('variant="workout"', () => {
		it('renders the actions area', () => {
			render(<ExerciseCard exercise={base} variant='workout' />)
			expect(document.querySelector('[data-slot="item-actions"]')).toBeInTheDocument()
		})

		it('applies accent background when not selected', () => {
			render(<ExerciseCard exercise={base} variant='workout' selected={false} />)
			const actionIcon = document.querySelector('[data-slot="item-actions"] > div')
			expect(actionIcon).toHaveClass('bg-accent')
		})

		it('applies primary background when selected', () => {
			render(<ExerciseCard exercise={base} variant='workout' selected={true} />)
			const actionIcon = document.querySelector('[data-slot="item-actions"] > div')
			expect(actionIcon).toHaveClass('bg-primary')
		})
	})

	describe('selected state', () => {
		it('adds border-primary class when selected', () => {
			render(<ExerciseCard exercise={base} selected={true} />)
			const item = document.querySelector('[data-slot="item"]')
			// toHaveClass checks for exact class name, not substring (hover:border-primary is ignored)
			expect(item).toHaveClass('border-primary')
		})

		it('does not add border-primary class when not selected', () => {
			render(<ExerciseCard exercise={base} selected={false} />)
			const item = document.querySelector('[data-slot="item"]')
			expect(item).not.toHaveClass('border-primary')
		})
	})
})
