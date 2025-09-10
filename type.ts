export interface IClickTime {
    date: Date
}

export interface ILink {
    Id: string 
    Url: string
    Clicks: number
    ClickRecord?: IClickTime[]
}

export interface IResponse {
    Message?: string
}