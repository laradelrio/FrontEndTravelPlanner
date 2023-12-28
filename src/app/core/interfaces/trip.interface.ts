export interface Trip{
    id: number;
    name: string;
    fk_users_id: number;
    destination: string;
    startDate: string;
    endDate: string;
    photo: URL;
    createdAt: Date;
    updatedAt: Date;
}

export interface NewTrip{
    name: string;
    user: number;
    destination: string;
    startDate: Date;
    endDate: Date;
    photo: string;
}