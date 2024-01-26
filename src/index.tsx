import { css } from '@emotion/css';
import * as THREE from 'three';
import * as React from 'react';
import { createRoot } from 'react-dom/client';
// import * as dummy_measurements from './dummy_measurements.json';
import { FeetScanPlaceholder } from './components/FeetScanPlaceholder';
import './index.css';

const styles = {
  container: css`
    background: #F6F6F6;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    position: absolute;
    font-family: 'Lato', sans-serif;
    font-weight: 300;
    overflow: hidden;
  `,
  content: css`
    height: 100%;
  `,
};

const ScanPage: React.FC = () => (
  <div
    className={ styles.container }
  >
    <div
      className={ styles.content }
    >
      <FeetScanPlaceholder
        sceneLBackground={ new THREE.Color( 0x185984 ) }
        sceneRBackground={ new THREE.Color( 0x333333 ) }
        cameraPosition={{
          x: 0.3,
          y: 0.5,
          z: 0.2,
        }}
      />
      {/* Implement following component:
        <Measurements
          measurements={ dummy_measurements.data }
        />
      */}
    </div>
  </div>
);

const root = createRoot(document.getElementById('root')!);
root.render(<ScanPage/>);
