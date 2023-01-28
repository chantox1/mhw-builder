import * as React from 'react';
import { Box, Paper, Grid, ButtonBase, Typography } from '@mui/material';
import { Card, CardMedia, CardContent } from '@mui/material';
import SlotDisplay from './slot_display';
import { Skeleton } from '@mui/material';

export default function ArmorCard(props) {
  const { data, main=false, charm=false, armor, onClick } = props
  const type = ["Head", "Chest", "Arms", "Waist", "Legs", "Charm"]
  const augDef = [66, 58, 52, 44, 38, 32, 26, 20, 58, 52, 44, 38]

  const [loading, setLoading] = React.useState(true);
  const [image, setImage] = React.useState({});
  const handleImageLoaded = () => {
    setLoading(false);
  };

  React.useEffect(() => {
    const image = new Image();
    image.onload = handleImageLoaded;
    image.src = "/icon/" + type[armor.Type] + "/" + armor.Rarity + ".png";
    setImage(image);
  }, [armor]);

  return (
    <Paper sx={props.sx}>
      <Grid container columnSpacing={1} height="100%">
        <Grid item xs sx={{flexGrow: 1}}>
          <ButtonBase sx={{height: "100%", width: "100%", justifyContent: "left", textAlign: "left", borderRadius: 1, border: 1, borderColor: 'text.secondary'}}
            onClick= {() => onClick(armor)}
          >
            <Card sx={{display: "flex"}}>
              <Box display="flex" alignItems="center">
                { loading ? <Skeleton variant="circular" width={64} height={64} /> :
                  <CardMedia sx={{objectFit: "contain"}}
                  component="img"
                  image={image.src}
                /> }
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
        <Grid item xs sx={{flexGrow: 1}}>
          <Box display="flex" flexDirection="column">
            { armor.Slots.map((s, i, arr) => {
              let divStyle = {justifyContent: "left", textAlign: "left", display: "flex", width: "100%", borderRadius: 1, border: 1, borderColor: 'text.disabled', p: 0.2}
              if (!(i + 1 === arr.length)) {
                divStyle.mb = "0.8%"
              }
              return (
                <SlotDisplay
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
