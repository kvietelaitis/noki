import HabitContents from "./habit-contents";
import { QUERIES } from "~/server/db/queries";
import { ThemeProvider } from "~/app/context/ThemeContext"
import { auth } from "@clerk/nextjs/server";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export default async function Page() {
  const user = await auth()
  if(!user.userId) {
    return (
      <ThemeProvider>
        <div>
          <SignedOut>
            <SignInButton />
            <SignUpButton>
              <button className="bg-[#6c47ff] text-ceramic-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
        you aint logged in son
      </ThemeProvider>
    )
  }

  const habits = await QUERIES.getHabits(user.userId);

  return (
    <ThemeProvider>
      <HabitContents habits={habits}/>
    </ThemeProvider>
  );
}
