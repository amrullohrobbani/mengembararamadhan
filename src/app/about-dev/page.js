'use client'
import Image from "next/image"
import imagePlaceholder from '@/assets/image/imagePlaceholder.jpg'
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Icons } from "@/components/icons"
import Link from "next/link"
import { useRef } from "react"

import CardTemplate from "@/components/card/card-template"
import {
  CardContent,
} from "@/components/ui/card"
import { useInView } from 'react-intersection-observer'

export default function AboutDevPage() {
    const cardRef = useRef(null)
    
    const { ref } = useInView({
        threshold: 0,
        onChange(inView) {
            if(inView){
                cardRef.current.children[0].classList.add('rotateY180')
                cardRef.current.children[0].classList.remove('-rotateY180')
            }
        }
    })
    return (
        <>
            <div className="h-screen w-screen perspective-1">
                <div className="absolute bg-[url('~/src/assets/image/imageBackgroundHeader.jpg')] h-screen w-screen parallax__layer__0" />
                <div className="absolute h-screen w-screen bg-gradient-to-t from-black/70 from-10% parallax__layer__3" />
                <div className="absolute h-screen w-screen bg-black/90 parallax__layer__5" />
                <div className="relative px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 parallax__layer__1">
                    <div className="w-full px-36 relative">
                        <AspectRatio ratio={3/5} className="relative h-screen">
                            <svg height="100" width="100" xmlns="http://www.w3.org/2000/svg" className="top-[16%] left-[33%] -translate-x-[50%] -translate-y-[50%] absolute" >
                                <circle r="45" cx="50" cy="50" fill="none" stroke="white" strokeWidth="3" opacity="1"/>
                            </svg>
                            <svg height="100" width="100" xmlns="http://www.w3.org/2000/svg" className="top-[12%] left-[27%] -translate-x-[50%] -translate-y-[50%] absolute" >
                                <circle r="5" cx="50" cy="50" fill="white" />
                            </svg>
                            <svg height="100" width="100" xmlns="http://www.w3.org/2000/svg" className="top-[16%] left-[33%] -translate-x-[50%] -translate-y-[50%] absolute" >
                                <circle r="25" cx="50" cy="50" fill="none" stroke="white" strokeWidth="1" opacity="1" />
                            </svg>
                            <div className="absolute w-full h-full bg-white" style={{clipPath: "inset(19% 65% 32% 23%)"}} />
                            <div className="absolute w-full h-full bg-white" style={{clipPath: "inset(52% 31% 6% 53%)"}} />
                            <Image src={imagePlaceholder} alt="PP" style={{clipPath: "inset(53% 32% 7% 54%)"}} className="absolute object-contain top-0" fill />
                            <svg height="100%" width="100%" viewBox="0 0 100 100"  preserveAspectRatio="none" className="drop-shadow-[0_13px_13px_rgba(0,0,0,0.25)]" >
                                <path d="M37 6 L63 6 L63 86 L37 86 Z" stroke="white" strokeWidth="1" />
                                <line x1={43} x2={43} y1={2} y2={50} stroke="white" strokeWidth="0.25" />
                                <line x1={45} x2={45} y1={1} y2={50} stroke="white" strokeWidth="0.5" />
                                 <line x1={48} x2={48} y1={50} y2={98} stroke="white" strokeWidth="0.25" />
                                <line x1={50} x2={50} y1={50} y2={99} stroke="white" strokeWidth="0.5" /> 
                                <line x1={30} x2={30} y1={50} y2={78} stroke="white" strokeWidth="0.25" />
                                <line x1={31} x2={31} y1={50} y2={79} stroke="white" strokeWidth="0.5" /> 
                            </svg>
                            <Image src={imagePlaceholder} alt="PP" style={{clipPath: "inset(20% 66% 33% 24%)"}} className="absolute object-contain top-0" fill />
                            <Image src={imagePlaceholder} alt="PP" style={{clipPath: "inset(6% 37% 14% 37%)"}} className="absolute object-contain top-0" fill />
                            {/* <Image src={imagePlaceholder} alt="PP" style={{clipPath: "inset(16% 27% 14% 71%)"}} className="absolute object-contain top-0" fill />
                            <Image src={imagePlaceholder} alt="PP" style={{clipPath: "inset(23% 21% 22% 78%)"}} className="absolute object-contain top-0" fill /> */}
                        </AspectRatio>
                    </div>
                    <div className="mx-auto max-w-4xl h-screen flex items-center">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">Muhammad Amrulloh Robbani</h1>
                            <div className="mt-6 text-lg leading-8 text-gray-200 grid grid-cols-3 gap-3">
                                <div className="flex gap-3 items-center">
                                    <div>
                                        <Icons.gmail/>
                                    </div>
                                    <div className="text-base">
                                        amrullohrobbani@gmail.com
                                    </div>
                                </div>
                                <div className="flex gap-3 items-center">
                                    <div>
                                        <Icons.gitHub className="w-6"/>
                                    </div>
                                    <div className="text-base">
                                        amrullohrobbani
                                    </div>
                                </div>
                                <div className="flex gap-3 items-center">
                                    <div>
                                        <Icons.linkedin className="w-6"/>
                                    </div>
                                    <div className="text-base">
                                        <Link href="http://www.linkedin.com/in/muhammad-amrullah-robbani" passHref={true}>
                                            Muhammad Amrulloh Robbani
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-10 flex items-center justify-center gap-x-6">
                                <a href="#" className="rounded-md bg-emerald-400 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Learn More</a>
                                {/* <a href="#" className="text-sm font-semibold leading-6 text-white">Learn more <span aria-hidden="true">→</span></a> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-screen bg-[#222222]">
                <div className="absolute w-full h-full bg-gradient-to-b from-black to-40%" />
                <div className="grid grid-cols-2 py-56">
                    <div className="flex items-center justify-center relative" ref={ref}>
                        <div className="absolute top-5 right-48">
                            <svg height="33.25rem" width="23.75rem" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <path d="M0 0 L100 0 L100 100 L0 100 Z" strokeWidth="5" stroke="#34d399" fill="none"/>
                            </svg>
                        </div>
                        <CardTemplate ref={cardRef}>
                            <CardContent className="grid gap-4 h-full text-center">
                                <Image src={imagePlaceholder} fill alt="PP"/>
                                <div className="absolute h-full w-full top-0 left-0">
                                    <svg height="100%" width="100%" viewBox="0 0 100 100"  preserveAspectRatio="none">
                                        <path d="M5 5 L95 5 L95 95 L5 95 Z" strokeWidth="1" stroke="black" fill="none"/>
                                    </svg>
                                </div>
                            </CardContent>
                        </CardTemplate>
                    </div>
                    <div className="flex items-center justify-center w-full h-full relative pr-24">
                        <div className="relative w-full text-center">
                            <h1 className="font-bold text-5xl whitespace-nowrap text-black/20">
                                Muhammad Amrulloh Robbani
                            </h1>
                            <h3 className="text-lg font-bold whitespace-nowrap -mt-8 text-[#34d399]" onClick={cardRef.current?.focus()}>
                                Muhammad Amrulloh Robbani
                            </h3>
                            <div className="text-justify px-12 text-white py-12">
                                Voracious full-stack web developer who specializes in front-end aspects for 4 years and enthusiastic biomedical engineer with proven skills in ideation, creation, and leadership in 1 internship and several biomedical engineering projects. Interested in biomedical data integration and optimization in sports or eSports to enhance player performance and coaches knowledge. Led front-end team to refactor company CSR website to increase customer engagement up to 800 users and completed 4 biomedical engineering projects: non-invasive glaucoma detection, wearable ECG, teenager fitness data acquisition, and non-invasive fetal electrocardiogram.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}