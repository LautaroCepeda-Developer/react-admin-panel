import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ISetCloudSavingState } from "@/Interfaces/StatesInterfaces";

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
    setCloudSavingState : Dispatch<SetStateAction<SaveState>>
}

export default function EditableCell({row, field, tableHeader, setCloudSavingState}:IEditableCellProps) {
    const [startValue, setStartValue] : [string, Dispatch<SetStateAction<string>>] = useState(row.original[field]);
    const [value, setValue] : [string, Dispatch<SetStateAction<string>>] = useState(row.original[field]);
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
            // Setting a new "Default value"
            setStartValue(value.trim());
        } catch (error) {
            changeSaveState("ERROR", {setCloudSavingState});
            // Reverting the changes
            setValue(startValue.trim());
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

    return <span className="flex py-2 px-3 w-full h-fit m-0 box-border text-nowrap" onClick={() => setEditing(true)}>{value}</span>
}