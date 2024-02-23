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

export const metadata = {
  title: "Your First Step",
  description: "First Step",
}

export default function initPage() {
  return (
    <>
      <div className="container bg-gradient-to-br from-indigo-500/25 from-10% via-sky-500/25 via-30% to-emerald-500/25 to-90% relative h-[100vh] flex-col md:flex-row items-center justify-center lg:px-0">
      <div className="flex w-full h-full justify-center items-center gap-16">
        <CardTemplate>
          <CardHeader>
            <CardTitle>Create New Group</CardTitle>
            <CardDescription>You can create your group first and start your journey.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 h-full">
            <div className=" flex items-center space-x-4 rounded-md border p-4">
              <div className="flex-1 space-y-1">
                <Label htmlFor="idGroup">New Group</Label>
                <Input id="idGroup" placeholder="New Group" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              Create New Group
            </Button>
          </CardFooter>
        </CardTemplate>
        <CardTemplate>
          <CardHeader>
            <CardTitle>Create New Group</CardTitle>
            <CardDescription>You can create your group first and start your journey.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 h-full">
            <div className=" flex items-center space-x-4 rounded-md border p-4">
              <div className="flex-1 space-y-1">
                <Label htmlFor="idGroup">New Group</Label>
                <Input id="idGroup" placeholder="New Group" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              Create New Group
            </Button>
          </CardFooter>
        </CardTemplate>
      </div>
      </div>
    </>
  )
}