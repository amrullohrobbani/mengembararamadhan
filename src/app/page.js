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
  TableRow,
} from "@/components/ui/table"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useAuthContext } from "@/context/AuthContext"
import { useRouter } from 'next/navigation'
import { readData, readDataQuery, addData, readDataQueryCustom, updateData } from '@/lib/firebase/database/handleData.js'
import { level, rank, amalan, sumTotal } from '@/lib/utils'
import Image from 'next/image'
import medal1 from '@/assets/image/t_common_icon_no_1.webp'
import medal2 from '@/assets/image/t_common_icon_no_2.webp'
import medal3 from '@/assets/image/t_common_icon_no_3.webp'
import RankIcon from "@/components/dashboard/rank-icon"
import InputModal from "@/components/dashboard/input-modal" 
import { where, Timestamp } from "firebase/firestore"
import dayjs from "dayjs"

export default function Home() {
  const { user } = useAuthContext()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [players, setPlayers] = useState([])
  const [topAmalan, setTopAmalan] = useState([])
  const [myProgress, setMyProgress] = useState([])
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
      setLoading(true)
      const response = await readData(['users',  user.uid])
      if(!response){
        addData(['users',  user.uid], {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          lastLoginAt: user.metadata.lastSignInTime,
          exp: 0
        })
      }

      if(!response.uid){
        updateData(['usersTeams',  user.uid], {
          uid: user.uid
        })
      }

      const responseTeams = await readData(['usersTeams',  user.uid])
      if(!responseTeams){
        router.push('/init')
      }
      if(teams){
        const memberOfTeam = await readData(['teams', teams?.id])
        const playerList = await readDataQuery('users', ['uid', 'in', Object.keys(memberOfTeam.members).filter(key => memberOfTeam.members[key] === true)], ['exp', 'desc'])
        setPlayers(playerList)
        const season = await readDataQueryCustom('season', [where('startDate', '<=', Timestamp.now())])
        season.find((obj) => obj.endDate >= Timestamp.now())
        const amalanList = await readDataQueryCustom('tasks', [where('seasonid', '==', season?.[0]?.id), where('uid', 'in', playerList.map((obj) => obj.id))])
        setTopAmalan(() => {
          let result = {}
          for (let key in amalanList) {
            let obj = amalanList[key]
            for (let prop in obj) {
              if (amalan.includes(prop)) {
                if (result[prop] === undefined) {
                  result[prop] = parseInt(obj[prop])
                } else {
                  result[prop] += parseInt(obj[prop])
                }
              }
            }
          }
          result.infaq = result.infaq/10000
          return Object.entries(result).map(([key, value]) => {
            return {
              name: key,
              value: value
            }
          }).sort((a, b) => b.value - a.value)
        })
        const dateArray = [];
        // Generate an array of dates for the past 7 days
        for (let i = 0; i < 7; i++) {
          const currentDate = dayjs().subtract(i, 'day');
          const formattedDate = currentDate.format('YYYY-MM-DD');
          dateArray.push(formattedDate);
        }
        const amalanProgressList = await readDataQueryCustom('tasks', [where('dateSubmitted', 'in', dateArray), where('uid', 'in', playerList.map((obj) => obj.id))])
        setMyProgress(dateArray.map((date) => {
          return {
            date: dayjs(date).format('DD MMM YYYY'),
            value: sumTotal(amalanProgressList.find((obj) => obj.dateSubmitted === date))
          }
        }).reverse())
      }
      setLoading(false)
      return response
  }, [router, teams, user])

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [fetchData, user, teams])
  
  return (
    <main className="min-h-screen h-auto md:h-screen p-5 py-24 md:p-24 no-scrollbar">
      {loading ? <div className='z-[100] fixed top-0 left-0 flex h-screen w-screen justify-center items-center bg-white/50'>
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
      
      <InputModal refetchData={fetchData} />
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
                  <div className="flex justify-center">
                    <Avatar className="h-8 w-8 mb-1">
                      <AvatarImage src={players?.[2]?.photoURL} alt="PP" />
                      <AvatarFallback>{getInitials(players?.[2]?.displayName)}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="bg-white px-5 pt-1 h-2/5 text-center"> 
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
                    <Avatar className="h-8 w-8 mb-1">
                      <AvatarImage src={players?.[0]?.photoURL} alt="PP" />
                      <AvatarFallback>{getInitials(players?.[0]?.displayName)}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="bg-white px-5 pt-1 h-4/5">
                    <Image
                      priority
                      src={medal1}
                      alt="medal"
                    />
                  </div> 
                </div>
                <div className="flex flex-col justify-end">
                  <div className="flex justify-center">
                    <Avatar className="h-8 w-8 mb-1">
                      <AvatarImage src={players?.[1]?.photoURL} alt="PP" />
                      <AvatarFallback>{getInitials(players?.[1]?.displayName)}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="bg-white px-5 pt-1 h-3/5">
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
                    {players?.map((player, index) => (
                      <TableRow key={index}>
                        <TableCell>{ index + 1 }</TableCell>
                        <TableCell>
                          <Avatar className="h-8 w-8 mb-1">
                            <AvatarImage src={player?.photoURL} alt="PP" />
                            <AvatarFallback>{getInitials(player?.displayName)}</AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell>{player?.displayName}</TableCell>
                        <TableCell>{level(player.exp)}</TableCell>
                        <TableCell className="relative">
                            <RankIcon rank={rank(level(player.exp))} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </Card>
        </div>

        <div className="w-full flex flex-col gap-5">
          <Card className="flex flex-col w-full h-1/2 bg-gradient-to-br from-indigo-500/25 from-10% via-sky-500/25 via-30% to-emerald-500/25 to-90%">
            <div className="w-full text-center mt-5 mb-1 font-semibold">Your Top Daily</div>
            <div className="h-full overflow-auto rounded-md bg-white m-5 no-scrollbar">
              <div className="h-full">
                <Table>
                  <TableBody>
                  {topAmalan?.map((obj, index) => (
                      <TableRow key={index}>
                        <TableCell>{ index + 1 }</TableCell>
                        <TableCell className="capitalize">{obj.name}</TableCell>
                        <TableCell>{obj.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </Card>
          <Card className="flex flex-col w-full h-1/2 bg-gradient-to-br from-indigo-500/25 from-10% via-sky-500/25 via-30% to-emerald-500/25 to-90%">
            <div className="w-full text-center mt-5 mb-1 font-semibold">Your Team Progress</div>
            <div className="h-full overflow-auto rounded-md bg-white m-5 no-scrollbar">
              <div className="h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    width={500}
                    height={300}
                    data={myProgress}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
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
