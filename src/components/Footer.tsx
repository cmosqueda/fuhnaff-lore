export default function Footer() {
  return (
    <div className="w-full bg-purple-950 flex justify-center py-3">
      <p className="italic text-white text-sm text-center">
        Site by tyne. All rights reserved to Scott Cawthon and Clickteam USA. Lore content adapted from the{" "}
        <a
          href="https://freddy-fazbears-pizza.fandom.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Five Nights at Freddy's Wiki
        </a>{" "}
        (CC BY-SA).
      </p>
    </div>
  );
}
