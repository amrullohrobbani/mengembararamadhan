'use client'
import { useEffect, useCallback, useState } from "react"
import { Icons } from "@/components/icons"
import CardTemplate from "@/components/card/card-template"
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"  
import Image from 'next/image'
import AddGroupIcon from '@/assets/image/add-group.svg'
import JoinGroupIcon from '@/assets/image/join-group.svg'
import { useAuthContext } from "@/context/AuthContext"
import { useRouter } from 'next/navigation'
import { readData, addData, updateData } from '@/lib/firebase/database/handleData.js'
import { generateRandomString } from '@/lib/utils'

export default function InitPage() {
  const { user } = useAuthContext()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const fetchData = useCallback(async () => {
    const responseTeams = await readData(['usersTeams',  user.uid])
    if(responseTeams){
      router.push('/')
    }
    return responseTeams
  }, [router, user.uid])
  
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
    router.push('/')
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
    router.push('/')
  }

  useEffect(() => {
      if(user) fetchData()
  }, [fetchData, router, user])

  return (
    <>
      {loading ? <div className='flex h-screen w-screen justify-center items-center bg-white/10'>
        <Icons.spinner className="mr-2 h-16 w-16 animate-spin" />
      </div> : undefined}
      <div className="bg-gradient-to-br from-indigo-500/25 from-10% via-sky-500/25 via-30% to-emerald-500/25 to-90% relative h-auto md:h-[100vh] flex-col md:flex-row items-center justify-center lg:px-0">
        <div className="grid grid-cols-1 items-center w-full h-full">
          <div className="text-center text-2xl py-5 md:text-5xl font-semibold mb-5">Start your Journey</div>
          <div className="flex flex-col md:flex-row justify-center items-center gap-16">
            <CardTemplate>
              <CardHeader>
                <CardTitle>Create New Group</CardTitle>
                <CardDescription>You can create your group first and start your journey.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 h-full text-center">
                <div className="flex w-full justify-center">
                  <Image
                    priority
                    src={AddGroupIcon}
                    alt="Create New Group"
                    className="w-1/2"
                  />
                </div>
              </CardContent>
              <CardFooter className="absolute bottom-0 w-full">
                <form className="w-full" action={handleCreateNew}>
                  <div className="w-full">
                    <div className=" flex items-center space-x-4 rounded-md border p-4 mb-4">
                      <div className="flex-1 space-y-1">
                        <Label htmlFor="idGroup">New Group</Label>
                        <Input name="group-name" id="idGroup" placeholder="New Group" />
                      </div>
                    </div>
                    <Button className="w-full" type="Submit">
                      Create New Group
                    </Button>
                  </div>
                </form>
              </CardFooter>
            </CardTemplate>

            <span> Or </span>

            <CardTemplate>
              <CardHeader>
                <CardTitle>Join Group</CardTitle>
                <CardDescription>You can join other group first and start your journey.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 h-full">
                <div className="flex w-full justify-center">
                  <Image
                    priority
                    src={JoinGroupIcon}
                    alt="Create New Group"
                    className="w-1/2"
                  />
                </div>
              </CardContent>
              <CardFooter className="absolute bottom-0 w-full">
                <form className="w-full" action={handleJoin}>
                  <div className="w-full">
                    <div className=" flex items-center space-x-4 rounded-md border p-4 mb-4">
                      <div className="flex-1 space-y-1">
                        <Label htmlFor="idGroup">Join Group</Label>
                        <Input name="group-name"  id="idGroup" placeholder="Group ID" />
                      </div>
                    </div>
                    <Button className="w-full" type="Submit">
                      Join Group
                    </Button>
                  </div>
                  </form>
              </CardFooter>
            </CardTemplate>
          </div>
        </div>
      </div>
    </>
  )
}