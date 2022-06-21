import { Fine } from './fine';

export interface Victim {
    id: number;
    username: string;
    email: string;
    fines: Fine[];
}
