"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await fetch(`/api/verify-email?token=${token}`);
        if (res.ok) setStatus("success");
        else setStatus("error");
      } catch (err) {
        setStatus("error");
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl text-center space-y-6">
        {status === "loading" && (
          <>
            <Loader2 className="w-16 h-16 text-[#1ecb81] animate-spin mx-auto" />
            <h1 className="text-2xl font-bold text-slate-800">
              Verifying Account...
            </h1>
            <p className="text-slate-500">
              Please wait while we secure your profile.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle2 className="w-16 h-16 text-[#1ecb81] mx-auto" />
            <h1 className="text-2xl font-bold text-slate-800">
              Email Verified!
            </h1>
            <p className="text-slate-500">
              Your account is now active. You can now access the inventory
              dashboard.
            </p>
            <Button
              onClick={() => router.push("/login")}
              className="w-full bg-[#004a61] hover:bg-[#00384a] h-12 rounded-xl"
            >
              Go to Login
            </Button>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto" />
            <h1 className="text-2xl font-bold text-slate-800">
              Verification Failed
            </h1>
            <p className="text-slate-500">
              The link is invalid or has already been used.
            </p>
            <Button
              variant="outline"
              onClick={() => router.push("/register")}
              className="w-full h-12 rounded-xl"
            >
              Back to Registration
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
