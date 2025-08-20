export type TableHeader = "users" | "roles";

export type User = {
    id: number;
    fullname: string;
    email: string;
    username: string;
    password: string;
    role_id: number;
    created_at: string;
    updated_at: string;
};

export type Role = {
    id: number,
    name: string,
    description: string | null
};

export type UserApiResponse = {
    parsedPage: number;
    parsedLimit: number;
    total: number;
    totalPages: number;
    usersFiltered: User[];
};