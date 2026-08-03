export interface Category {
    id: number;
    category_name: string;
}

export interface CategoriesIndexProps {
    categories: {
        data: Category[];
        current_page: number;
        last_page: number;
    };
}
