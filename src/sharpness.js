import { Box } from "@mui/material";

const sharpColors = ['#be3844', '#d3673d', '#cab232', '#6eaf1e', '#4678e6', '#e2e2e2', '#8755f0'];
const sharpMod = [[0.5, 0.25], [0.75, 0.5], [1.0, 0.75], [1.05, 1.0], [1.2, 1.0625], [1.32, 1.15], [1.39, 1.25]];

function pushSharpness(sharpness, unitArray, max, unitNo=0, colorIndex=0) {
  while (unitNo < max) {
    let dif = unitArray[colorIndex] - unitNo;
    if (unitNo + dif > max) {
      dif = max - unitNo;
    }
    else {
      colorIndex++;
    }
    sharpness.push(dif);
    unitNo += dif;
  }
  return [unitNo, colorIndex];
}

export function getSharpness(data, wep, handiLvl=0) {
  var sharpness = { 'natural' : [] };
  let unitArray = data.sharpness[wep.SharpId].Bar;
  let max = 150 + parseInt(wep.SharpNo) * 50;
  let [unitNo, colorIndex] = pushSharpness(sharpness.natural, unitArray, max);
  
  const handiUnits = Math.min(400, max + handiLvl * 10) - max;
  if (handiUnits) {
    sharpness.handicraft = new Array(colorIndex);
    max += handiUnits;
    [unitNo, colorIndex] = pushSharpness(sharpness.handicraft, unitArray, max, unitNo, colorIndex);
  }

  const extraUnits = Math.min(400, max + (50 - handiUnits)) - max;
  if (extraUnits) {
    sharpness.extra = new Array(colorIndex);
    max += extraUnits;
    pushSharpness(sharpness.extra, unitArray, max, unitNo, colorIndex);
  }

  return sharpness;
}

export function getSharpnessMod(sharpness) {
  return ('handicraft') in sharpness ? sharpMod[sharpness.handicraft.length - 1] :
                                       sharpMod[sharpness.natural.length - 1];
}

export function SharpnessDisplay(props) {
  const { sharpness } = props;
  let { height } = props;
  if ('extra' in sharpness) {
    var marginTop = height * 0.65
    var paddingTop = height - marginTop;
    height = marginTop;
  }
  return (
    <Box display='flex' sx={props.sx}>
      { sharpness.natural.map((s, i) => {
        return (
          <Box key={i} width={(s/4).toString() + '%'} backgroundColor={sharpColors[i]} paddingTop={height}/>
        )
      })}

      { 'handicraft' in sharpness &&
        sharpness.handicraft.map((s, i) => {
          return (
            <Box key={i} width={(s/4).toString() + '%'} backgroundColor={sharpColors[i]} paddingTop={height}/>
          )
        })
      }

      { 'extra' in sharpness &&
        sharpness.extra.map((s, i) => {
          return (
            <Box key={i} width={(s/4).toString() + '%'} backgroundColor={sharpColors[i]} marginTop={marginTop} paddingTop={paddingTop}/>
          )
        })
      }
    </Box>
  )
}
