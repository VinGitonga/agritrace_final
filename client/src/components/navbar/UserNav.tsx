import useAuth from "@/hooks/store/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "../ui/dropdown-menu";

export default function UserNav() {
	const { account } = useAuth();
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="relative h-8 w-8 rounded-full">
					<Avatar className="w-8 h-8">
						<AvatarImage src="https://avatars.githubusercontent.com/u/139895814?s=280&v=4" alt="User's Avatar" />
						<AvatarFallback>JD</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="end" forceMount>
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<p className="text-sm font-medium leading-none">{account?.name}</p>
						<p className="text-xs  leading-none text-muted-foreground">{account?.phoneNo}</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem>
						Profile
						<DropdownMenuShortcut>
							<kbd>⌘</kbd>
							<kbd>P</kbd>
						</DropdownMenuShortcut>
					</DropdownMenuItem>
					<DropdownMenuItem>
						Billing
						<DropdownMenuShortcut>
							<kbd>⌘</kbd>
							<kbd>B</kbd>
						</DropdownMenuShortcut>
					</DropdownMenuItem>
					<DropdownMenuItem>
						Settings
						<DropdownMenuShortcut>
							<kbd>⌘</kbd>
							<kbd>S</kbd>
						</DropdownMenuShortcut>
					</DropdownMenuItem>
					<DropdownMenuItem>New Team</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem>
					Log out
					<DropdownMenuShortcut>
						<kbd>⬆</kbd>
						<kbd>⌘</kbd>
						<kbd>Q</kbd>
					</DropdownMenuShortcut>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
