import { Box } from "@mui/material";
import { Tooltip } from "@mui/material";

const sharpColors = ['#be3844', '#d3673d', '#cab232', '#6eaf1e', '#4678e6', '#e2e2e2', '#8755f0'];
const sharpNames = ['red', 'orange', 'yellow', 'green', 'blue', 'white', 'purple'];
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

export function getSharpness(data, wep, handiLvl=0, natBonus=0) {
  var sharpness = { 'natural' : [] };
  let unitArray = data.sharpness[wep.SharpId].Bar;
  let max = Math.min(400, 150 + wep.SharpNo * 50 + natBonus);
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

function HandiSharpDisplay(props) {
  const { handicraft, height, tooltip } = props;
  const totalUnits = handicraft.reduce((a, b) => {
    return a + b;
  }, 0);
  const norm = 400/totalUnits;
  return (
    <Box display='flex' width={(totalUnits/4).toString() + '%'} sx={{outline: '2px solid cyan', zIndex: 1}}>
        {
          handicraft.map((s, i) => {
            if (tooltip) {
              return (
                <Tooltip key={i} arrow title={s.toString() + ' units of ' + sharpNames[i]}>
                  <Box width={(norm*s/4).toString() + '%'} backgroundColor={sharpColors[i]} paddingTop={height}/>
                </Tooltip>
              )
            }
            return (
              <Box key={i} width={(norm*s/4).toString() + '%'} backgroundColor={sharpColors[i]} paddingTop={height}/>
            )
          })
        }
    </Box>
  )
}

export function getSharpnessMod(sharpness) {
  return ('handicraft') in sharpness ? sharpMod[sharpness.handicraft.length - 1] :
                                       sharpMod[sharpness.natural.length - 1];
}

export function getSharpnessColor(sharpness) {
  return ('handicraft') in sharpness ? sharpColors[sharpness.handicraft.length - 1] :
                                       sharpColors[sharpness.natural.length - 1];
}

export function SharpnessDisplay(props) {
  const { sharpness, tooltip=false } = props;
  let { height } = props;
  if ('extra' in sharpness) {
    var marginTop = height * 0.65
    var paddingTop = height - marginTop;
    height = marginTop;
  }
  return (
    <Box display='flex' sx={props.sx}>
      { sharpness.natural.map((s, i) => {
        if (tooltip) {
          return (
            <Tooltip key={i} arrow title={s.toString() + ' units of ' + sharpNames[i]}>
              <Box width={(s/4).toString() + '%'} backgroundColor={sharpColors[i]} paddingTop={height}/>
            </Tooltip>
          )
        }
        return (
          <Box key={i} width={(s/4).toString() + '%'} backgroundColor={sharpColors[i]} paddingTop={height}/>
        )
      })}

      { 'handicraft' in sharpness &&
        <HandiSharpDisplay tooltip={tooltip} handicraft={sharpness.handicraft} height={height}/>
      }

      { 'extra' in sharpness &&
        sharpness.extra.map((s, i) => {
          if (tooltip) {
            return (
              <Tooltip key={i} arrow title={s.toString() + ' units of ' + sharpNames[i]}>
                <Box width={(s/4).toString() + '%'} backgroundColor={sharpColors[i]} marginTop={marginTop} paddingTop={paddingTop}/>
              </Tooltip>
            )
          }
          return (
            <Box key={i} width={(s/4).toString() + '%'} backgroundColor={sharpColors[i]} marginTop={marginTop} paddingTop={paddingTop}/>
          )
        })
      }
    </Box>
  )
}

export function SharpnessBar(props) {
  const { sharpness } = props;
  return (
    <Box flex={1} display="flex" justifyContent="center">
      <Box position="relative" height={24}>
        <Box
          component="img"
          src="/icon/sharpness.png"
          width={250}
          height={24}
        />
        <SharpnessDisplay
          tooltip
          sharpness={sharpness}
          height={1.5}
          sx={{
            width: 200,
            position: "relative",
            bottom: 24.5,
            left: 32
          }}
        />
      </Box>
    </Box>
  )
}
