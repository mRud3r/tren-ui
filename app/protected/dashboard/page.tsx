import { Button } from '@/components/ui/button'

export default async function DashboardPage() {


	return (
		<div className='flex-1 w-full flex flex-col gap-12'>
			<Button className='bg-accent text-accent-foreground'>Dashboard</Button>
		</div>
	)
}