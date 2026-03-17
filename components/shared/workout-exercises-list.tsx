'use client'

import { useState } from 'react'
import {
	DndContext,
	KeyboardSensor,
	PointerSensor,
	type DragEndEvent,
	closestCenter,
	useSensor,
	useSensors,
} from '@dnd-kit/core'
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { WorkoutExercise } from '@/types/view'
import WorkoutExerciseCard from './workout-exercise-card'

type WorkoutExercisesListProps = {
	exercises: WorkoutExercise[]
}

type SortableWorkoutExerciseCardProps = {
	exercise: WorkoutExercise
	isOpen: boolean
	onOpenChange: (isOpen: boolean) => void
	onExerciseCompleted: () => void
}

function SortableWorkoutExerciseCard({
	exercise,
	isOpen,
	onOpenChange,
	onExerciseCompleted,
}: SortableWorkoutExerciseCardProps) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: exercise.id })

	return (
		<div
			ref={setNodeRef}
			style={{
				transform: transform ? CSS.Translate.toString(transform) : undefined,
				transition,
			}}>
			<WorkoutExerciseCard
				exercise={exercise}
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				onExerciseCompleted={onExerciseCompleted}
				dragHandleProps={{ ...attributes, ...listeners }}
				isDragging={isDragging}
			/>
		</div>
	)
}

export default function WorkoutExercisesList({ exercises }: WorkoutExercisesListProps) {
	const [orderedExercises, setOrderedExercises] = useState(exercises)
	const [openExerciseId, setOpenExerciseId] = useState<number | null>(exercises[0]?.id ?? null)

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	)

	const handleExerciseCompleted = (exerciseId: number) => {
		const currentIndex = orderedExercises.findIndex(exercise => exercise.id === exerciseId)

		if (currentIndex === -1) {
			setOpenExerciseId(null)
			return
		}

		const nextExercise = orderedExercises[currentIndex + 1]
		setOpenExerciseId(nextExercise?.id ?? null)
	}

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event

		if (!over || active.id === over.id) {
			return
		}

		setOrderedExercises(prev => {
			const fromIndex = prev.findIndex(exercise => exercise.id === Number(active.id))
			const toIndex = prev.findIndex(exercise => exercise.id === Number(over.id))

			if (fromIndex === -1 || toIndex === -1) {
				return prev
			}

			const reordered = [...prev]
			const [movedExercise] = reordered.splice(fromIndex, 1)
			reordered.splice(toIndex, 0, movedExercise)

			return reordered
		})
	}

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			modifiers={[restrictToVerticalAxis, restrictToParentElement]}
			onDragEnd={handleDragEnd}>
			<SortableContext items={orderedExercises.map(exercise => exercise.id)} strategy={verticalListSortingStrategy}>
				<div className='space-y-6 overflow-hidden'>
					{orderedExercises.map(exercise => (
						<SortableWorkoutExerciseCard
							key={exercise.id}
							exercise={exercise}
							isOpen={openExerciseId === exercise.id}
							onOpenChange={isOpen => setOpenExerciseId(isOpen ? exercise.id : null)}
							onExerciseCompleted={() => handleExerciseCompleted(exercise.id)}
						/>
					))}
				</div>
			</SortableContext>
		</DndContext>
	)
}
