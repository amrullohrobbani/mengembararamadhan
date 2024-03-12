'use client'
import { useCallback, useEffect, useState, useMemo } from "react"
import { ChartSwitcher } from "@/components/dashboard/chart-switcher"
import TeamSwitcher from "@/components/dashboard/team-switcher"
import { UserNav } from "@/components/dashboard/user-nav"
import { Icons } from "@/components/icons"
import _debounce from 'lodash/debounce'
import Link from "next/link"
import {
  Card
} from "@/components/ui/card"
import {
  Table,
  TableHeader,
  TableHead,
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
import { level, rank, amalan, sumTotal, formatCurrency } from '@/lib/utils'
import Image from 'next/image'
import medal1 from '@/assets/image/t_common_icon_no_1.webp'
import medal2 from '@/assets/image/t_common_icon_no_2.webp'
import medal3 from '@/assets/image/t_common_icon_no_3.webp'
import RankIcon from "@/components/dashboard/rank-icon"
import InputModal from "@/components/dashboard/input-modal" 
import { Input } from "@/components/ui/input"
import { where, Timestamp } from "firebase/firestore"
import dayjs from "dayjs"

export default function Home() {
  const { user } = useAuthContext()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [players, setPlayers] = useState()
  const [topAmalan, setTopAmalan] = useState([])
  const [myProgress, setMyProgress] = useState([])
  const [listAmalan, setListAmalan] = useState([])
  const [teams, setTeams] = useState()
  const [chart, setChart] = useState('')

  const getInitials = (inputString) => {
    if(!inputString) return 
    const words = inputString.split(' ')
    const initials = words.map((word) => word[0].toUpperCase())
    return initials.join('')
  }

  function selectedGroup(selectedTeams){
    return setTeams(selectedTeams)
  }

  function selectedChart(chart){
    return setChart(chart)
  }

  const fetchData = useCallback(async () => {
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

      const responseTeams = await readData(['usersTeams',  user.uid])
      if(!responseTeams){
        router.push('/init')
      }
      if(teams){
        const memberOfTeam = await readData(['teams', teams?.id])
        const playerList = await readDataQuery('users', ['uid', 'in', Object.keys(memberOfTeam.members)], ['exp', 'desc'])
        setPlayers(playerList)
        const season = await readDataQueryCustom('season', [where('startDate', '<=', Timestamp.now())])
        season.find((obj) => obj.endDate >= Timestamp.now())
        const amalanList = await readDataQueryCustom('tasks', [where('uid', '==', user.uid)])
        setListAmalan(amalanList)
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
              value: value,
              avg: value/amalanList?.length,
              target: playerList?.[playerList?.findIndex((obj) => obj.uid === user.uid)]?.target?.[key]
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
        const amalanProgressList = await readDataQueryCustom('tasks', [where('dateSubmitted', 'in', dateArray), where('uid', '==', user.uid)])
        setMyProgress(dateArray.map((date) => {
          return {
            date: dayjs(date).format('DD MMM YYYY'),
            value: sumTotal(amalanProgressList.find((obj) => obj.dateSubmitted === date), chart)
          }
        }).reverse())
      }
      return response
  }, [router, teams, user, chart])

  const targetReferenceLine = useMemo(() => {
    const player = players?.[players?.findIndex((obj) => obj.uid === user.uid)]
    if(player?.target){
      player.target.infaq = parseFloat((player.target.infaq/10000).toFixed(2))
    }
    if(chart && chart !== ''){
      return parseFloat(player?.target[chart])
    }
    return player?.target? Object.values(player?.target)?.map((numb) => parseFloat(numb))?.reduce((a, b) => (a) + b, 0):0
  }, [chart, players])

  useEffect(() => {
    if (user) {
      setLoading(true)
      fetchData()
      setLoading(false)
    }
  }, [fetchData, user, chart, players?.length])

  const handleInputTarget = useCallback(_debounce(
    (e) => {
      e.preventDefault()
      updateData(['users',  user.uid],{
        [`target.${e.target.name.split('-').pop()}`]: e.target.value
      })
    }
  , 500), [])
  
  return (
    <main className="min-h-screen h-auto md:h-screen p-5 py-24 md:p-24 no-scrollbar">
      {loading ? <div className='flex h-screen w-screen justify-center items-center bg-white/10'>
        <Icons.spinner className="mr-2 h-16 w-16 animate-spin" />
      </div> : undefined}
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <div className="fixed left-0 top-0 flex w-full px-5 justify-between border-b border-gray-300 bg-gradient-to-br from-indigo-500/25 from-10% via-sky-500/25 via-30% to-emerald-500/25 to-90% pb-1 md:pb-6 pt-2 md:pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit">
          <TeamSwitcher selectedGroup={selectedGroup} />
          <Link href={'/'}>
            <div className="hidden md:block">
              ft{' '}<code className="text-sm md:text-2xl italic font-mono font-bold">Mengembara ke Surga</code> 
            </div>
          </Link>
          <UserNav user={user}/>
        </div>
      </div>
      
      <InputModal refetchData={fetchData} />
      <div>
        <h2 className="my-0 md:my-5 text-3xl font-bold tracking-tight">Personal</h2>
      </div>
      <div className="w-full h-full flex flex-col md:flex-row gap-5">
        <div className="w-full">
          <Card className="flex flex-col w-full !h-full bg-gradient-to-br from-indigo-500/25 from-10% via-sky-500/25 via-30% to-emerald-500/25 to-90%">
            <div className="w-full text-center my-5 font-semibold">{user?.displayName}</div>
            <div className="flex justify-center w-full h-1/2">
              <div className="flex w-full justify-center gap-5 px-2 md:px-0">
                <div className="w-1/2 text-center">
                    <div className="font-semibold">
                      Your Rank
                    </div>
                    <div className="w-1/2 p-12 mx-auto">
                      {players?.findIndex((obj) => obj.uid === user.uid) === 0 &&
                        <Image
                          priority
                          src={medal1}
                          alt="medal"
                          className="w-full"
                        />
                      }
                      {players?.findIndex((obj) => obj.uid === user.uid) === 1 &&
                        <Image
                          priority
                          src={medal2}
                          alt="medal"
                          className="w-full"
                        />
                      }
                      {players?.findIndex((obj) => obj.uid === user.uid) === 2 &&
                        <Image
                          priority
                          src={medal3}
                          alt="medal"
                          className="w-full"
                        />
                      }
                      {players?.findIndex((obj) => obj.uid === user.uid) +1 > 2 &&
                        <code className="text-5xl font-semibold italic">
                          {players?.findIndex((obj) => obj.uid === user.uid) + 1}
                        </code>
                      }
                    </div>
                  </div>
                  <div className="flex flex-col justify-center">
                    <div className="grid grid-cols-2 justify-center items-center gap-5">
                      <Avatar className="h-32 w-32 mb-1">
                        <AvatarImage src={players?.[players?.findIndex((obj) => obj.uid === user.uid)]?.photoURL} alt="PP" />
                        <AvatarFallback>{getInitials(players?.[players?.findIndex((obj) => obj.uid === user.uid)]?.displayName)}</AvatarFallback>
                      </Avatar>
                      <div className="relative w-full h-full">
                        <RankIcon rank={rank(level(players?.[players?.findIndex((obj) => obj.uid === user.uid)]?.exp))} />
                      </div>
                    </div>
                    <div className="text-center mt-5 font-semibold">Level {level(players?.[players?.findIndex((obj) => obj.uid === user.uid)]?.exp)} {rank(level(players?.[players?.findIndex((obj) => obj.uid === user.uid)]?.exp))}</div>
                  </div>
              </div>
            </div>
            <div className="h-full overflow-auto rounded-md bg-white m-5 no-scrollbar">
              <div className="h-full">
                <Table>  
                  <TableHeader>
                    <TableRow>
                      <TableHead >Date</TableHead>
                      <TableHead>Rawatib</TableHead>
                      <TableHead>Dhuha</TableHead>
                      <TableHead>Mengaji</TableHead>
                      <TableHead>Infaq</TableHead>
                      <TableHead>Tahajud</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {listAmalan?.map((player, index) => (
                      <TableRow key={index}>
                        <TableCell className="whitespace-nowrap">{dayjs(player.dateSubmitted).format('dddd, DD MMM YYYY')}</TableCell>
                        <TableCell>{player.rawatib}</TableCell>
                        <TableCell>{player.dhuha}</TableCell>
                        <TableCell>{player.mengaji}</TableCell>
                        <TableCell className="whitespace-nowrap">Rp. {formatCurrency(player.infaq)}</TableCell>
                        <TableCell>{player.tahajud}</TableCell>                        
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
            <div className="w-full text-center mt-5 mb-1 font-semibold relative">
              <span>
                Your Progress
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
                    <ReferenceLine y={targetReferenceLine} label={`Target ${targetReferenceLine}`} stroke="red" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>      
              </div>
            </div>
          </Card>
          <Card className="flex flex-col w-full h-1/2 bg-gradient-to-br from-indigo-500/25 from-10% via-sky-500/25 via-30% to-emerald-500/25 to-90%">
            <div className="w-full text-center mt-5 mb-1 font-semibold">Top Daily</div>
            <div className="h-full overflow-auto rounded-md bg-white m-5 no-scrollbar">
              <div className="h-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead></TableHead>
                      <TableHead></TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Average</TableHead>
                      <TableHead>Target</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                  {topAmalan?.map((obj, index) => (
                      <TableRow key={index}>
                        <TableCell>{ index + 1 }</TableCell>
                        <TableCell className="capitalize">{obj.name}</TableCell>
                        <TableCell>{obj.value}</TableCell>
                        <TableCell>{obj.avg}</TableCell>
                        <TableCell className="w-1/3" >
                          <Input name={`target-${obj.name}`}  id={`target-${obj.name}`} defaultValue={obj.target} onInput={handleInputTarget} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
