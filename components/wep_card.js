import * as React from 'react';
import { Box, Grid } from '@mui/material';
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
    }
    sharpness.push((dif / 4).toString() + '%');
    len = data.sharpness[wep.SharpId].Bar[i]
    i++;
  }
  return sharpness;
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
  <Box
    maxHeight={25}
    maxWidth={25}
    component="img"
    src={props.src}
    sx={{...props.sx, p: 0.2}}
  />
)

const sharpColors = ['#be3844', '#d3673d', '#cab232', '#6eaf1e', '#4678e6', '#e2e2e2', '#8755f0']

export default function WepCard(props) {
  const { data, main=false, wep, onClick } = props;

  return (
    <Paper style={props.style}>
      <Grid container columnSpacing={1} justify="center" sx={{height: "100%"}}>
        <Grid item xs sx={{height: "100%"}}>
          <ButtonBase sx={{justifyContent: "left", textAlign: "left", height: "100%", width: "100%", border: 1, borderRadius: 1, borderColor: 'text.secondary'}}
            onClick= {() => buttonFunction(main, onClick, wep)}
          >
            <Card sx={{display: "flex", height: "100%", width: "100%"}}>
              <Box display="flex" alignItems="center">
                <CardMedia  sx={{objectFit: "contain"}}
                  component="img"
                  image={"/icon/Wep/" + wep.Class + "/" + wep.Rarity + ".png"}
                />
              </Box>
              <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", p: 0.65}}>
                <Box>
                  <Typography noWrap>
                    { data.weaponString[wep.Class][wep.Name] }
                  </Typography>
                </Box>

                <Box display="flex">
                  <WepStat sx={{mr: 0.5}}>
                    <WepStatIcon
                      src="/icon/dmg.png"
                    />
                    <Typography mr={0.5}>
                      { wep.Damage }
                    </Typography>
                  </WepStat>

                  <WepStat sx={{mr: 0.5}}>
                    <WepStatIcon
                      src="/icon/aff.png"
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
                  })()}
                </Box>
                <Box display="flex" width={175} marginTop={1}>
                  { getSharpness(data, wep).map((s, i) => {
                    console.log("Sharp val:")
                    console.log(s)
                    return (
                      <Box width={s} backgroundColor={sharpColors[i]} paddingTop={1}/>
                    )
                  })}
                  {console.log(getSharpness(data, wep))}
                </Box>
              </CardContent>
            </Card>
          </ButtonBase>
        </Grid>
        <Grid item xs sx={{height: "100%"}}>
          { wep.Slots.map((s, i, arr) => {
            let divStyle = {justifyContent: "left", textAlign: "left", display: "flex", width: "100%", borderRadius: 1, border: 1, borderColor: 'text.disabled', p: 0.2}
            if (main) {
              divStyle.height = "25%"
            }
            else {
              divStyle.height = "32%"
            }
            if (!(i + 1 === arr.length)) {
              divStyle.mb = "0.8%"
            }
            return (
              <SlotDisplay
                data={data}
                main={main}
                slot={s}
                pos={i}
                style={divStyle}
                type={6}  // wep is always on equip slot 6
                onClick={onClick}
              />
            )
          })}
        </Grid>
      </Grid>
    </Paper>
  )
}
