// Standalone types — will be replaced by Drizzle inferred types in Phase 2

export type DifficultyLevel = 'easy' | 'intermediate' | 'hard'
export type SessionStatus = 'completed' | 'started' | 'cancelled'
export type WorkoutTag = 'push' | 'pull' | 'legs' | 'cardio'

export type ExerciseCardData = {
	id: number
	name: string
	difficulty: DifficultyLevel
	primaryMuscle: { id: number; name: string } | null
	secondaryMuscles: { id: number; name: string }[]
}

export type ExercisePageData = {
	id: number
	name: string
	difficulty: DifficultyLevel
	primaryMuscle: { id: number; name: string } | null
	secondaryMuscles: { id: number; name: string }[]
	instructions: string[]
}

export type WorkoutCardData = {
	id: number
	name: string
	description: string | null
	tag: WorkoutTag | null
	duration: number | null
	exerciseCount: number
}
