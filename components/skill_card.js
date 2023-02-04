import * as React from 'react';
import { Box, Grid } from '@mui/material';
import { Paper, Card, CardMedia, CardContent } from '@mui/material';
import { Typography } from '@mui/material';
import { ButtonBase } from '@mui/material';
import SlotDisplay from './slot_display';
import Sprite from './sprite';

export default function SkillCard(props) {
  const { data, skill } = props;
  const [id, lvl] = skill;

  return (
    <Box
      display='flex'
      border={1}
      borderRadius={1}
      borderColor='text.disabled'
      padding={0.3}
      sx={props.sx}
    >
      <Sprite
        src='/icon/gems.png'
        pos={[256 + 64*data.skillColor[id].Set, 64*data.skillColor[id].Color]}
        width={27}
        crop={[64,64]}
        sx={{mr: 0.3}}
      />
      <Typography alignSelf="center">
        { data.skillString[data.skills[id].Name] + " " + lvl }
      </Typography>
    </Box>
  )
}

