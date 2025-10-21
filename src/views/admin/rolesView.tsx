import { Role } from "@/types/Entities";
import { ISetCloudSavingState } from "@/Interfaces/StatesInterfaces";
import { useState, useEffect } from "react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import EditableCell from "@/components/admin/editableCell";
import DeleteRowButton from "@/components/admin/deleteRowButton";
import AddRowButton from "@/components/admin/addRowButton";


function RolesTable({setCloudSavingState} : ISetCloudSavingState) {
    const [data, setData] = useState<Role[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [errorCode, setErrorCode] = useState("");

    const fetchData = async() => {
        setLoading(true);
        setError(false);
        setErrorCode("");

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/people/roles`,
                { credentials: 'include' }
            );  
            if (!res.ok) {
                setErrorCode(`(${res.status})`);
                setData([]);
            }

            const json: Role[] = await res.json();

            setData(json);
        } catch (err) {
            setError(true);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {fetchData();}, [])


    const columns : ColumnDef<Role>[] = [
        {
            accessorKey: "name",
            header: "Name",
            cell: ({row}) => (row.original.id === 1 || row.original.name === "superadmin" ? <p className="flex py-2 px-3 w-full h-fit m-0 box-border text-nowrap cursor-not-allowed">{row.original.name}</p>: <EditableCell row={row} field="name" tableHeader="roles" setCloudSavingState={setCloudSavingState} />),
        },
        {
            accessorKey: "description",
            header: "Description",
            cell: ({row}) => (row.original.id === 1 || row.original.name === "superadmin" ? <p className="flex py-2 px-3 w-full h-fit m-0 box-border text-nowrap cursor-not-allowed">{row.original.description}</p> : <EditableCell row={row} field="description" tableHeader="roles" setCloudSavingState={setCloudSavingState}/>)
        },
        {
            accessorKey: "level",
            header: "Level",
            cell: ({row}) => (row.original.id === 1 || row.original.name === "superadmin" ? <p
            className="flex py-2 px-3 w-full h-fit m-0 text-center flex-center font-semibold box-border text-nowrap cursor-not-allowed">{row.original.level}
            </p> : <EditableCell customClassName="text-center font-semibold flex-center" row={row} field="level" tableHeader="roles" setCloudSavingState={setCloudSavingState}/>)
        },
        {
            accessorKey: "delete_btn",
            header: "",
            cell: ({row}) => (row.original.name === "superadmin" || row.original.id === 1 ? <span className="flex size-10"></span>: <DeleteRowButton row={row} field="delete_btn" reloadDataFunc={fetchData} setCloudSavingState={setCloudSavingState} tableHeader="roles" />)
        }

    ]


    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel()
    })

    return (
    <div className="overflow-auto">
        <title>Dashboard - Roles</title>
        <div className='flex justify-between mb-4 h-fit gap-3'>
            <h2 className='text-lg font-bold h-full flex justify-center items-end self-end'>Roles</h2>
            
            {error ? (<p className='flex justify-center items-end ml-2 text-red-900 font-medium'>An error ocurred loading the roles {errorCode}</p>) : (<></>)}

            <button className='cursor-pointer border-2 py-2 px-3 font-semibold hover:border-stone-300 hover:text-black hover:bg-stone-200 transition-colors ease-in-out no-select' onClick={fetchData}>RELOAD DATA</button>
        </div>
        

        {loading ? (<p>Loading roles...</p>) : (
            <table className='w-full border-collapse border-2 border-white table-auto'>
                <colgroup>
                    <col span={1} className='w-fit'/>
                    <col span={1} className='w-full'/>
                </colgroup>
                <thead className='bg-black'>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                header.index == headerGroup.headers.length - 1 ?
                                <th id="ADD-ROW-BUTTON-CONTAINER" key={header.id} className='border border-white py-2 px-3 text-left text-nowrap flex-nowrap'>
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                    <AddRowButton tableHeader="roles" setCloudSavingState={setCloudSavingState} reloadDataFunc={fetchData}/>
                                </th>
                                :
                                <th key={header.id} className='border border-white py-2 px-3 text-left text-nowrap flex-nowrap'>
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))

                    }
                </thead>

                <tbody>
                    {table.getRowModel().rows.map((row, index) => (
                        <tr key={row.id} className={index % 2 === 0 ? "bg-gray-200 text-black" : "bg-gray-400 text-black"}>
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} className='border border-gray-300 text-wrap'>
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        )}

        <div className='flex justify-between items-center mt-4'>
        </div>
    </div>)
}


export default function RolesView({setCloudSavingState}:ISetCloudSavingState) {
    return <RolesTable setCloudSavingState={setCloudSavingState}/>;
}