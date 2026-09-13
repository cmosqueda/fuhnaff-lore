export default function Footer() {
  return (
    <div className="w-full bg-panel border-t border-hairline flex justify-center py-4 px-4">
      <p className="font-mono text-[11px] text-muted text-center leading-relaxed">
        Site by tyne. All rights reserved to Scott Cawthon and Clickteam USA. Lore content adapted from the{" "}
        <a
          href="https://freddy-fazbears-pizza.fandom.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-marquee-dim hover:text-marquee underline"
        >
          Five Nights at Freddy's Wiki
        </a>{" "}
        (CC BY-SA).
      </p>
    </div>
  );
}
