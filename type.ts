export interface IClickTime {
    date: Date
}

export default interface ILink {
    Id: string 
    Url: string
    Clicks: number
    ClickRecord: IClickTime[]
}