"use client"

import * as React from "react"
import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { readDataQuery, readData, addData } from '@/lib/firebase/database/handleData.js'
import { generateRandomString } from '@/lib/utils'
import { useAuthContext } from "@/context/AuthContext"

export default function TeamSwitcher({ className, selectedGroup }) {
  const [open, setOpen] = React.useState(false)
  const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false)
  const [groups, setGroups] = React.useState([
    {
      label: "Teams",
      teams: [
        {
          name: "Acme Inc.",
          id: "acme-inc",
        },
        {
          name: "Monsters Inc.",
          id: "monsters",
        },
      ],
    }
  ])
  const [selectedTeam, setSelectedTeam] = React.useState(groups[0]?.teams?.[0])

  const { user } = useAuthContext()

  const getInitials = (inputString) => {
    if(!inputString) return 
    const words = inputString.split(' ')
    const initials = words.map((word) => word[0].toUpperCase())
    return initials.join('')
  }

  const fetchData = React.useCallback(async () => {
    const response = await readDataQuery('teams', [user?.uid?`members.${user?.uid}`:undefined, '==', true])
    if(response) {
      setGroups([{
        label: "Teams",
        teams: response,
      }])
    }
}, [user?.uid])

  React.useEffect(() => {
    fetchData()
  }, [fetchData, user?.uid])

  React.useEffect(() => {
    setSelectedTeam(groups[0]?.teams?.[0])
    selectedGroup(groups[0]?.teams?.[0])
  }, [groups])

  const handleCreateNew = async (formData) => {
    setLoading(true)
    const key = generateRandomString()
    const responseTeams = await readData(['teams',  key])
    if(responseTeams){
      setLoading(false)
      return toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      })
    }
    const payload = {
      name: formData.get('group-name'),
      createdBy: user.uid,
      members: {}
    }
    payload.members[user.uid] = true
    addData(['teams',  key], payload)
    const userTeamsPayload = {}
    userTeamsPayload[key] = true
    addData(['usersTeams',  user.uid], userTeamsPayload)
    toast({
      title: "Good Job",
      description: "You can start your journey",
    })
    setSelectedTeam(groups[0].teams[groups[0].teams.length - 1])
    selectedGroup(selectedTeam)
    setShowNewTeamDialog(false)
  }

  return (
    <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a team"
            className={cn("justify-between", className)}
          >
            <Avatar className="mr-2 h-5 w-5">
              <AvatarFallback>{getInitials(selectedTeam.name)}</AvatarFallback>
            </Avatar>
            <span className="hidden md:block">{selectedTeam.name} - {selectedTeam.id}</span>
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search team..." />
              <CommandEmpty>No team found.</CommandEmpty>
              {groups.map((group) => (
                <CommandGroup key={group.name} heading={group.name}>
                  {group.teams?.map((team) => (
                    <CommandItem
                      key={team.value}
                      onSelect={() => {
                        setSelectedTeam(team)
                        setOpen(false)
                      }}
                      className="text-sm"
                    >
                      <Avatar className="mr-2 h-5 w-5">
                       <AvatarFallback>{getInitials(selectedTeam.name)}</AvatarFallback>
                      </Avatar>
                      <span className="whitespace-nowrap">{team.name} - {team.id}</span>
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          selectedTeam.value === team.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
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
                      setOpen(false)
                      setShowNewTeamDialog(true)
                    }}
                  >
                    <PlusCircledIcon className="mr-2 h-5 w-5" />
                    Create Team
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <DialogContent>
        <form className="w-full" action={handleCreateNew}>
          <DialogHeader>
            <DialogTitle>Create team</DialogTitle>
            <DialogDescription>
              Add a new team.
            </DialogDescription>
          </DialogHeader>
          <div>
            <div className="space-y-4 py-2 pb-4">
              <div className="space-y-2">
                <Label htmlFor="name">Team name</Label>
                <Input name="group-name"  id="idGroup" placeholder="Group ID" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewTeamDialog(false)}>
              Cancel
            </Button>
            <Button type="submit">Continue</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}