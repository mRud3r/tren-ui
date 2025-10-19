import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'

export const WorkoutCard = () => {
	const colorMap = {
		push: 'bg-green-100 text-green-800 border-green-300',
		pull: 'bg-yellow-100 text-yellow-800 border-yellow-300',
		legs: 'bg-red-100 text-red-800 border-red-300',
	} as const
	return (
		<Card>
			<CardHeader>
				<div className='flex flex-row w-full justify-between items-center'>
					<CardTitle>PushDay</CardTitle>
					<Badge>push</Badge>
				</div>
			</CardHeader>
			<CardContent></CardContent>
		</Card>
	)
}
