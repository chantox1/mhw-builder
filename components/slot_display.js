import * as React from 'react';
import { Box } from '@mui/material';
import { Card, CardMedia } from '@mui/material';
import { Typography } from '@mui/material';
import { ButtonBase } from '@mui/material';

const Sprite = (props) => {
  const { src, pos, crop, width, p=0 } = props;
  const norm = (width-2*p)/crop[0]

  return (
    <Box
      sx={{
        ...props.sx,
        width: width,
        height: crop[1]*norm,
        padding: p
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

export default function SlotDisplay(props) {
  const { data, main=false, slot, pos, sx, type, onClick } = props;

  if (main) {
    sx.borderColor = 'text.secondary'
    if (typeof(slot) == "number") {
      return (
        <ButtonBase sx={sx}
          onClick = {() => onClick({Mode: 1, Type: type, Pos: pos, Size: slot, Item: slot})}
        >
          <Box display="flex">
            <Sprite
              src='/icon/Slot/gems-base.png'
              pos={[33*(slot - 1),0]}
              width={27}
              crop={[33,30]}
            />
          </Box>
        </ButtonBase>
      )
    }
    else {
      console.log("filled slot:")
      console.log(slot.Deco)
      return (
        <ButtonBase sx={sx}
          onClick = {() => onClick({Mode: 1, Type: type, Pos: pos, Size: slot.Size, Item: slot})}
        >
          <Box display="flex">
            <Sprite
              src='/icon/Slot/gems-base.png'
              pos={[33*(slot.Size - 1),30*(slot.Deco.Size)]}
              width={27}
              crop={[33,30]}
            />
            <Sprite
              src='/icon/Slot/gems-over.png'
              pos={[33*(slot.Deco.Size - 1),30*(slot.Deco.Color)]}
              width={27}
              crop={[33,30]}
              sx={{position: "absolute"}}
            />
            <Box alignSelf="center" ml={0.5}>
              <Typography noWrap> { data.decoString[slot.Deco.Name] } </Typography>
            </Box>
          </Box>
        </ButtonBase>
      )
    }
  }
  return (
    <Box display="flex" sx={sx}>
      <Sprite
        src='/icon/Slot/gems-base.png'
        pos={[33*(slot - 1),0]}
        width={27}
        crop={[33,30]}
      />
    </Box>
  )
}
