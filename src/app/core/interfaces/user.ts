import { Fine } from './fine';

export interface User {
    uuid: string;
    username?: string;
    email?: string;
    fines?: Fine[];
}
