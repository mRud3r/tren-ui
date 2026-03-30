import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import type { PlanWithDays } from '../queries/plans.server'
import { PlanCardActions } from './plan-card-actions'

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function PlanCard({ plan }: { plan: PlanWithDays }) {
	return (
		<Card className='px-5 py-3 gap-0'>
			<CardHeader className='px-0'>
				<CardTitle className='mt-3 flex items-center gap-2'>
					{plan.name}
					{plan.isActive && <Badge>Active</Badge>}
				</CardTitle>
			</CardHeader>

			<CardContent className='px-0 space-y-4'>
				{plan.description && <p className='text-sm text-muted-foreground'>{plan.description}</p>}

				<div className='grid grid-cols-7 gap-1 text-center'>
					{DAY_LABELS.map((label, i) => {
						const day = plan.days.find(d => d.dayIndex === i)
						return (
							<div key={i} className='flex flex-col items-center gap-1'>
								<span className='text-[11px] text-muted-foreground'>{label}</span>
								<div
									className={`w-7 h-7 rounded-full flex items-center justify-center text-xs border transition-colors ${
										day
											? 'bg-primary text-primary-foreground border-primary'
											: 'border-muted-foreground/20 text-muted-foreground/40'
									}`}
								>
									{day ? '●' : '–'}
								</div>
								{day && (
									<span className='text-[9px] leading-tight text-muted-foreground line-clamp-2 max-w-[40px]'>
										{day.workoutName}
									</span>
								)}
							</div>
						)
					})}
				</div>
			</CardContent>

			<CardFooter className='px-0 mb-2 mt-4'>
				<PlanCardActions planId={plan.id} isActive={plan.isActive} />
			</CardFooter>
		</Card>
	)
}
