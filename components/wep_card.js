import * as React from 'react';
import { Avatar, Box, Grid } from '@mui/material';
import { Paper, Card, CardMedia, CardContent } from '@mui/material';
import { Typography } from '@mui/material';
import { ButtonBase } from '@mui/material';
import SlotDisplay from './slot_display';

function buttonFunction(main, onClick, val) {
  if (main) {
    onClick({Mode: 2, Wep: val})
  }
  else {
    onClick(val)
  }
}

function getSharpness(data, wep) {
  var sharpness = [];
  const delta = parseInt(wep.SharpNo) * 50;   // TODO: redump with int
  const max = 150 + delta;
  let len = 0;
  let i = 0;
  while (len < max) {
    let dif = data.sharpness[wep.SharpId].Bar[i] - len;
    if (len + dif > max) {
      dif = max - len;
      sharpness.push((dif / 4).toString() + '%');
      len = max;
      break;
    }
    sharpness.push((dif / 4).toString() + '%');
    len = data.sharpness[wep.SharpId].Bar[i]
    i++;
  }
  var extra = new Array(i);
  while (len < 400) {
    let dif = data.sharpness[wep.SharpId].Bar[i] - len;
    if (len + dif > max + 50) {
      dif = max + 50 - len;
    }
    extra.push((dif / 4).toString() + '%');
    len = data.sharpness[wep.SharpId].Bar[i];
    i++;
  }
  return [sharpness, extra];
}

function phialString(data, phialId) {
  const dmg = data.phials[phialId].PhialDmg;
  let dmgStr = dmg == 0 ? "" : " " + dmg.toString();
  return (
    data.statusString[140 + data.phials[phialId].PhialId] + dmgStr
  )
}

const Sprite = (props) => {
  const { src, pos, crop, size, p=0 } = props;
  const norm = (size[0]-2*p)/crop[0]

  return (
    <Box
      sx={{
        ...props.sx,
        width: size[0],
        height: size[1],
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

const WepStat = (props) => (
  <Box
    display="flex"
    border={1}
    borderRadius={1}
    borderColor='text.disabled'
    sx={props.sx}
  >
    { props.children }
  </Box>
)

const WepStatIcon = (props) => (
  <Box alignSelf="center"
    maxHeight={25}
    maxWidth={25}
    component="img"
    src={props.src}
    sx={{...props.sx, p: 0.2}}
  />
)

const sharpColors = ['#be3844', '#d3673d', '#cab232', '#6eaf1e', '#4678e6', '#e2e2e2', '#8755f0']

const saPhials = ['Power', 'Element', 'Dragon', 'Exhaust', 'Paralysis', 'Poison']

export default function WepCard(props) {
  const { data, main=false, wep, onClick } = props;
  const [sharpness, extra] = getSharpness(data, wep);
  let sharpBarHeight = wep.SharpNo == "5" ? 1 : 0.6

  return (
    <Paper style={props.sx}>
      <Grid container columnSpacing={1} height="100%">
        <Grid item xs flexGrow={1}>
          <ButtonBase sx={{height: "100%", width: "100%", justifyContent: "left", textAlign: "left", border: 1, borderRadius: 1, borderColor: 'text.secondary'}}
            onClick= {() => buttonFunction(main, onClick, wep)}
          >
            <Card sx={{display: "flex", height: "100%", width: "100%"}}>
              <Box display="flex" alignItems="center">
                <CardMedia  sx={{objectFit: "contain"}}
                  component="img"
                  image={"/icon/Wep/" + wep.Class + "/" + wep.Rarity + ".png"}
                />
              </Box>
              <CardContent sx={{ display: "flex", flexDirection: "column", p: 0.65}}>
                <Box>
                  <Typography noWrap>
                    { data.weaponString[wep.Class][wep.Name] }
                  </Typography>
                </Box>

                <Box display="flex">
                  <WepStat sx={{mr: 0.5}}>
                    <Sprite
                      src='/icon/weaponetc.png'
                      pos={[0,0]}
                      crop={[64,64]}
                      size={[20,20]}
                      p={0.25}
                      sx={{mr: 0.3}}
                    />
                    <Typography mr={0.5}>
                      { wep.Damage }
                    </Typography>
                  </WepStat>

                  <WepStat sx={{mr: 0.5}}>
                  <Sprite
                      src='/icon/weaponetc.png'
                      pos={[64,0]}
                      crop={[64,64]}
                      size={[20,20]}
                      p={0.25}
                      sx={{mr: 0.3}}
                    />
                    <Typography mr={0.5}>
                      { wep.Affinity }%
                    </Typography>
                  </WepStat>

                  {(() => {
                    if ('Element' in wep) {
                      return (
                        <WepStat>
                          <WepStatIcon
                            src={"/icon/Element/" + wep.Element + ".png" }
                          />
                          <Typography mr={0.5}>
                            { wep.ElementDmg }
                          </Typography>
                        </WepStat>
                      )
                    }

                    else if ('HiddenEle' in wep) {
                      return (
                        <WepStat>
                          <WepStatIcon
                            src={"/icon/Element/" + wep.HiddenEle + ".png" }
                          />
                          <Typography color='text.disabled' mr={0.5}>
                            ({ wep.HiddenEleDmg })
                          </Typography>
                        </WepStat>
                      )
                    }
                  })()}
                </Box>
                <Box display="flex" width={175} marginTop={1} marginBottom={0.5}>
                  { sharpness.map((s, i) => {
                    return (
                      <Box width={s} backgroundColor={sharpColors[i]} paddingTop={sharpBarHeight}/>
                    )
                  })}
                  { extra.map((s, i) => {
                    return (
                      <Box width={s} backgroundColor={sharpColors[i]} marginTop={0.65} paddingTop={0.35}/>
                    )
                  })}
                </Box>
                {(() => {
                  if ('Skill' in wep) {
                    return (
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          + { data.skillString[data.skills[wep.Skill].Name] }
                        </Typography>
                      </Box>
                    )
                  }
                })()}
                
              </CardContent>
            </Card>
          </ButtonBase>
        </Grid>
        <Grid item xs flexGrow={1}>
          <Box display="flex" flexDirection="column" height="100%">
            { wep.Slots.map((s, i, arr) => {
              let len = arr.length;
              let divHeight = (100 / len).toString() + "%";
              let divStyle = {height: {divHeight}, justifyContent: "left", textAlign: "left", display: "flex", width: "100%", borderRadius: 1, border: 1, borderColor: 'text.disabled', p: 0.2}
              if (!(i + 1 === len)) {
                divStyle.mb = 0.3;
              }
              return (
                <SlotDisplay
                  data={data}
                  main={main}
                  slot={s}
                  pos={i}
                  sx={divStyle}
                  type={6}  // wep is always on equip slot 6
                  onClick={onClick}
                />
              )
            })}
          </Box>
        </Grid>
        { (wep.Class == 8 || wep.Class == 9) &&
          <Grid item>
            <WepStat>
              <WepStatIcon src='/icon/phial.png'/>
              <Typography m={0.5}>
                { phialString(data, wep.WepVar1) }
              </Typography>
            </WepStat>
          </Grid>
        }
      </Grid>
    </Paper>
  )
}
