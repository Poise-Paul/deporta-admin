import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  MapPin,
  FileText,
  Hash,
  Calendar,
  CheckCircle,
  XCircle,
  CreditCard,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useEditCorporateCreditPayment } from "@/api/bookings";

export default function CorporateDetailsPage() {
  const router = useRouter();

  const { selCoOperate } = useSelector((state: RootState) => state.corporate);
  const { mutate: editCreditPayment, isPending: isCreditPending } =
    useEditCorporateCreditPayment();

  // Helper to format dates safely
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toDateString();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Corporate Details
            </h1>
            <p className="text-muted-foreground text-sm">
              View full information for{" "}
              {selCoOperate?.user_type.type_id.company_name || "this account"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() =>
              editCreditPayment({
                allow_credit_payment:
                  !selCoOperate?.user_type.type_id.is_credit_allowed,
                corporate_type_id: selCoOperate?.user_type.type_id._id ?? "",
              })
            }
            disabled={isCreditPending}
            variant="outline"
            size="sm"
            className={cn(
              "gap-2",
              selCoOperate?.user_type.type_id.is_credit_allowed
                ? "border-red-400 text-red-600 hover:bg-red-50"
                : "border-green-500 text-green-600 hover:bg-green-50",
            )}
          >
            {isCreditPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CreditCard className="h-4 w-4" />
            )}
            {selCoOperate?.user_type.type_id.is_credit_allowed
              ? "Revoke Credit Payment"
              : "Approve Credit Payment"}
          </Button>

          <Badge
            variant="outline"
            className={cn(
              "px-4 py-1 text-sm font-medium capitalize",
              selCoOperate?.status === "active"
                ? "border-green-500 text-green-600 bg-green-50"
                : "border-orange-500 text-orange-600 bg-orange-50",
            )}
          >
            {selCoOperate?.status}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Admin / Representative Profile */}
        <Card className="md:col-span-1 h-fit">
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <div className="relative h-24 w-24 mb-4 rounded-full overflow-hidden border-2 border-muted">
              {selCoOperate?.profile_image ? (
                <Image
                  src={selCoOperate?.profile_image}
                  alt={selCoOperate?.first_name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-xl font-bold">
                    {selCoOperate?.first_name?.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <h2 className="text-xl font-bold">
              {selCoOperate?.first_name} {selCoOperate?.last_name}
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Account Administrator
            </p>

            <div className="w-full space-y-3 text-left mt-4 border-t pt-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="flex-1 truncate">{selCoOperate?.email}</span>
                {selCoOperate?.verify_email ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-destructive" />
                )}
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{selCoOperate?.phone_number}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Joined: {formatDate(selCoOperate?.createdAt || "")}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Company Details */}
        <div className="md:col-span-2 space-y-6">
          {/* Company Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building2 className="h-5 w-5" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Company Name</p>
                <p className="font-medium">
                  {selCoOperate?.user_type.type_id.company_name}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Registration Number
                </p>
                <p className="font-medium">
                  {selCoOperate?.user_type.type_id.registration_number}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Official Email</p>
                <p className="font-medium">
                  {selCoOperate?.user_type.type_id.business_email}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Official Phone</p>
                <p className="font-medium">
                  {selCoOperate?.user_type.type_id.official_phone_number}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Corporate Hash</p>
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <p className="font-mono text-sm">
                    {selCoOperate?.user_type.type_id.corporate_hash}
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Referral Code</p>
                <p className="font-medium">
                  {selCoOperate?.user_type.type_id.referral_code}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Locations & Documents Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5" />
                Locations & Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Operating Address
                  </p>
                  <p className="text-sm font-medium">
                    {selCoOperate?.user_type.type_id.operating_address}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Residential Address
                  </p>
                  <p className="text-sm font-medium">
                    {selCoOperate?.user_type.type_id.residential_address}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Certificate of Incorporation
                </p>
                {selCoOperate?.user_type.type_id
                  .certificate_of_incorporation ? (
                  <a
                    href={
                      selCoOperate?.user_type.type_id
                        .certificate_of_incorporation
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <FileText className="h-8 w-8 text-blue-500" />
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-medium truncate">
                        View Certificate
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        Click to open document
                      </p>
                    </div>
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No document uploaded.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
