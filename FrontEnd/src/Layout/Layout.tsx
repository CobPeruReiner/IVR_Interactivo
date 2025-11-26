import { Aside } from "../Components/Aside";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative xl:pl-[360px] md:pt-4 md:pb-6 w-full bg-[rgb(240,242,245)] dark:bg-[rgb(26,32,53)] transition-all">
      <div className="absolute left-0 top-0 w-full h-screen bg-[rgb(240,242,245)] dark:bg-[rgb(26,32,53)] transition-all" />
      <Aside />
      <div className="relative">
        <div className="relative px-4 w-full mx-auto">{children}</div>
      </div>
    </div>
  );
};
