import { TableContainer, Table, TableBody, TableRow, TableCell, Box, Typography, Accordion, AccordionSummary, AccordionDetails} from "@mui/material"
import { styled } from "@mui/material";
import { SharpnessBar, getSharpnessColor } from "../src/sharpness";
import { Paper } from "@mui/material"
import Header from "./header";
import Sprite from "./sprite";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function getReduction(defense) {
  return defense / (defense + 80);
}

function TableHeader(props) {
  const { title, rounded=false } = props;
  let style = {...props.sx};
  if (rounded) {
    style.borderTopLeftRadius = 4;
    style.borderTopRightRadius = 4;
  }
  return (
    <Paper elevation={0} square sx={style}>
      <Box flex={1} display="flex" justifyContent="center">
        <Typography variant="h6">{ title }</Typography>
      </Box>
    </Paper>
  )
}

const eleMap = {
  1: 0,
  2: 1,
  3: 3,
  4: 2,
  5: 4
};

const ElementIcon = (props) => (
  <Box alignSelf="center"
    maxHeight={20}
    maxWidth={20}
    component="img"
    src={props.src}
    sx={{...props.sx, p: 0.2}}
  />
)

function ElementDamage(props) {
  const { element, damage } = props;

  if (element) {
    return (
      <Box
        display="flex"
        alignItems='center'
      >
        { damage }
        <ElementIcon src={'/icon/Element/' + element + '.png'}/>
      </Box>
    )
  }
  return (
    <Box display="flex">
      None
    </Box>
  )
}

export function Calcs(props) {
  const { data, stats } = props;
  return (
    <Box>
      <Accordion defaultExpanded disableGutters>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon/>}
        >
          <Typography variant="h6">
            {data.statusString[24]}
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{padding: 0}}>
          <TableContainer component={Paper} sx={{width: "100%"}}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Raw</TableCell>
                  <TableCell>{stats.Attack}</TableCell>
                  <TableCell>Effective Raw</TableCell>
                  <TableCell>{Math.round(stats.EffRaw * 100)/100}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{data.statusString[29]}</TableCell>
                  <TableCell>
                    <ElementDamage element={stats.Element} damage={stats.EleDmg}/>
                  </TableCell>
                  <TableCell>Effective Ele</TableCell>
                  <TableCell>
                    <ElementDamage
                      element={stats.Element}
                      damage={Math.round(stats.EffEle * 100)/100}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{data.statusString[65]}</TableCell>
                  {(() => {
                    if (stats.RawAffinity <= 100) {
                      return (
                        <TableCell>
                          { stats.Affinity }%
                        </TableCell>
                      )
                    }
                    else {
                      return (
                        <TableCell>
                          <span style={{color: 'orange'}}>{ stats.Affinity }% </span>
                          <span>({ stats.RawAffinity }%)</span>
                        </TableCell>
                      )
                    }
                  })()}
                  <TableCell>Crit Damage</TableCell>
                  <TableCell>{stats.CritDmg / 100}x</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>
      { 'Sharpness' in stats && 
        <Accordion defaultExpanded disableGutters>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon/>}
          >
            <Typography variant="h6">
              {data.statusString[64]}
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{padding: 0}}>
            <SharpnessBar sharpness={stats.Sharpness}/>
            <TableContainer>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Raw Mod</TableCell>
                    <TableCell>
                      <span style={{color: getSharpnessColor(stats.Sharpness)}}>
                        {stats.SharpMod[0]}
                      </span>
                    </TableCell>
                    <TableCell>Ele Mod</TableCell>
                    <TableCell>
                      <span style={{color: getSharpnessColor(stats.Sharpness)}}>
                        {stats.SharpMod[1]}
                      </span>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      }
      <Accordion disableGutters>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon/>}
        >
          <Typography variant='h6'>
            { data.statusString[25] }
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{padding: 0}}>
          <TableContainer>
            <Table size='small'>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Box display='flex'>
                      <Sprite
                        src='/icon/status.png'
                        pos={[128,192]}
                        width={20}
                        crop={[64,64]}
                      />
                      <Typography variant='body2' align='center'>
                        { data.statusString[25] }
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align='center'>
                    { stats.Defense } ({ stats.AugDefense })
                  </TableCell>
                </TableRow>
                {[1,2,4,3,5].map(i => {
                  return (
                    <TableRow key={i}>
                      <TableCell>
                        <Box display='flex'>
                          <Sprite
                            src='/icon/status.png'
                            pos={[3*64 + eleMap[i]*64,0]}
                            width={20}
                            crop={[64,64]}
                          />
                          <Typography variant='body2' align='center'>
                            { data.statusString[43 + eleMap[i]] }
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align='center'>
                        { stats.EleRes[i - 1] }
                      </TableCell>
                    </TableRow>
                  )
                })}
                <TableRow>
                  <TableCell>
                    <Box display='flex'>
                      <Sprite
                        src='/icon/status.png'
                        pos={[0,576]}
                        width={20}
                        crop={[64,64]}
                      />
                      <Typography variant='body2' align='center'>
                        { data.statusString[22] }
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align='center'>
                    { stats.Health }
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Box display='flex'>
                      <Sprite
                        src='/icon/status.png'
                        pos={[0,576]}
                        width={20}
                        crop={[64,64]}
                      />
                      <Typography variant='body2' align='center'>
                        Effective Health
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align='center'>
                    { Math.round(stats.EffHealth[0]) } ({ Math.round(stats.EffHealth[1]) })
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>
    </Box>
  )
}
