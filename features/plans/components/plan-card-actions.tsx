'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { deletePlan, setActivePlan } from '../actions/plans.client'

export function PlanCardActions({ planId, isActive }: { planId: number; isActive: boolean }) {
	const supabase = createClient()
	const router = useRouter()
	const [deleting, setDeleting] = useState(false)
	const [activating, setActivating] = useState(false)

	async function handleDelete() {
		if (deleting) return
		const confirmed = window.confirm('Delete this plan?')
		if (!confirmed) return

		setDeleting(true)
		try {
			await deletePlan(supabase, planId)
			toast.success('Plan deleted')
			router.refresh()
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Failed to delete plan.'
			toast.error(message)
		} finally {
			setDeleting(false)
		}
	}

	async function handleSetActive() {
		if (activating) return
		setActivating(true)
		try {
			await setActivePlan(supabase, planId)
			toast.success('Plan set as active')
			router.refresh()
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Failed to set active plan.'
			toast.error(message)
		} finally {
			setActivating(false)
		}
	}

	return (
		<div className='flex gap-2'>
			{!isActive && (
				<Button size='sm' onClick={handleSetActive} disabled={activating}>
					{activating ? 'Setting...' : 'Set as active'}
				</Button>
			)}
			<Button
				variant='ghost'
				size='sm'
				className='text-destructive hover:text-destructive ml-auto'
				onClick={handleDelete}
				disabled={deleting}
			>
				<Trash className='w-4 h-4' />
			</Button>
		</div>
	)
}
