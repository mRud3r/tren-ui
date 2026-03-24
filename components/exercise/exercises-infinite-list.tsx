'use client'

import { useRef, useCallback } from 'react'
import Link from 'next/link'

import { createClient } from '@/lib/supabase/client'
import { isExerciseType } from '@/lib/exerciseTypeIcons'
import { ExerciseCard } from '@/components/exercise/exercise-card'
import { Spinner } from '@/components/ui/spinner'
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll'
import type { ExerciseCardData } from '@/types/view'

const PAGE_SIZE = 20

type Props = {
	initialExercises: ExerciseCardData[]
	initialHasMore: boolean
	search?: string
	muscle?: string
	type?: string
}

export function ExercisesInfiniteList({ initialExercises, initialHasMore, search, muscle, type }: Props) {
	const supabaseRef = useRef(createClient())

	const fetchPage = useCallback(
		async (page: number): Promise<ExerciseCardData[]> => {
			const from = page * PAGE_SIZE
			const to = from + PAGE_SIZE - 1

			let query = supabaseRef.current.from('exercises').select(`
				id,
				exercise_name,
				primaryMuscle:muscle_groups!exercises_primary_muscle_id_fkey ( id, name ),
				type
			`)

			if (search) query = query.ilike('exercise_name', `%${search}%`)
			if (muscle) query = query.eq('primary_muscle_id', Number(muscle))
			if (type && isExerciseType(type)) query = query.eq('type', type)

			const { data, error } = await query.order('id', { ascending: true }).range(from, to)

			if (error) throw error

			return (data ?? []).map(item => {
				const primary = Array.isArray(item.primaryMuscle)
					? (item.primaryMuscle[0] ?? null)
					: (item.primaryMuscle ?? null)

				return {
					id: item.id,
					name: item.exercise_name,
					primaryMuscle: primary ? { id: primary.id, name: primary.name } : null,
					secondaryMuscles: [],
					type: item.type,
				}
			})
		},
		[search, muscle, type],
	)

	const { items: exercises, loading, sentinelRef } = useInfiniteScroll({
		fetchPage,
		initialItems: initialExercises,
		initialHasMore,
		pageSize: PAGE_SIZE,
	})

	if (exercises.length === 0) {
		return <div className='text-sm opacity-70'>No exercises available</div>
	}

	return (
		<>
			<div className='grid sm:grid-cols-2 xl:grid-cols-3 gap-2'>
				{exercises.map(ex => (
					<Link key={ex.id} href={`/dashboard/exercises/${ex.id}`} className='block'>
						<ExerciseCard exercise={ex} />
					</Link>
				))}
			</div>
			<div ref={sentinelRef} className='flex justify-center py-6'>
				{loading && <Spinner className='size-5' />}
			</div>
		</>
	)
}
