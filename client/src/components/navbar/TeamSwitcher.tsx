import { ComponentPropsWithoutRef, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { RxCaretSort } from "react-icons/rx";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "../ui/command";
import { Check, PlusCircle } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const groups = [
	{
		label: "Personal Account",
		teams: [
			{
				label: "Alicia Koch",
				value: "personal",
			},
		],
	},
	{
		label: "Teams",
		teams: [
			{
				label: "Acme Inc.",
				value: "acme-inc",
			},
			{
				label: "Globex Corp.",
				value: "globex-corp",
			},
		],
	},
];

function getInitials(name: string) {
	const splitName = name.trim().split(" ");

	if (splitName.length === 1) {
		return splitName[0][0].toUpperCase();
	} else {
		return (splitName[0][0] + splitName[splitName.length - 1][0]).toUpperCase();
	}
}

type ITeam = (typeof groups)[number]["teams"][number];
type PopoverTriggerProps = ComponentPropsWithoutRef<typeof PopoverTrigger>;

interface IProps extends PopoverTriggerProps {}

export default function TeamSwitcher({ className }: IProps) {
	const [open, setOpen] = useState<boolean>(false);
	const [showNewTeamDialog, setShowNewTeamDialog] = useState<boolean>(false);
	const [selectedTeam, setSelectedTeam] = useState<ITeam>(groups[0].teams[0]);
	return (
		<Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button variant="outline" role="combobox" aria-expanded={open} aria-label="Select a Team" className={cn("w-[200px] justify-between", className)}>
						<Avatar className="mr-2 h-5 w-5">
							<AvatarImage src={`https://avatar.vercel.sh/${selectedTeam.value}.png`} alt={`${selectedTeam.label}'s Avatar`} />
							<AvatarFallback>{getInitials(selectedTeam.label)}</AvatarFallback>
						</Avatar>
						{selectedTeam.label}
						<RxCaretSort className="ml-auto h-4 w-4 shrink-0 opacity-0" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-[200px] p-0">
					<Command>
						<CommandList>
							<CommandInput placeholder="Search Team ..." />
							<CommandEmpty>No Teams Found</CommandEmpty>
							{groups.map((grp) => (
								<CommandGroup key={grp.label} heading={grp.label}>
									{grp.teams.map((team) => (
										<CommandGroup
											key={team.value}
											onSelect={() => {
												setSelectedTeam(team);
												setOpen(false);
											}}
											className="text-sm">
											<Avatar className="mr-2 h-5 w-5">
												<AvatarImage src={`https://avatar.vercel.sh/${team.value}.png`} alt={`${team.label}'s Avatar`} />
												<AvatarFallback>{getInitials(team.label)}</AvatarFallback>
											</Avatar>
											{team.label}
											<Check className={cn("ml-auto h-4 w-4", selectedTeam.value === team.value ? "opacity-100" : "opacity-0")} />
										</CommandGroup>
									))}
								</CommandGroup>
							))}
						</CommandList>
						<CommandSeparator />
						<CommandList>
							<CommandGroup>
								<DialogTrigger asChild>
									<CommandItem
										onSelect={() => {
											setOpen(false);
											setShowNewTeamDialog(true);
										}}>
										<PlusCircle className="mr-2 h-5 w-5" />
										Create New Team
									</CommandItem>
								</DialogTrigger>
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create New Team</DialogTitle>
					<DialogDescription>Teams are a collection of people and projects in your organization. Learn more about teams.</DialogDescription>
				</DialogHeader>
				<div>
					<div className="space-y-4 py-2 pb-4">
						<div className="space-y-2">
							<Label htmlFor="name">Team Name</Label>
							<Input id="name" placeholder="Globel Inc." />
						</div>
						<div className="space-y-2">
							<Label htmlFor="plan">Subscription Plan</Label>
							<Select>
								<SelectTrigger>
									<SelectValue placeholder="Select a Plan" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="free">
										<span className="font-medium">Free</span> -- <span className="text-muted-foreground">Trials for 2 weeks</span>
									</SelectItem>
									<SelectItem value="pro">
										<span className="font-medium">Pro</span> -- <span className="text-muted-foreground">$10 per user per month</span>
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={() => setShowNewTeamDialog(false)}>
						Cancel
					</Button>
					<Button type="submit">Continue</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
