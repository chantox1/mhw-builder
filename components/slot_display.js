import * as React from 'react';
import { Box } from '@mui/material';
import { Card, CardMedia } from '@mui/material';
import { Typography } from '@mui/material';
import { ButtonBase } from '@mui/material';

export default function SlotDisplay(props) {
  const { data, main=false, slot, pos, sx, type, onClick } = props;

  if (main) {
    sx.borderColor = 'text.secondary'
    if (typeof(slot) == "number") {
      return (
        <ButtonBase sx={sx}
          onClick = {() => onClick({Mode: 1, Type: type, Pos: pos, Size: slot, Item: slot})}
        >
          <Box display="flex" height="100%">
            <Box
              component="img"
              src={'/icon/Slot/' + slot + '.png'}
            />
          </Box>
        </ButtonBase>
      )
    }
    else {
      return (
        <ButtonBase sx={sx}
          onClick = {() => onClick({Mode: 1, Type: type, Pos: pos, Size: slot, Item: slot})}
        >
          <Box display="flex" height="100%">
            <Box
              component="img"
              src={'/icon/Slot/' + slot.Size + '.png'}
            />
            <Typography align="center" noWrap> { data.decoString[slot.Deco.Name] } </Typography>
          </Box>
        </ButtonBase>
      )
    }
  }
  return (
    <Box display="flex" sx={sx}>
      <Box
        component="img"
        src={'/icon/Slot/' + slot + '.png'}
      />
    </Box>
  )
}
