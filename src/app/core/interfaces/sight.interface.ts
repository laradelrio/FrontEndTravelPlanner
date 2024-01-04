export interface NewSight{
    name: string;
    fk_trips_id: number;
    longitude: number;
    latitude: number;
    startDate: string;
    endDate: string;
    photo: string;    
}

export interface Sight{
    id: number,
    name: string;
    fk_trips_id: number;
    longitude: number;
    latitude: number;
    startDate: string;
    endDate: string;
    photo: string;  
    createdAt: string;
    updatedAt: string;
}