import React from 'react';
import Chip from '@mui/material/Chip';

const ExperienceChip = ({ level }) => {
  if (!level) return null;

  const chipProps = {
    green: {
      label: 'Green',
      color: 'success',
      variant: 'filled',
    },
    yellow: {
      label: 'Yellow',
      variant: 'filled',
      sx: {
        backgroundColor: '#ffeb3b',
        color: '#000',
      },
    },
    red: {
      label: 'Red',
      color: 'error',
      variant: 'filled',
    },
  };

  const props = chipProps[level.toLowerCase()];
  if (!props) return null;

  return <Chip {...props} size="small" />;
};

export default ExperienceChip;