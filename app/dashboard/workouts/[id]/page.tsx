import FinishWorkoutButton from '@/components/shared/finish-workout-button'
import { createClient } from '@/lib/supabase/server'
import { ExerciseSetsForm } from '@/components/shared/exercise-sets-form'
import { Calendar, Trash, Plus } from 'lucide-react'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default async function WorkoutPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	const supabase = createClient()

	const sessionId = Number(id)

	const { data: session } = await (await supabase)
		.from('workout_session')
		.select('id, workout_id')
		.eq('id', sessionId)
		.single()

	if (!session) {
		throw new Error('Workout session not found')
	}

	const { data: workoutExercises } = await (
		await supabase
	)
		.from('workout_exercises')
		.select(
			`
	exercise:exercises (
	  id,
	  exercise_name,
	  difficulty
	)
  `,
		)
		.eq('workout_id', session.workout_id)

	return (
		<div className='w-full space-y-6 p-4'>
			<div className='flex items-center justify-between'>
				<div className='flex gap-4'>
					<h1 className='font-semibold text-xl'>Workout {id}</h1>
					<span className='flex items-center gap-1 text-xs text-muted-foreground'>
						<Calendar className='h-3 w-3' />
						{new Date().toLocaleDateString()}
					</span>
				</div>
				<FinishWorkoutButton sessionId={id} />
			</div>

			{workoutExercises?.map(item => (
				<div key={item.exercise.id}>
					<span className='text-xl font-medium'>{item.exercise.exercise_name}</span>
					<div className='flex gap-8 items-center'>
						<Input type='number' placeholder='Reps' />
						<Input type='number' placeholder='Weight' />
						<div className='grid w-full gap-1'>
							<div className='flex items-center justify-between gap-2'>
								<Label className='text-muted-foreground'>Intensity</Label>
								<span className='text-muted-foreground text-sm'>5</span>
							</div>
							<Slider defaultValue={[5]} max={10} step={1} />
						</div>
						<Trash height={48} width={48} />
					</div>
					<div className='flex gap-8 items-center'>
						<Input type='number' placeholder='Reps' />
						<Input type='number' placeholder='Weight' />
						<div className='grid w-full gap-1'>
							<div className='flex items-center justify-between gap-2'>
								<Label className='text-muted-foreground'>Intensity</Label>
								<span className='text-muted-foreground text-sm'>5</span>
							</div>
							<Slider defaultValue={[5]} max={10} min={1} step={1} />
						</div>
						<Trash height={48} width={48} />
					</div>
					<Button variant='outline' className='w-full mt-2 opacity-60 border-dashed'>
						Add set <Plus />
					</Button>
					<div className='mt-2'>
						<Label className='text-muted-foreground'>Exercise notes</Label>
						<Textarea placeholder='Notes' className='mt-1' />
					</div>
					{/*
					<ExerciseSetsForm exerciseId={item.exercise.id} />
					*/}
				</div>
			))}
		</div>
	)
}
