import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";

const TEMP_EMAIL_DOMAINS = [
  "mailinator.com", "tempmail.com", "10minutemail.com", "guerrillamail.com", "yopmail.com", "dispostable.com", "trashmail.com"
];

function isTempEmail(email) {
  return TEMP_EMAIL_DOMAINS.some(domain => email.endsWith("@" + domain) || email.split("@")[1] === domain);
}

function isValidPassword(password) {
  // At least 8 chars, 1 letter, 1 number, 1 symbol
  return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(password);
}

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");
    if (isTempEmail(email)) return toast.error("Temporary emails are not allowed");
      setLoading(true);
      try {
        const res = await fetch("http://localhost:8080/api/v1/auth/forgot-password/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (data.success) {
          toast.success(`OTP sent to your email${data.otp ? ", OTP: " + data.otp : ""}`);
        setStep(2);
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch {
      toast.error("Server error");
    }
    setLoading(false);
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!otp || !newPassword || !repeatPassword) return toast.error("All fields required");
    if (newPassword !== repeatPassword) return toast.error("Passwords do not match");
    if (!isValidPassword(newPassword)) return toast.error("Password must be 8+ chars, include letters, numbers, and symbols");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/v1/auth/forgot-password/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword })
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Password updated successfully");
        setStep(1);
        setEmail(""); setOtp(""); setNewPassword(""); setRepeatPassword("");
      } else {
        toast.error(data.message || "Failed to update password");
      }
    } catch {
      toast.error("Server error");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-[#FF6B00]">Forgot Password</h2>
        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="h-12" />
            </div>
            <Button type="submit" className="w-full h-12" disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleUpdatePassword} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="otp">OTP</Label>
              <Input id="otp" type="text" value={otp} onChange={e => setOtp(e.target.value)} required className="h-12" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input id="newPassword" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required className="h-12" />
              <p className="text-xs text-gray-500">Must be 8+ chars, include letters, numbers, and symbols.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="repeatPassword">Repeat New Password</Label>
              <Input id="repeatPassword" type="password" value={repeatPassword} onChange={e => setRepeatPassword(e.target.value)} required className="h-12" />
            </div>
            <Button type="submit" className="w-full h-12" disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
