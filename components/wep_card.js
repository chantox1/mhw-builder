import * as React from 'react';
import { Paper, ButtonBase } from '@mui/material';
import { Grid } from '@mui/material';

export default function WepCard(props) {
  const { data, wep } = props;

  return (
    <Paper style={props.style}>
      <Grid container columnSpacing={1} justify="center" sx={{height: "100%"}}>
        <Grid item xs sx={{height: "100%"}}>
          <ButtonBase sx={{justifyContent: "left", textAlign: "left", height: "100%", width: "100%", border: 1, borderRadius: 1, borderColor: 'text.secondary'}}
                      onClick= {() => onClick(wep)}
          >

          </ButtonBase>
        </Grid>
      </Grid>
    </Paper>
  )
}