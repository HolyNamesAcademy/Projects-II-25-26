"use client";
import {useState} from "react";
import PrimaryButton from "@/components/primaryButton";
import TextInput from "@/components/textInput";
import { api, handleApiError } from '@/lib/api';

export default function Signup() {
  const [email,setEmail] = useState("");
  const [name,setName] = useState("");
  const[password, setPassword] = useState("");
  const[confirm, setConfirm] = useState("");
  const[agree, setAgree] = useState(false);
  
    //login logic here
  const signUp = async () => {
    console.log("Signing up..." );
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Confirm:", confirm);
    console.log("Agree:", agree);
    
    if (password !== confirm|| !agree) {
      console.error("Password and Confirm Password do not match or Terms not agreed.");
      return;
    } 
    const response = await api.auth.register({name,email,password});
    console.log("Registered from server:", response);
  };
  return (
    <div>
      <main className="flex flex-col gap-[32px] row-start-2 items-center">
        <h1 className="text-5xl">
          Sign Up
        </h1>

        <form>
    <div className="grid gap-6 mb-6 md:grid-cols-1">
        <TextInput label="Name" type="name" placeholder="Holly Academy" required value={name} onChange = {(e) => setName(e.target.value)}/>
        <TextInput label="Your email" type="email" placeholder="name@holynames-sea.org" required value={email} onChange = {(e) => setEmail(e.target.value)}/>
        <TextInput label="Password" type="password" placeholder="•••••••••" required value={password} onChange = {(e) => setPassword(e.target.value)}/>
        <TextInput label="Confirm Password" type="password" placeholder="•••••••••" required value={confirm} onChange = {(e) => setConfirm(e.target.value)}/>
        
    </div> 
    
    
    { <div className="flex items-start mb-6">
        <div className="flex items-center h-5">
        <input id="agree" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800" required />
        </div>
        <label htmlFor="agree" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">I agree with the <a href="#" className="text-blue-600 hover:underline dark:text-blue-500">terms and conditions</a>.</label>
    </div> }
    <PrimaryButton text="Sign Up" type="button" onClick = {signUp} />
    
</form>
        
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
      </footer>
    </div>
  );
}
