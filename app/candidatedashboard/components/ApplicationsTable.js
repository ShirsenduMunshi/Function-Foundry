// "use client";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Clock, CheckCircle2, XCircle, Loader2, FileText } from "lucide-react";
// import { useEffect, useState } from "react";
// import { toast } from "sonner";
// import Link from "next/link";

// const statusIcons = {
//   pending: <Clock className="h-4 w-4" />,
//   reviewed: <CheckCircle2 className="h-4 w-4" />,
//   accepted: <CheckCircle2 className="h-4 w-4 text-green-500" />,
//   rejected: <XCircle className="h-4 w-4 text-red-500" />,
// };

// const statusVariant = {
//   pending: "outline",
//   reviewed: "secondary",
//   accepted: "default",
//   rejected: "destructive",
// };

// export default function ApplicationsTable() {
//   const [applications, setApplications] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchApplications = async () => {
//       try {
//         setIsLoading(true);
//         const authToken = localStorage.getItem("authToken");
        
//         if (!authToken) {
//           window.location.href = "/login";
//           return;
//         }

//         const user = JSON.parse(authToken);
//         const userId = user?.token?.user?._id;

//         if (!userId) {
//           throw new Error("User ID not found in token");
//         }

//         const response = await fetch(`/api/applications?applicantId=${userId}`, {
//           headers: {
//             Authorization: authToken,
//           },
//         });

//         if (response.status === 401) {
//           localStorage.removeItem("authToken");
//           window.location.href = "/login";
//           return;
//         }

//         if (!response.ok) {
//           throw new Error(`Failed to fetch applications: ${response.status}`);
//         }

//         const data = await response.json();
//         setApplications(data);
//       } catch (error) {
//         console.error("Error fetching applications:", error);
//         toast.error("Failed to load applications");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchApplications();
//   }, []);

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <Loader2 className="h-8 w-8 animate-spin" />
//       </div>
//     );
//   }

//   if (applications.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center h-64 gap-4">
//         <FileText className="h-12 w-12 text-muted-foreground" />
//         <p className="text-lg text-muted-foreground">No applications found</p>
//         <Button asChild>
//           <Link href="/joblist">Browse Jobs</Link>
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <Table>
//       <TableHeader>
//         <TableRow>
//           <TableHead>Position</TableHead>
//           <TableHead>Company</TableHead>
//           <TableHead>Date Applied</TableHead>
//           <TableHead>Status</TableHead>
//           <TableHead>Actions</TableHead>
//         </TableRow>
//       </TableHeader>
//       <TableBody>
//         {applications.map((app) => (
//           <TableRow key={app._id}>
//             <TableCell className="font-medium">
//               {app.jobId?.title || "N/A"}
//             </TableCell>
//             <TableCell>
//               {app.jobId?.company?.name || "N/A"}
//             </TableCell>
//             <TableCell>
//               {new Date(app.appliedAt).toLocaleDateString()}
//             </TableCell>
//             <TableCell>
//               <Badge 
//                 variant={statusVariant[app.status] || "outline"} 
//                 className="flex items-center gap-1"
//               >
//                 {statusIcons[app.status]}
//                 {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
//               </Badge>
//             </TableCell>
//             <TableCell>
//               <Button variant="outline" size="sm" asChild>
//                 <Link href={`/applications/${app._id}`}>
//                   View Details
//                 </Link>
//               </Button>
//             </TableCell>
//           </TableRow>
//         ))}
//       </TableBody>
//     </Table>
//   );
// }

// app/clientdashboard/components/ApplicationsTable.js
"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle2, XCircle, Loader2, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

const statusIcons = {
  pending: <Clock className="h-4 w-4" />,
  reviewed: <CheckCircle2 className="h-4 w-4" />,
  accepted: <CheckCircle2 className="h-4 w-4 text-green-500" />,
  rejected: <XCircle className="h-4 w-4 text-red-500" />,
};

const statusVariant = {
  pending: "outline",
  reviewed: "secondary",
  accepted: "default",
  rejected: "destructive",
};

export default function ApplicationsTable() {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setIsLoading(true);
        const authToken = localStorage.getItem("authToken");
        
        if (!authToken) {
          window.location.href = "/login";
          return;
        }

        const user = JSON.parse(authToken);
        const userId = user?.token?.user?._id;

        if (!userId) {
          throw new Error("User ID not found in token");
        }

        const response = await fetch(`/api/applications?applicantId=${userId}`, {
          headers: {
            Authorization: authToken,
          },
        });

        if (response.status === 401) {
          localStorage.removeItem("authToken");
          window.location.href = "/login";
          return;
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch applications: ${response.status}`);
        }

        const data = await response.json();
        setApplications(data);
      } catch (error) {
        console.error("Error fetching applications:", error);
        toast.error("Failed to load applications");
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <FileText className="h-12 w-12 text-muted-foreground" />
        <p className="text-lg text-muted-foreground">No applications found</p>
        <Button asChild>
          <Link href="/joblist">Browse Jobs</Link>
        </Button>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Position</TableHead>
          <TableHead>Company</TableHead>
          <TableHead>Date Applied</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {applications.map((app) => (
          <TableRow key={app._id}>
            <TableCell className="font-medium">
              {app.jobId?.title || "N/A"}
            </TableCell>
            <TableCell>
              {app.jobId?.company || "N/A"} {/* Changed from company.name to company */}
            </TableCell>
            <TableCell>
              {new Date(app.appliedAt).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <Badge 
                variant={statusVariant[app.status] || "outline"} 
                className="flex items-center gap-1"
              >
                {statusIcons[app.status]}
                {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
              </Badge>
            </TableCell>
            <TableCell>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/candidatedashboard/${app.jobId._id}`}>
                  View Details
                </Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}