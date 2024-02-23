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
import Image from 'next/image'
import AddGroupIcon from '@/assets/image/add-group.svg'
import JoinGroupIcon from '@/assets/image/join-group.svg'

export const metadata = {
  title: "Your First Step",
  description: "First Step",
}

export default function initPage() {
  return (
    <>
      <div className="bg-gradient-to-br from-indigo-500/25 from-10% via-sky-500/25 via-30% to-emerald-500/25 to-90% relative h-auto md:h-[100vh] flex-col md:flex-row items-center justify-center lg:px-0">
        <div className="grid grid-cols-1 items-center w-full h-full">
          <div className="text-center text-2xl py-5 md:text-5xl font-semibold mb-5">Start your Journey</div>
          <div className="flex flex-col md:flex-row justify-center items-center gap-16">
            <CardTemplate>
              <CardHeader>
                <CardTitle>Create New Group</CardTitle>
                <CardDescription>You can create your group first and start your journey.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 h-full">
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
                <div className="w-full">
                  <div className=" flex items-center space-x-4 rounded-md border p-4 mb-4">
                    <div className="flex-1 space-y-1">
                      <Label htmlFor="idGroup">New Group</Label>
                      <Input id="idGroup" placeholder="New Group" />
                    </div>
                  </div>
                  <Button className="w-full">
                    Create New Group
                  </Button>
                </div>
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
                <div className="w-full">
                  <div className=" flex items-center space-x-4 rounded-md border p-4 mb-4">
                    <div className="flex-1 space-y-1">
                      <Label htmlFor="idGroup">Join Group</Label>
                      <Input id="idGroup" placeholder="Join Group" />
                    </div>
                  </div>
                  <Button className="w-full">
                    Join Group
                  </Button>
                </div>
              </CardFooter>
            </CardTemplate>
          </div>
        </div>
      </div>
    </>
  )
}