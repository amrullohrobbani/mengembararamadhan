import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AboutDev() {
    return (
        <>
            <Link href={'/about-dev'}>
                <Button variant="ghost" className="fixed bottom-7 left-7 hover:bg-transparent">
                    <div className="rounded-lg bg-gradient-to-bl from-indigo-500/75 from-10% via-sky-500/75 via-30% to-emerald-500/75 to-90% p-5 text-white">
                        About Dev
                    </div>
                </Button>
            </Link>
        </>
    )
}