import { Button } from "@/components/ui/button"
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
import { Icons } from "@/components/icons"
import { useAuthContext } from "@/context/AuthContext"
import { useState } from "react"
import { readData, addData, updateData, readDataQueryCustom } from '@/lib/firebase/database/handleData.js'
import { sumTotal } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"  
import { where, Timestamp } from "firebase/firestore"
import dayjs from "dayjs"

export default function InputModal({className, ...props}) {
  const { user } = useAuthContext()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [modal, setModal] = useState(false)

  const onSubmit = async (formData) => {
    setIsLoading(true)
    const alreadySubmit = await readDataQueryCustom('tasks', [where('dateSubmitted', '==', dayjs().format('YYYY-MM-DD')), where('uid', '==', user.uid)])
    if(alreadySubmit?.length > 0){
      setIsLoading(false)
      return toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Ypu have submitted for today",
      })
    }
    try {
      const season = await readDataQueryCustom('season', [where('startDate', '<=', Timestamp.now())])
      season.find((obj) => obj.endDate >= Timestamp.now())
      const currentUser = await readData(['users',  user.uid])
      const payload = {
        ...Object.fromEntries(formData),
        seasonid: season?.[0]?.id,
        uid: user.uid,
        timeSubmitted: Timestamp.now(),
        dateSubmitted: dayjs().format('YYYY-MM-DD')
      }
      addData(['tasks', dayjs().format('YYYY-MM-DD')], payload)
      updateData(['users',  user.uid], {
        exp: currentUser.exp + sumTotal({...Object.fromEntries(formData)})
      })
      setModal(false)
      return toast({
        title: "Good Job",
        description: "Thank you for submitting",
      })
    } catch (error) {
      console.error(error)
      return toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error?.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog className={className} {...props} open={modal} onOpenChange={setModal}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="fixed bottom-7 right-7 hover:bg-transparent">
          <div className="rounded-full bg-gradient-to-br from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% p-5">
            <Icons.plus className="h-6 w-6 text-white" />
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[26.5625rem]">
        <form action={onSubmit}>
          <DialogHeader>
            <DialogTitle>Add Submission</DialogTitle>
            <DialogDescription>
              Make submission of the daily here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rawatib" className="text-right">
                Rawatib
              </Label>
              <Input
                id="rawatib"
                name="rawatib"
                type="number"
                placeholder="Raka'at"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dhuha" className="text-right">
                Dhuha
              </Label>
              <Input
                id="dhuha"
                name="dhuha"
                type="number"
                placeholder="Raka'at"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="infaq" className="text-right">
                Infaq
              </Label>
              <Input
                id="infaq"
                name="infaq"
                type="number"
                placeholder="/Rp 10.000"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tahajud" className="text-right">
                Tahajud
              </Label>
              <Input
                id="tahajud"
                name="tahajud"
                type="number"
                placeholder="Raka'at"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="mengaji" className="text-right">
                Mengaji
              </Label>
              <Input
                id="mengaji"
                name="mengaji"
                type="number"
                placeholder="Juz"
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">
              {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : undefined}{" "}Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
