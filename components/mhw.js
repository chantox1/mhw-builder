import * as React from 'react';
import PropTypes from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import ModeIcon from '@mui/icons-material/Mode';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid';
import update from 'immutability-helper';
import ArmorCard from './armor_card';
import SimpleDialog from './search_equip';


export default function Builder(data) {
    const [open, setOpen] = React.useState(false);
    
    const [equipItem, setEquipItem] = React.useState()

    const handleClickOpen = (value) => {
      setEquipItem(value);
      setOpen(true);
    };

    const handleClose = (value) => {
      setOpen(false);

      if (equipItem.Mode == 1) {
        setEquip(update(equip, {
          [equipItem.Type]: {Slots: {[equipItem.Pos]: {$set: value}}}
        }))
      }
      else {
        setEquip(update(equip, {
          [value.Type]: {$set: value}
        }))
      }
    };

    const [equip, setEquip] = React.useState([
      data.armor.armors[0],
      data.armor.armors[667],
      data.armor.armors[1284],
      data.armor.armors[1899],
      data.armor.armors[2508],
      data.armor.armors[3123],
    ])

    var mySkills = []

    return (
      <div>
      

      <Box
        sx={{
          mb: 1,
          backgroundColor: 'primary.main',
        }}
      >
        <Toolbar>
          <ModeIcon sx={{ mr: 2 }}/>
          <Typography variant="h4"> New Set (placeholder) </Typography>
        </Toolbar>
      </Box>

      <Grid container wrap="wrap-reverse" spacing={1}>
        <Grid item xs={12} sm={2.5}>
            <Paper style={{height: "82vh", overflow: 'auto'}}>
              {/* List skills */}
            </Paper>
        </Grid>

        <Grid item xs={12} sm={9.5}>
            <Paper style={{height: "5vh", marginBottom: "0.5vh"}}>
              {/* Active effect icons */}
            </Paper>

            <Paper style={{height: "12vh", marginBottom: "0.5vh"}}>
              {/* Weapon */}
            </Paper>

            <Grid container spacing={1}>
              <Grid item xs={12} md={8}>
                {/* Head */}
                <ArmorCard main armor={equip[0]} onClick={handleClickOpen} style={{ height: "10vh", marginBottom: "0.6vh", padding:2 }}/>

                {/* Chest */}
                <ArmorCard main armor={equip[1]} onClick={handleClickOpen} style={{ height: "10vh", marginBottom: "0.6vh", padding:2 }}/>

                {/* Arms */}
                <ArmorCard main armor={equip[2]} onClick={handleClickOpen} style={{ height: "10vh", marginBottom: "0.6vh", padding:2 }}/>

                {/* Waist */}
                <ArmorCard main armor={equip[3]} onClick={handleClickOpen} style={{ height: "10vh", marginBottom: "0.6vh", padding:2 }}/>

                {/* Legs */}
                <ArmorCard main armor={equip[4]} onClick={handleClickOpen} style={{ height: "10vh", marginBottom: "0.6vh", padding:2 }}/>

                {/* Charm */}
                <ArmorCard charm armor={equip[5]} onClick={handleClickOpen} style={{ height: "11vh", padding:2 }}/>

                {open &&
                <SimpleDialog
                  data={data}
                  equipItem={equipItem}
                  open={open}
                  onClose={handleClose}
                />}
              </Grid>

              <Grid item xs={12} md={4}>
                <Paper style={{height: "64vh", padding: "1vh"}}>
                  {/* Calcs */}
                </Paper>
              </Grid>
            </Grid>
        </Grid>
      </Grid>
      </div>
    );
}