export interface Athlete {
    position: number;
    name: string;
    team: string;
    time: string; //mm:ss
    schoolYear: YearType;
}
  
export type YearType = 
    | "Freshman"
    | "Sophomore"
    | "Junior"
    | "Senior"
    | "Graduate";