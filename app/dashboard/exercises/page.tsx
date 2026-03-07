import { ExercisesList } from '@/components/exercises-list'
import { ExerciseSearch } from '@/components/exercise-search'
import { getMuscleGroups } from '@/lib/db/exercises'

export default async function ExcersisesPage({
	searchParams,
}: {
	searchParams: Promise<{
		search?: string
		muscle?: string
	}>
}) {
	const { search, muscle } = await searchParams
	const muscleData = await getMuscleGroups()

	return (
		<div className='w-full space-y-6 p-4'>
			<h1 className='text-2xl font-medium'>Exercise Library</h1>
			<p>Browse and learn proper form for exercises</p>
			<ExerciseSearch muscles={muscleData} musclesError={false} />
			<ExercisesList search={search} muscle={muscle} />
		</div>
	)
}
