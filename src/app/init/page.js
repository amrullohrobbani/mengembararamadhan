import CardTemplate from "@/components/card/card-template"

export const metadata = {
  title: "Your First Step",
  description: "First Step",
}

export default function initPage() {
  return (
    <>
      <div className="container bg-gradient-to-br from-indigo-500/25 from-10% via-sky-500/25 via-30% to-emerald-500/25 to-90% relative h-[100vh] flex-col md:flex-row items-center justify-center lg:px-0">
      <div className="flex w-full h-full justify-center items-center">
        <CardTemplate />
      </div>
      </div>
    </>
  )
}