'use client'

import { useRef, useCallback } from 'react'

import { createClient } from '@/lib/supabase/client'
import { WorkoutCard } from '@/components/workout/workout-card'
import { Spinner } from '@/components/ui/spinner'
import { Skeleton } from '@/components/ui/skeleton'
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll'
import type { WorkoutCardData } from '@/types/view'

const PAGE_SIZE = 20

type Props = {
	initialWorkouts: WorkoutCardData[]
	initialHasMore: boolean
	userId: string
}

export function WorkoutsInfiniteList({ initialWorkouts, initialHasMore, userId }: Props) {
	const supabaseRef = useRef(createClient())

	const fetchPage = useCallback(
		async (page: number): Promise<WorkoutCardData[]> => {
			const from = page * PAGE_SIZE
			const to = from + PAGE_SIZE - 1

			const { data, error } = await supabaseRef.current
				.from('workouts')
				.select('id, name, description, workout_exercises(id)')
				.eq('user_id', userId)
				.order('id', { ascending: true })
				.range(from, to)

			if (error) throw error

			return (data ?? []).map(w => ({
				id: w.id,
				name: w.name,
				description: w.description,
				exerciseCount: Array.isArray(w.workout_exercises) ? w.workout_exercises.length : 0,
			}))
		},
		[userId],
	)

	const { items: workouts, loading, sentinelRef } = useInfiniteScroll({
		fetchPage,
		initialItems: initialWorkouts,
		initialHasMore,
		pageSize: PAGE_SIZE,
	})

	if (workouts.length === 0) {
		return <div className='text-sm opacity-70'>No workouts available</div>
	}

	return (
		<>
			<div className='grid sm:grid-cols-2 xl:grid-cols-3 gap-4'>
				{workouts.map(w => (
					<WorkoutCard key={w.id} workout={w} />
				))}
			</div>
			<div ref={sentinelRef} className='flex justify-center py-6'>
				{loading && <Spinner className='size-5' />}
			</div>
		</>
	)
}

export function WorkoutsListSkeleton() {
	return (
		<div className='grid sm:grid-cols-2 xl:grid-cols-3 gap-4'>
			{Array.from({ length: 6 }).map((_, i) => (
				<div key={i} className='rounded-xl border px-5 py-3 space-y-3'>
					<Skeleton className='h-6 w-2/3 mt-3' />
					<Skeleton className='h-4 w-1/4' />
					<Skeleton className='h-9 w-full mt-6' />
				</div>
			))}
		</div>
	)
}
