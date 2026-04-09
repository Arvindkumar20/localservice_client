// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import {
//   Avatar,
//   AvatarImage,
//   AvatarFallback,
// } from "@/components/ui/avatar";

// export function VerificationCard({ name, role, image }) {
//   return (
//     <Card className="rounded-2xl shadow-md hover:shadow-lg transition">
//       <CardContent className="p-6 text-center space-y-4">
        
//         {/* Avatar */}
//         <Avatar className="h-16 w-16 mx-auto">
//           <AvatarImage src={image} alt={name} />
//           <AvatarFallback>
//             {name
//               ?.split(" ")
//               .map((n) => n[0])
//               .join("")}
//           </AvatarFallback>
//         </Avatar>

//         {/* Info */}
//         <div>
//           <h3 className="font-semibold text-lg">{name}</h3>
//           <p className="text-sm text-muted-foreground">{role}</p>
//         </div>

//         {/* Button */}
//         <Button className="w-full bg-teal-700 hover:bg-teal-800 rounded-xl">
//           Review
//         </Button>

//       </CardContent>
//     </Card>
//   );
// }


// components/dashboard/serviceProvider/VerificationCard.js
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";

export const VerificationCard = ({ image, name, role, onApprove, onReject }) => {
  return (
    <Card className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <img 
            src={image} 
            alt={name} 
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{name}</h3>
            <p className="text-sm text-muted-foreground">{role}</p>
            <div className="flex gap-2 mt-3">
              <Button 
                size="sm" 
                className="bg-green-600 hover:bg-green-700"
                onClick={onApprove}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Approve
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="text-red-600 hover:text-red-700"
                onClick={onReject}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Reject
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


