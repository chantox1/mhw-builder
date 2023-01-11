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

function pushSkill(data, skillDict, skill) {
  const [id, lv] = skill;
  if (!(id in skillDict)) {
    skillDict[id] = skill
  }
  else {
    const max = data.skills[id].Max
    if (skillDict[id][1] + lv > max) {
      skillDict[id][1] = max
    }
    else {
      skillDict[id][1] += lv
    }
  }
}

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
      data.armor[0],
      data.armor[667],
      data.armor[1284],
      data.armor[1899],
      data.armor[2508],
      data.armor[3123],
    ])

    const [mySkills, setMySkills] = React.useState([])

    React.useEffect(() => {
      let tempSkills = {}
      const e = JSON.parse(JSON.stringify(equip))  // Deep clone
      e.forEach(a => {
        if ('SetSkill' in a) {
          const s = [a.SetSkill, 1]
          pushSkill(data, tempSkills, s);
        }

        a.Skills.forEach(s => pushSkill(data, tempSkills, s));

        a.Slots.forEach(sl => {
          if (typeof(sl) != "number") {
            sl.Deco.Skills.forEach(s => pushSkill(data, tempSkills, s));
          }
        })
      });

      let newSkills = [];
      for (const key in tempSkills) {
        newSkills.push(tempSkills[key]);
      }
      setMySkills(newSkills);
    }, [equip]);

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
              {mySkills.map(s => {
                var id = s[0]
                var lv = s[1]
                return (
                  <Typography>
                    { data.skillNames[data.skills[id].Name] + " " + lv }
                  </Typography>
                )
              })}
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
                <ArmorCard main data={data} armor={equip[0]} onClick={handleClickOpen} style={{ height: "10vh", marginBottom: "0.6vh", padding:2 }}/>

                {/* Chest */}
                <ArmorCard main data={data} armor={equip[1]} onClick={handleClickOpen} style={{ height: "10vh", marginBottom: "0.6vh", padding:2 }}/>

                {/* Arms */}
                <ArmorCard main data={data} armor={equip[2]} onClick={handleClickOpen} style={{ height: "10vh", marginBottom: "0.6vh", padding:2 }}/>

                {/* Waist */}
                <ArmorCard main data={data} armor={equip[3]} onClick={handleClickOpen} style={{ height: "10vh", marginBottom: "0.6vh", padding:2 }}/>

                {/* Legs */}
                <ArmorCard main data={data} armor={equip[4]} onClick={handleClickOpen} style={{ height: "10vh", marginBottom: "0.6vh", padding:2 }}/>

                {/* Charm */}
                <ArmorCard charm data={data} armor={equip[5]} onClick={handleClickOpen} style={{ height: "11vh", padding:2 }}/>

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