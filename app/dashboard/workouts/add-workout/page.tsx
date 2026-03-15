import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import { AddWorkoutExercisesGrid } from '@/components/add-workout-exercises-grid'
import { AddWorkoutSelectedExercises } from '@/components/add-workout-selected-exercises'
import { ExerciseSearch } from '@/components/exercise-search'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { isExerciseType } from '@/lib/exerciseTypeIcons'
import { createClient } from '@/lib/supabase/server'
import type { ExerciseCardData } from '@/types/view'

export default async function NewWorkoutPage({
	searchParams,
}: {
	searchParams: Promise<{
		search?: string
		muscle?: string
		type?: string
	}>
}) {
	const supabase = await createClient()
	const { search, muscle, type } = await searchParams

	const { data: musclesData, error: musclesFetchError } = await supabase
		.from('muscle_groups')
		.select('id, name')
		.order('name')

	let exercisesQuery = supabase.from('exercises').select(
		`
      id,
      exercise_name,
      difficulty,
      primaryMuscle:muscle_groups!exercises_primary_muscle_id_fkey ( id, name ),
      secondary_muscle_ids,
	  type
    `,
	)

	if (search) {
		exercisesQuery = exercisesQuery.ilike('exercise_name', `%${search}%`)
	}

	if (muscle) {
		exercisesQuery = exercisesQuery.eq('primary_muscle_id', Number(muscle))
	}

	if (type && isExerciseType(type)) {
		exercisesQuery = exercisesQuery.eq('type', type)
	}

	const { data: exercisesData, error: exercisesError } = await exercisesQuery.order('id', { ascending: true })

	const musclesError = Boolean(musclesFetchError)

	const musclesById = new Map<number, { id: number; name: string }>(
		(musclesData ?? []).map(m => [m.id, { id: m.id, name: m.name }]),
	)

	const exercises: ExerciseCardData[] = (exercisesData ?? []).map(item => {
		const primary = Array.isArray(item.primaryMuscle) ? (item.primaryMuscle[0] ?? null) : (item.primaryMuscle ?? null)

		const secondaryMusclesObjects = Array.isArray(item.secondary_muscle_ids)
			? item.secondary_muscle_ids
					.map(mid => musclesById.get(mid))
					.filter((x): x is { id: number; name: string } => Boolean(x))
			: []

		return {
			id: item.id,
			name: item.exercise_name,
			difficulty: item.difficulty,
			primaryMuscle: primary ? { id: primary.id, name: primary.name } : null,
			secondaryMuscles: secondaryMusclesObjects,
			type: item.type,
		}
	})

	return (
		<div className='w-full space-y-6 p-4'>
			<div className='flex items-center justify-between'>
				<h1 className='text-2xl font-medium'>Add Workout</h1>
				<Button asChild type='button' variant='ghost'>
					<Link href='/dashboard/workouts'>
						<ArrowLeft />
						Back to workouts
					</Link>
				</Button>
			</div>
			<div className='w-full flex gap-8 justify-between'>
				<div className='space-y-2 w-full'>
					<ExerciseSearch muscles={musclesData ?? []} musclesError={musclesError} />
					{exercisesError ? (
						<div className='text-sm text-destructive'>Error: {exercisesError.message}</div>
					) : exercises.length === 0 ? (
						<div className='text-sm opacity-70'>No exercises available</div>
					) : (
						<AddWorkoutExercisesGrid exercises={exercises} />
					)}
				</div>
				<Card className='w-120'>
					<CardHeader>
						<CardTitle>Workout Name</CardTitle>
					</CardHeader>
					<CardContent>
						<AddWorkoutSelectedExercises />
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
