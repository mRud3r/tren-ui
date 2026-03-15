import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Dumbbell, Heart, PersonStanding, CircleDotDashed, Sword, Plus } from 'lucide-react'
import type { ExerciseCardData } from '@/types/view'

export const ExerciseCard = ({
	exercise,
	variant = 'default',
}: {
	exercise: ExerciseCardData
	variant?: 'default' | 'workout'
}) => {
	const typeIconMap = {
		strength: <Dumbbell className='w-4 h-4' />,
		cardio: <Heart className='w-4 h-4' />,
		flexibility: <PersonStanding className='w-4 h-4' />,
		core: <CircleDotDashed className='w-4 h-4' />,
		plyometric: <Sword className='w-4 h-4' />,
	}
	const colorMap = {
		easy: 'bg-green-100 text-green-800 border-green-300',
		intermediate: 'bg-yellow-100 text-yellow-800 border-yellow-300',
		hard: 'bg-red-100 text-red-800 border-red-300',
	} as const

	return (
		<Card className='shadow-none group hover:border-primary transition-colors'>
			<CardHeader className='flex flex-row items-start justify-between'>
				<div className='w-full flex flex-row gap-3 items-center'>
					{exercise.type && <div className='p-2 rounded-full bg-accent'>{typeIconMap[exercise.type]}</div>}
					<div className='flex flex-col gap-1 items-start'>
						<CardTitle>{exercise.name}</CardTitle>
						<span className='text-xs opacity-70'>{exercise.primaryMuscle?.name ?? 'None'}</span>
					</div>
				</div>
				{variant === 'workout' && (
					<div className='p-2 rounded-full bg-accent group-hover:bg-primary group-hover:text-background transition-colors'>
						<Plus className='w-3 h-3' />
					</div>
				)}
			</CardHeader>
			<CardContent>
				<Badge className={`${colorMap[exercise.difficulty]} rounded-full`}>{exercise.difficulty}</Badge>
			</CardContent>
		</Card>
	)
}
