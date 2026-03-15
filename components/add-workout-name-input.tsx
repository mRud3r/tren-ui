'use client'

import { Input } from '@/components/ui/input'
import { useCreateWorkoutStore } from '@/stores/createWorkout.store'

export function AddWorkoutNameInput() {
	const name = useCreateWorkoutStore(state => state.name)
	const setName = useCreateWorkoutStore(state => state.setName)

	return <Input type='text' placeholder='Workout name...' value={name} onChange={e => setName(e.target.value)} />
}
