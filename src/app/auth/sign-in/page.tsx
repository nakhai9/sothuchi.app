"use client"
import { SERVICES } from "@/services/service";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { setCookie } from 'cookies-next'
export default function SignInPage() {

  const router = useRouter()

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = await SERVICES.authService.signIn({ email, password })
      if (token.accessToken.length > 0) {
        setCookie('accessToken', token.accessToken);
        router.push('/dashboard')
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Sign In Page</h1>
      <form onSubmit={handleSubmit}>
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
          <label>Password: </label>
          <input
            type="password"
            value={password}
            className="border border-slate-400"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="p-4 border border-slate-400 rounded cursor-pointer">Sign In</button>
        <button type="button" className="p-4 border border-slate-400 rounded cursor-pointer" onClick={() => router.push('/auth/sign-up')}>Sign Up</button>
      </form>
    </div>
  );
}
