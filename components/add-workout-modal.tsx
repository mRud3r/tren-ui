'use client'

import React from 'react'
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from './ui/dialog'
import { Button } from './ui/button'
import { Plus } from 'lucide-react'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Select, SelectValue, SelectTrigger, SelectContent, SelectGroup, SelectItem } from './ui/select'
import { FieldSet, FieldGroup, Field, FieldLabel } from './ui/field'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export const AddWorkoutModal = () => {
	const router = useRouter()
	const supabase = createClient()

	const [open, setOpen] = React.useState(false)
	const [submitting, setSubmitting] = React.useState(false)
	const [name, setName] = React.useState('')
	const [description, setDescription] = React.useState('')
	const [tag, setTag] = React.useState<string | null>(null)
	const [duration, setDuration] = React.useState<string>('')
	const [error, setError] = React.useState<string | null>(null)

	async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()
		setError(null)
		console.log('[add-workout] submitting')
		if (!name.trim()) {
			setError('Workout name is required')
			return
		}
		setSubmitting(true)
		try {
			const payload = {
				name: name.trim(),
				description: description.trim() || null,
				tag: tag,
				duration: duration ? Number.parseInt(duration, 10) : null,
			}

			const { error: insertError } = await supabase.from('workouts').insert(payload)
			if (insertError) {
				setError(insertError.message)
				return
			}

			setName('')
			setDescription('')
			setTag(null)
			setDuration('')
			setOpen(false)
			router.refresh()
		} catch (err: any) {
			setError(err?.message ?? 'Unexpected error')
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button type="button">
					<Plus />
					<span>Add workout</span>
				</Button>
			</DialogTrigger>
			<DialogContent>
				<form onSubmit={onSubmit}>
					<DialogHeader>
						<DialogTitle>Add Workout</DialogTitle>
						<DialogDescription>Describe your workout and add exercises</DialogDescription>
					</DialogHeader>
					<FieldSet>
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor='workout-name'>Workout name</FieldLabel>
								<Input id='workout-name' type='text' value={name} onChange={e => setName(e.target.value)} required />
							</Field>
							<Field>
								<FieldLabel htmlFor='workout-description'>Workout description</FieldLabel>
								<Textarea id='workout-description' value={description} onChange={e => setDescription(e.target.value)} />
							</Field>
							<Field>
								<FieldLabel htmlFor='workout-tag'>Workout tag</FieldLabel>
								<Select value={tag ?? ''} onValueChange={v => setTag(v)}>
									<SelectTrigger id='workout-tag'>
										<SelectValue placeholder='Select tag (optional)' />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											<SelectItem value='push'>Push</SelectItem>
											<SelectItem value='pull'>Pull</SelectItem>
											<SelectItem value='legs'>Legs</SelectItem>
											<SelectItem value='cardio'>Cardio</SelectItem>
										</SelectGroup>
									</SelectContent>
								</Select>
							</Field>
							<Field>
								<FieldLabel htmlFor='workout-duration'>Workout duration (min)</FieldLabel>
								<Input id='workout-duration' inputMode='numeric' pattern='[0-9]*' value={duration} onChange={e => setDuration(e.target.value)} placeholder='e.g. 60' />
							</Field>
						</FieldGroup>
					</FieldSet>

					<div className='flex items-center justify-between gap-3'>
						{error ? <p className='text-sm text-destructive bg-destructive/10 rounded px-2 py-1'>{error}</p> : <span />}
						<div className='flex gap-2'>
							<Button type='button' variant='outline' onClick={() => setOpen(false)} disabled={submitting}>
								Cancel
							</Button>
							<Button type='submit' disabled={submitting}>
								{submitting ? 'Saving…' : 'Save workout'}
							</Button>
						</div>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	)
}
