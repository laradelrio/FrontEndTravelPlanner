import { Injectable } from '@angular/core';
@Injectable()
export class Constants {
    public static DB_API_ENDPOINT: string = 'http://localhost:8080/api';
    public static IBB_API_URL: string = 'https://api.imgbb.com/1/upload'
    public static TitleOfSite: string = "TravelApp";

    constructor() {}
}