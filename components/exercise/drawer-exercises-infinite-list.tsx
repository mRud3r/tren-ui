'use client'

import { useRef, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'

import { createClient } from '@/lib/supabase/client'
import { isExerciseType } from '@/lib/exerciseTypeIcons'
import { Spinner } from '@/components/ui/spinner'
import { Skeleton } from '@/components/ui/skeleton'
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll'
import type { ExerciseCardData } from '@/types/view'

const PAGE_SIZE = 20

type Props = {
	children: (exercises: ExerciseCardData[]) => React.ReactNode
}

export function DrawerExercisesInfiniteList({ children }: Props) {
	const params = useSearchParams()
	const search = params.get('search') ?? undefined
	const muscle = params.get('muscle') ?? undefined
	const type = params.get('type') ?? undefined

	const supabaseRef = useRef(createClient())
	const scrollContainerRef = useRef<HTMLDivElement>(null)

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

	const { items: exercises, loading, error, sentinelRef } = useInfiniteScroll({
		fetchPage,
		pageSize: PAGE_SIZE,
		scrollRoot: scrollContainerRef,
	})

	return (
		<div ref={scrollContainerRef} className='overflow-y-auto flex-1 min-h-0'>
			{error ? (
				<p className='text-sm text-destructive'>Error: {error}</p>
			) : exercises.length === 0 && !loading ? (
				<p className='text-sm opacity-70'>No exercises available</p>
			) : exercises.length === 0 && loading ? (
				<div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2'>
					{Array.from({ length: 6 }).map((_, i) => (
						<div key={i} className='rounded-xl border p-4 space-y-2'>
							<Skeleton className='h-5 w-3/4' />
							<Skeleton className='h-4 w-1/2' />
						</div>
					))}
				</div>
			) : (
				children(exercises)
			)}
			<div ref={sentinelRef} className='flex justify-center py-4'>
				{loading && exercises.length > 0 && <Spinner className='size-5' />}
			</div>
		</div>
	)
}
