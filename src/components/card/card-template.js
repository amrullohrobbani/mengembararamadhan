import { cn } from "@/lib/utils"
import {
  Card
} from "@/components/ui/card"
import styles from './card-template.module.css'
import { forwardRef } from "react"

const CardTemplate = forwardRef(
  function CardTemplate({ className, ...props }, ref) {
    return (
      <>
          <div className={cn("w-[23.75rem] h-[33.25rem]", styles['flip-card'], className)} ref={ref}>
              <div className={styles['flip-card-inner']}>
                  <div className={styles['flip-card-front']}>
                  </div>
                  <div className={styles['flip-card-back']}>
                    <Card className={cn("w-[23.75rem] min-h-[33.25rem]", className)}>
                      { props.children }
                    </Card>
                  </div>
              </div>
          </div>
      </>
    )
  }
)

export default CardTemplate