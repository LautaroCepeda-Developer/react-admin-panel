export type TableHeader = "users" | "roles";

export type Overlay = "update" | "delete";
export type Entity = User | Role;
export type User = {
    id: number,
    fullname: string,
    email: string,
    username: string,
    password: string,
    role_name: string,
    role_id: number,
    role_level: number,
    created_at: string,
    updated_at: string,
};

export type PostEntity = PostUserDTO | PostRoleDTO;

export type PostUserDTO = {
    fullname: string,
    email: string,
    username: string,
    password: string,
    role: string,
}

export type PostRoleDTO = {
    name: string,
    description: string,
}

export type Role = {
    id: number,
    name: string,
    description: string | null,
};

export type UserApiResponse = {
    parsedPage: number,
    parsedLimit: number,
    total: number,
    totalPages: number,
    usersFiltered: User[],
};

export type BackendError = {
    path: string[]
    message: string
}