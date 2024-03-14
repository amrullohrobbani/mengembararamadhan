'use client'
import {
  CheckIcon,
} from "@radix-ui/react-icons"
import { useCallback, useEffect, useMemo, useState } from "react"
import TeamSwitcher from "@/components/dashboard/team-switcher"
import SeasonSwitcher from "@/components/dashboard/season-switcher"
import { ChartSwitcher } from "@/components/dashboard/chart-switcher"
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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts'
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
import Link from "next/link"

export default function Home() {
  const { user } = useAuthContext()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [players, setPlayers] = useState([])
  const [topAmalan, setTopAmalan] = useState([])
  const [myProgress, setMyProgress] = useState([])
  const [teams, setTeams] = useState()
  const [chart, setChart] = useState('')
  const [season, setSeason] = useState('')

  const getInitials = (inputString) => {
    if(!inputString) return 
    const words = inputString.split(' ')
    const initials = words.map((word) => word[0].toUpperCase())
    return initials.join('')
  }

  function selectedGroup(selectedTeams){
    return setTeams(selectedTeams)
  }

  function selectedSeason(selectedSeason){
    return setSeason(selectedSeason)
  }

  function selectedChart(chart){
    return setChart(chart)
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
        let amalanList = await readDataQueryCustom('tasks', [where('uid', 'in', playerList.map((obj) => obj.id))])
        if(season) {
          amalanList = amalanList.filter((obj) => obj.seasonid === season)
          const playerL = playerList.map((player) => {
            return {
              ...player,
              seasonExp: amalanList.filter((obj) => obj.uid === player.uid)?.map((obj) => sumTotal(obj, chart))?.reduce((a, b) => (a) + b, 0)
            }
          })
          .sort((a, b) => {
            return b.seasonExp - a.seasonExp;
          })
          setPlayers(playerL)
        }
        setTopAmalan(() => {
          let result = {}
          for (let key in amalanList) {
            let obj = amalanList[key]
            for (let prop in obj) { 
              if (amalan.includes(prop)) {
                if (result[prop] === undefined) {
                  result[prop] = parseFloat(obj[prop])
                } else {
                  result[prop] += parseFloat(obj[prop])
                }
              }
            }
          }
          if(result.infaq){
            result.infaq = result.infaq/10000
          }
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
        const amalanProgressList = await readDataQueryCustom('tasks', [where('uid', 'in', playerList.map((obj) => obj.id))])
        const amalanProgress = amalanProgressList.filter((obj) => dateArray.includes(obj.dateSubmitted)).filter((obj) => {
          if(season){
            return obj.seasonid === season
          }
          return obj
        })
        setMyProgress(dateArray.map((date) => {
          return {
            date: dayjs(date).format('DD MMM YYYY'),
            value: amalanProgress.filter((obj) => obj.dateSubmitted === date)?.map((obj) => sumTotal(obj, chart))?.reduce((a, b) => (a) + b, 0)
          }
        }).reverse())
      }
      setLoading(false)
      return response
  }, [router, teams, user, chart, season])

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [fetchData, user, teams, chart])

  const targetReferenceLine = useMemo(() => {
    const sumObjects = (array) => {
      return array.reduce((accumulator, currentValue) => {
        Object.keys(currentValue).forEach((property) => {
          accumulator[property] = (parseInt(accumulator[property]) || 0) + (parseInt(currentValue[property]) || 0)
        })
        return accumulator
      }, {})
    }
    
    const player = {
      target: sumObjects(players.map((obj) => obj.target).filter(item => item))
    }
    player.target.infaq = parseFloat((player.target.infaq/10000).toFixed(2))
    if(chart && chart !== ''){
      return parseFloat(player?.target[chart])
    }
    return player?.target? Object.values(player?.target)?.map((numb) => parseFloat(numb))?.reduce((a, b) => (a) + b, 0):0
  }, [chart, players])
  
  return (
    <main className="min-h-screen h-auto md:h-screen p-5 py-24 md:p-24 no-scrollbar">
      {loading ? <div className='z-[100] fixed top-0 left-0 flex h-screen w-screen justify-center items-center bg-white/50'>
        <Icons.spinner className="mr-2 h-16 w-16 animate-spin" />
      </div> : undefined}
      <div className="z-50 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <div className="absolute md:fixed left-0 top-0 flex w-full px-5 justify-between border-b border-gray-300 bg-gradient-to-br from-indigo-500/25 from-10% via-sky-500/25 via-30% to-emerald-500/25 to-90% pb-1 md:pb-6 pt-2 md:pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit">
          <TeamSwitcher selectedGroup={selectedGroup} />
          <Link href={'/'}>
            <div className="hidden md:block">
              ft{' '}<code className="text-sm md:text-2xl italic font-mono font-bold">Mengembara ke Surga</code> 
            </div>
          </Link>
          <div className="flex gap-4">
            <SeasonSwitcher selectedSeason={selectedSeason} />
            <UserNav user={user}/>
          </div>
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
                        <TableCell>
                          <div className="flex gap-3">
                            {player?.displayName}
                            {
                              player?.target && 
                              <CheckIcon
                                className="rounded-full p-1 bg-blue-400 text-white h-4 w-4"
                              />
                            }
                          </div>
                        </TableCell>
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
            <div className="w-full text-center mt-5 mb-1 font-semibold">Your Team Top Daily</div>
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
            <div className="w-full text-left md:text-center mt-5 mb-1 font-semibold relative">
              <span className="ml-5 md:ml-0 text-sm md:text-base">
                Your Team Progress
              </span>
              <div className="absolute right-5 bottom-0">
                <ChartSwitcher setChartValue={selectedChart} />
              </div>
            </div>
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
                    <ReferenceLine y={targetReferenceLine} label={`Target ${targetReferenceLine}`} stroke="red" alwaysShow />
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
