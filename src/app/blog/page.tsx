import { redirect } from "next/navigation";

// Legacy route — the blog ("yap.txt") now lives as a window in the VivOS desktop.
export default function BlogRedirect() {
  redirect("/?app=yap");
}
