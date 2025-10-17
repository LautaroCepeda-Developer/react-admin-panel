'use client'
import { PostEntity, TableHeader, Role } from "@/types/Entities"
import { useState, Suspense } from "react"


interface IAddRowFormModal {
    cancelFunction : () => Promise<void>,
    continueFunction : (entity : any) => Promise<void>,
    tableHeader : TableHeader
}

const getEndpoint = (tableHeader : TableHeader) => 
    `${process.env.NEXT_PUBLIC_API_URL}/people/${tableHeader}/`


type RolesResource = {read: () => Role[];};
let rolesResource : RolesResource | null = null;

function createRolesResource() : RolesResource {
    let promise = fetchRoles();

    return {
        read: () => {
            throw promise.then((roles) => (rolesResource = {read: () => roles}));
        },
    };
}

    
async function fetchRoles(): Promise<Role[]> {
    let endpoint = getEndpoint("roles");
    return fetch(endpoint,{
        method: "GET",
        headers: {"Content-Type" : "application/json"},
        credentials: "include",})
        .then((res) => {
            if (!res.ok) throw new Error();
            return res.json();
        })
        .then((roles: Role[]) => {
            roles.shift();
            return roles;
        });
}

function RoleSelectorOptions() {
    if (!rolesResource) rolesResource = createRolesResource();

    const roles = rolesResource.read();

    return (<>
        {roles.map((r) => (
            <option key={r.id} value={r.name}>{r.name}</option>
        ))}
    </>)
}


function UserForm(roleList : any) {
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");

    return (<>
        <input name="fullname" type="text" value={fullname} placeholder="Full name..." onChange={(evt) => setFullname(evt.target.value)} autoComplete="off"/>
        <input name="email" type="email" value={email} placeholder="Email..." onChange={(evt) => setEmail(evt.target.value)} autoComplete="off"/>
        <input name="username" type="text" value={username} placeholder="Username..." onChange={(evt) => setUsername(evt.target.value)} autoComplete="off"/>
        <input name="password" type="password" value={password} placeholder="Password..." onChange={(evt) => setPassword(evt.target.value)} autoComplete="off"/>
        
        <select name="role" defaultValue="" value={role} onChange={(evt) => setRole(evt.target.value)}>
            <Suspense fallback={<option value="">Loading...</option>}>
                <RoleSelectorOptions/>
            </Suspense>
        </select>
    </>)
}

function RoleForm() {
    return(<>
    </>)
}

export default function AddRowFormModal({tableHeader, continueFunction, cancelFunction} : IAddRowFormModal) {

    const [entity, setEntity] = useState<PostEntity | null>(null)

    let form;

    switch (tableHeader) {
        case "users":
            form = <UserForm />
            break;
        case "roles":
            form = <RoleForm />
            break;
    }

    return(
    <div className="flex-center top-0 left-0 w-full h-full z-500 absolute flex-1 bg-black/50">
        <div className="flex flex-col justify-between items-center p-5 gap-5 bg-black border-white border-2">
            {form}
             <div className="flex flex-row justify-between w-full">
                    <button className="flex-center bg-red-900 hover:bg-red-950 transition-colors text-white px-5 py-3 outline-2 outline-pink-950 cursor-pointer" 
                    onClick={async () => cancelFunction()}>CANCEL</button>
                    <button className="flex-center bg-green-800 hover:bg-green-950 outline-2 outline-lime-950 transition-colors text-white px-5 py-3 cursor-pointer"
                    onClick={async () => continueFunction(entity)}>CREATE</button>
                </div>
        </div>
    </div>
)}