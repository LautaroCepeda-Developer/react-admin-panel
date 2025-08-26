import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ISetCloudSavingState } from "@/Interfaces/StatesInterfaces";
import { User } from "@/types/Entities";
import { Row } from "@tanstack/react-table";

type SaveState = "SAVING" | "SAVED" | "ERROR";

const changeSaveState = (state : SaveState, {setCloudSavingState} : ISetCloudSavingState) => {
    setCloudSavingState(state);
}

type TableHeader = "users" | "roles";

const getEndpoint = (tableHeader : TableHeader) => 
    `${process.env.NEXT_PUBLIC_API_URL}/people/${tableHeader}/`


interface IEditableCellProps {
    row: any,
    field:string,
    tableHeader: TableHeader,
    setCloudSavingState : Dispatch<SetStateAction<SaveState>>,
    customClassName?:string
}

function getCurrentFormatedDate() : string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function UpdateUpdatedAtValue(row : Row<User>) : void {
    row.original["updated_at"] = getCurrentFormatedDate();

    const dateOptions : Intl.DateTimeFormatOptions = {
        year:"numeric", day:"2-digit","month":"2-digit"
    }

    document.querySelector(`td[data-row-id="${CSS.escape(row.id)}"][data-header-id="updated_at"]`)!.firstElementChild!.innerHTML = `${new Date(row.original["updated_at"]).toLocaleDateString('es-ar',dateOptions)}`

}

export default function EditableCell({row, field, tableHeader, setCloudSavingState, customClassName}:IEditableCellProps) {
    const [startValue, setStartValue] : [string, Dispatch<SetStateAction<string>>] = useState(row.original[field]);
    const [value, setValue] : [string, Dispatch<SetStateAction<string>>] = useState(row.original[field]);

    const [start_updated_at_value, setStart_updated_at_value] : [string, Dispatch<SetStateAction<string>>] = useState(row.original["updated_at"])

    const [editing, setEditing] = useState(false);

    let endpoint = getEndpoint(tableHeader);

    const saveChange = async () => {
        setValue(value.trim());
        setEditing(false);

        // Prevent fetching
        if (value.trim() === startValue) return;

        try {

            changeSaveState("SAVING", {setCloudSavingState});

            const response = await fetch(`${endpoint}${row.original.id}`, {
                method: "PATCH",
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify({[field]: value.trim()}),
                credentials: "include"
            });

            if (!response.ok) {
                throw new Error();
            }

            changeSaveState("SAVED", {setCloudSavingState});
            
            // Visual update of the 'updated at' field (if exists)
            if (row.original["updated_at"]) {
                UpdateUpdatedAtValue(row);
                setStart_updated_at_value(row.original["updated_at"])
            }

            // Setting a new "Default value"
            setStartValue(value.trim());

        } catch (error) {
            changeSaveState("ERROR", {setCloudSavingState});
            // Reverting the changes
            setValue(startValue.trim());

            // Reverting the 'updated at field' (if exists)
            if (row.original["updated_at"]) {
                row.original["updated_at"] = start_updated_at_value;
            }

        }
    };

    if (editing) {
        
        return (
            <input className="py-2 px-3 m-0 field-sizing-content w-full"
            spellCheck="false"
            autoComplete="false"
            autoCapitalize="false"
            name={field + " input"}
            value={value} 
            onChange={(evt) => setValue(evt.target.value)}
            onBlur={saveChange}
            onKeyDown={(evt)=> evt.key === "Enter" && saveChange()}
            autoFocus/>
        )
    }

    return <span className={`flex py-2 px-3 w-full h-fit m-0 box-border text-nowrap ${customClassName}`} onClick={() => setEditing(true)}>{value}</span>
}