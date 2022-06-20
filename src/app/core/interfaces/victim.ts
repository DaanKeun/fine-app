import { Fine } from './fine';

export interface Victim {
    id: number;
    name: string;
    surname: string;
    fines: Fine[];
}
