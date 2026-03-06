'use client'

import { useState } from 'react'
import { Button } from '../ui/button'
import { useWorkoutSessionStore } from '@/stores/workoutSession.store'
import { Save } from 'lucide-react'

export default function FinishWorkoutButton({ sessionId }: { sessionId: string }) {
	const [loading, setLoading] = useState(false)
	const [finished, setFinished] = useState(false)

	async function finishWorkout() {
		try {
			setLoading(true)

			// TODO: Replace with API route / Server Action
			console.error('Finish workout not implemented yet', sessionId)
			useWorkoutSessionStore.getState().clear()
			setFinished(true)
		} catch (err) {
			console.error('Failed to finish workout:', err)
		} finally {
			setLoading(false)
		}
	}

	return (
		<Button onClick={finishWorkout} disabled={loading || finished}>
			<Save className='ml-1 h-4 w-4' />
			{finished ? 'Workout Saved' : loading ? 'Saving…' : 'Save workout'}
		</Button>
	)
}
