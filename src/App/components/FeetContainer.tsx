import { FeetScanPlaceholder } from "../../components/FeetScanPlaceholder";
import * as THREE from "three";

export const FeetContainer: React.FC = () => {
  return (
    <div className="w-full relative">
      <div className="absolute top-0 bottom-0 left-0 right-0 overflow-hidden">
        <FeetScanPlaceholder
          sceneLBackground={new THREE.Color(0x185984)}
          sceneRBackground={new THREE.Color(0x333333)}
          cameraPosition={{
            x: 0.3,
            y: 0.5,
            z: 0.2,
          }}
        />
      </div>
    </div>
  );
};
