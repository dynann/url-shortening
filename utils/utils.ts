import { IClickTime } from "@/type";
import dayjs from "dayjs";

export function countClicks(clickRecords?: IClickTime[]): number{
    let counts = 0
    const now = dayjs()
    console.log(clickRecords)
    if(!clickRecords) {
        return 0
    }

    const yesterday = now.day() - 1
    clickRecords?.forEach((rec) => {
        console.log(now, rec.date.day)
        const date = dayjs(rec.date)
        if(date.isAfter(yesterday)) {
            counts += 1
        }
    })
    return counts
}