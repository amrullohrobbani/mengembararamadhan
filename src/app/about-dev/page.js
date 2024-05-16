'use client'
import Image from "next/image"
import imageMe from '@/assets/image/imageMe.png'
import imageMine from '@/assets/image/mine 2.png'
import me from '@/assets/image/S10122I-009340.A_IMG_0020 asf.jpg'
import Regista from '@/assets/image/Regista.png'
import Databugar from '@/assets/image/databugar.png'
import Robovis from '@/assets/image/Robovis.png'
import ELS from '@/assets/image/ELS.png'
import FMD from '@/assets/image/FMD.png'
import Suteki from '@/assets/image/Suteki.png'
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Icons } from "@/components/icons"
import Link from "next/link"
import { useRef, useState, useEffect } from "react"
import CardTemplate from "@/components/card/card-template"
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import { useInView } from 'react-intersection-observer'
import { InstagramLogoIcon, DiscordLogoIcon } from '@radix-ui/react-icons'

import suteki from '@/assets/image/experience/suteki.jpeg'
import elife from '@/assets/image/experience/elife.jpeg'
import databugar from '@/assets/image/experience/databugar.png'
import robovis from '@/assets/image/experience/robovis.png'
import regista from '@/assets/image/experience/regista.png'
import dfm from '@/assets/image/experience/dfm.png'

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"

import Autoplay from "embla-carousel-autoplay"

const images = require.context('@/assets/image/artwork', true);
const imageList = images.keys().map(image => images(image));

const imagesYonkoma = require.context('@/assets/image/yonkoma', true);
const imageYonkomaList = imagesYonkoma.keys().map(image => imagesYonkoma(image));

