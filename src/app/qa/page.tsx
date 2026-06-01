import { redirect } from "next/navigation";

// Legacy route — the AMA experience now lives as a window in the VivOS desktop.
export default function QARedirect() {
  redirect("/?app=ama");
}
