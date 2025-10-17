
import React, { useState } from "react";
import { motion } from "framer-motion";

export default function Login({ onSuccess }){
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if(user === "barmods" && pass === "barmods21") onSuccess();
    else setErr("Username atau password salah");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black flex items-center justify-center">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y:0, opacity:1 }} transition={{ duration: 0.6 }} className="bg-slate-800/60 backdrop-blur-md p-8 rounded-3xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-white">barmods-x-panel-create-server</h2>
        <form onSubmit={submit} className="space-y-3">
          <input value={user} onChange={e=>setUser(e.target.value)} placeholder="Username" className="w-full p-2 rounded bg-slate-700 text-white" />
          <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Password" className="w-full p-2 rounded bg-slate-700 text-white" />
          {err && <div className="text-red-400 text-sm">{err}</div>}
          <button className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded mt-2 text-white">Login</button>
        </form>
      </motion.div>
    </div>
  );
}
