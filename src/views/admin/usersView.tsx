'use client'

import { useEffect, useState } from 'react';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import EditableCell from '@/components/admin/editableCell';
import { ISetCloudSavingState } from '@/Interfaces/StatesInterfaces';
import { User, UserApiResponse } from '@/types/Entities';
import EditablePrivateCell from '@/components/admin/editablePrivateCell';
import DeleteRowButton from '@/components/admin/deleteRowButton';


function UsersTable({setCloudSavingState} : ISetCloudSavingState) {
    const [data, setData] = useState<User[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [errorCode, setErrorCode] = useState("");

    const fetchData = async () => {
        setLoading(true);
        setError(false);
        setErrorCode("");
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/people/users?page=${page}&limit=10`,
                { credentials: 'include' }
            );

            if (!res.ok) {
                setErrorCode(`(${res.status})`);
                setData([]);
            }

            const json: UserApiResponse = await res.json();

            setData(json.usersFiltered);
            setTotalPages(json.totalPages);
        } catch (err) {
            setError(true);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page]);


    const dateOptions : Intl.DateTimeFormatOptions = {
        year:"numeric", day:"2-digit","month":"2-digit"
    }



    const columns : ColumnDef<User>[] = [
        {
            accessorKey: "fullname",
            header: "Full name",
            cell: ({row}) => (row.original.id === 1 || row.original.role_name === "superadmin" || row.original.role_id === 1 ? <p className="flex py-2 px-3 w-full h-fit m-0 box-border text-nowrap cursor-not-allowed">{row.original.fullname}</p>:<EditableCell customClassName='text-wrap flex-wrap' row={row} field="fullname" tableHeader="users" setCloudSavingState={setCloudSavingState}/>)
        },
        {
            accessorKey:"email",
            header: "Email",
            cell: ({row}) => (row.original.id === 1 || row.original.role_name === "superadmin" || row.original.role_id === 1 ? <p className="flex py-2 px-3 w-full h-fit m-0 box-border text-nowrap cursor-not-allowed">{row.original.email}</p>:<EditableCell row={row} field="email" tableHeader="users" setCloudSavingState={setCloudSavingState}/>)
        },
        {
            accessorKey:"username",
            header: "Username",
            cell: ({row}) => (row.original.id === 1 || row.original.role_name === "superadmin" || row.original.role_id === 1 ? <p className="flex py-2 px-3 w-full h-fit m-0 box-border text-nowrap cursor-not-allowed">••••••</p>:<EditablePrivateCell row={row} field="username" tableHeader="users" setCloudSavingState={setCloudSavingState}/>)
        },
        {
            accessorKey:"password",
            header: "Password",
            cell: ({row}) => (row.original.id === 1 || row.original.role_name === "superadmin" || row.original.role_id === 1 ? <p className="flex py-2 px-3 w-full h-fit m-0 box-border text-nowrap cursor-not-allowed">••••••</p>:<EditablePrivateCell row={row} field="password" tableHeader="users" setCloudSavingState={setCloudSavingState}/>)
        },
        {
            accessorKey:"role_name",
            header: "Role",
            cell: ({row}) => (row.original.id === 1 || row.original.role_name === "superadmin" || row.original.role_id === 1 ? <span className='py-2 px-3 flex-center text-center text-nowrap cursor-not-allowed'>{row.original.role_name} <span className='ml-1 opacity-70 text-xs'>(LVL {row.original.role_level})</span></span> :
            <span className='py-2 px-3 flex-center text-center text-nowrap'>{row.original.role_name} <span className='ml-1 opacity-70 text-xs'>(LVL {row.original.role_level})</span></span>) 
        },
        {
            accessorKey:"created_at",
            header: "Created at",
            cell: ({row}) => (<span className='py-2 px-3 text-nowrap flex-nowrap cursor-not-allowed'>{new Date(row.original.created_at).toLocaleDateString('es-ar',dateOptions)}</span>)
        },
        {
            accessorKey:"updated_at",
            header: "Updated at",
            cell: ({row}) => (<span className='py-2 px-3 text-nowrap flex-nowrap cursor-not-allowed'>{new Date(row.original.updated_at).toLocaleDateString('es-ar',dateOptions)}</span>)
        },
        {
            accessorKey:"delete_btn",
            header:"",
            cell: ({row}) => (row.original.role_name === "superadmin" || row.original.role_level === 1 ? <span className='flex size-10'></span> : <DeleteRowButton row={row} field='delete_btn' reloadDataFunc={fetchData} setCloudSavingState={setCloudSavingState} tableHeader='users'/>)
        }
    ]

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
    <div className='overflow-auto'>
        <title>Dashboard - Users</title>
        <div className='flex justify-between mb-4 h-fit gap-3'>
            <h2 className='text-lg font-bold h-full flex justify-center items-end self-end'>Users</h2>
            
            {error ? (<p className='flex justify-center items-end ml-2 text-red-900 font-medium'>An error ocurred loading the users {errorCode}</p>) : (<></>)}

            <button className='cursor-pointer border-2 py-2 px-3 font-semibold hover:border-stone-300 hover:text-black hover:bg-stone-200 transition-colors ease-in-out no-select' onClick={fetchData}>RELOAD DATA</button>
        </div>
        

        {loading ? (<p>Loading users...</p>) : (
            <table className='w-full border-collapse border-2 border-white'>
                <colgroup>
                    <col span={1} className='w-full'/>
                    <col span={1} className='w-fit'/>
                    <col span={1} className='w-fit'/>
                    <col span={1} className='w-fit'/>
                    <col span={1} className='w-fit'/>
                    <col span={1} className='w-fit'/>
                    <col span={1} className='w-fit'/>
                    <col span={1} className='w-fit'/>
                </colgroup>
                <thead className='bg-black'>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
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
                                <td key={cell.id} data-row-id={row.id} data-header-id={cell.column.id} className='wrap-anywhere md:wrap-normal border border-gray-300 text-wrap'>
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
            <button 
                onClick={()=> setPage((p) => Math.max(p-1,1))}
                disabled={page === 1}
                className='cursor-pointer px-3 py-1 bg-white text-black font-medium rounded disabled:opacity-50 disabled:cursor-not-allowed'
            >PREV</button>
            <div draggable="false" className='flex-center border-2 p-2 no-select'>
                <p draggable="false">{page} / {totalPages}</p>
            </div>
            <button
                onClick={() => setPage((p) => Math.min(p+1, totalPages))}
                disabled={page === totalPages}
                className='cursor-pointer px-3 py-1 bg-white text-black font-medium rounded disabled:opacity-50 disabled:cursor-not-allowed'
            >NEXT</button>
        </div>
    </div>)
}

export default function UsersView({setCloudSavingState}:ISetCloudSavingState) {
    return <UsersTable setCloudSavingState={setCloudSavingState} />;
}
