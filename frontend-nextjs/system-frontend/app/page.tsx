"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/test")
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.error(error));
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1 className="text-3xl font-bold">
        {message || "Connecting to Laravel..."}
      </h1>
    </main>
  );
}