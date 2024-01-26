import { css } from '@emotion/css';
import * as React from 'react';

import { SceneManager } from './scene_manager';

const styles = {
  canvasContainer: css`
    height: 100vh;
    width: 100vw;
    position: absolute;
  `,
  canvas: css`
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    overflow: visible;
  `,
  slider: css`
    position: absolute;
    cursor: ew-resize;
    width: 40px;
    height: 40px;
    background-color: #1CB5D1;
    opacity: 0.7;
    border-radius: 50%;
    top: calc(50% - 20px);
    left: 50%;
  `,
};

interface FeetScanPlaceholderProps {
  sceneLBackground: THREE.Color;
  sceneRBackground: THREE.Color;
  cameraPosition: {
    x: number;
    y: number;
    z: number;
  };
};

export const FeetScanPlaceholder: React.FC<FeetScanPlaceholderProps> = (props) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const sliderRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(
    () => {
      if (containerRef.current && sliderRef.current) {
        new SceneManager(
          containerRef.current,
          sliderRef.current,
          props.cameraPosition,
          props.sceneLBackground,
          props.sceneRBackground,
        );

        const onMouseMove = (event: MouseEvent) => {
          if (sliderRef.current) {
            const sliderPos = Math.max( 0, Math.min( window.innerWidth, event.pageX ) );
            sliderRef.current.style.left = sliderPos - ( sliderRef.current.offsetWidth / 2 ) + 'px';
          }
        };
        const onMouseDown = (event: MouseEvent) => {
          window.addEventListener('mousemove', onMouseMove);
          window.addEventListener('mouseup', onMouseUp);
        };
        const onMouseUp = (event: MouseEvent) => {
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('mouseup', onMouseUp);
        };
        sliderRef.current.addEventListener('mousedown', onMouseDown);
        window.addEventListener('resize', () => {
          if (sliderRef.current) {
            sliderRef.current.style.left = `${
              Math.max(sliderRef.current.getBoundingClientRect().left,
              window.innerWidth / 2)}px`;
          }
        });
      }
    },
    [props],
  );

  return (
    <>
      <div
        className={ styles.canvasContainer }
      >
        <div
          className={ styles.canvas }
          id="canvas"
          ref={ containerRef }
        />
      </div>
      <div
        className={ styles.slider }
        id="slider"
        ref={ sliderRef }
      />
    </>
  );
};
