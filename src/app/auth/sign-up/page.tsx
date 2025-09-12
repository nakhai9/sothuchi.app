"use client"
import { SERVICES } from "@/services/service";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUpPage() {

  const router = useRouter()

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await SERVICES.authService.signUp({
        email, firstName, lastName, password, phone
      })

      router.push('/auth/sign-in')

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Sign Up Page</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>First name: </label>
          <input
            type="text"
            value={firstName}
            className="border border-slate-400"
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Last name: </label>
          <input
            type="text"
            value={lastName}
            className="border border-slate-400"
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email: </label>
          <input
            type="email"
            value={email}
            className="border border-slate-400"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Phone: </label>
          <input
            type="text"
            value={phone}
            className="border border-slate-400"
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password: </label>
          <input
            type="password"
            value={password}
            className="border border-slate-400"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="p-4 border border-slate-400 rounded cursor-pointer">Sign Up</button>
      </form>
    </div>
  );
}
