import { render, screen } from '@testing-library/react'
import { ExerciseStats, type SessionPoint } from '@/components/exercises/exercise-stats'

jest.mock('recharts', () => ({
	Area: () => null,
	AreaChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
	CartesianGrid: () => null,
	XAxis: () => null,
	YAxis: () => null,
}))

jest.mock('@/components/ui/chart', () => ({
	ChartContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
	ChartTooltip: () => null,
	ChartTooltipContent: () => null,
}))

const weightedRepsPoint = (overrides: Partial<SessionPoint> = {}): SessionPoint => ({
	date: '2024-01-01',
	maxWeight: 100,
	totalVolume: 3000,
	maxReps: 10,
	...overrides,
})

describe('ExerciseStats', () => {
	describe('empty state', () => {
		it('shows empty message when history is empty', () => {
			render(<ExerciseStats trackingType='reps' weightType='weighted' history={[]} />)
			expect(
				screen.getByText(/no sessions recorded yet/i),
			).toBeInTheDocument()
		})
	})

	describe('session stats', () => {
		it('displays the number of sessions', () => {
			const history = [weightedRepsPoint(), weightedRepsPoint({ date: '2024-01-08' })]
			render(<ExerciseStats trackingType='reps' weightType='weighted' history={history} />)
			expect(screen.getByText('2')).toBeInTheDocument()
			expect(screen.getByText('Sessions')).toBeInTheDocument()
		})

		it('displays the last session date', () => {
			const history = [
				weightedRepsPoint({ date: '2024-01-01' }),
				weightedRepsPoint({ date: '2024-03-15' }),
			]
			render(<ExerciseStats trackingType='reps' weightType='weighted' history={history} />)
			expect(screen.getByText('2024-03-15')).toBeInTheDocument()
		})
	})

	describe('PR display — weighted + reps', () => {
		it('shows max weight as PR with "kg" unit', () => {
			const history = [
				weightedRepsPoint({ maxWeight: 80 }),
				weightedRepsPoint({ maxWeight: 100 }),
				weightedRepsPoint({ maxWeight: 90 }),
			]
			render(<ExerciseStats trackingType='reps' weightType='weighted' history={history} />)
			expect(screen.getByText('100 kg')).toBeInTheDocument()
			expect(screen.getByText('PR (weight)')).toBeInTheDocument()
		})
	})

	describe('PR display — bodyweight + reps', () => {
		it('shows max reps as PR without unit', () => {
			const history = [
				{ date: '2024-01-01', maxReps: 15 },
				{ date: '2024-01-08', maxReps: 20 },
			]
			render(<ExerciseStats trackingType='reps' weightType='bodyweight' history={history} />)
			expect(screen.getByText('20')).toBeInTheDocument()
			expect(screen.getByText('PR (reps)')).toBeInTheDocument()
		})
	})

	describe('PR display — duration', () => {
		it('shows duration under a minute as seconds', () => {
			const history = [{ date: '2024-01-01', maxDuration: 45 }]
			render(<ExerciseStats trackingType='duration' weightType='bodyweight' history={history} />)
			expect(screen.getByText('45s')).toBeInTheDocument()
			expect(screen.getByText('PR (duration)')).toBeInTheDocument()
		})

		it('shows duration over a minute as minutes and seconds', () => {
			const history = [{ date: '2024-01-01', maxDuration: 90 }]
			render(<ExerciseStats trackingType='duration' weightType='bodyweight' history={history} />)
			expect(screen.getByText('1m 30s')).toBeInTheDocument()
		})

		it('picks the longest duration across sessions', () => {
			const history = [
				{ date: '2024-01-01', maxDuration: 60 },
				{ date: '2024-01-08', maxDuration: 120 },
			]
			render(<ExerciseStats trackingType='duration' weightType='bodyweight' history={history} />)
			expect(screen.getByText('2m 0s')).toBeInTheDocument()
		})
	})

	describe('intensity gauge', () => {
		it('shows intensity gauge when sessions have avgIntensity', () => {
			const history = [weightedRepsPoint({ avgIntensity: 7 })]
			render(<ExerciseStats trackingType='reps' weightType='weighted' history={history} />)
			expect(screen.getByText('Avg intensity')).toBeInTheDocument()
		})

		it('hides intensity gauge when no session has avgIntensity', () => {
			const history = [weightedRepsPoint()]
			render(<ExerciseStats trackingType='reps' weightType='weighted' history={history} />)
			expect(screen.queryByText('Avg intensity')).not.toBeInTheDocument()
		})

		it('shows "Easy" label for RPE ≤ 3', () => {
			const history = [weightedRepsPoint({ avgIntensity: 2 })]
			render(<ExerciseStats trackingType='reps' weightType='weighted' history={history} />)
			expect(screen.getByText('Easy')).toBeInTheDocument()
		})

		it('shows "Moderate" label for RPE 4–6', () => {
			const history = [weightedRepsPoint({ avgIntensity: 5 })]
			render(<ExerciseStats trackingType='reps' weightType='weighted' history={history} />)
			expect(screen.getByText('Moderate')).toBeInTheDocument()
		})

		it('shows "Hard" label for RPE 7–8', () => {
			const history = [weightedRepsPoint({ avgIntensity: 8 })]
			render(<ExerciseStats trackingType='reps' weightType='weighted' history={history} />)
			expect(screen.getByText('Hard')).toBeInTheDocument()
		})

		it('shows "Max effort" label for RPE > 8', () => {
			const history = [weightedRepsPoint({ avgIntensity: 10 })]
			render(<ExerciseStats trackingType='reps' weightType='weighted' history={history} />)
			expect(screen.getByText('Max effort')).toBeInTheDocument()
		})

		it('averages RPE across all sessions that have intensity', () => {
			const history = [
				weightedRepsPoint({ avgIntensity: 2 }),
				weightedRepsPoint({ avgIntensity: 8 }),
			]
			render(<ExerciseStats trackingType='reps' weightType='weighted' history={history} />)
			expect(screen.getByText('Moderate')).toBeInTheDocument()
		})

		it('ignores sessions without avgIntensity when computing average', () => {
			const history = [
				weightedRepsPoint({ avgIntensity: 9 }),
				weightedRepsPoint(),
			]
			render(<ExerciseStats trackingType='reps' weightType='weighted' history={history} />)
			expect(screen.getByText('Max effort')).toBeInTheDocument()
		})
	})
})
