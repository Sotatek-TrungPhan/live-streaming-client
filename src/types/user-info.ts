export type UserInfo = {
    readonly memberId: string
    firstName?: string
    lastName?: string
    email?: string
    avatar?: string
    telephone?: string
    address?: string
    isRegistered?: boolean
    readonly userId?: string
    readonly displayName?:string;
}

export type UserInfoPayload = {
    firstName: string;
    lastName:string;
    email: string;
    telephone: string;
    address: string;
}