async function Logout() {
    const apiUrl :string = process.env.NEXT_PUBLIC_API_URL!; 
    const res = await fetch(`${apiUrl}/auth/logout`, {
    method:'POST',
    headers: {'Content-Type': 'application/json'},
    credentials: 'include'})
    
    if (!res.ok) {
        // The cookie is HTTP-Only so this should do absolutely nothing.
        document.cookie = "authCookie=; Max-Age=0; path=/;"
    }

    window.location.href = "/admin/login";
}

export default function LogoutButton() {
    return(<button type="button" className="ml-5 flex-center border-2 box-border px-3 py-1.5 font-bold cursor-pointer hover:border-stone-300 hover:text-black hover:bg-stone-200 transition-colors ease-in-out no-select" onClick={Logout}>LOGOUT</button>)
}