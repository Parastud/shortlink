"use client"
import Image from "next/image";
import Link from "next/link";
import { ToastContainer, toast } from 'react-toastify';
import { useEffect, useState } from "react";

export default function Home() {
  const [form, setform] = useState({})
  const [generated, setgenerated] = useState(false)
  const [mode,setmode] = useState("light");
  const handlechange = (e) => {
    setform({
      ...form,
      [e.target.name]: e.target.value,
    });
  }
    useEffect(() => {
    document.documentElement.classList.toggle('dark', mode === 'dark');
    document.documentElement.classList.toggle('light', mode === 'light');
  }, [mode]);

  const handleSubmit = async (e) => {
    if(!form.link || !form.type) {
      toast("Please fill all fields");
      return;
    }
    if(!form.link.startsWith("http://") && !form.link.startsWith("https://")) {
      toast("Please enter a valid URL starting with http:// or https://");
      return;
    }
    if(form.type.length < 3) {
      toast("Short URL type must be at least 3 characters long");
      return;
    }
    if(form.type.length > 20) {
      toast("Short URL type must be less than 20 characters long");
      return;
    }
    if(!/^[a-zA-Z0-9_-]+$/.test(form.type)) {
      toast("Short URL type can only contain alphanumeric characters, underscores, and hyphens");
      return;
    }
    e.preventDefault();
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        toast("Short URL Created Successfully");
        setgenerated(form.type);
        setform({});
      }else {
        toast("Short URL already exists");
      }
    } else {
      console.error("Failed to generate link");
    }
  
  
  }


  return (
    <div className="">
<div className="absolute w-10 h-10 top-10 cursor-pointer right-10 transition-all hover:size-12 active:size-14" onClick={() => setmode(mode === 'dark' ? 'light' : 'dark')}>
  {mode === 'dark' ? (
    <Image
      src="/night-mode.png"
      alt="Night mode icon"
      fill
      className="invert"
      style={{ objectFit: 'contain' }}
    />
  ) : (
    <Image
      src="/light-mode.png"
      alt="Light mode icon"
      fill
      style={{ objectFit: 'contain' }}
    />
  )}
</div>

      <ToastContainer />  
      <div className="flex flex-col my-48 p-10 mx-auto max-w-xl gap-5 bg-slate-400 max-h-64 rounded-2xl">
        <input type="text" value={form.link || ""} onChange={handlechange} name="link" placeholder="Enter The Link" className="border-violet-300 border-2 p-2 placeholder-slate-600 rounded-3xl" />

        <input type="text" value={form.type || ""} onChange={handlechange} name="type" placeholder="Enter The Type" className="border-violet-300 border-2 p-2 placeholder-slate-600 rounded-3xl" />
        <div className="mx-auto">
          <button className="bg-gradient-to-r from-violet-500 to-purple-500 rounded-3xl p-4 max-w-2xl hover:from-purple-500 hover:to-violet-500 cursor-pointer transition-all active:text-lg" onClick={handleSubmit}>Generate</button>
        </div>
        {generated && (
          <div className="text-center mt-4">
            <p className="text-lg font-semibold">Short URL Created Successfully!</p>
            <p className="text-sm text-gray-600">You can now use your short URL.</p>
            <Link href={`${process.env.NEXT_PUBLIC_HOST}/${generated}`} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
            <p className="text-sm text-gray-600">{`${process.env.NEXT_PUBLIC_HOST}/${generated}`}</p>
            </Link>

          </div>
        )}
      </div>
    </div>
  );
}
