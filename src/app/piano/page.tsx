import { redirect } from "next/navigation";

// Legacy route — the piano experience now lives as a window in the VivOS desktop.
export default function PianoRedirect() {
  redirect("/?app=piano");
}
