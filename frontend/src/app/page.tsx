"use client";
import { ModeToggle } from "@/components/common/ModeToggle";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/store/useUIStore";

export default function Home() {
  const { isSidebarOpen, toggleSidebar } = useUIStore();

  return (
    <main>
      <Button onClick={toggleSidebar}>
        {isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
      </Button>
      <ModeToggle />
    </main>
  );
}
