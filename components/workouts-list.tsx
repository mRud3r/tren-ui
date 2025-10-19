import { createClient } from '@/lib/supabase/server'

type Workout = {
	id: number
	name: string
	description: string | null
	tag: string | null
	duration: number | null
}

export const WorkoutsList = async () => {
	const supabase = await createClient()

	const { data: workoutsData, error } = await supabase
		.from('workouts')
		.select('id, name, description, tag, duration')
		.order('id', { ascending: true })

	if (error) {
		return <div className='text-sm text-destructive'>Błąd pobierania treningów: {error.message}</div>
	}

	if (!workoutsData || workoutsData.length === 0) {
		return <div className='text-sm opacity-70'>Brak treningów</div>
	}

	const workouts: Workout[] = workoutsData.map(w => ({
		id: w.id as number,
		name: w.name as string,
		description: (w.description as string) ?? null,
		tag: (w.tag as string) ?? null,
		duration: (w.duration as number) ?? null,
	}))

	return (
		<div className='grid sm:grid-cols-2 xl:grid-cols-3 gap-4'>
			{workouts.map(w => (
				<div key={w.id} className='rounded-lg border p-4'>
					<div className='flex items-start justify-between gap-2'>
						<h3 className='font-medium'>{w.name}</h3>
						{w.tag ? <span className='text-xs px-2 py-0.5 rounded border uppercase opacity-80'>{w.tag}</span> : null}
					</div>
					{w.description ? <p className='mt-2 text-sm opacity-80 line-clamp-3'>{w.description}</p> : null}
					{typeof w.duration === 'number' ? (
						<div className='mt-3 text-xs opacity-70'>duration: {w.duration} min</div>
					) : null}
				</div>
			))}
		</div>
	)
}
