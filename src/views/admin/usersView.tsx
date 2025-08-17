'use client'

import { useEffect, useState } from 'react';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';

type User = {
    id: number;
    fullname: string;
    email: string;
    username: string;
    password: string;
    role_id: number;
    created_at: string;
    updated_at: string;
};

type ApiResponse = {
    parsedPage: number;
    parsedLimit: number;
    total: number;
    totalPages: number;
    usersFiltered: User[];
};

const columnHelper = createColumnHelper<User>();

function UsersTable() {
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

            const json: ApiResponse = await res.json();

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

    // Column definitions
    const columns = [
        columnHelper.accessor('fullname', {
            header: 'Full Name',
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor('email', {
            header: 'Email',
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor('username', {
            header: 'Username',
            cell: (info) => info.getValue(),
        }),
        columnHelper.display({
            id: 'password',
            header: 'Password',
            cell: () => '••••••',
        }),
        columnHelper.accessor('role_id', {
            header: 'Role ID',
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor('created_at', {
            header: 'Created',
            cell: (info) =>
                new Date(info.getValue()).toLocaleDateString('es-AR', dateOptions),
        }),
        columnHelper.accessor('updated_at', {
            header: 'Updated',
            cell: (info) =>
                new Date(info.getValue()).toLocaleDateString('es-ar',dateOptions),
        }),
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
    <>
        <div className='flex justify-between mb-4 h-fit gap-3'>
            <h2 className='text-lg font-bold h-full flex justify-center items-end'>Users</h2>
            
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
    </>)
}

export default function UsersView() {
    return <UsersTable/>;
}
