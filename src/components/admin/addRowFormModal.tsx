'use client'
import { PostEntity, TableHeader, Role, PostUserDTO } from "@/types/Entities"
import { useState, Suspense, SetStateAction, HTMLInputTypeAttribute, useEffect, Dispatch } from "react"
import "@/styles/admin/login.css"
import { NotificationContextType, useNotify } from "@/components/notificationProvider";

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

export function resetRolesResource() {
    rolesResource = null;
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
            <option key={r.id} value={r.name}
            className="bg-neutral-300 hover:text-white text-neutral-800"
            >{r.name}</option>
        ))}
    </>)
}

interface ICustomInput {
    state : string,
    setState : (value: SetStateAction<string>) => void,
    name : string,
    type : HTMLInputTypeAttribute,
    placeholder: string,
    focus?: boolean
}

function CustomInput({state, setState, name, type, placeholder, focus}:ICustomInput) {
    return (
        <input autoFocus={focus} name={name} type={type} autoComplete="off" placeholder={placeholder}
        value={state}
        onKeyDownCapture={(evt) => 
            {if (type === "email" && evt.key === ",") 
                { evt.stopPropagation(); evt.preventDefault(); }
            else if (type === "number" && (evt.key === "." || evt.key === "," || evt.key === "-")) 
                { evt.stopPropagation(); evt.preventDefault(); }
            }
        } 
        onChange={(evt) => {
            type == "email" ? 
            setState(evt.target.value.toLowerCase()) : setState(evt.target.value)
    
        }} min="1" step="1"
        className="p-2 outline-0 border-b-neutral-500 focus:border-b-neutral-200 border-b-2 w-full h-full text-white"
        />
    )
}


interface IEntityFormProps {
    setEntity: Dispatch<SetStateAction<PostEntity | null>>,
}

function UserForm({setEntity}:IEntityFormProps) {
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");

    useEffect(() => {
        setEntity({fullname:fullname, email:email, username:username, password:password, role:role})
    }, [fullname,email,username,password,role])

    return (<>
        <CustomInput focus={true} name="fullname" type="text" placeholder="Full name..."
        state={fullname} setState={setFullname} />
        <CustomInput name="email" type="email" placeholder="Email...."
        state={email} setState={setEmail} />
        <CustomInput name="username" type="text" placeholder="Username..."
        state={username} setState={setUsername} />
        <CustomInput name="password" type="password" placeholder="Password..."
        state={password} setState={setPassword} />
        
        <Suspense
        fallback={
            <select className="flex-center w-full border-2 border-neutral-500 focus:border-neutral-200 p-2 capitalize outline-none"><option value="">Loading...</option></select>
        } >
            <select title="Role selection menu" name="role" value={role} onChange={(evt) => setRole(evt.target.value)}
            className="flex-center w-full border-2 border-neutral-500 focus:border-neutral-200 p-2 capitalize outline-none" >

                <option disabled value="" className="hover:bg-neutral-300 active:bg-neutral-300 bg-neutral-300 hover:text-white text-neutral-800 normal-case cursor-not-allowed ">
                    Select role...
                </option>

                <RoleSelectorOptions/>
            </select>
        </Suspense>

    </>)
}

function RoleForm({setEntity}:IEntityFormProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [level, setLevel] = useState("");

    useEffect(() => {
        setEntity({name:name, description:description, level:level})
    }, [name, description, level])

    return(<>
        <CustomInput focus={true} name="name" type="text" placeholder="Role name..."
        state={name} setState={setName}/>
        <CustomInput name="description" type="text" placeholder="Description..."
        state={description} setState={setDescription}/>
        <CustomInput name="level" type="number" placeholder="Access level..."
        state={level} setState={setLevel} />
    </>)
}

interface IAddRowFormModal {
    cancelFunction : () => Promise<void>,
    continueFunction : (entity : PostEntity | null) => Promise<void>,
    tableHeader : TableHeader,
}

function isEntityValid(entity : PostEntity | null, notify : NotificationContextType) : boolean {
    let invalidFields = 0;

    if (entity == null) return false;
    const castedEntity = entity as any;
    for (const key in castedEntity) {
        if ((!castedEntity || castedEntity[`${key}`].trim() == "" ) && key != "description") {
            invalidFields += 1;
            notify(`WARNING [${key}]`,"This field cannot be empty.","WARNING")
        }
    }

    return invalidFields === 0;
}

export default function AddRowFormModal({tableHeader, continueFunction, cancelFunction} : IAddRowFormModal) {
    const [entity, setEntity] = useState<PostEntity | null>(null)
    const notify = useNotify();
    let form;

    switch (tableHeader) {
        case "users":
            form = <UserForm setEntity={setEntity} />
            break;
        case "roles":
            form = <RoleForm  setEntity={setEntity}/>
            break;
    }

    return(
    <div className="flex-center top-0 left-0 w-full h-full z-500 absolute flex-1 bg-black/50">
        <form className="flex flex-col justify-between items-center p-5 gap-8 bg-black border-neutral-300 border-2">
            {form}
             <div className="flex flex-row justify-between w-full gap-30">
                    <button type="button" className="flex-center bg-red-900 hover:bg-red-950 transition-colors text-white px-5 py-3 outline-2 outline-pink-950 cursor-pointer" 
                    onClick={async () => cancelFunction()}>CANCEL</button>
                    <button type="button" className="flex-center bg-green-800 hover:bg-green-950 outline-2 outline-lime-950 transition-colors text-white px-5 py-3 cursor-pointer"
                    onClick={async (evt) => {
                        evt.preventDefault();
                        if (!isEntityValid(entity, notify)) return;
                        continueFunction(entity);
                    }}>CREATE</button>
                </div>
        </form>
    </div>
)}