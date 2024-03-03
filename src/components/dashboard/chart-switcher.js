"use client"
 
import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
 
const amals = [
  {
    value: '',
    label: "Show All"
  },  
  {
    value: "tahajud",
    label: "Tahajud",
  },
  {
    value: "rawatib",
    label: "Rawatib",
  },
  {
    value: "dhuha",
    label: "Dhuha",
  },
  {
    value: "infaq",
    label: "Infaq",
  },
  {
    value: "mengaji",
    label: "Mengaji",
  },
]
 
export function ChartSwitcher({ setChartValue }) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
 
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {amals.find((amal) => amal.value === value)?.label}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search amal..." />
          <CommandEmpty>No amal found.</CommandEmpty>
          <CommandGroup>
            {amals.map((amal) => (
              <CommandItem
                key={amal.value}
                value={amal.value}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue)
                  setChartValue(currentValue === value ? "" : currentValue)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === amal.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {amal.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}