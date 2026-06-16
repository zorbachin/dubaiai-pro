import { redirect } from "next/navigation";

// The home scroll is now the morning experience (time-of-day aware).
export default function MorningRedirect() {
  redirect("/");
}
