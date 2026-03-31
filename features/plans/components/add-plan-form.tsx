'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import type { WorkoutCardData } from '@/types/workout.types'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createPlan } from '../actions/plans.client'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export function AddPlanForm({ workouts, id }: { workouts: WorkoutCardData[]; id?: string }) {
	const supabase = createClient()
	const router = useRouter()

	const [name, setName] = useState('')
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
			await createPlan(supabase, { name: name.trim(), days })
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
		<form id={id} onSubmit={e => { e.preventDefault(); void handleSave() }} className='flex flex-col gap-6'>
			<Input
				type='text'
				placeholder='Plan name...'
				value={name}
				onChange={e => setName(e.target.value)}
				disabled={saving}
				className='h-auto rounded-none border-0 border-b border-border/35 px-2 py-2 text-xl font-medium md:text-xl shadow-none focus-visible:border-b focus-visible:border-foreground/20 focus-visible:ring-0'
			/>

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
		</form>
	)
}
