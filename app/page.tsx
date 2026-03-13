"use client";
import dynamic from "next/dynamic";
const Simulator = dynamic(() => import("./simulator"), { ssr: false });
export default function Home() {
  return <Simulator />;
}
