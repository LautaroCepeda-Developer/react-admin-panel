import AdminButton from "@/components/admin/adminButton";
import Footer from "@/components/footer";

export default function App() {
    return(
    <>
    <title>Home</title>
    <header className="flex flex-row justify-between items-center p-2.5">
        <h1 className="font-bold">COOKIE & JWT AUTH FRONTEND DEMO</h1>
        <AdminButton/>
    </header>
    <main className="flex flex-1 justify-center items-center">
        <p>This is a demo to test the <a target="_blank" title="Github Repository" className="text-blue-400 hover:underline" href="https://github.com/LautaroCepeda-Developer/Advanced_JWT_Backend_Template">Advanced JWT Backend Template</a>.</p>
    </main>
    <Footer/>
    </>)
}