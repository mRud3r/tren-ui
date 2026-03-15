import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { StartWorkoutButton } from './shared/start-workout-button'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from './ui/dropdown-menu'
import { EllipsisVertical, Trash, SquarePen } from 'lucide-react'
import type { WorkoutCardData } from '@/types/view'
import { Button } from './ui/button'

export const WorkoutCard = ({ workout }: { workout: WorkoutCardData }) => {
	return (
		<Card>
			<CardHeader>
				<div className='flex flex-row w-full justify-between items-center'>
					<CardTitle>{workout.name}</CardTitle>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant='ghost' size='icon'>
								<EllipsisVertical />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className='w-24'>
							<Button variant='ghost' size='sm' className='justify-start w-full'>
								<SquarePen className='me-2' />
								<span>Edit</span>
							</Button>
							<Button variant='ghost' size='sm' className='justify-start w-full'>
								<Trash className='me-2' />
								<span>Delete</span>
							</Button>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
				{workout.description ? <span className='text-sm opacity-80'>{workout.description}</span> : null}
			</CardHeader>
			<CardContent>
				<div className='text-sm opacity-70 flex gap-3'>
					{typeof workout.exerciseCount === 'number' ? <span>{workout.exerciseCount} exercises</span> : null}
				</div>
			</CardContent>
			<CardFooter>
				<StartWorkoutButton workoutId={workout.id} />
			</CardFooter>
		</Card>
	)
}
