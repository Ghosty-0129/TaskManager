import { redirect } from "next/navigation";

export default function Home() {
  // immediately send visitors to the login page
  redirect("/login");
}
