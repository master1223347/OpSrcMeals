import { ContributionForm } from "@/components/contribution-form";
import { SiteHeader } from "@/components/site-header";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return <><SiteHeader /><main className="landing-shell"><Image className="botanical botanical-right" src="/olive-branch.png" alt="" width={1024} height={1536} priority /><Image className="botanical botanical-left" src="/olive-branch.png" alt="" width={1024} height={1536} /><div className="citrus-seal" aria-hidden="true">✳</div><section className="hero-copy"><p className="hero-note">An open recipe commons</p><h1 className="font-serif">Contribute a Recipe</h1><p>Help build an open recipe dataset.</p></section><ContributionForm /><section className="open-actions"><Link className="utility-link" href="/recipes"><b>⌘</b>Browse all recipes <span>→</span></Link><a className="utility-link" href="/api/recipes?download=1"><b>↓</b>Download dataset <span>→</span></a><a className="utility-link" href={process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com"} target="_blank" rel="noreferrer"><b>◒</b>GitHub <span>→</span></a></section><p className="open-promise"><span>✳</span> Built in public. Free to browse, download, and improve.</p></main></>;
}
