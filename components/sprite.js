import * as React from 'react';
import { Box } from '@mui/material';

const Sprite = (props) => {
  const { src, pos, crop, width, p=0 } = props;
  const norm = (width-2*p)/crop[0]

  return (
    <Box
      sx={{
        ...props.sx,
        width: width,
        height: crop[1]*norm,
        padding: p,
        boxSizing: "border-box"
      }}
    >
      <Box
        sx={{
          width: crop[0],
          height: crop[1],
          backgroundImage: `url(${src})`,
          backgroundPosition: `${pos[0]*-1}px ${pos[1]*-1}px`,
          backgroundRepeat: 'no-repeat',
          transform: `scale(${norm})`,
          transformOrigin: '0 0',
        }}
      />
    </Box>
  )
}

export default Sprite;
