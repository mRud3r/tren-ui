import { Calendar, Home, Dumbbell, Search, TrendingUp } from 'lucide-react'

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar'

// Menu items.
const items = [
	{
		title: 'Dashboard',
		url: '/protected/dashboard',
		icon: Home,
	},
	{
		title: 'Workouts',
		url: '/protected/workouts',
		icon: Calendar,
	},
	{
		title: 'Excercises',
		url: '/protected/excercises',
		icon: Dumbbell,
	},
	{
		title: 'Progress',
		url: '/protected/progress',
		icon: TrendingUp,
	},
]

export function AppSidebar() {
	return (
		<Sidebar>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>TrenUI</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map(item => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<a href={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</a>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	)
}
