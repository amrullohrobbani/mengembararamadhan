import Image from "next/image"
import { cn } from '@/lib/utils'

import AncientIcon from '@/assets/image/AncientIcon.svg'
import ArchonIcon from '@/assets/image/ArchonIcon.svg'
import CrusaderIcon from '@/assets/image/CrusaderIcon.svg'
import DivineIcon from '@/assets/image/DivineIcon.svg'
import GuardianIcon from '@/assets/image/GuardianIcon.svg'
import HeraldIcon from '@/assets/image/HeraldIcon.svg'
import ImmortalIcon from '@/assets/image/ImmortalIcon.svg'
import LegendIcon from '@/assets/image/LegendIcon.svg'

export default function RankIcon({ rank }) {
    return (
        <>
            {
                rank === "Ancient" && <Image
                    priority
                    src={AncientIcon}
                    alt="medal"
                    fill
              />
            }
            {
                rank === "Archon" && <Image
                    priority
                    src={ArchonIcon}
                    alt="medal"
                    fill
              />
            }
            {
                rank === "Crusader" && <Image
                    priority
                    src={CrusaderIcon}
                    alt="medal"
                    fill
              />
            }
            {
                rank === "Divine" && <Image
                    priority
                    src={DivineIcon}
                    alt="medal"
                    fill
              />
            }
            {
                rank === "Guardian" && <Image
                    priority
                    src={GuardianIcon}
                    alt="medal"
                    fill
              />
            }
            {
                rank === "Herald" && <Image
                    priority
                    src={HeraldIcon}
                    alt="medal"
                    fill
              />
            }
            {
                rank === "Immortal" && <Image
                    priority
                    src={ImmortalIcon}
                    alt="medal"
                    fill
              />
            }
            {
                rank === "Legend" && <Image
                    priority
                    src={LegendIcon}
                    alt="medal"
                    fill
              />
            }
        </>
    )
}