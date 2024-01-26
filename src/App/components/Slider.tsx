import { ShoeItem } from "./MeasurementCards";

export const Slider: React.FC<ShoeItem> = (item) => {
  const ArrowDiv = (range: string, deviation: number, arrow: number) => {
    return (
      <>
        {range === item.active && (
          <div
            style={{
              transform: `translateX(${deviation * 200}%)`,
              fontSize: "10px",
            }}
          >
            <div className="text-center py-1">
              <p>{arrow ? "^" : "Left"}</p>
              <p>{arrow ? "Right" : "⌄"}</p>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="w-full flex justify-between items-center">
      {item.values.map((range: string) => (
        <div
          className="flex flex-col w-full relative items-center"
          key={item.id}
        >
          {ArrowDiv(range, item.leftDeviation, 0)}
          <div
            className={`w-full h-10 flex items-center justify-center rounded-none shadow-lg ${
              range === item.active ? "bg-[#1CB5D1]/50" : "bg-gray-300"
            }`}
          >
            {range}
          </div>
          {ArrowDiv(range, item.rightDeviation, 1)}
        </div>
      ))}
    </div>
  );
};
