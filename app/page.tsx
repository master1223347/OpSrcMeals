import { ContributionForm } from "@/components/contribution-form";
import { SiteHeader } from "@/components/site-header";
import Link from "next/link";

export default function Home() {
  return <><SiteHeader /><main className="landing-shell"><div className="recipe-index" aria-hidden="true"><span>01</span><i /><span>02</span><span>03</span><span>04</span></div><div className="botanical-mark botanical-mark-top" aria-hidden="true">✦</div><section className="hero-copy"><p className="hero-note">An open recipe commons</p><h1 className="font-serif">Contribute a Recipe</h1><p>Help build an open recipe dataset.</p></section><ContributionForm /><section className="open-actions"><Link className="utility-link" href="/recipes"><b>⌘</b>Browse all recipes <span>→</span></Link><a className="utility-link" href="/api/recipes?download=1"><b>↓</b>Download dataset <span>→</span></a><a className="utility-link" href={process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com"} target="_blank" rel="noreferrer"><b>◒</b>GitHub <span>→</span></a></section><p className="open-promise"><span>✳</span> Built in public. Free to browse, download, and improve.</p></main></>;
}
