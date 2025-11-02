export default async function WorkoutPage(props: unknown) {
	const { params } = props as { params: { id: string } }

	return <div>{params.id}</div>
}
