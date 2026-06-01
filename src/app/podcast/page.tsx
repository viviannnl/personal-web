import { redirect } from "next/navigation";

// Legacy route — the podcast now lives as a window in the VivOS desktop.
export default function PodcastRedirect() {
  redirect("/?app=podcast");
}
