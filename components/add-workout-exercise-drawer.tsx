'use client'

import { Plus } from 'lucide-react'

import { AddWorkoutExercisesGrid } from '@/components/add-workout-exercises-grid'
import { ExerciseSearch } from '@/components/exercise-search'
import { Button } from '@/components/ui/button'
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer'
import type { ExerciseCardData, MuscleGroup } from '@/types/view'

type Props = {
	muscles: MuscleGroup[]
	musclesError: boolean
	exercises: ExerciseCardData[]
	exercisesErrorMessage?: string
}

export function AddWorkoutExerciseDrawer({ muscles, musclesError, exercises, exercisesErrorMessage }: Props) {
	return (
		<Drawer direction='bottom'>
			<DrawerTrigger asChild>
				<Button type='button' variant='outline' className='w-full'>
					<Plus className='h-4 w-4' />
					Add exercises
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<div className='w-full max-w-7xl mx-auto'>
					<DrawerHeader>
						<DrawerTitle>Add exercises to workout</DrawerTitle>
						<DrawerDescription>Search and select exercises. Click again to unselect.</DrawerDescription>
					</DrawerHeader>
					<div className='space-y-4 overflow-y-auto p-4'>
						<ExerciseSearch muscles={muscles} musclesError={musclesError} />
						{exercisesErrorMessage ? (
							<div className='text-sm text-destructive'>Error: {exercisesErrorMessage}</div>
						) : exercises.length === 0 ? (
							<div className='text-sm opacity-70'>No exercises available</div>
						) : (
							<AddWorkoutExercisesGrid exercises={exercises} />
						)}
					</div>
				</div>
			</DrawerContent>
		</Drawer>
	)
}
