export interface Trip{
    id: number;
    name: string;
    fk_users_id: number;
    destination: string;
    startDate: Date;
    endDate: Date;
    photo: string;
    createdAt: Date;
    updatedAt: Date;
}