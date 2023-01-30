import * as React from 'react';
import { Box, Grid } from '@mui/material';
import { Paper, Card, CardMedia, CardContent } from '@mui/material';
import { Typography } from '@mui/material';
import { ButtonBase } from '@mui/material';
import SlotDisplay from './slot_display';
import Sprite from './sprite';
import { styled } from "@mui/material/styles";

const CardContentNoPad = styled(CardContent)(`
  padding: 0;
  &:last-child {
    padding-bottom: 0;
  }
`);

function buttonFunction(main, pos, onClick, val) {
  if (main) {
    onClick({Mode: 3, Pos: pos, Mantle: val})
  }
  else {
    onClick(val)
  }
}

export default function MantleCard(props) {
  const { data, main=false, mantle, onClick } = props;
  const pos = main ? props.pos : -1;

  return (
    <Paper sx={props.sx}>
      <Grid container columnSpacing={1} height="100%">
        <Grid item xs flexGrow={1}>
          <ButtonBase sx={{height: "100%", width: "100%", justifyContent: "left", textAlign: "left", border: 1, borderRadius: 1, borderColor: 'text.secondary'}}
            onClick= {() => buttonFunction(main, pos, onClick, mantle)}
          >
            <Card sx={{display: "flex", height: "100%"}}>
              { mantle == null ? <Box width={48} height={48}/> :
                <Box display="flex">
                  <Sprite
                    src='/icon/mantles.png'
                    pos={[0,64*mantle.Color]}
                    width={52}
                    crop={[64,64]}
                    sx={{alignSelf: "center"}}
                  />
                  <Box>
                    <CardContentNoPad sx={{p: 0.65}}>
                      <Typography noWrap mr={0.5}>
                        { data.mantleString[mantle.Name] }
                      </Typography>
                    </CardContentNoPad>
                  </Box>
                </Box>
              }
            </Card>
          </ButtonBase>
        </Grid>
          { (!(mantle == null) && (mantle.Slots.length != 0 || !main)) &&
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
