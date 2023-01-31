import * as React from 'react';
import { Box } from '@mui/material';
import { Typography } from '@mui/material';
import { ButtonBase } from '@mui/material';
import Sprite from './sprite';

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
              src='/icon/slots.png'
              pos={[33*5*(slot - 1),810]}
              width={27}
              crop={[33,30]}
            />
          </Box>
        </ButtonBase>
      )
    }
    else {
      return (
        <ButtonBase sx={sx}
          onClick = {() => onClick({Mode: 1, Type: type, Pos: pos, Size: slot.Size, Item: slot})}
        >
          <Box display="flex">
            <Sprite
              src='/icon/slots.png'
              pos={[33*(5*(slot.Size - 1) + (slot.Deco.Size)),30*(slot.Deco.Color)]}
              width={27}
              crop={[33,30]}
            />
            <Box alignSelf="center" ml={0.5}>
              <Typography variant='body2' noWrap mr={0.5}> { data.decoString[slot.Deco.Name] } </Typography>
            </Box>
          </Box>
        </ButtonBase>
      )
    }
  }
  return (
    <Box display="flex" sx={sx}>
      <Sprite
        src='/icon/slots.png'
        pos={[33*5*(slot - 1),810]}
        width={27}
        crop={[33,30]}
      />
    </Box>
  )
}
