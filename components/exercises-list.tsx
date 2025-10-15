import { ExerciseCard } from './exercise-card'
import { createClient } from '@/lib/supabase/server'

type Exercise = {
	id: number
	exercise_name: string
	difficulty: 'easy' | 'intermediate' | 'hard'
	primaryMuscle: { id: number; name: string } | null
}

export async function ExercisesList() {
	const supabase = await createClient()

	const { data, error } = await supabase
		.from('exercises')
		.select('id, exercise_name, difficulty, primaryMuscle:muscle_groups!exercises_primary_muscle_id_fkey ( id, name )')
		.order('id', { ascending: true })

	const exercises = (data ?? []).map(item => ({
		...item,
		primaryMuscle: Array.isArray(item.primaryMuscle)
			? item.primaryMuscle[0] ?? null
			: item.primaryMuscle ?? null,
	})) as Exercise[]

	if (error) {
		return <div className='text-sm text-destructive'>Błąd pobierania ćwiczeń: {error.message}</div>
	}

	if (exercises.length === 0) {
		return <div className='text-sm opacity-70'>Brak ćwiczeń</div>
	}

	return (
		<div className='grid gap-4'>
			{exercises.map(ex => (
				<ExerciseCard
					key={ex.id}
					name={ex.exercise_name}
					difficulty={ex.difficulty}
					primaryMuscle={ex.primaryMuscle?.name ?? null}
				/>
			))}
		</div>
	)
}
