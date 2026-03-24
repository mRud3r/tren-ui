'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

const DEFAULT_PAGE_SIZE = 20

type UseInfiniteScrollOptions<T> = {
	fetchPage: (page: number) => Promise<T[]>
	initialItems?: T[]
	initialHasMore?: boolean
	pageSize?: number
	scrollRoot?: React.RefObject<HTMLElement | null>
}

export function useInfiniteScroll<T>({
	fetchPage,
	initialItems,
	initialHasMore = false,
	pageSize = DEFAULT_PAGE_SIZE,
	scrollRoot,
}: UseInfiniteScrollOptions<T>) {
	const hasInitialItems = initialItems !== undefined

	const [items, setItems] = useState<T[]>(initialItems ?? [])
	const [hasMore, setHasMore] = useState(hasInitialItems ? initialHasMore : false)
	const [loading, setLoading] = useState(!hasInitialItems)
	const [error, setError] = useState<string | null>(null)
	const pageRef = useRef(hasInitialItems ? 1 : 0)
	const sentinelRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (hasInitialItems) return

		let cancelled = false
		setLoading(true)
		setError(null)
		setItems([])
		setHasMore(false)
		pageRef.current = 0

		fetchPage(0)
			.then(data => {
				if (cancelled) return
				setItems(data)
				setHasMore(data.length === pageSize)
				pageRef.current = 1
			})
			.catch(err => {
				if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load.')
			})
			.finally(() => {
				if (!cancelled) setLoading(false)
			})

		return () => {
			cancelled = true
		}
	}, [fetchPage, hasInitialItems, pageSize])

	const fetchMore = useCallback(async () => {
		if (loading || !hasMore) return
		setLoading(true)

		try {
			const data = await fetchPage(pageRef.current)
			setItems(prev => [...prev, ...data])
			setHasMore(data.length === pageSize)
			pageRef.current += 1
		} catch (err) {
			console.error('Failed to load more:', err)
		} finally {
			setLoading(false)
		}
	}, [loading, hasMore, fetchPage, pageSize])

	const fetchMoreRef = useRef(fetchMore)
	fetchMoreRef.current = fetchMore

	useEffect(() => {
		const sentinel = sentinelRef.current
		if (!sentinel) return

		const observer = new IntersectionObserver(
			entries => {
				if (entries[0].isIntersecting) void fetchMoreRef.current()
			},
			{ root: scrollRoot?.current ?? null },
		)

		observer.observe(sentinel)
		return () => observer.disconnect()
	}, [scrollRoot])

	return { items, hasMore, loading, error, sentinelRef }
}
