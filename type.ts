export interface IClickTime {
    date: Date
}

export default interface ILink {
    id: string 
    url: string
    clicks: number
    clickRecord: IClickTime[]
}