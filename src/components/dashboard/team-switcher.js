"use client"

import * as React from "react"
import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
  Cross1Icon,
  EnterIcon
} from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"  
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

import { readDataQuery, readData, addData, updateData } from '@/lib/firebase/database/handleData.js'
import { generateRandomString } from '@/lib/utils'
import { useAuthContext } from "@/context/AuthContext"

export default function TeamSwitcher({ className, selectedGroup }) {
  const [loading, setLoading]= React.useState(false)
  const [isJoin, setIsJoin]= React.useState(false)
  const [deleteTeam, setDeleteTeam]= React.useState()
  const [open, setOpen] = React.useState(false)
  const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false)
  const [groups, setGroups] = React.useState([])
  const [selectedTeam, setSelectedTeam] = React.useState()
  const { toast } = useToast()


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
    const teamId = sessionStorage.getItem('team-id') || groups[0]?.teams?.[0]?.id
    setSelectedTeam(groups[0]?.teams?.[groups[0]?.teams?.findIndex((obj) => obj.id === teamId)])
    selectedGroup(groups[0]?.teams?.[groups[0]?.teams?.findIndex((obj) => obj.id === teamId)])
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
    fetchData()
  }

  const handleJoin= async (formData) => {
    setLoading(true)
    const key = formData.get('group-name')
    const responseTeams = await readData(['teams',  key])
    if(!responseTeams){
      setLoading(false)
      return toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "No Teams match with the ID",
      })
    }
    const payload = {
      [`members.${user.uid}`]: true
    }
    updateData(['teams',  key], payload)
    const userTeamsPayload = {}
    userTeamsPayload[key] = true
    const userTeamData = await readData(['usersTeams',  user.uid])
    if(userTeamData){
      updateData(['usersTeams',  user.uid], userTeamsPayload)
    } else { 
      addData(['usersTeams',  user.uid], userTeamsPayload)
    }
    toast({
      title: "Good Job",
      description: "You can start your journey",
    })
    setSelectedTeam(groups[0].teams[groups[0].teams.length - 1])
    selectedGroup(selectedTeam)
    setShowNewTeamDialog(false)
    fetchData()
  }

  const handleUnJoin = async() => {
    setLoading(true)
    try {
      const payload = {
        [`members.${user.uid}`]: false
      }
      updateData(['teams',  deleteTeam.id], payload)
      const userTeamsPayload = {}
      userTeamsPayload[deleteTeam.id] = false
      updateData(['usersTeams',  user.uid], userTeamsPayload)
      toast({
        title: "Successfully Delete",
        description: "You Successfully Unjoin Group",
      })
      setSelectedTeam(groups[0].teams[groups[0].teams.length - 1])
      selectedGroup(selectedTeam)
      setShowNewTeamDialog(false)
      fetchData()
    } catch (error) {
      setLoading(false)
      return toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      })
    } finally {
      setLoading(false)
      setIsJoin(false)
    }
  }

  return (
    <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
      <AlertDialog>
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
                <AvatarFallback>{getInitials(selectedTeam?.name)}</AvatarFallback>
              </Avatar>
              <span className="hidden md:block">{selectedTeam?.name} - {selectedTeam?.id}</span>
              <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <Command>
              <CommandList>
                <CommandInput placeholder="Search team..." />
                <CommandEmpty>No team found.</CommandEmpty>
                {groups.map((group, index) => (
                  <CommandGroup key={index} heading={group.label}>
                    {group.teams?.map((team, indexes) => (
                      <CommandItem
                        key={indexes}
                        onSelect={() => {
                          setSelectedTeam(team)
                          selectedGroup(team)
                          sessionStorage.setItem('team-id', team.id) 
                          setOpen(false)
                        }}
                        className="text-sm"
                      >
                        <Avatar className="mr-2 h-5 w-5">
                          <AvatarFallback>{getInitials(team?.name)}</AvatarFallback>
                        </Avatar>
                        <span className="whitespace-nowrap">{team?.name} - {team?.id}</span>
                        {selectedTeam?.id === team?.id?
                        <CheckIcon
                          className="ml-auto h-4 w-4"
                        />
                        :
                          <AlertDialogTrigger asChild>
                            <Cross1Icon
                              className="ml-auto h-3 w-3"
                              onClick={(e) => {
                                e.stopPropagation()
                                setDeleteTeam(team)
                              }}
                            />
                          </AlertDialogTrigger> 
                        }
                        
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
              <CommandSeparator />
              <CommandList>
                <CommandGroup>
                  <DialogTrigger asChild>
                    <CommandItem
                      onSelect={() => {
                        setIsJoin(true)
                        setOpen(false)
                        setShowNewTeamDialog(true)
                      }}
                    >
                      <EnterIcon className="mr-2 h-5 w-5" />
                      Join Team
                    </CommandItem>
                  </DialogTrigger>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <DialogContent>
          <form className="w-full" action={isJoin?handleJoin:handleCreateNew}>
            <DialogHeader>
              <DialogTitle>{isJoin?'Join Team':'Create Team'}</DialogTitle>
              <DialogDescription>
                {isJoin?'Join':'Add'} a new team.
              </DialogDescription>
            </DialogHeader>
            <div>
              <div className="space-y-4 py-2 pb-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Team {isJoin?'ID': 'name'}</Label>
                  <Input name="group-name"  id="idGroup" placeholder={isJoin? 'Group ID' :'Group Name'} />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={(e) => {
                e.preventDefault()
                setShowNewTeamDialog(false)
                setIsJoin(false)
              }}>
                Cancel
              </Button>
              <Button type="submit">Continue</Button>
            </DialogFooter>
          </form>
        </DialogContent>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This Action will let you get out of group, you can join later though
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleUnJoin}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  )
}