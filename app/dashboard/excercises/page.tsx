import { ExercisesList } from '@/components/exercises-list'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Search } from 'lucide-react'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { createClient } from '@/lib/supabase/server'

export default async function ExcersisesPage() {
	const supabse = await createClient()

	const { data: muscleData, error } = await supabse.from('muscle_groups').select('id, name').order('name')

	const musclesError = Boolean(error)

	return (
		<>
			<h1 className='text-2xl font-medium'>Exercise Library</h1>
			<p>Browse and learn proper form for exercises</p>
			<div className='flex gap-2'>
				<InputGroup>
					<InputGroupInput placeholder='Search...' />
					<InputGroupAddon>
						<Search />
					</InputGroupAddon>
				</InputGroup>
				<Select disabled={musclesError}>
					<SelectTrigger>
						<SelectValue placeholder='muscle' />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectLabel>Primary muscle</SelectLabel>
							{muscleData?.map(mscl => (
								<SelectItem key={mscl.id} value={mscl.name}>
									{mscl.name}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>
			<ExercisesList />
		</>
	)
}
