import OAuthCallBack from "@/components/OAuthCallBack";
import { Suspense } from "react";

export default function OAuthCallback() {

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
         <Suspense fallback={<div>Đang tải...</div>}>
             
      <OAuthCallBack/>
            </Suspense>
    </div>
  );
}