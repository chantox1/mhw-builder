import * as React from 'react';
import { Box, Grid } from '@mui/material';
import { Paper, Card, CardContent } from '@mui/material';
import { Typography } from '@mui/material';
import { ButtonBase } from '@mui/material';
import SlotDisplay from './slot_display';
import Sprite from './sprite';

function buttonFunction(main, pos, onClick, val) {
  if (main) {
    onClick({Mode: 3, Pos: pos, Mantle: val})
  }
  else {
    onClick(val)
  }
}

const EmptyCard = (props) => {
  const {data, main, width, height} = props;
  return (
    <Box display="flex" sx={props.sx}>
      <Box
        width={width}
        height={height}
        component='img'
        src='/icon/mantle-empty.png'
        alignSelf="center"
      />
      <Box>
        <CardContent variant='nopad' sx={{p: 0.65}}>
          <Typography color='text.disabled' noWrap mr={0.5}>
            { data.statusString[31] }
          </Typography>
        </CardContent>
      </Box>
    </Box>
  )
}

export default function MantleCard(props) {
  const { data, main=false, mantle, pos, onClick } = props;

  return (
    <Paper sx={props.sx}>
      <Grid container spacing={0.35} height="100%">
        <Grid item xs={12} flexGrow={1}>
          <ButtonBase sx={{height: "100%", width: "100%", justifyContent: "left", textAlign: "left", border: 1, borderRadius: 1, borderColor: 'text.secondary'}}
            onClick= {() => buttonFunction(main, pos, onClick, mantle)}
          >
            <Card sx={{display: "flex", height: "100%"}}>
              { mantle == null ? 
                <EmptyCard data={data} main={main} width={52} height={52}/> :
                <Box display="flex">
                  <Sprite
                    src='/icon/mantles.png'
                    pos={[0,64*mantle.Color]}
                    width={52}
                    crop={[64,64]}
                    sx={{alignSelf: "center"}}
                  />
                  <Box>
                    <CardContent variant='nopad' sx={{p: 0.65}}>
                      <Typography noWrap mr={0.5}>
                        { data.mantleString[mantle.Name] }
                      </Typography>
                    </CardContent>
                  </Box>
                </Box>
              }
            </Card>
          </ButtonBase>
        </Grid>
        { (!(mantle == null) && (mantle.Slots.length != 0)) &&
          <Grid item xs flexGrow={1}>
            <Box display="flex" flexDirection="column" height="100%">
              { mantle.Slots.map((s, i, arr) => {
                let len = arr.length;
                let divHeight = (100 / len).toString() + "%";
                let divStyle = {height: {divHeight}, justifyContent: "left", textAlign: "left", display: "flex", width: "100%", borderRadius: 1, border: 1, borderColor: 'text.disabled', p: 0.2}
                if (!(i + 1 === len)) {
                  divStyle.mb = 0.3;
                }
                return (
                  <SlotDisplay
                    key={i}
                    data={data}
                    main={main}
                    slot={s}
                    pos={[pos, i]}
                    sx={divStyle}
                    type={7}
                    onClick={onClick}
                  />
                )})
              }
            </Box>
          </Grid>
        }
      </Grid>
    </Paper>
  )
}
