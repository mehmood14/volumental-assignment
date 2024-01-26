import { Slider } from "./Slider";

type ShoeData = {
  data: ShoeItem[];
};

export type ShoeItem = {
  id: string;
  title: string;
  subTitle: string;
  values: string[];
  active: string;
  leftDeviation: number;
  rightDeviation: number;
};

export const MeasurementCards: React.FC<ShoeData> = (measurements) => {
  return (
    <>
      {measurements.data.map((item: ShoeItem) => (
        <div
          key={item.id}
          className="w-2/5 h-56 flex flex-col rounded-lg shadow-xl justify-between items-center p-4 m-0
          bg-gray-200 hover:bg-gray-100/75 hover:scale-105 transition-all duration-500 cursor-pointer"
        >
          <div className="flex flex-col w-full items-center gap-3">
            <p className="text-2xl">{item.title}</p>
            <p className="text-gray-500">{item.subTitle}</p>
          </div>

          <Slider {...item} />
        </div>
      ))}
    </>
  );
};
