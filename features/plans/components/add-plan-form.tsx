'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import type { WorkoutCardData } from '@/types/workout.types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { createPlan } from '../actions/plans.client'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export function AddPlanForm({ workouts }: { workouts: WorkoutCardData[] }) {
	const supabase = createClient()
	const router = useRouter()

	const [name, setName] = useState('')
	const [description, setDescription] = useState('')
	const [dayWorkouts, setDayWorkouts] = useState<Record<number, number | null>>({})
	const [saving, setSaving] = useState(false)

	function handleDayChange(dayIndex: number, value: string) {
		setDayWorkouts(prev => ({
			...prev,
			[dayIndex]: value === 'rest' ? null : Number(value),
		}))
	}

	async function handleSave() {
		if (!name.trim() || saving) return

		const days = DAYS.flatMap((_, i) => {
			const workoutId = Object.prototype.hasOwnProperty.call(dayWorkouts, i) ? dayWorkouts[i] : null
			if (workoutId === null) return []
			return [{ dayIndex: i, workoutId }]
		})

		setSaving(true)
		try {
			await createPlan(supabase, { name: name.trim(), description: description.trim() || undefined, days })
			toast.success('Plan created')
			router.push('/dashboard/plans')
			router.refresh()
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Failed to create plan.'
			toast.error(message)
			setSaving(false)
		}
	}

	return (
		<div className='space-y-8'>
			<div className='space-y-4'>
				<div className='space-y-2'>
					<Label htmlFor='plan-name'>Plan name</Label>
					<Input
						id='plan-name'
						placeholder='e.g. Push Pull Legs'
						value={name}
						onChange={e => setName(e.target.value)}
						disabled={saving}
					/>
				</div>
				<div className='space-y-2'>
					<Label htmlFor='plan-desc'>Description (optional)</Label>
					<Textarea
						id='plan-desc'
						placeholder='Short description...'
						value={description}
						onChange={e => setDescription(e.target.value)}
						rows={2}
						disabled={saving}
					/>
				</div>
			</div>

			<div className='space-y-3'>
				<div>
					<h2 className='font-medium'>Weekly schedule</h2>
					<p className='text-sm text-muted-foreground mt-0.5'>Assign a workout to each day, or leave as rest.</p>
				</div>
				<div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
					{DAYS.map((day, i) => (
						<Card key={i} className='py-3 px-4'>
							<CardContent className='px-0 space-y-2'>
								<p className='text-sm font-medium'>{day}</p>
								<Select onValueChange={v => handleDayChange(i, v)} defaultValue='rest' disabled={saving}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='rest'>Rest day</SelectItem>
										{workouts.map(w => (
											<SelectItem key={w.id} value={String(w.id)}>
												{w.name}
												{typeof w.exerciseCount === 'number' && (
													<span className='text-muted-foreground ml-1'>({w.exerciseCount})</span>
												)}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</CardContent>
						</Card>
					))}
				</div>
			</div>

			<div className='flex gap-3'>
				<Button onClick={handleSave} disabled={!name.trim() || saving}>
					{saving ? <Spinner /> : null}
					{saving ? 'Saving...' : 'Save plan'}
				</Button>
				<Button variant='ghost' onClick={() => router.back()} disabled={saving}>
					Cancel
				</Button>
			</div>
		</div>
	)
}
