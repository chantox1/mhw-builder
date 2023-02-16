import * as React from 'react';
import { Box } from '@mui/material';
import { Typography } from '@mui/material';
import Sprite from './sprite';

function LvlIcon(props) {
  const [x,y] = props.pos;
  return (
    <Sprite
      src='/icon/Skill/skill-pips.png'
      pos={[19*x,18*y]}
      width={12}
      crop={[19,18]}
      sx={{alignSelf: "center", position: "relative", right: 92}}
    />
  )
}

export default function SkillCard(props) {
  const { data, skill } = props;
  const [id, lvl, secret, max] = skill;
  const s = data.skills[id];

  const skillsFilled = [];
  var lvlTextStyle = {mr: 0.3}
  var i=0;
  if (secret) {
    var full = (lvl < s.Max) ? lvl : s.Max;
    for (i; i < full; i++) {
      skillsFilled.push([1,0]);
    }
    for (i; i < s.Max; i++) {
      skillsFilled.push([0,0]);
    }
    if (lvl == s.MaxSecret){
      lvlTextStyle.color = "orange";
      for (i; i < lvl - 1; i++) {
        skillsFilled.push([1,1]);
      }
      skillsFilled.push([3,1])
    }
    else {
      for (i; i < lvl; i++) {
        skillsFilled.push([1,1]);
      }
      for (i; i < s.MaxSecret; i++) {
        skillsFilled.push([0,1]);
      }
    }
  }
  else {
    if (lvl == s.Max) {
      lvlTextStyle.color = "orange";
      for(i; i < lvl - 1; i++) {
        skillsFilled.push([1,0])
      }
      skillsFilled.push([3,0])
    }
    else {
      for (i; i < lvl; i++) {
        skillsFilled.push([1,0]);
      }
      for (i; i < s.Max; i++) {
        skillsFilled.push([0,0]);
      }
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
        width={32}
        crop={[64,64]}
        sx={{alignSelf: "center", mr: 0.5}}
      />
      <Box flex={1}>
        <Typography>
          { data.skillString[data.skills[id].Name] }
        </Typography>
        <Box width="100%" display="flex" justifyContent="space-between">
          <Box alignSelf="center" display="flex" mb={0.3} width={95} height={10}>
            <Sprite
              src='/icon/Skill/skill-base.png'
              pos={[0,16*(max ? 1 : 0)]}
              width={100}
              crop={[200,16]}
              sx={{alignSelf: "center"}}
            />
            {skillsFilled.map((pos, i) => {
              return (
                <Box key={i}>
                  <LvlIcon pos={pos}/>
                </Box>
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

