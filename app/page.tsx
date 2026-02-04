"use client"; // This is a client component 

import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {
  const [joke, setJoke] = useState<string | null>(null);

  const fetchJoke = async () => {
    try {
      const response = await fetch("https://icanhazdadjoke.com/", {
        headers: {
          Accept: "application/json",
        },
      });
      const data = await response.json();
      setJoke(data.joke);
    } catch (error) {
      console.error("Error fetching joke:", error);
      setJoke("Failed to fetch a joke. Please try again!");
    }
  };

  useEffect(() => {
    fetchJoke();
  }, []);

  return (
    <div className={"mainContent"}>
      <h1>HELLO WORLD!</h1>
      <button onClick={fetchJoke}>Get a New Joke</button>
      {joke && <p>{joke}</p>}
    </div>
  );
}
