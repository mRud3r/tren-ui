import { ExerciseSearch } from '@/components/exercise/exercise-search'
import { ExercisesInfiniteList } from '@/components/exercise/exercises-infinite-list'
import { isExerciseType } from '@/lib/exerciseTypeIcons'
import { createClient } from '@/lib/supabase/server'
import type { ExerciseCardData } from '@/types/view'

const PAGE_SIZE = 20

export default async function ExercisesPage({
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

	const { data: muscleData, error: musclesFetchError } = await supabase
		.from('muscle_groups')
		.select('id, name')
		.order('name')

	let exercisesQuery = supabase.from('exercises').select(
		`
      id,
      exercise_name,
      primaryMuscle:muscle_groups!exercises_primary_muscle_id_fkey ( id, name ),
      secondary_muscle_ids,
	  type
    `,
	)

	if (search) exercisesQuery = exercisesQuery.ilike('exercise_name', `%${search}%`)
	if (muscle) exercisesQuery = exercisesQuery.eq('primary_muscle_id', Number(muscle))
	if (type && isExerciseType(type)) exercisesQuery = exercisesQuery.eq('type', type)

	const { data: exercisesData, error: exercisesError } = await exercisesQuery
		.order('id', { ascending: true })
		.range(0, PAGE_SIZE - 1)

	const musclesError = Boolean(musclesFetchError)

	if (exercisesError) {
		return <div className='text-sm text-destructive'>Error: {exercisesError.message}</div>
	}

	const musclesById = new Map<number, { id: number; name: string }>(
		(muscleData ?? []).map(m => [m.id, { id: m.id, name: m.name }]),
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
			primaryMuscle: primary ? { id: primary.id, name: primary.name } : null,
			secondaryMuscles: secondaryMusclesObjects,
			type: item.type,
		}
	})

	return (
		<div className='flex flex-col gap-2 p-4'>
			<h1 className='text-2xl font-medium'>Exercise Library</h1>
			<ExerciseSearch muscles={muscleData ?? []} musclesError={musclesError} />
			<ExercisesInfiniteList
				key={`${search ?? ''}-${muscle ?? ''}-${type ?? ''}`}
				initialExercises={exercises}
				initialHasMore={exercises.length === PAGE_SIZE}
				search={search}
				muscle={muscle}
				type={type}
			/>
		</div>
	)
}
