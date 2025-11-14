import { db } from "~/server/db"

export default function SandboxPage() {
    return <div className="flex flex-col gap-4">
        Seed?
        <form>
           <button>Seed</button>
        </form>
    </div>
}