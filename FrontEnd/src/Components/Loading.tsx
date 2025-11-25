import { Loader } from "../UI/Iconos";

export const Loading = () => {
  return (
    <div className="cont-loader flex w-full h-screen justify-center items-center">
      <Loader className="w-14 h-14 text-[#09c] animate-spin" />
    </div>
  );
};
