import { UserData } from "./user.interface";

export interface UserApiResp{
    success:  boolean,
    message: string,
    data?: any,
}

export interface GetUserApiResp{
    success:  boolean,
    message: string,
    data?: UserData,
}

export interface ApiResp{
    success:  boolean,
    message: string,
    data?: any,
}