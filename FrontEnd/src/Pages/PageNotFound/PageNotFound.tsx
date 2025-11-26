import { Layout } from "../../Layout/Layout";
import { Error404 } from "../../UI/Iconos";

export const PageNotFound = () => {
  return (
    <Layout
      children={
        <section className="flex flex-col items-center justify-center h-[calc(100vh-3rem)] bg-white dark:bg-gray-900 px-4">
          <div className="max-w-xl text-center flex flex-col justify-center items-center gap-5">
            <Error404 className="relative text-8xl text-gray-700" />
            <h1 className="text-2xl font-extrabold text-[#09c] dark:text-[#09c]">
              404 Not Found
            </h1>
            <p className="text-4xl font-bold text-gray-700 dark:text-gray-300">
              Whoops! That page doesn’t exist.
            </p>
          </div>
        </section>
      }
    />
  );
};
