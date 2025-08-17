import { useState, useEffect } from "react";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';

type Role = {
    id: number,
    name: string,
    description: string | null
}

const columnHelper = createColumnHelper<Role>();

function RolesTable() {
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

    const columns = [
        columnHelper.accessor('name', {
            header: 'Name',
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("description", {
            header: "Description",
            cell: (info) => info.getValue()
        })
    ]

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel()
    })

    return (
    <>
        <div className='flex justify-between mb-4 h-fit gap-3'>
            <h2 className='text-lg font-bold h-full flex justify-center items-end'>Roles</h2>
            
            {error ? (<p className='flex justify-center items-end ml-2 text-red-900 font-medium'>An error ocurred loading the users {errorCode}</p>) : (<></>)}

            <button className='cursor-pointer border-2 py-2 px-3 font-semibold hover:border-stone-300 hover:text-black hover:bg-stone-200 transition-colors ease-in-out no-select' onClick={fetchData}>RELOAD DATA</button>
        </div>
        

        {loading ? (<p>Loading users...</p>) : (
            <table className='w-full border-collapse border-2 border-white'>
                <thead className='bg-black'>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id} className='border border-white p-2 text-left'>
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
                                <td key={cell.id} className='border wrap-anywhere border-gray-300 p-2 text-wrap'>
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
    </>)
}


export default function RolesView() {
    return <RolesTable/>;
}