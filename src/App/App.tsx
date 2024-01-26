import { useState } from "react";
import { MeasurementCards, FeetContainer } from "./components";
import * as dummy_measurements from "../dummy_measurements.json";

export const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  return (
    <div className="w-full h-screen flex">
      <div
        onClick={() => setIsSidebarOpen((prevCheck: boolean) => !prevCheck)}
        className="absolute top-3 left-5 z-50 cursor-pointer text-3xl"
      >
        {isSidebarOpen ? "⬅" : "➡"}
      </div>
      <div
        className={`${
          isSidebarOpen ? "w-2/5" : "w-0"
        }  flex flex-col h-screen transition-all duration-300 ease-in-out bg-gray-500/30 absolute z-40`}
      >
        <div className="flex flex-wrap justify-center gap-5 overflow-y-scroll font-medium pb-10">
          <p className="w-full text-center text-2xl my-2 ">Measurements</p>

          <MeasurementCards {...dummy_measurements} />
        </div>
      </div>
      <FeetContainer />
    </div>
  );
};
