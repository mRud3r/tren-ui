import { Skeleton } from '@/components/ui/skeleton'

export default function WorkoutsLoading() {
	return (
		<div className='w-full space-y-6 p-4'>
			<div className='flex w-full justify-between'>
				<Skeleton className='h-8 w-32' />
				<Skeleton className='h-9 w-36' />
			</div>
			<div className='grid sm:grid-cols-2 xl:grid-cols-3 gap-4'>
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={i} className='rounded-xl border px-5 py-3 space-y-3'>
						<Skeleton className='h-6 w-2/3 mt-3' />
						<Skeleton className='h-4 w-1/4' />
						<Skeleton className='h-9 w-full mt-6' />
					</div>
				))}
			</div>
		</div>
	)
}
