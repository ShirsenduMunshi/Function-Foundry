import DashboardLayout from "./DashboardLayout";

export const metadata = {
    title: "Function Foundry - Employer Dashboard",
    description:
      "Post & Manage your dream tech job at Function Foundry. We connect top developers with exciting opportunities at innovative companies.",
    author: "Shirsendu Munshi",
  };
  
  export default function Layout({ children }) {
    return <DashboardLayout>{children}</DashboardLayout>;
  }
  