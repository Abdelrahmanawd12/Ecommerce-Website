import { SubCategories } from "./sub-categories";

export interface Categories {
    id: number;
    name: string;
    subcategory: SubCategories[];
}
