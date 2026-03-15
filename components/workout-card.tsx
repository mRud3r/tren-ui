import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { StartWorkoutButton } from './shared/start-workout-button'
import type { WorkoutCardData } from '@/types/view'

export const WorkoutCard = ({ workout }: { workout: WorkoutCardData }) => {
	return (
		<Card>
			<CardHeader>
				<div className='flex flex-row w-full justify-between items-center'>
					<CardTitle>{workout.name}</CardTitle>
				</div>
				{workout.description ? <span className='text-sm opacity-80'>{workout.description}</span> : null}
			</CardHeader>
			<CardContent>
				<div className='text-sm opacity-70 flex gap-3'>
					{typeof workout.duration === 'number' ? <span>Duration: {workout.duration} min</span> : null}
					{typeof workout.exerciseCount === 'number' ? <span>{workout.exerciseCount} exercises</span> : null}
				</div>
			</CardContent>
			<CardFooter>
				<StartWorkoutButton workoutId={workout.id} />
			</CardFooter>
		</Card>
	)
}
