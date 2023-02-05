import * as React from 'react';
import { Box, Grid } from '@mui/material';
import { Paper, Card, CardMedia, CardContent } from '@mui/material';
import { Typography } from '@mui/material';
import { ButtonBase } from '@mui/material';
import SlotDisplay from './slot_display';
import Sprite from './sprite';
import { Toolbar } from '@mui/material'
import Image from 'next/image'

function lvlIcon(mode) {
  var sx = {};
  switch (mode) {
    case 0:
      var src = '/icon/Skill/skillfilled.bmp';
      break;
    case 1:
      var src = '/icon/Skill/skillempty.bmp';
      break;
    case 2:
      var src = '/icon/Skill/secretfilled.bmp';
      sx.width = 10;
      sx.height= 10;
      break;
    default:
      var src= '/icon/Skill/secretempty.bmp';
      sx.width = 10;
      sx.height= 10;
  }
  return (
    <Box
      component="img"
      src={src}
      sx={{...sx, position: 'relative', right: 86}}
    />
  )
}

export default function SkillCard(props) {
  const { data, skill } = props;
  const [id, lvl, secret] = skill;
  const s = data.skills[id];
  console.log(s)

  const skillsFilled = [];
  var lvlTextStyle = {}
  var i=0;
  if (secret) {
    var full = (lvl < s.Max) ? lvl : s.Max;
    for (i; i < full; i++) {
      skillsFilled.push(0);
    }
    for (i; i < s.Max; i++) {
      skillsFilled.push(1);
    }
    for (i; i < lvl; i++) {
      skillsFilled.push(2);
    }
    for (i; i < s.MaxSecret; i++) {
      skillsFilled.push(3);
    }

    if (lvl == s.MaxSecret) {
      lvlTextStyle.color = "orange"
    }
  }
  else {
    for (i; i < lvl; i++) {
      skillsFilled.push(0);
    }
    for (i; i < s.Max; i++) {
      skillsFilled.push(1);
    }

    if (lvl == s.Max) {
      lvlTextStyle.color = "orange"
    }
  }

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
        sx={{alignSelf: "center", mr: 0.5}}
      />
      <Box flex={1}>
        <Typography>
          { data.skillString[data.skills[id].Name] }
        </Typography>
        <Box width="100%" display="flex" justifyContent="space-between">
          <Box alignSelf="center" display="flex" mb={0.3} width={95} height={10}>
            <Box
              component="img"
              src='/icon/Skill/skillbar.bmp'
            />
            {skillsFilled.map(m => {
              return (
                lvlIcon(m)
              )
            })}
          </Box>
          <Typography variant="body2" sx={lvlTextStyle}>
            {"Level " + lvl}
          </Typography>
        </Box>
      </Box>
      
    </Box>
  )
}

