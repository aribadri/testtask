import React from 'react';
import { RotationDirection } from '../../constants';

interface RotationControlsProps {
  direction: RotationDirection
  onRotate: () => void;
  className?: string;
}

const RotationControls: React.FC<RotationControlsProps> = ({ direction, onRotate, className }) => {
  return (
    <>
      <div className={className} onClick={onRotate}>{direction}</div>
    </>
  );
};

export default RotationControls;
