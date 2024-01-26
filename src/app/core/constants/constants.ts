import { Injectable } from '@angular/core';
@Injectable()
export class Constants {
    public static DB_API_ENDPOINT: string = 'https://travel-mates-sj73.onrender.com/api';
    public static IBB_API_URL: string = 'https://api.imgbb.com/1/upload';
    public static COUNTRIES_CITIES_API: string = 'https://countriesnow.space/api/v0.1/countries/cities';
    public static UNSPLASH_API: string = 'https://api.unsplash.com/search/photos?page=1&query='
    public static TitleOfSite: string = "TravelMates";

    constructor() {}
}