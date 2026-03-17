'use client'

import { useState } from 'react'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Slider } from '../ui/slider'
import { Trash, Plus, ChevronDown } from 'lucide-react'
import { useWorkoutSessionStore } from '@/stores/workoutSession.store'
import type { WorkoutExercise } from '@/types/view'
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group'
import { Checkbox } from '../ui/checkbox'

type SetData = {
	reps: number
	weight: number
	intensity: number
}

export default function WorkoutExerciseCard({ exercise }: { exercise: WorkoutExercise }) {
	const upsertExercise = useWorkoutSessionStore(s => s.upsertExercise)

	const [sets, setSets] = useState<SetData[]>([
		{ reps: 0, weight: 0, intensity: 5 },
		{ reps: 0, weight: 0, intensity: 5 },
		{ reps: 0, weight: 0, intensity: 5 },
	])

	const completedSets = sets.filter(set => set.reps > 0).length

	const updateSet = (index: number, field: keyof SetData, value: number) => {
		const newSets = [...sets]
		newSets[index][field] = value
		setSets(newSets)

		upsertExercise({
			exerciseId: exercise.id,
			sets: newSets,
		})
	}

	const addSet = () => {
		const newSets = [...sets, { reps: 0, weight: 0, intensity: 5 }]
		setSets(newSets)

		upsertExercise({
			exerciseId: exercise.id,
			sets: newSets,
		})
	}

	const removeSet = (index: number) => {
		if (sets.length === 1) return

		const newSets = sets.filter((_, i) => i !== index)
		setSets(newSets)

		upsertExercise({
			exerciseId: exercise.id,
			sets: newSets,
		})
	}

	return (
		<div className='space-y-2'>
			<Button variant='ghost' className='flex items-center gap-2 w-full justify-start'>
				<ChevronDown className='h-4 w-4' />
				<div className='w-full flex items-center justify-between'>
					<h3 className='text-lg font-medium'>{exercise.name ?? 'Unnamed Exercise'}</h3>
					<p className='text-xs text-muted-foreground'>
						{completedSets} / {sets.length}
					</p>
				</div>
			</Button>
			<div className='flex gap-4 ms-5'>
				<div className='w-px self-stretch bg-accent rounded' />
				<div className='w-full flex flex-col gap-6 items-start pt-2'>
					{sets.map((set, index) => (
						<div key={index} className='flex gap-4 items-start justify-between w-full'>
							<Checkbox />
							<div className='flex flex-col gap-2 w-full'>
								<div className='flex items-center gap-4 w-full'>
									<InputGroup className='max-w-40'>
										<InputGroupInput
											type='number'
											value={set.reps || ''}
											onChange={e => updateSet(index, 'reps', Number(e.target.value))}
										/>
										<InputGroupAddon align='inline-end'>reps</InputGroupAddon>
									</InputGroup>
									<InputGroup className='max-w-40'>
										<InputGroupInput
											type='number'
											value={set.weight || ''}
											onChange={e => updateSet(index, 'weight', Number(e.target.value))}
										/>
										<InputGroupAddon align='inline-end'>kg</InputGroupAddon>
									</InputGroup>
								</div>
								<div className='grid w-full gap-1'>
									<div className='flex items-center justify-between gap-2'>
										<Label className='text-muted-foreground'>Intensity</Label>
										<span className='text-muted-foreground text-sm'>{set.intensity}</span>
									</div>
									<Slider
										value={[set.intensity]}
										onValueChange={([value]) => updateSet(index, 'intensity', value)}
										max={10}
										min={1}
										step={1}
									/>
								</div>
							</div>
							<Button
								variant='ghost'
								onClick={() => removeSet(index)}
								disabled={sets.length === 1}
								className='disabled:opacity-30'>
								<Trash className='h-4 w-4' />
							</Button>
						</div>
					))}
					<Button size='sm' variant='ghost' className='opacity-60 hover:opacity-100 transition-all' onClick={addSet}>
						<Plus /> Add set
					</Button>
				</div>
			</div>
		</div>
	)
}
