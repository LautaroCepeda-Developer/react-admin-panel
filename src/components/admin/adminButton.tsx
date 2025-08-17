'use client'
export default function AdminButton() {
    return(<button type="button" className="flex-center border-2 box-border px-3 py-1.5 font-bold cursor-pointer hover:border-stone-300 hover:text-black hover:bg-stone-200 transition-colors ease-in-out no-select" onClick={() => {
        window.location.href = "/admin/login"
    }}>ADMIN</button>)
}