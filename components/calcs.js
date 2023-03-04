import { TableContainer, Table, TableBody, TableRow, TableCell, Box, Typography } from "@mui/material"
import { Paper } from "@mui/material"
import Sprite from "./sprite";

const ElementIcon = (props) => (
  <Box alignSelf="center"
    maxHeight={25}
    maxWidth={25}
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
  const { stats } = props;
  return (
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
            <TableCell>Ele</TableCell>
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
            <TableCell>Affinity</TableCell>
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
  )
}