import { ContributionForm } from "@/components/contribution-form";
import { SiteHeader } from "@/components/site-header";
import Image from "next/image";
import Link from "next/link";

function ArrowIcon() {
  return <svg className="link-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15M14 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function BookIcon() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3.75 5.5A2.75 2.75 0 0 1 6.5 2.75H11v16.5H6.5a2.75 2.75 0 0 0-2.75 2.75V5.5ZM20.25 5.5a2.75 2.75 0 0 0-2.75-2.75H13v16.5h4.5a2.75 2.75 0 0 1 2.75 2.75V5.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /></svg>;
}

function DownloadIcon() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3v12m0 0 4.5-4.5M12 15l-4.5-4.5M4 20.25h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function GitHubIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2.7a9.3 9.3 0 0 0-2.94 18.12c.46.08.62-.2.62-.43v-1.63c-2.52.55-3.05-1.07-3.05-1.07-.42-1.05-1.02-1.33-1.02-1.33-.83-.57.07-.56.07-.56.92.06 1.4.94 1.4.94.82 1.4 2.15 1 2.67.77.08-.59.32-1 .58-1.23-2.01-.23-4.13-1-4.13-4.47 0-.99.35-1.79.93-2.43-.1-.23-.4-1.15.09-2.4 0 0 .76-.24 2.48.93A8.61 8.61 0 0 1 12 7.6a8.5 8.5 0 0 1 2.26.3c1.72-1.17 2.48-.93 2.48-.93.49 1.25.18 2.17.09 2.4.58.64.93 1.44.93 2.43 0 3.48-2.12 4.23-4.14 4.46.33.28.62.81.62 1.63v2.5c0 .24.16.52.62.43A9.3 9.3 0 0 0 12 2.7Z" /></svg>;
}

export default function Home() {
  const github = process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com";
  return <><SiteHeader /><main className="landing-shell"><Image className="botanical botanical-right" src="/olive-branch.png" alt="" width={1024} height={1536} priority /><Image className="botanical botanical-left" src="/olive-branch.png" alt="" width={1024} height={1536} /><aside className="side-notes" aria-label="Open recipe principles"><p>Recipes<br />belong<br />to<br />everyone</p><i /><p>Open<br />ingredients,<br />brighter<br />tomorrows</p><i /></aside><div className="citrus-seal" aria-hidden="true">✳</div><section className="hero-copy"><p className="hero-note">An open recipe commons</p><h1 className="font-serif">Contribute a Recipe</h1><p>Help build an open recipe dataset.</p></section><ContributionForm /><section className="open-actions"><Link className="utility-link" href="/recipes"><span className="link-icon"><BookIcon /></span><span>Browse all recipes</span><ArrowIcon /></Link><a className="utility-link" href="/api/recipes?download=1"><span className="link-icon"><DownloadIcon /></span><span>Download dataset</span><ArrowIcon /></a><a className="utility-link" href={github} target="_blank" rel="noreferrer"><span className="link-icon"><GitHubIcon /></span><span>GitHub</span><ArrowIcon /></a></section><p className="open-promise"><span>✳</span> Built in public. Free to browse, download, and improve.</p></main></>;
}