export default function AboutDevPage() {
    const experienceList = [
        {
            id: 'dfm',
            name: 'Biolectricity Based Fetal Movement Detector',
            description: 'Freelance Project',
            position: 'Research Engineer',
            job: [
                "Spearheaded the design and experimentation of biomedical instrumentation for bioelectricity-based fetal movement detectors, aiming for everyday use.",
                "Collaborated closely with midwives to develop mobile, user-friendly, and precise instrumentation for fetal movement detection.",
                "Utilized data analysis libraries such as SciPy and others, alongside Python and Google Colab, for comprehensive data analysis."
            ],
            place: 'Bandung, Indonesia',
            time: 'July 2021 – Present',
            logo: dfm,
            image: FMD
        },
        {
            id: 'suteki',
            name: 'Suteki Tech',
            description: 'Education Technology Solutions Startup',
            position: 'Front End Engineer',
            job: [
                "Led front-end team for Company CSR Project, developing a website for college student management with data synchronization to The Ministry of Education, Culture, Research, and Technology Indonesia, serving 800+ university users.",
                "Created company source control documentation, optimizing processes for the main web product.",
                "Initiated migration from Vue 2 and Nuxt 2 to Vue 3 and Nuxt 3, enhancing performance and aligning with industry standards.",
                "Initiated development of the company's private component library based on Vue 3 and Tailwind CSS.",
                "Conducted code reviews to improve overall code quality.",
                "Collaborated with backend, product owner, UI/UX, and quality assurance teams from grooming to UAT to ensure delivery of high-quality products.",
                "Initiated the refactoring of one of the company's products, migrating from JavaScript to TypeScript for improved maintainability and scalability."
            ],
            place: 'Bandung, Indonesia',
            time: 'Mar 2022 – Present',
            logo: suteki,
            image: Suteki
        },
        {
            id: 'elife',
            name: 'E-Life Solution Plt Malaysia',
            description: 'Startup consulting firm for technology solutions',
            position: 'Front End Engineer Intern',
            job: [
                'Worked with a team of other developers on built hospital assets and inventory management systems',
                'Designed indoor positioning system for hospital assets utilizing Internet of Things',
                'Develop and build a front-end website to manage, analyze and display assets and inventory usage on the hospital'
            ],
            place: 'Johor, Malaysia',
            time: 'May 2018 – Jul 2018',
            logo: elife,
            image: ELS
        },
        {
            id: 'databugar',
            name: 'Databugar.itb.ac.id',
            description: 'Joint Project of three department in Institut Teknologi Bandung',
            position: 'Website Developer and Consultant',
            job: [
                'As a web development project leader, planned, managed, and supervised the teenager fitness data Management web development, coordinated with the design team, and presented to the client of 2 high school and entire first-year of the university.'
            ],
            place: 'Bandung, Indonesia',
            time: 'Feb 2019 – Feb 2022',
            logo: databugar,
            image: Databugar
        },
        {
            id: 'robovis',
            name: 'Robovis Laboratory',
            description: 'Biomedical Engineering Laboratory in Institut Teknologi Bandung',
            position: 'Research Assistant',
            job: [
                'Designed and experimented on biomedical instrumentation for everyday use and collaborated with doctors to develop mobile, user-friendly, precise instrumentation.',
                'Developed a non-invasive glaucoma detection to acquire and analyze EEG signal and detect glaucoma then display the result on a website.',
                'Developed a non-invasive fetal electrocardiogram to obtain fetal heart signal and analyze the outcome.'
            ],
            place: 'Bandung, Indonesia',
            time: 'Jun 2018 – Jun 2021',
            logo: robovis,
            image: Robovis
        },
        {
            id: 'regista',
            name: 'Regista',
            description: 'Sport GPS tracker and athlete management startup',
            position: 'Founder',
            job: [
                'Designed and developed a sport GPS tracker for football players to track player vital and performance assessment tools.'
            ],
            place: 'Bandung, Indonesia',
            time: 'Feb 2019 – Present',
            logo: regista,
            image: Regista
        },
    ]

    const [state, setState] = useState(experienceList[0])
    const [api, setApi] = useState(null)
    const [apiYonkoma , setApiYonkoma] = useState(null)
    const cardsRef = useRef([])
    const cardsRefYonkoma = useRef([])
    
    const { ref } = useInView({
        threshold: 0,
        onChange(inView) {
            if(inView){
                for (let index = 0; index < cardsRef.current.length; index++) {
                    if(api.slidesInView().includes(index)){
                        cardsRef.current[index].children[0].classList.add('rotateY180')
                    }
                }
            } else {
                for (let index = 0; index < cardsRef.current.length; index++) {
                    cardsRef.current[index].children[0].classList.remove('rotateY180')
                }
            }
        }
    })
    
    const { ref : refYonkoma } = useInView({
        threshold: 0,
        onChange(inView) {
            if(inView){
                for (let index = 0; index < cardsRefYonkoma.current.length; index++) {
                    if(apiYonkoma.slidesInView().includes(index)){
                        cardsRefYonkoma.current[index].children[0].classList.add('rotateY180')
                    }
                }
            } else {
                for (let index = 0; index < cardsRefYonkoma.current.length; index++) {
                    cardsRefYonkoma.current[index].children[0].classList.remove('rotateY180')
                }
            }
        }
    })

    useEffect(() => {
        if (!api) {
          return
        }
        api.on("select", () => {
            for (let index = 0; index < cardsRef.current.length; index++) {
                if(api.slidesNotInView().includes(index)){
                    cardsRef.current[index].children[0].classList.remove('rotateY180')
                }
            }
            const imageIdx = [api.selectedScrollSnap(), api.selectedScrollSnap() + 2].map((id) => {
                    if(id === cardsRef.current.length + 1) {
                        return 1
                    }
                    if(id > cardsRef.current.length - 1) {
                        return 0
                    }
                    if(id < 0) {
                        return cardsRef.current.length - 1
                    }
                    return id
                }
            )
            imageIdx.map((id) => {
                cardsRef.current[id].children[0].classList.add('rotateY180')
            })
        })
      }, [api])

      useEffect(() => {
        if (!apiYonkoma) {
          return
        }
        apiYonkoma.on("select", () => {
            for (let index = 0; index < cardsRefYonkoma.current.length; index++) {
                if(apiYonkoma.slidesNotInView().includes(index)){
                    cardsRefYonkoma.current[index].children[0].classList.remove('rotateY180')
                }
            }
            const imageIdx = [apiYonkoma.selectedScrollSnap(), apiYonkoma.selectedScrollSnap() + 2].map((id) => {
                    if(id === cardsRefYonkoma.current.length + 1) {
                        return 1
                    }
                    if(id > cardsRefYonkoma.current.length - 1) {
                        return 0
                    }
                    if(id < 0) {
                        return cardsRefYonkoma.current.length - 1
                    }
                    return id
                }
            )
            imageIdx.map((id) => {
                cardsRefYonkoma.current[id].children[0].classList.add('rotateY180')
            })
        })
      }, [apiYonkoma])

    return (
        <>
            <div className="h-screen w-screen perspective-1">
                <div className="absolute bg-[url('~/src/assets/image/imageBackgroundHeader.jpg')] h-screen w-screen parallax__layer__0" />
                <div className="absolute h-screen w-screen bg-gradient-to-t from-black/70 from-10% parallax__layer__3" />
                <div className="absolute h-screen w-screen bg-black/80 parallax__layer__5" />
                <div className="relative px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 parallax__layer__1">
                    <div className="w-full px-0 md:px-36 relative">
                        <div className="relative h-screen">
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
                            <Image src={imageMe} alt="PP" style={{clipPath: "inset(53% 32% 7% 54%)"}} className="absolute object-cover top-0" fill quality={10} />
                            <svg height="100%" width="100%" viewBox="0 0 100 100"  preserveAspectRatio="none" className="drop-shadow-[0_13px_13px_rgba(0,0,0,0.25)]" >
                                <path d="M37 6 L63 6 L63 86 L37 86 Z" stroke="white" strokeWidth="1" />
                                <line x1={43} x2={43} y1={2} y2={50} stroke="white" strokeWidth="0.25" />
                                <line x1={45} x2={45} y1={1} y2={50} stroke="white" strokeWidth="0.5" />
                                 <line x1={48} x2={48} y1={50} y2={98} stroke="white" strokeWidth="0.25" />
                                <line x1={50} x2={50} y1={50} y2={99} stroke="white" strokeWidth="0.5" /> 
                                <line x1={30} x2={30} y1={50} y2={78} stroke="white" strokeWidth="0.25" />
                                <line x1={31} x2={31} y1={50} y2={79} stroke="white" strokeWidth="0.5" /> 
                            </svg>
                            <Image src={imageMe} alt="PP" style={{clipPath: "inset(20% 66% 33% 24%)"}} className="absolute object-cover top-0" fill quality={10} />
                            <Image src={imageMe} alt="PP" style={{clipPath: "inset(6% 37% 14% 37%)"}} className="absolute object-cover top-0" fill quality={10} />
                        </div>
                    </div>
                    <div className="mx-auto max-w-4xl h-screen hidden md:flex items-center">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">Muhammad Amrulloh Robbani</h1>
                            <div className="mt-6 text-lg leading-8 text-gray-200 grid grid-cols-3 gap-3">
                                <div className="flex gap-3 items-center">
                                    <div>
                                        <Icons.gmail/>
                                    </div>
                                    <div className="text-base truncate">
                                        amrullohrobbani@gmail.com
                                    </div>
                                </div>
                                <div className="flex gap-3 items-center">
                                    <div>
                                        <Icons.gitHub className="w-6"/>
                                    </div>
                                    <div className="text-base truncate">
                                        amrullohrobbani
                                    </div>
                                </div>
                                <div className="flex gap-3 items-center">
                                    <div>
                                        <Icons.linkedin className="w-6"/>
                                    </div>
                                    <div className="text-base truncate">
                                        <Link href="http://www.linkedin.com/in/muhammad-amrullah-robbani" passHref={true}>
                                            Muhammad Amrulloh Robbani
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-10 flex items-center justify-center gap-x-6">
                                <a href="/CV Muhammad Amrulloh Robbani.pdf" download className="rounded-md bg-emerald-400 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Download CV</a>
                                {/* <a href="#" className="text-sm font-semibold leading-6 text-white">Learn more <span aria-hidden="true">→</span></a> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-screen h-screen bg-black bg-[url('https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota\_react//backgrounds/greyfade.jpg')] bg-[100%_auto] bg-[center_top] bg-no-repeat overflow-hidden relative">
                <div className="absolute w-full h-[40vh] bg-gradient-to-b from-black to-40%" />
                <div className="absolute bottom-0 left-0 text-white font-semibold -rotate-90 origin-top-left translate-y-12 py-12 w-full hidden md:flex gap-3 items-center whitespace-nowrap">ENGINEER AND DESIGNER <hr className="w-full border-slate-700"/></div>
                <div className="flex w-full h-full relative">
                    <div className="grid grid-cols-1 md:grid-cols-2 px-5 md:px-24">
                        <div className="flex items-center justify-center w-full h-full relative pr-0 xl:pr-24">
                            <div className="relative w-full xl:px-12">
                                <h1 className="font-bold text-lg md:text-5xl whitespace-nowrap text-black/20">
                                    Muhammad Amrulloh Robbani
                                </h1>
                                <h2 className="text-sm md:text-2xl font-bold whitespace-nowrap -mt-7 text-white">
                                    Muhammad Amrulloh Robbani
                                </h2>
                                <h4 className="text-xs md:text-xl font-semibold whitespace-nowrap text-[#34d399]">
                                    Biomedical Engineering and Full Stack Developer
                                </h4>
                                <div className="text-justify text-white text-xs md:text-lg xl:text-xl py-12">
                                    Voracious full-stack web developer who specializes in front-end aspects for 4 years and enthusiastic biomedical engineer with proven skills in ideation, creation, and leadership in 1 internship and several biomedical engineering projects. Interested in biomedical data integration and optimization in sports or eSports to enhance player performance and coaches knowledge. Led front-end team to refactor company CSR website to increase customer engagement up to 800 users and completed 4 biomedical engineering projects: non-invasive glaucoma detection, wearable ECG, teenager fitness data acquisition, and non-invasive fetal electrocardiogram.
                                </div>
                            </div>
                        </div>
                        <AspectRatio ratio={1/1} className="flex w-full h-full">
                            <Image src={imageMine} alt="PP" fill className="-mb-3" />
                        </AspectRatio>
                    </div>
                </div>
            </div>
            <div className="w-full h-[fit-content] min-h-[221px] bg-[linear-gradient(80deg,_#252728_0%,_#101415_100%)] border-t-[2px_solid_#282828] border-b-[2px_solid_#2c2e2e] [box-shadow:0px_0px_8px_#000] flex justify-center">
                <div className="w-full max-w-[1600px] px-0 py-[20px] relative flex flex-col md:flex-row items-center justify-evenly text-white text-xs md:text-base">
                    <div className="min-w-[300px] w-[30%] h-[fit-content] flex flex-col justify-center items-center">
                        <div className="grid grid-cols-2 w-full" >
                            <div className="flex items-center px-8 py-5">
                                <AspectRatio ratio={4/3} className="w-full h-full">
                                    <Image src={me} alt="PP" className="object-cover" fill />
                                </AspectRatio>
                            </div>
                            <div className="px-8 py-5">
                                <div className="font-semibold">Institut Teknologi Bandung Indonesia (2015-2019)</div>
                                <div>Bachelor of Engineering, majoring in Biomedical Engineering	(GPA: 3.14)</div>
                            </div>
                        </div>
                        <div className="text-[#969696] text-sm md:text-[18px] uppercase tracking-[2px] [text-shadow:1px_1px_2px_#000] mt-[12px]">
                            PAST EDUCATION
                        </div>
                    </div>
                    <div className="w-px h-full flex flex-row items-center after:content-[''] after:w-full after:h-4/5 after:bg-[#4f4f4f]" />
                    <div className="min-w-[300px] w-[30%] h-full flex flex-col justify-center items-center">
                        <div className="w-full h-full flex items-center" >
                            <ul className="list-image-[url('~/src/assets/image/icon_magic_resist.png')]">
                                <li className="ml-10">Developed a full-stack website for managing hospital assets and warehouse for Ministry of Health of Malaysia Project</li>
                                <li className="ml-10">Developed an electrode for wearable electrocardiogram vest and full - stack website and cloud to manage, analyze and display ECG data</li>
                            </ul>
                        </div>
                        <div className="text-[#969696] text-sm md:text-[18px] uppercase tracking-[2px] [text-shadow:1px_1px_2px_#000] mt-[12px]">
                            PAST EDUCATION PROJECT
                        </div>
                    </div>
                    <div className="w-px h-full flex flex-row items-center after:content-[''] after:w-full after:h-4/5 after:bg-[#4f4f4f]" />
                    <div className="min-w-[300px] w-[30%] h-full flex flex-col justify-center items-center">
                        <div className="w-full h-full flex items-center" >
                            <ul className="list-image-[url('~/src/assets/image/icon_magic_resist.png')]">
                                <li className="ml-10">Received Asrama Salman Scholarship 2016 and 2017</li>
                                <li className="ml-10">Received YBP PLN Scholarship</li>
                            </ul>
                        </div>
                        <div className="text-[#969696] text-sm md:text-[18px] uppercase tracking-[2px] [text-shadow:1px_1px_2px_#000] mt-[12px]">
                            PAST SCHOLARSHIP
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-screen h-screen bg-black bg-[url('https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota\_react//backgrounds/greyfade.jpg')] bg-[100%_auto] bg-[center_top] bg-no-repeat overflow-hidden relative shadow-[inset_0_35px_35px_-15px_rgba(0,0,0,0.5)]">
                <div className="absolute bottom-0 left-0 text-white font-semibold -rotate-90 origin-top-left translate-y-12 py-12 w-full hidden md:flex gap-3 items-center whitespace-nowrap">Muhammad Amrulloh Robbani <hr className="w-full border-slate-700"/></div>
                <div className="w-full text-center text-white text-3xl pt-12 pb-6">
                    EXPERIENCE DETAIL
                </div>
                <div className="w-full h-full grid grid-cols-2 ml-0 md:ml-24">
                    <div className="w-full h-[65vh] p-1">
                        <Card className="w-full h-full rounded-sm shadow-2xl border-none">
                            <CardContent className="w-full h-full relative">
                                <Image src={state.image} alt="PP" className="object-cover transition ease-in-out delay-150" fill />
                            </CardContent>
                        </Card>
                    </div>
                    <div className="w-full h-[65vh] p-1">
                        <div className="h-[fit-content] w-full ">
                            <Card className="w-full h-full rounded-sm shadow-2xl bg-gradient-to-br from-[#121212] to-neutral-700 border-none text-white">
                                <CardContent className="w-full h-full relative p-1 md:p-5">
                                <div className="flex gap-5 w-full" >
                                    <div className="w-24 hidden md:flex">
                                        <AspectRatio ratio={1/1} className="w-24 h-24">
                                            <Image src={state.logo} alt="PP" className="object-cover" fill />
                                        </AspectRatio>
                                    </div>
                                    <div className="ml-1 md:ml-8 pr-0md:pr-24 w-full">
                                        <div className="font-semibold text-sm md:text-xl">{state.name}</div>
                                        <div className="text-xs md:text-lg">{state.description}</div>
                                        <div className="font-semibold text-xs md:text-base">{state.position}</div>
                                        <div className="mt-5">
                                            <ul className="list-disc text-xs md:text-base">
                                                {
                                                    state?.job?.map((item, index) => {
                                                        return(
                                                            <li key={index}>{item}</li>
                                                        )
                                                    })
                                                }
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                </CardContent>
                                <div className="w-full bg-black px-5 py-4">
                                    <div className="text-xs md:text-lg text-[#737373] uppercase tracking-[1px] flex flex-row w-full mb-[4px] whitespace-nowrap">
                                        Place :
                                        <div className="ml-[4px] text-[#fff] font-semibold tracking-[0px] normal-case whitespace-normal">
                                            {state.place}
                                        </div>
                                    </div>
                                    <div className="text-xs md:text-lg text-[#737373] uppercase tracking-[1px] flex flex-row w-full mb-[4px] whitespace-nowrap">
                                        Time :
                                        <div className="ml-[4px] text-[#fff] font-semibold tracking-[0px] normal-case whitespace-normal">
                                            {state.time}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                    <div className="w-full h-full flex -mt-32 md:-mt-48">
                        {
                            experienceList.map((item) => {
                                return (
                                    <div className={`w-24 m-0.5 md:m-2 hover:scale-110 ${state.id === item.id?'':'grayscale'}`} onClick={() => setState(item)} key={item.id} >
                                        <AspectRatio ratio={1/1} className="w-full h-full bg-white">
                                            <Image src={item.logo} alt={item.id} className="object-cover" fill />
                                        </AspectRatio>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
            <div className="w-full h-[fit-content] min-h-[221px] bg-[linear-gradient(80deg,_#252728_0%,_#101415_100%)] border-t-[2px_solid_#282828] border-b-[2px_solid_#2c2e2e] [box-shadow:0px_0px_8px_#000]">
                <div className="w-full text-center text-white text-3xl py-6">
                    Additional Information
                </div>
                <div className="w-full px-12 py-[20px] relative flex flex-col md:flex-row items-center justify-evenly text-white text-xs md:text-base">
                    <div className="min-w-[300px] w-[30%] h-full flex flex-col justify-center items-center">
                        <div className="w-full h-full flex items-center" >
                            <ul className="list-image-[url('~/src/assets/image/icon_magic_resist.png')]">
                                <li className="ml-10">Passed level C1 of CEFR by getting 7.5 overall band score on IELTS </li>
                            </ul>
                        </div>
                        <div className="text-[#969696] text-sm md:text-[18px] uppercase tracking-[2px] [text-shadow:1px_1px_2px_#000] mt-[12px]">
                            Certification
                        </div>
                    </div>
                    <div className="w-px h-full flex flex-row items-center after:content-[''] after:w-full after:h-4/5 after:bg-[#4f4f4f]" />
                    <div className="min-w-[300px] w-[30%] h-full flex flex-col justify-center items-center">
                        <div className="w-full h-full flex items-center" >
                            <ul className="list-image-[url('~/src/assets/image/icon_vision.png')]">
                                <li className="ml-10">Web Development: HTML, CSS, JS, ReactJS, VueJS, NuxtJS, NextJS, PostgreSQL, Nginx</li>
                                <li className="ml-10">Data Processing: Python, TensorFlow</li>
                                <li className="ml-10">Design: Adobe Photoshop, Krita, Manga Studio</li>
                                <li className="ml-10">Language: English</li>
                            </ul>
                        </div>
                        <div className="text-[#969696] text-sm md:text-[18px] uppercase tracking-[2px] [text-shadow:1px_1px_2px_#000] mt-[12px]">
                            Skills
                        </div>
                    </div>
                    <div className="w-px h-full flex flex-row items-center after:content-[''] after:w-full after:h-4/5 after:bg-[#4f4f4f]" />
                    <div className="min-w-[300px] w-[30%] h-full flex flex-col justify-center items-center">
                        <div className="w-full h-full flex items-center" >
                            <ul className="list-image-[url('~/src/assets/image/icon_magic_resist.png')]">
                                <li className="ml-10">Biomedical Engineering</li>
                                <li className="ml-10">Biomechanics</li>
                                <li className="ml-10">Web Development</li>
                                <li className="ml-10">Data Analysis in Sport and E-Sport</li>
                            </ul>
                        </div>
                        <div className="text-[#969696] text-sm md:text-[18px] uppercase tracking-[2px] [text-shadow:1px_1px_2px_#000] mt-[12px]">
                            Interest
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-screen h-screen bg-black bg-[url('https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota\_react//backgrounds/greyfade.jpg')] bg-[100%_auto] bg-[center_top] bg-no-repeat overflow-hidden relative shadow-[inset_0_35px_35px_-15px_rgba(0,0,0,0.5)]">
                <div className="w-full text-center text-white text-3xl top-1 xl:top-12 absolute">
                    ARTWORKS
                </div>
                <div className="w-full h-full flex justify-center relative items-center" ref={ref}>
                    <Carousel
                        opts={{
                            align: "start",
                            loop: true
                        }}
                        className="w-full max-w-6xl"
                        setApi={setApi}
                        plugins={[
                            Autoplay({
                              delay: 2000,
                            }),
                          ]}
                        >
                        <CarouselContent>
                            {imageList.map((_, index) => (
                            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                                <div className="p-1">
                                <CardTemplate ref={el => cardsRef.current[index] = el}>
                                    <CardContent className="grid gap-4 h-full text-center">
                                        <Image src={_.default} fill className={_.default.height > _.default.width?'object-cover':'object-contain'} alt="PP" quality={50}/>
                                    </CardContent>
                                </CardTemplate>
                                </div>
                            </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </div>    
            </div>
            <div className="w-screen h-screen bg-black bg-[url('https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota\_react//backgrounds/greyfade.jpg')] bg-[100%_auto] bg-[center_top] bg-no-repeat overflow-hidden relative shadow-[inset_0_35px_35px_-15px_rgba(0,0,0,0.5)]">
                <div className="w-full text-center text-white text-3xl top-1 xl:top-12 absolute">
                    YONKOMA
                </div>
                <div className="w-full h-full flex justify-center relative items-center" ref={refYonkoma}>
                    <Carousel
                        opts={{
                            align: "start",
                            loop: true
                        }}
                        className="w-full max-w-6xl"
                        setApi={setApiYonkoma}
                        >
                        <CarouselContent>
                            {imageYonkomaList.map((_, index) => (
                            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                                <div className="p-1">
                                <CardTemplate ref={el => cardsRefYonkoma.current[index] = el}>
                                    <CardContent className="grid gap-4 h-full text-center">
                                        <Image src={_.default} fill className={_.default.height > _.default.width?'object-cover':'object-contain'} alt="PP" quality={50}/>
                                    </CardContent>
                                </CardTemplate>
                                </div>
                            </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </div>    
            </div>
            <div className="w-full h-[fit-content] min-h-[221px] bg-[linear-gradient(80deg,_#252728_0%,_#101415_100%)] border-t-[2px_solid_#282828] border-b-[2px_solid_#2c2e2e] [box-shadow:0px_0px_8px_#000] flex flex-wrap justify-center">
                <div className="w-full text-center text-white text-3xl py-6">
                    Feel Free to Contact Me
                </div>
                <div className="w-full max-w-[1600px] px-0 py-[20px] relative flex flex-col md:flex-row items-center justify-evenly text-white text-xs md:text-base">
                    <div className="min-w-[300px] w-[30%] h-[fit-content] flex flex-col justify-center items-center">
                        <div className="w-full h-full flex items-center justify-center" >
                            <div className="flex gap-3 items-center">
                                <div>
                                    <Icons.gmail/>
                                </div>
                                <div className="text-base">
                                    amrullohrobbani@gmail.com
                                </div>
                            </div>
                        </div>
                        <div className="text-[#969696] text-sm md:text-[18px] uppercase tracking-[2px] [text-shadow:1px_1px_2px_#000] mt-[12px]">
                            Email
                        </div>
                    </div>
                    <div className="w-px h-full flex flex-row items-center after:content-[''] after:w-full after:h-4/5 after:bg-[#4f4f4f]" />
                    <div className="min-w-[300px] w-[30%] h-full flex flex-col justify-center items-center">
                        <div className="w-full h-full flex items-center justify-center" >
                            <div className="flex gap-3 items-center">
                                <div>
                                    <DiscordLogoIcon/>
                                </div>
                                <div className="text-base">
                                    amrullohrobbani
                                </div>
                            </div>
                        </div>
                        <div className="text-[#969696] text-sm md:text-[18px] uppercase tracking-[2px] [text-shadow:1px_1px_2px_#000] mt-[12px]">
                            DISCORD
                        </div>
                    </div>
                    <div className="w-px h-full flex flex-row items-center after:content-[''] after:w-full after:h-4/5 after:bg-[#4f4f4f]" />
                    <div className="min-w-[300px] w-[30%] h-full flex flex-col justify-center items-center">
                        <div className="w-full h-full flex items-center justify-center" >
                            <div className="flex gap-3 items-center">
                                <div>
                                    <InstagramLogoIcon/>
                                </div>
                                <div className="text-base">
                                    amrullohrobbani
                                </div>
                            </div>
                        </div>
                        <div className="text-[#969696] text-sm md:text-[18px] uppercase tracking-[2px] [text-shadow:1px_1px_2px_#000] mt-[12px]">
                            INSTAGRAM
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}