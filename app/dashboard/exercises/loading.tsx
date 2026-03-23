import { Skeleton } from '@/components/ui/skeleton'

export default function ExercisesLoading() {
	return (
		<div className='flex flex-col gap-2 p-4'>
			<Skeleton className='h-8 w-48' />
			<Skeleton className='h-10 w-full mt-1' />
			<div className='grid sm:grid-cols-2 xl:grid-cols-3 gap-2 mt-1'>
				{Array.from({ length: 9 }).map((_, i) => (
					<div key={i} className='rounded-xl border p-4 space-y-2'>
						<Skeleton className='h-5 w-3/4' />
						<Skeleton className='h-4 w-1/2' />
					</div>
				))}
			</div>
		</div>
	)
}
