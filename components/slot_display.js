import * as React from 'react';
import { Box } from '@mui/material';
import { Card, CardMedia } from '@mui/material';
import { Typography } from '@mui/material';
import { ButtonBase } from '@mui/material';

export default function SlotDisplay(props) {
  const { data, main=false, slot, pos, style, type, onClick } = props;

  if (main) {
    style.borderColor = 'text.secondary'
    if (typeof(slot) == "number") {
      return (
        <ButtonBase sx={style}
          onClick = {() => onClick({Mode: 1, Type: type, Pos: pos, Size: slot, Item: slot})}
        >
          <Card sx={{ display: "flex", height: "100%", mr: "1vh"}}>
            <CardMedia sx={{objectFit: "contain"}}
              component="img"
              image={"/icon/Slot/" + slot + ".png"}
            />
          </Card>
        </ButtonBase>
      )
    }
    else {
      return (
        <ButtonBase sx={style}
          onClick = {() => onClick({Mode: 1, Type: type, Pos: pos, Size: slot.Size, Item: slot})}
        >
          <Card sx={{ display: "flex", height: "100%", mr: "1vh"}}>
            <CardMedia sx={{objectFit: "contain"}}
              component="img"
              image={"/icon/Slot/" + slot.Size + ".png"}
            />
          </Card>
          <Typography noWrap> { data.decoString[slot.Deco.Name] } </Typography>
        </ButtonBase>
      )
    }
  }
  return (
    <Box sx={style}>
      <Card sx={{ display: "flex", height: "100%", mr: "1vh"}}>
        <CardMedia sx={{objectFit: "contain"}}
          component="img"
          image={"/icon/Slot/" + slot + ".png"}
        />
      </Card>
    </Box>
  )
}
