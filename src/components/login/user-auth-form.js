'use client'
import { useState, useEffect } from 'react'
import { signInWithGoogle } from '@/lib/firebase/auth'

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { useAuthContext } from "@/context/AuthContext"
import { useRouter } from 'next/navigation'

export function UserAuthForm({ className, ...props }) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { user } = useAuthContext()

  useEffect(() => {
    if(user){
      router.push('/')
    }
  })
  
  async function handleSignIn() {
    setIsLoading(true)
    await signInWithGoogle()

    router.push('/')
    setIsLoading(false)
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground font-semibold">
            Login with
          </span>
        </div>
      </div>
      <Button variant="outline" type="button" disabled={isLoading} onClick={handleSignIn} >
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}{" "}
        Google
      </Button>
    </div>
  )
}