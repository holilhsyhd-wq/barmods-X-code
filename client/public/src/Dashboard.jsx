
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function Dashboard(){
  const [name, setName] = useState("");
  const [ram, setRam] = useState("");
  const [result, setResult] = useState(null);
  const [cfg, setCfg] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{ axios.get("/api/config").then(r=>setCfg(r.data)).catch(()=>{}); },[]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try{
      const res = await axios.post("/api/create", { name, ram });
      setResult({ ok:true, data: res.data });
    } catch(err){
      setResult({ ok:false, error: err.response?.data?.error || err.message, extra: err.response?.data });
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="max-w-3xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">barmods-x-panel-create-server</h1>
          <div className="text-sm text-slate-400">Panel • {cfg?.domain || "not configured"}</div>
        </header>

        <motion.div initial={{ y: 10, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ delay: 0.1 }} className="bg-slate-800 p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-3">Buat Server Baru</h2>
          <form onSubmit={submit} className="space-y-3">
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Nama Server" className="w-full p-2 rounded bg-slate-700 text-white" required />
            <select value={ram} onChange={e=>setRam(e.target.value)} className="w-full p-2 rounded bg-slate-700 text-white" required>
              <option value="">Pilih RAM</option>
              <option value="1024">1 GB</option>
              <option value="2048">2 GB</option>
              <option value="3072">3 GB</option>
              <option value="4096">4 GB</option>
              <option value="5120">5 GB</option>
              <option value="6144">6 GB</option>
              <option value="7168">7 GB</option>
              <option value="8192">8 GB</option>
              <option value="9216">9 GB</option>
              <option value="0">Unlimited</option>
            </select>
            <div className="flex gap-3">
              <button disabled={loading} className="px-4 py-2 bg-blue-600 rounded disabled:opacity-50">{loading ? "Membuat..." : "Create Server"}</button>
              <button type="button" onClick={()=>{setName(""); setRam(""); setResult(null)}} className="px-4 py-2 bg-gray-600 rounded">Reset</button>
            </div>
          </form>

          {result && (
            <div className="mt-4 p-3 rounded bg-slate-700">
                {result.ok ? (
                  <>
                    <p className="text-green-300 font-semibold">✅ Server berhasil dibuat</p>
                    <pre className="text-xs mt-2 whitespace-pre-wrap">{JSON.stringify(result.data, null, 2)}</pre>
                  </>
                ) : (
                  <>
                    <p className="text-red-300 font-semibold">❌ Gagal</p>
                    <p className="text-sm mt-1">{result.error}</p>
                    {result.extra && <pre className="text-xs mt-2 whitespace-pre-wrap">{JSON.stringify(result.extra, null, 2)}</pre>}
                  </>
                )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
