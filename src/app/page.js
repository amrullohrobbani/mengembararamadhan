import TeamSwitcher from "@/components/dashboard/team-switcher"
import { UserNav } from "@/components/dashboard/user-nav"
import {
  Card
} from "@/components/ui/card"

export default function Home() {
  return (
    <main className="min-h-screen h-auto md:h-screen p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full px-5 justify-between border-b border-gray-300 bg-gradient-to-br from-indigo-500/25 from-10% via-sky-500/25 via-30% to-emerald-500/25 to-90% pb-1 md:pb-6 pt-2 md:pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit">
          <TeamSwitcher />
          <div className="hidden md:block">
            ft{' '}<code className="text-sm md:text-2xl italic font-mono font-bold">Mengembara ke Surga</code> 
          </div>
          <UserNav />
        </p>
      </div>
      
      <div>
        <h2 className="my-0 md:my-5 text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <Card className="w-full h-full bg-gradient-to-br from-indigo-500/25 from-10% via-sky-500/25 via-30% to-emerald-500/25 to-90%">
            <div className="w-full text-center my-5 font-semibold">Top Players</div>
            <div className="flex">
              <div className="flex">
                
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
