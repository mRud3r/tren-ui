'use client'

import { useState } from 'react'
import { Button } from '../ui/button'
import { Play } from 'lucide-react'

export function StartWorkoutButton({ workoutId }: { workoutId: number }) {
	const [loading, setLoading] = useState(false)

	async function startWorkout() {
		try {
			setLoading(true)
			// TODO: Replace with API route / Server Action
			console.error('Start workout not implemented yet', workoutId)
		} catch (err) {
			console.error('Failed to create session:', err)
		} finally {
			setLoading(false)
		}
	}

	return (
		<Button className='w-full flex gap-1 items-center justify-center' onClick={startWorkout} disabled={loading}>
			<Play />
			{loading ? 'Starting…' : 'Start workout'}
		</Button>
	)
}
