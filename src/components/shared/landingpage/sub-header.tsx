export function SubHeader({ title }: { title: string }) {
  return (
    <h2 className="font-semibold text-[1.75rem] text-white pb-3 border-b-4 border-[#F75720] inline-block">
      {title}
    </h2>
  );
}
