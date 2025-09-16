import { Dayjs } from "dayjs"

export interface IClickTime {
    date: Dayjs
}

export interface ILink {
    id: string 
    url: string
    clicks: number
    click_records?: IClickTime[]
}

export interface IResponse {
    Message?: string
}

export interface IHourData {
    Hour: number
    Click: number
}