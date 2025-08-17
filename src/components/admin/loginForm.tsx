import UserIcon from "@/media/userIcon";
import InputField from "./loginInput";
import LockIcon from "@/media/lockIcon";
import { FormEvent, ReactElement, useState } from "react";
import { Tooltip } from 'react-tooltip'

const apiUrl :string = process.env.NEXT_PUBLIC_API_URL!; 

async function parseFields(form : FormData) {
    for (const key of form.keys()) {
        // Saving the value
        let temp = form.get(key)!; 

        // Removing the start/end whitespaces
        temp = temp.toString().trim();

        // Updating the value
        form.set(key, temp);
    }
}


async function HandleLogin(e:FormEvent) : Promise<void> {
    e.preventDefault();

    const form : HTMLFormElement = document.getElementById("LOGIN-FORM")! as HTMLFormElement;
        
    const formData = new FormData(form);

    await parseFields(formData);


    const res = await fetch(`${apiUrl}/auth/login`, {
        method:'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username: formData.get('username'),password: formData.get('password')}),
        credentials: 'include'
    })
    
    if (!res.ok) {
        const data = await res.json();
    }

    // Redirect to dashboard on login
    window.location.href = "/admin/dashboard";
}


export default function LoginForm() {
    const [error, setError] = useState(false);
    const [errorInfo, setErrorInfo] = useState("");


    const color : string = "#FFF"

    // Icons of the field inputs
    const userIcon : ReactElement = <UserIcon iconId="LOGIN-FORM-EMAIL-ICON" iconColor={color} iconWidth="25" iconHeight="35" />

    const lockIcon : ReactElement = <LockIcon iconId="LOGIN-FORM-PASSWORD-ICON" iconColor={color} iconWidth="25" iconHeight="35"/>


    return(
        <form id="LOGIN-FORM" method="POST" onSubmit={HandleLogin} autoComplete="on" className="flex flex-col w-full md:w-1/2 box-border gap-8 px-5">
            <InputField fieldId="LOGIN-FORM-USERNAME" fieldName="username" fieldPlaceholder="Username..." hideChars={false} autoComplete="username" fieldIcon={userIcon}/>

            <div>
                <InputField fieldId="LOGIN-FORM-PASSWORD" fieldName="password" fieldPlaceholder="Password..." hideChars={true} autoComplete="current-password" fieldIcon={lockIcon}/>
                <div className="flex w-full justify-end items-center">
                    <p data-tooltip-id="forgot-password-tooltip" data-tooltip-content="Not implemented"  className="flex w-fit text-end text-sm cursor-pointer text-[#D0D0D0]">Forgot password?</p>
                    <Tooltip id="forgot-password-tooltip"/>
                </div>
            </div>

            <input id="LOGIN-FORM-SUBMIT" className="flex-center w-full py-2.5 border-2 cursor-pointer font-bold hover:border-stone-300 hover:text-black hover:bg-stone-200 transition-colors ease-in-out" type="submit" value="LOGIN"/>

            <div className="flex w-full h-full flex-1 py-15 justify-center items-center">
                <p data-tooltip-id="dont-have-an-accout-tooltip" data-tooltip-content="Only administrators can create accounts." className="flex w-fit cursor-pointer text-[#D0D0D0]">¿Don't have an account?</p>
                <Tooltip id="dont-have-an-accout-tooltip"/>
            </div>
        </form>
    )
}