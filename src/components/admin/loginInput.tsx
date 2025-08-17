import {ReactElement, useEffect } from "react";
import '@/styles/admin/login.css'


interface InputFieldProps {
    fieldId: string,
    fieldName: string,
    fieldPlaceholder : string,
    fieldIcon: ReactElement,
    hideChars: boolean,
    autoComplete: string,
    containerClassName?: string,
    fieldClassName?: string
}

export default function InputField({fieldId,fieldName,fieldPlaceholder, hideChars, fieldIcon, autoComplete: autoComplete, containerClassName, fieldClassName}:InputFieldProps) {

    useEffect(() => {
        const element : HTMLElement = document.getElementById(fieldId)!;
        const parent : HTMLElement = element.parentElement!;

        element.addEventListener("focus", () => {
            parent.classList.add("field-container-focus");
        })
        element.addEventListener("focusout", () => {
            parent.classList.remove("field-container-focus");
        })
    })

    const fieldContainerClassNames = "login-input-container flex flex-row gap-2 p-2 box-border";
    const commonFieldContainerClassNames = fieldContainerClassNames + (containerClassName || "")

    const fieldInputClassNames = "login-input-field w-full px-2 box-border"
    const commonFieldClassNames = fieldInputClassNames + (fieldClassName || "")

    return (<>
    {hideChars ? 
    (<div className={commonFieldContainerClassNames}>
        {fieldIcon}
        <input className={commonFieldClassNames} required placeholder={fieldPlaceholder} type="password" id={fieldId} name={fieldName} autoComplete={autoComplete}/>
    </div>)

    :

    (<div className={commonFieldContainerClassNames}>
        {fieldIcon}
        <input className={commonFieldClassNames} required placeholder={fieldPlaceholder} type="text" id={fieldId} name={fieldName} autoComplete={autoComplete}/>
    </div>)}
    </>)
    

}