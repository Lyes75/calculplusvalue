"use client";
import dynamic from "next/dynamic";
const SimulateurBase = dynamic(() => import("@/components/SimulateurBase"), { ssr: false });
export default function Home() {
  return <SimulateurBase defaultType="secondaire" showTypeResidence={true} />;
}
