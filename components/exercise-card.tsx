import { Card, CardHeader, CardTitle } from './ui/card'

export function ExerciseCard({
  name,
  difficulty,
  primaryMuscle,
}: {
  name: string
  difficulty: 'easy' | 'intermediate' | 'hard'
  primaryMuscle: string | null
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <span className='text-sm opacity-70'>{difficulty}</span>
        {primaryMuscle && <span className='text-sm opacity-70'>Primary muscle: {primaryMuscle}</span>}
      </CardHeader>
    </Card>
  )
}
