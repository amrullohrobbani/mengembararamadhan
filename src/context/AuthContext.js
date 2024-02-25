'use client'
import React from 'react'
import {
    onAuthStateChanged
} from 'firebase/auth'

import { Icons } from "@/components/icons"
import { auth } from "@/lib/firebase/firebase"

export const AuthContext = React.createContext({})

export const useAuthContext = () => React.useContext(AuthContext)

export const AuthContextProvider = ({
    children,
}) => {
    const [user, setUser] = React.useState(null)
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user)
            } else {
                setUser(null)
            }
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    return (
        <AuthContext.Provider value={{ user }}>
            {loading ? <div className='flex h-screen w-screen justify-center items-center'>
                <Icons.spinner className="mr-2 h-16 w-16 animate-spin" />
            </div> : children}
        </AuthContext.Provider>
    )
}