'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import Link from 'next/link'

import { createClient } from '@/lib/supabase/client'
import { isExerciseType } from '@/lib/exerciseTypeIcons'
import { ExerciseCard } from '@/components/exercise/exercise-card'
import { Spinner } from '@/components/ui/spinner'
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
	const [exercises, setExercises] = useState(initialExercises)
	const [hasMore, setHasMore] = useState(initialHasMore)
	const [loading, setLoading] = useState(false)
	const pageRef = useRef(1)
	const sentinelRef = useRef<HTMLDivElement>(null)
	const supabaseRef = useRef(createClient())

	const fetchMore = useCallback(async () => {
		if (loading || !hasMore) return
		setLoading(true)

		try {
			const from = pageRef.current * PAGE_SIZE
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

			const newExercises: ExerciseCardData[] = (data ?? []).map(item => {
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

			setExercises(prev => [...prev, ...newExercises])
			setHasMore(newExercises.length === PAGE_SIZE)
			pageRef.current += 1
		} catch (err) {
			console.error('Failed to load more exercises:', err)
		} finally {
			setLoading(false)
		}
	}, [loading, hasMore, search, muscle, type])

	const fetchMoreRef = useRef(fetchMore)
	fetchMoreRef.current = fetchMore

	useEffect(() => {
		const sentinel = sentinelRef.current
		if (!sentinel) return

		const observer = new IntersectionObserver(
			entries => {
				if (entries[0].isIntersecting) {
					void fetchMoreRef.current()
				}
			},
			{ rootMargin: '200px' },
		)

		observer.observe(sentinel)
		return () => observer.disconnect()
	}, [])

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
