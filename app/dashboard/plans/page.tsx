import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PlansList } from '@/components/plans/plans-list'

export default function PlansPage() {
	return (
		<div className='w-full space-y-6 p-4'>
			<div className='flex w-full justify-between'>
				<h1 className='text-2xl font-medium'>Plans</h1>
				<Button asChild type='button' variant='secondary'>
					<Link href='/dashboard/plans/add-plan'>
						<Plus />
						<span>Add plan</span>
					</Link>
				</Button>
			</div>
			<PlansList />
		</div>
	)
}
