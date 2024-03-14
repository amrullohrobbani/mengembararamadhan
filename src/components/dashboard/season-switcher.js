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

import { readDatas } from '@/lib/firebase/database/handleData.js'
import { useAuthContext } from "@/context/AuthContext"

export default function SeasonSwitcher({ className, selectedSeason }) {
  const [open, setOpen] = React.useState(false)
  const [season, setSeason] = React.useState([])
  const [selectedTeam, setSelectedTeam] = React.useState()


  const { user } = useAuthContext()

  const getInitials = (inputString) => {
    if(!inputString) return 
    const words = inputString.split(' ')
    const initials = words.map((word) => word[0].toUpperCase())
    return initials.join('')
  }

  const fetchData = React.useCallback(async () => {
    const response = await readDatas(['season'])
    if(response) {
      setSeason([
        {
          id: '',
          name: 'All Time'
        },
        ...response
      ])
    }
}, [user?.uid])

  React.useEffect(() => {
    fetchData()
  }, [fetchData, user?.uid])

  React.useEffect(() => {
    const teamId = sessionStorage.getItem('season-id') || season?.[0]?.id
    setSelectedTeam(season?.[season?.findIndex((obj) => obj.id === teamId)])
    selectedSeason(season?.[season?.findIndex((obj) => obj.id === teamId)]?.id)
  }, [season])

  return (
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
          <span className="hidden md:block">{selectedTeam?.name}</span>
          <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search team..." />
            <CommandEmpty>No Season found.</CommandEmpty>
              <CommandGroup heading="Choose Season">
                {season?.map((period, indexes) => (
                  <CommandItem
                    key={indexes}
                    onSelect={() => {
                      setSelectedTeam(period)
                      selectedSeason(period?.id)
                      sessionStorage.setItem('season-id', period.id) 
                      setOpen(false)
                    }}
                    className="text-sm"
                  >
                    <Avatar className="mr-2 h-5 w-5">
                      <AvatarFallback>{getInitials(period?.name)}</AvatarFallback>
                    </Avatar>
                    <span className="whitespace-nowrap">{period?.name}</span>                        
                  </CommandItem>
                ))}
              </CommandGroup>
          </CommandList>
          <CommandSeparator />
        </Command>
      </PopoverContent>
    </Popover>
  )
}