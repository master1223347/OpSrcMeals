import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title:"Open Source Meals", description:"A public, open recipe dataset built by contributors." };
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body>{children}</body></html>}
