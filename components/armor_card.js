import * as React from 'react';
import { Box, Paper, Grid, ButtonBase, Typography } from '@mui/material';
import { Card, CardMedia, CardContent } from '@mui/material';
import SlotDisplay from './slot_display';
import { Skeleton } from '@mui/material';

export default function ArmorCard(props) {
  const { data, main=false, charm=false, armor, loading=false, onClick } = props;
  const type = ["Head", "Chest", "Arms", "Waist", "Legs", "Charm"];
  const augDef = [66, 58, 52, 44, 38, 32, 26, 20, 58, 52, 44, 38];

  return (
    <Paper sx={props.sx}>
      <Grid container columnSpacing={1} height="100%">
        <Grid item xs sx={{flexGrow: 1}}>
          <ButtonBase sx={{height: "100%", width: "100%", justifyContent: "left", textAlign: "left", borderRadius: 1, border: 1, borderColor: 'text.secondary'}}
            onClick= {() => onClick(armor)}
          >
            <Card sx={{display: "flex", height: "100%"}}>
              <Box display="flex" alignItems="center">
                { loading ? <Skeleton variant="circular" width={64} height={64} /> :
                  <Box
                    width={64}
                    height={64}
                    component="img"
                    src={"/icon/" + type[armor.Type] + "/" + armor.Rarity + ".png"}
                  /> }
              </Box>
              <Box>
                <CardContent variant='nopad' sx={{ display: "flex", flexDirection: "column", p: 0.65 }}>
                  <Box>
                    <Typography noWrap mr={0.3}>
                      { data.armorString[armor.Name] }
                    </Typography>
                  </Box>
                  { armor.Skills.length > 0 &&
                    <Box mb={0.5}>
                      { armor.Skills.map(s => {
                        return (
                          <div key={s[0]}>
                          <Typography variant="caption" color="text.secondary">
                            { data.skillString[data.skills[s[0]].Name] + " " + s[1] }
                          </Typography>
                          </div>
                        )
                      })}
                    </Box> }
                </CardContent>
              </Box>
            </Card>
          </ButtonBase>
        </Grid>
        { !(charm) &&
        <Grid item xs sx={{flexGrow: 1}}>
          <Box display="flex" flexDirection="column">
            { armor.Slots.map((s, i, arr) => {
              let divStyle = {justifyContent: "left", textAlign: "left", display: "flex", width: "100%", borderRadius: 1, border: 1, borderColor: 'text.disabled', p: 0.2}
              if (!(i + 1 === arr.length)) {
                divStyle.mb = "0.8%"
              }
              return (
                <SlotDisplay
                  key={i}
                  data={data}
                  main={main}
                  slot={s}
                  pos={i}
                  sx={divStyle}
                  type={armor.Type}
                  onClick={onClick}
                />
              )
            })}
          </Box>
        </Grid>}
          
        { !(charm) &&
        <Grid item display={{ xs: "none", lg: "block"}}>
          <Box>
            <Box display="flex" border={1} borderRadius={1} borderColor='text.disabled' mb="1%">
              <Box
                maxHeight={25}
                component="img"
                src="/icon/def.png"
              />
              <Box display="flex" alignItems="center">
                <Typography sx={{mr: 1}}>
                  { armor.Stats[0] }
                </Typography>

                <Typography>
                  ({ armor.Stats[0] + augDef[armor.Rarity - 1]})
                </Typography>
              </Box>
            </Box>

            <Box display="flex" alignItems="center" border={1} borderRadius={1} borderColor="text.disabled">
              { [1,2,4,3,5].map(i => {
                return (
                  <div key={i}>
                  <Box display="flex" flexDirection="column">
                    <Box
                      maxHeight={25}
                      component="img"
                      src={"/icon/Element/" + i + ".png"}
                      sx={{mb:0}}
                    />
                    <Typography align="center">
                      { armor.Stats[i] }
                    </Typography>
                  </Box>
                  </div>
                )
              })}
            </Box>
          </Box>
        </Grid>
        }
      </Grid>
    </Paper>
  )
}
