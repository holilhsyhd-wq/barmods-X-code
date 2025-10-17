
import React, { useState } from "react";
import Login from "./Login";
import Dashboard from "./Dashboard";

export default function App(){
  const [authed, setAuthed] = useState(false);
  return authed ? <Dashboard /> : <Login onSuccess={() => setAuthed(true)} />;
}
