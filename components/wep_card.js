import * as React from 'react';
import { Grid } from '@mui/material';
import { Paper, Card, CardMedia, CardContent } from '@mui/material';
import { Typography } from '@mui/material';
import { ButtonBase } from '@mui/material';
import SlotDisplay from './slot_display';

export default function WepCard(props) {
  const { data, main=false, wep, onClick } = props;

  return (
    <Paper style={props.style}>
      <Grid container columnSpacing={1} justify="center" sx={{height: "100%"}}>
        <Grid item xs sx={{height: "100%"}}>
          <ButtonBase sx={{justifyContent: "left", textAlign: "left", height: "75%", width: "100%", border: 1, borderRadius: 1, borderColor: 'text.secondary'}}
                      onClick= {() => onClick(wep)}
          >
            <Card sx={{display: "flex", height: "100%", width: "100%"}}>
              <CardMedia  sx={{maxWidth: "20%", objectFit: "contain"}}
                component="img"
                image={"/icon/Wep/" + wep.Class + "/" + wep.Rarity + ".png"}
              />
              <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", p: 0.65}}>
                <Typography>
                  { data.weaponString[wep.Class][wep.Name] }
                </Typography>
              </CardContent>
            </Card>
          </ButtonBase>
        </Grid>
        <Grid item xs sx={{height: "100%"}}>
          { wep.Slots.map((s, i, arr) => {
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
