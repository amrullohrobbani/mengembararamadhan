'use client'
import { useState } from "react"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"  
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  
import { readData, addData } from '@/lib/firebase/database/handleData.js'
import { generateRandomString } from '@/lib/utils'
import { signOut } from "@/lib/firebase/auth"
import Link from "next/link"

export function UserNav({user}) {
  const [showNewTeamDialog, setShowNewTeamDialog] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState()
  const [loading, setLoading]= useState(false)
  const { toast } = useToast()

  const getInitials = (inputString) => {
    if(!inputString) return 
    const words = inputString.split(' ')
    const initials = words.map((word) => word[0].toUpperCase())
    return initials.join('')
  }

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
  
  return (
    <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.photoURL} alt="@shadcn" />
              <AvatarFallback>{getInitials(user?.displayName)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{ user?.displayName }</p>
              <p className="text-xs leading-none text-muted-foreground">
                { user?.email }
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <Link href="/profile">
              <DropdownMenuItem>
                Personal
              </DropdownMenuItem>
            </Link>
            {/* <DialogTrigger asChild>
              <DropdownMenuItem>New Team</DropdownMenuItem>
            </DialogTrigger> */}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={signOut}>
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
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
            <Button variant="outline" onClick={(e) => {
              e.preventDefault()
              setShowNewTeamDialog(false)
            }}>
              Cancel
            </Button>
            <Button type="submit">Continue</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}