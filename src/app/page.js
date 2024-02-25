'use client'
import { useCallback, useEffect, useState } from "react"
import TeamSwitcher from "@/components/dashboard/team-switcher"
import { UserNav } from "@/components/dashboard/user-nav"
import { Icons } from "@/components/icons"
import {
  Card
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableRow,
} from "@/components/ui/table"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useAuthContext } from "@/context/AuthContext"
import { useRouter } from 'next/navigation'
import { readData, readDataQuery, addData } from '@/lib/firebase/database/handleData.js'
import Image from 'next/image'
import medal1 from '@/assets/image/t_common_icon_no_1.webp'
import medal2 from '@/assets/image/t_common_icon_no_2.webp'
import medal3 from '@/assets/image/t_common_icon_no_3.webp'

const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.0011",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
]

export default function Home() {
  const { user } = useAuthContext()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [players, setPlayers] = useState([])
  const [teams, setTeams] = useState()

  const getInitials = (inputString) => {
    if(!inputString) return 
    const words = inputString.split(' ')
    const initials = words.map((word) => word[0].toUpperCase())
    return initials.join('')
  }

  function selectedGroup(selectedTeams){
    return setTeams(selectedTeams)
  }

  const fetchData = useCallback(async () => {
      const response = await readData(['users',  user.uid])
      if(!response){
        addData(['users',  user.uid], {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          lastLoginAt: user.metadata.lastSignInTime,
          exp: 0
        })
      }

      const responseTeams = await readData(['usersTeams',  user.uid])
      if(!responseTeams){
        router.push('/init')
      }
      const responsePlayers = await readDataQuery('usersTeams', [teams?.id, '==', true])
      let playerData = []
      responsePlayers?.map(async (obj) => {
        const response = await readData(['users', obj.id])
        playerData.push(response)
      })
      setPlayers(playerData)
      console.log(teams)

      return response
  }, [router, teams, user])

  useEffect(() => {
    if (!user) router.push("/login")
    if (user) {
      setLoading(true)
      fetchData()
      setLoading(false)
    }
  }, [fetchData, router, user])
  
  return (
    <main className="min-h-screen h-auto md:h-screen p-5 py-24 md:p-24 no-scrollbar">
      {loading ? <div className='flex h-screen w-screen justify-center items-center bg-white/10'>
        <Icons.spinner className="mr-2 h-16 w-16 animate-spin" />
      </div> : undefined}
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <div className="fixed left-0 top-0 flex w-full px-5 justify-between border-b border-gray-300 bg-gradient-to-br from-indigo-500/25 from-10% via-sky-500/25 via-30% to-emerald-500/25 to-90% pb-1 md:pb-6 pt-2 md:pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit">
          <TeamSwitcher selectedGroup={selectedGroup} />
          <div className="hidden md:block">
            ft{' '}<code className="text-sm md:text-2xl italic font-mono font-bold">Mengembara ke Surga</code> 
          </div>
          <UserNav user={user}/>
        </div>
      </div>
      
      <div>
        <h2 className="my-0 md:my-5 text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="w-full h-full flex flex-col md:flex-row gap-5">
        <div className="w-full">
          <Card className="flex flex-col w-full !h-full bg-gradient-to-br from-indigo-500/25 from-10% via-sky-500/25 via-30% to-emerald-500/25 to-90%">
            <div className="w-full text-center my-5 font-semibold">Top Players</div>
            <div className="flex justify-center w-full h-1/3">
              <div className="flex justify-center gap-5 px-12 md:px-0">
                <div className="flex flex-col justify-end">
                  <div className="text-center">
                    Juara 3
                  </div>
                  <div className="bg-white px-5 h-2/5 text-center"> 
                    <Image
                      priority
                      src={medal3}
                      alt="medal"
                      className="scale-50"
                    />
                  </div> 
                </div>
                <div className="flex flex-col justify-end">
                  <div className="flex justify-center">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={players[0]?.photoURL} alt="@shadcn" />
                      <AvatarFallback>{getInitials(players[0]?.displayName)}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="bg-white px-5 h-4/5">
                    <Image
                      priority
                      src={medal1}
                      alt="medal"
                    />
                  </div> 
                </div>
                <div className="flex flex-col justify-end">
                  <div className="text-center">
                    Juara 2
                  </div>
                  <div className="bg-white px-5 h-3/5">
                    <Image
                      priority
                      src={medal2}
                      alt="medal"
                      className="scale-75"
                    />
                  </div> 
                </div>
              </div>
            </div>
            <div className="h-full overflow-auto rounded-md bg-white m-5 no-scrollbar">
              <div className="h-full">
                <Table>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.invoice}>
                        <TableCell className="font-medium">{invoice.invoice}</TableCell>
                        <TableCell>{invoice.paymentStatus}</TableCell>
                        <TableCell>{invoice.paymentMethod}</TableCell>
                        <TableCell className="text-right">{invoice.totalAmount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={3}>Total</TableCell>
                      <TableCell className="text-right">$2,500.00</TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            </div>
          </Card>
        </div>

        <div className="w-full flex flex-col gap-5">
          <Card className="flex flex-col w-full h-1/2 bg-gradient-to-br from-indigo-500/25 from-10% via-sky-500/25 via-30% to-emerald-500/25 to-90%">
            <div className="w-full text-center mt-5 mb-1 font-semibold">Top Daily</div>
            <div className="h-full overflow-auto rounded-md bg-white m-5 no-scrollbar">
              <div className="h-full">
                <Table>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.invoice}>
                        <TableCell className="font-medium">{invoice.invoice}</TableCell>
                        <TableCell>{invoice.paymentStatus}</TableCell>
                        <TableCell>{invoice.paymentMethod}</TableCell>
                        <TableCell className="text-right">{invoice.totalAmount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={3}>Total</TableCell>
                      <TableCell className="text-right">$2,500.00</TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            </div>
          </Card>
          <Card className="flex flex-col w-full h-1/2 bg-gradient-to-br from-indigo-500/25 from-10% via-sky-500/25 via-30% to-emerald-500/25 to-90%">
            <div className="w-full text-center mt-5 mb-1 font-semibold">Your Progress</div>
            <div className="h-full overflow-auto rounded-md bg-white m-5 no-scrollbar">
              <div className="h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    width={500}
                    height={300}
                    data={data}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>      
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
