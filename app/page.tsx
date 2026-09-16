import { ContributionForm } from "@/components/contribution-form";
import { SiteHeader } from "@/components/site-header";
import Link from "next/link";

export default function Home() {
  return <><SiteHeader /><main className="mx-auto w-full max-w-6xl px-5 pb-24 pt-20 sm:px-8 sm:pt-28"><section className="mx-auto max-w-4xl text-center"><h1 className="font-serif text-5xl font-semibold tracking-[-0.045em] text-ink sm:text-7xl">Contribute a Recipe</h1><p className="mt-4 text-lg text-muted sm:text-xl">Help build an open recipe dataset.</p></section><ContributionForm /><section className="mx-auto mt-10 grid max-w-4xl gap-5 border-t border-line pt-9 text-center sm:grid-cols-3"><Link className="utility-link" href="/recipes">Browse all recipes <span>→</span></Link><a className="utility-link" href="/api/recipes?download=1">Download dataset <span>↓</span></a><a className="utility-link" href={process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com"} target="_blank" rel="noreferrer">GitHub <span>↗</span></a></section><p className="mx-auto mt-10 max-w-xl text-center text-sm leading-6 text-muted">Open Source Meals is a community-built, open-source project. Every submitted recipe is publicly accessible and downloadable for anyone to use, improve, or import.</p></main></>;
}
