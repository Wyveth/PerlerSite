import { Role } from "./Role.Model";

export class User {
    constructor(
        public id: number,
        public surname: string,
        public name: string,
        public email: string,
        public role: Role,
        public statut:boolean,
    ){}
}