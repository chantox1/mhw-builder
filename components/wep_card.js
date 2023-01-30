import * as React from 'react';
import { Box, Grid } from '@mui/material';
import { Paper, Card, CardMedia, CardContent } from '@mui/material';
import { Typography } from '@mui/material';
import { ButtonBase } from '@mui/material';
import SlotDisplay from './slot_display';
import { Skeleton } from '@mui/material';
import { styled } from "@mui/material/styles";

const CardContentNoPad = styled(CardContent)(`
  padding: 0;
  &:last-child {
    padding-bottom: 0;
  }
`);

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

function shellString(data, shellId) {
  const [id,lvl] = data.shelling[shellId];
  if (id != 0) {
    var strId = (id == 1) ? 2 : 1;
  }
  else {
    var strId = id;
  }
  return (
    data.statusString[79 + strId] + " " + lvl.toString()
  );
}

function phialString(data, phialId) {
  const [id, dmg] = data.phials[phialId];
  const dmgStr = dmg == 0 ? "" : " " + dmg.toString();
  return (
    data.statusString[140 + id] + dmgStr
  );
}

function kinsectString(data, bonusId) {
  let offset = 149;
  if (bonusId > 5) {
    offset = 238;
  }
  return (
    data.statusString[offset + bonusId]
  );
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

export default function WepCard(props) {
  const { data, main=false, wep, onClick } = props;

  const [loading, setLoading] = React.useState(true);
  const [image, setImage] = React.useState({});
  const handleImageLoaded = () => {
    setLoading(false);
  };

  React.useEffect(() => {
    const image = new Image();
    image.onload = handleImageLoaded;
    image.src = "/icon/Wep/" + wep.Class + "/" + wep.Rarity + ".png";
    setImage(image);
  }, [wep]);

  const [sharpness, extra] = getSharpness(data, wep);
  let sharpBarHeight = wep.SharpNo == "5" ? 1 : 0.6

  return (
    <Paper sx={props.sx}>
      <Grid container columnSpacing={1} height="100%">
        <Grid item xs flexGrow={1}>
          <ButtonBase sx={{height: "100%", width: "100%", justifyContent: "left", textAlign: "left", border: 1, borderRadius: 1, borderColor: 'text.secondary'}}
            onClick= {() => buttonFunction(main, onClick, wep)}
          >
            <Card sx={{display: "flex", height: "100%"}}>
              <Box display="flex" alignItems="center">
                { loading ? <Skeleton variant="circular" width={64} height={64} /> :
                  <CardMedia sx={{objectFit: "contain"}}
                    component="img"
                    image={image.src}
                  /> }
              </Box>
              <Box>
                <CardContentNoPad height="100%" sx={{ display: "flex", flexDirection: "column", p: 0.65 }}>
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
                      if (wep.Class == 2 && wep.WepVar1 != 0) {
                        const entry = data.dualEle[wep.WepVar1]
                        return (
                          <WepStat>
                            <WepStatIcon
                              src={"/icon/Element/" + entry.Element1 + ".png" }
                            />
                            <Typography mr={0.5}>
                              { entry.Element1Dmg }
                            </Typography>
                            <WepStatIcon
                              src={"/icon/Element/" + entry.Element2 + ".png" }
                            />
                            <Typography mr={0.5}>
                              { entry.Element2Dmg }
                            </Typography>
                          </WepStat>
                        )
                      }
                      else if ('Element' in wep) {
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

                    { (wep.Class == 5) &&
                      <WepStat sx={{ml: 0.5}}>
                        { data.notes[wep.WepVar1].map((id, i) => (
                          <WepStatIcon key={i} src={'/icon/Notes/' + i + '-' + id + '.png'}/>
                        ))}
                      </WepStat>
                    }
                    { (wep.Class == 7) &&
                      <WepStat sx={{ml: 0.5}}>
                        <WepStatIcon src='/icon/shell.png'/>
                        <Typography sx={{mr: 0.5}}>
                          { shellString(data, wep.WepVar1) }
                        </Typography>
                      </WepStat>
                    }
                  </Box>
                  <Box display="flex" width={175} marginTop={1} marginBottom={0.5}>
                    { sharpness.map((s, i) => {
                      return (
                        <Box key={i} width={s} backgroundColor={sharpColors[i]} paddingTop={sharpBarHeight}/>
                      )
                    })}
                    { extra.map((s, i) => {
                      return (
                        <Box key={i} width={s} backgroundColor={sharpColors[i]} marginTop={0.65} paddingTop={0.35}/>
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
                  
                </CardContentNoPad>
              </Box>
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
                  key={i}
                  data={data}
                  main={main}
                  slot={s}
                  pos={i}
                  sx={divStyle}
                  type={6}
                  onClick={onClick}
                />
              )
            })}
          </Box>
        </Grid>
        { (wep.Class == 8 || wep.Class == 9) &&
          <Grid item xl={3}>
            <WepStat>
              <WepStatIcon src='/icon/phial.png'/>
              <Typography m={0.5}>
                { phialString(data, wep.WepVar1) }
              </Typography>
            </WepStat>
          </Grid>
        }
        { (wep.Class == 10) &&
          <Grid item xl={3}>
            <WepStat>
              <WepStatIcon src='/icon/kinsect.png'/>
              <Typography m={0.5}>
                { kinsectString(data, wep.WepVar1) }
              </Typography>
            </WepStat>
          </Grid>
        }
      </Grid>
    </Paper>
  )
}
