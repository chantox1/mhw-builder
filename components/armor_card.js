import * as React from 'react';
import PropTypes from 'react';
import { Box, Paper, Grid, ButtonBase, Typography } from '@mui/material';
import { Card, CardMedia, CardContent } from '@mui/material';
import { Container, Stack } from '@mui/material';
import SlotDisplay from './slot_display';
import { range } from '../src/util';

export default function ArmorCard(props) {
  const { data, main=false, charm=false, armor, onClick } = props
  const type = ["Head", "Chest", "Arms", "Waist", "Legs", "Charm"]
  const augDef = [66, 58, 52, 44, 38, 32, 26, 20, 58, 52, 44, 38]

  return (
    <Paper style={props.style}>
      <Grid container columnSpacing={1} justify="center" sx={{height: "100%"}}>
        <Grid item xs sx={{height: "100%"}}>
          <ButtonBase sx={{justifyContent: "left", textAlign: "left", height: "100%", width: "100%", borderRadius: 1, border: 1, borderColor: 'text.secondary'}}
            onClick= {() => onClick(armor)}
          >
            <Card sx={{display: "flex", height: "100%", width: "100%"}}>
              <Box display="flex" alignItems="center">
                <CardMedia  sx={{objectFit: "contain"}}
                  component="img"
                  image={"/icon/" + type[armor.Type] + "/" + armor.Rarity + ".png"}
                />
              </Box>
              <Box>
                <CardContent sx={{ height: "100%", display: "flex", flexDirection: "column", p: 0.65 }}>
                  <Box>
                    <Typography noWrap>
                      { data.armorString[armor.Name] }
                    </Typography>
                  </Box>
                  { armor.Skills.map(s => {
                    return (
                      <Typography variant="caption" color="text.secondary">
                        { data.skillString[data.skills[s[0]].Name] + " " + s[1] }
                      </Typography>
                    )
                  })}
                </CardContent>
              </Box>
            </Card>
          </ButtonBase>
        </Grid>
        { !(charm) &&
        <Grid item sm sx={{height: "100%"}}>
          { armor.Slots.map((s, i, arr) => {
            let divStyle = {height: "32%", justifyContent: "left", textAlign: "left", display: "flex", width: "100%", borderRadius: 1, border: 1, borderColor: 'text.disabled', p: 0.2}
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
                type={armor.Type}
                onClick={onClick}
              />
            )
          })}
        </Grid>}
          
        { !(charm) &&
        <Grid item display={{ xs: "none", lg: "block"}} sx={{height: "100%"}}>
          <Card sx={{display: "flex", width: "100%", height: "32%", border: 1, borderColor: 'text.disabled', mb: "1%"}}>
            <CardMedia sx={{width: "auto", objectFit: "contain", p: 0.4}}
              component="img"
              image="/icon/def.png"
            />
            <CardContent sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', p: 0, '&:last-child': { pb: 0 }}}>
              <Typography sx={{mr: 1}}>
                { armor.Stats[0] }
              </Typography>

              <Typography>
                ({ armor.Stats[0] + augDef[armor.Rarity - 1]})
              </Typography>
            </CardContent>
          </Card>

          <Box sx={{ display: "flex", height: "65%", alignItems: "center", justifyContent: 'space-between', borderRadius: 1, border: 1, borderColor: 'text.disabled'}}>
            { [1,2,4,3,5].map(i => {
              return (
                <Card sx={{height: "100%"}}>
                  <CardMedia sx={{height: "50%", objectFit: "contain"}}
                    component="img"
                    image={"/icon/Element/" + i + ".png"}
                  />
                  <CardContent sx={{ p:0, '&:last-child': { pb: 0 }}}>
                    <Typography align="center">{ armor.Stats[i] }</Typography>
                  </CardContent>
                </Card>
              )
            })}
          </Box>
        </Grid>
        }
      </Grid>
    </Paper>
  )
}
