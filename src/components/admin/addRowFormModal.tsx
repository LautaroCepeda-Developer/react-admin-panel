'use client'
import { PostEntity, TableHeader, Role } from "@/types/Entities"
import { useEffect, useState, Suspense, use } from "react"


interface IAddRowFormModal {
    cancelFunction : () => Promise<void>,
    continueFunction : (entity : any) => Promise<void>,
    tableHeader : TableHeader
}

const getEndpoint = (tableHeader : TableHeader) => 
    `${process.env.NEXT_PUBLIC_API_URL}/people/${tableHeader}/`

function UserForm(roleList : any) {
    let endpoint = getEndpoint("roles");
    
    async function getRoles(){
        try {
            const response = await fetch(endpoint, {
                method: "GET",
                headers: {"Content-Type" : "application/json"},
                credentials: "include",
            });

            if (!response.ok) throw new Error();  

            const roles : Role[] = await response.json();

            roles.shift();

            setRoles(roles);
        } catch (err) {
            console.error("An error ocurred loading the roles.");
            return {};
        }
    }

    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await fetch(endpoint, {
                method: "GET",
                headers: {"Content-Type" : "application/json"},
                credentials: "include",
                }); 

                if (!response.ok) throw new Error("Fetch Error.");

                const rolesData : Role[] = await response.json();
                rolesData.shift();

                setRoles(rolesData);

            } catch (error) {
                console.error(`An error ocurred loading the roles: ${error}`)
            } finally {
                setLoading(false);
            } 
        };
        fetchRoles();
    },[]);

    return (<>
        <input type="text" value={fullname} placeholder="Full name..." onChange={(evt) => setFullname(evt.target.value)}/>
        <input type="email" value={email} placeholder="Email..." onChange={(evt) => setEmail(evt.target.value)}/>
        <input type="text" value={username} placeholder="Username..." onChange={(evt) => setUsername(evt.target.value)}/>
        <input type="password" value={password} placeholder="Password..." onChange={(evt) => setPassword(evt.target.value)}/>
        
        <select name="role" disabled={loading}>
            {loading ? (<option value="">Loading...</option>) : (
                roles.map((role:Role) => (<option key={role.id} value={role.name}>{role.name}</option>))
            )}
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
        <div className="flex flex-col justify-between items-center p-5 gap-5 bg-gray-300">
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