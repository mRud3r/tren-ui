import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CheckCircle2, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'

export default async function WorkoutSummaryPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	const sessionId = Number(id)

	if (Number.isNaN(sessionId)) {
		notFound()
	}

	const supabase = await createClient()

	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser()

	if (userError || !user) {
		notFound()
	}

	const { data: session } = await supabase
		.from('workout_session')
		.select(
			`
			id,
			created_at,
			workout:workouts (name),
			exercise_session (
				id,
				notes,
				exercise:exercises (exercise_name, tracking_type, weight_type),
				exercise_set (reps, duration_sec, weight, intensity)
			)
		`,
		)
		.eq('id', sessionId)
		.eq('user_id', user.id)
		.single()

	if (!session) {
		notFound()
	}

	const totalSets = session.exercise_session.reduce((acc, es) => acc + es.exercise_set.length, 0)

	const totalVolume = session.exercise_session.reduce((acc, es) => {
		return (
			acc +
			es.exercise_set.reduce((setAcc, s) => {
				if (s.weight && s.reps) return setAcc + s.weight * s.reps
				return setAcc
			}, 0)
		)
	}, 0)

	const formattedDate = session.created_at
		? new Date(session.created_at).toLocaleDateString('en-US', {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			})
		: null

	return (
		<div className='min-h-screen flex flex-col items-center justify-start p-4 pt-12 max-w-2xl mx-auto w-full'>
			<div className='flex flex-col items-center gap-2 mb-8'>
				<CheckCircle2 className='h-12 w-12 text-green-500' />
				<h1 className='text-2xl font-semibold'>Workout complete!</h1>
				<p className='text-muted-foreground text-sm'>{formattedDate}</p>
			</div>

			<div className='w-full rounded-lg border p-4 mb-6'>
				<h2 className='text-lg font-medium mb-4'>{session.workout.name}</h2>

				<div className='flex gap-6 text-sm'>
					<div>
						<p className='text-muted-foreground'>Sets</p>
						<p className='font-semibold text-base'>{totalSets}</p>
					</div>
					{totalVolume > 0 && (
						<div>
							<p className='text-muted-foreground'>Volume</p>
							<p className='font-semibold text-base'>{totalVolume.toLocaleString()} kg</p>
						</div>
					)}
					<div>
						<p className='text-muted-foreground'>Exercises</p>
						<p className='font-semibold text-base'>{session.exercise_session.length}</p>
					</div>
				</div>
			</div>

			<div className='w-full space-y-3 mb-8'>
				{session.exercise_session.map(es => {
					const isBodyweight = es.exercise.weight_type !== 'weighted'
					const isTime = es.exercise.tracking_type === 'duration'

					return (
						<div key={es.id} className='rounded-lg border p-4'>
							<h3 className='font-medium mb-3'>{es.exercise.exercise_name}</h3>

							{es.notes && <p className='text-sm text-muted-foreground mb-3 italic'>{es.notes}</p>}

							<div className='space-y-1'>
								{es.exercise_set.map((set, index) => (
									<div key={index} className='flex items-center gap-4 text-sm'>
										<span className='text-muted-foreground w-6'>{index + 1}.</span>

										{isTime ? (
											<span>{set.duration_sec ?? 0}s</span>
										) : (
											<span>{set.reps ?? 0} reps</span>
										)}

										{!isBodyweight && set.weight != null && (
											<span className='text-muted-foreground'>{set.weight} kg</span>
										)}

										{set.intensity != null && set.intensity > 0 && (
											<span className='text-muted-foreground ml-auto'>RPE {set.intensity}</span>
										)}
									</div>
								))}
							</div>
						</div>
					)
				})}
			</div>

			<div className='flex flex-col gap-2 w-full'>
				<Button asChild>
					<Link href='/dashboard'>
						Go to dashboard
						<ChevronRight className='h-4 w-4' />
					</Link>
				</Button>
			</div>
		</div>
	)
}
