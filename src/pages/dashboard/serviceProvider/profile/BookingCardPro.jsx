import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function BookingCardPro({
  urgent,
  name,
  service,
  distance,
  time,
  image,
  bookingId,
  status,
  handleAction,
  isLoading = false // New prop for loading state
}) {

  // Determine if buttons should be disabled based on status or loading
  const isAccepted = status === "confirmed" || status === "accepted";
  const isDeclined = status === "cancelled" || status === "declined";
  const isCompleted = status === "completed";
  const isInProgress = status === "in-progress" || status === "ongoing";
  const isPending = status === "pending";
  
  // Button disabled states
  const isActionDisabled = isLoading || isAccepted || isDeclined || isCompleted || isInProgress;

  // Status display configuration
  const getStatusConfig = () => {
    if (isAccepted) return { text: "Accepted", color: "text-green-600", bg: "bg-green-50" };
    if (isDeclined) return { text: "Declined", color: "text-red-600", bg: "bg-red-50" };
    if (isCompleted) return { text: "Completed", color: "text-blue-600", bg: "bg-blue-50" };
    if (isInProgress) return { text: "In Progress", color: "text-yellow-600", bg: "bg-yellow-50" };
    return { text: "Pending", color: "text-blue-600", bg: "bg-blue-50" };
  };

  const statusConfig = getStatusConfig();

  return (
    <Card className="rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6 space-y-4">
        <div className="flex justify-between items-start gap-4 flex-col md:flex-row">
          <div className="space-y-2 w-full">

            <div className="flex items-center justify-between">
              <div>
                {urgent && (
                  <span className="bg-yellow-100 text-yellow-600 text-xs px-3 py-1 rounded-full animate-pulse">
                    URGENT
                  </span>
                )}
                <h3 className="text-lg font-semibold mt-2">{name}</h3>
              </div>

              <Avatar className="h-16 w-16">
                <AvatarImage src={image} />
                <AvatarFallback>
                  {name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>

            <p className="text-teal-600">
              {service} · {distance}
            </p>

            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              {urgent ? (
                <Clock className="w-4 h-4" />
              ) : (
                <Calendar className="w-4 h-4" />
              )}
              {time}
            </div>

            {/* Status Badge */}
            <div className="pt-1">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                {statusConfig.text}
              </span>
            </div>
          </div>
        </div>

        {/* Actions - Only show for pending status */}
        {isPending && (
          <div className="flex gap-4 flex-col sm:flex-row pt-2">
            <Button
              onClick={() => handleAction(bookingId, "confirmed")}
              disabled={isActionDisabled}
              className="bg-teal-700 hover:bg-teal-800 rounded-xl w-full sm:w-auto relative"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Accepting...
                </>
              ) : (
                "Accept Request"
              )}
            </Button>

            <Button
              onClick={() => handleAction(bookingId, "cancelled")}
              variant="secondary"
              disabled={isActionDisabled}
              className="rounded-xl w-full sm:w-auto relative"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Declining...
                </>
              ) : (
                "Decline"
              )}
            </Button>
          </div>
        )}

        {/* Show message for non-pending statuses */}
        {!isPending && (
          <div className="pt-3 border-t border-gray-100">
            <p className="text-sm text-gray-500 text-center">
              This request has been {statusConfig.text.toLowerCase()}
              {isCompleted && " and is now complete"}
              {isInProgress && " and is currently in progress"}
              {isAccepted && ". You can view details in your active bookings"}
              {isDeclined && ". This action cannot be undone"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}