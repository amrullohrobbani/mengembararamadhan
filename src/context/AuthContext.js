'use client'
import React from 'react'
import {
    onAuthStateChanged
} from 'firebase/auth'

import { Icons } from "@/components/icons"
import { auth } from "@/lib/firebase/firebase"
import { useRouter } from 'next/navigation'

export const AuthContext = React.createContext({})

export const useAuthContext = () => React.useContext(AuthContext)

export const AuthContextProvider = ({
    children,
}) => {
    const [user, setUser] = React.useState(null)
    const [loading, setLoading] = React.useState(true)
    const router = useRouter()

    React.useEffect(() => {
        setLoading(true)
        const unsubscribe = onAuthStateChanged(auth, (authenticatedUser) => {
            if (authenticatedUser) {
                if(!user){
                    setUser(authenticatedUser)
                    router.push('/')
                }
            } else {
                if(window.location.href.includes('about-dev')){
                    setLoading(false)
                    return
                }
                setUser(null)
                router.push('/login')
            }
            setLoading(false)
        })

        return () => unsubscribe()
    }, [router])

    return (
        <AuthContext.Provider value={{ user }}>
            {loading ? <div className='flex h-screen w-screen justify-center items-center'>
                <Icons.spinner className="mr-2 h-16 w-16 animate-spin" />
            </div> : children}
        </AuthContext.Provider>
    )
}