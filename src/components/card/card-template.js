import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import styles from './card-template.module.css'

export default function CardTemplate({ className, ...props }) {
  return (
    <>
        <div className={cn("w-[23.75rem] h-[33.25rem]", styles['flip-card'], className)}>
            <div className={styles['flip-card-inner']}>
                <div className={styles['flip-card-front']}>
                </div>
                <div className={styles['flip-card-back']}>
                  <Card className={cn("w-[23.75rem] min-h-[33.25rem]", className)} {...props}>
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
                  </Card>
                </div>
            </div>
        </div>
    </>
  )
}