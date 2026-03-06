import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'

export default async function ExercisePage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params

	const exerciseId = Number(id)
	if (Number.isNaN(exerciseId)) {
		notFound()
	}

	// TODO: Replace with Drizzle query
	const exercise = null as { exercise_name: string } | null

	if (!exercise) {
		notFound()
	}

	const primary = null as { id: number; name: string } | null
	const secondaryMuscles: { id: number; name: string }[] = []
	const instructions: string[] = []

	return (
		<div className='w-full space-y-6 p-4'>
			<div className='lg:col-span-2'>
				<h1 className='text-2xl font-medium'>{exercise.exercise_name}</h1>

				<Card className='mb-6 mt-4'>
					<CardHeader>
						<CardTitle>Instructions</CardTitle>
					</CardHeader>
					<CardContent>
						{instructions.length > 0 ? (
							<ol className='list-decimal pl-5 space-y-2'>
								{instructions.map((ins: string, i: number) => (
									<li key={i} className='text-sm leading-tight'>
										{ins}
									</li>
								))}
							</ol>
						) : (
							<div className='text-sm opacity-50 italic'>No instructions set</div>
						)}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Details</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='mb-3'>
							<div className='text-sm opacity-70 mb-1'>Primary muscle:</div>
							{primary ? (
								<Badge variant='outline'>{primary.name}</Badge>
							) : (
								<div className='text-sm opacity-50 italic'>No primary muscle set</div>
							)}
						</div>

						<div>
							<div className='text-sm opacity-70 mb-1'>Secondary muscles:</div>
							{secondaryMuscles.length > 0 ? (
								<div className='flex flex-wrap gap-2'>
									{secondaryMuscles.map(m => (
										<Badge key={m.id} variant='outline'>
											{m.name}
										</Badge>
									))}
								</div>
							) : (
								<div className='text-sm opacity-50 italic'>No secondary muscles set</div>
							)}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
