import * as React from 'react';
import { Box, ButtonBase, Grid } from '@mui/material';
import { Paper, Toolbar } from '@mui/material';
import { IconButton } from '@mui/material';
import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { TableContainer, Table, TableBody, TableCell, TableRow } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import ModeIcon from '@mui/icons-material/Mode';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import update from 'immutability-helper';
import ArmorCard from './armor_card';
import WepCard from './wep_card';
import MantleCard from './mantle_card';
import SkillCard from './skill_card';
import SearchDialog from './search_equip';
import ToggleDialog from './effect_toggle';
import { useScreenshot, createFileName } from 'use-react-screenshot';
import { getSharpness, getSharpnessMod } from '../src/sharpness';
import Sprite from './sprite';
import SharpnessBar from './sharpness_bar';

function pushSkill(skillDict, skill) {
  const [id, lvl] = skill;
  if (!(id in skillDict)) {
    skillDict[id] = skill
  }
  else {
    skillDict[id][1] += lvl
  }
}

function applySkillLvlMax(data, skillDict) {
  for (const key in skillDict) {
    let [id, lvl] = skillDict[key];
    const s = data.skills[id];

    let secret = false;
    if ('Unlock' in s) {
      for (const i in s.Unlock) {
        const [u_id, u_lvl] = s.Unlock[i];
        if (u_id in skillDict) {
          if (skillDict[u_id][1] >= u_lvl) {
            secret = true;
            break;
          }
        }
      }
    }
    skillDict[key][2] = secret;

    let max = secret ? s.MaxSecret : s.Max;
    if (lvl >= max) {
      skillDict[key][1] = max;
      skillDict[key][3] = true;
    }
    else {
      skillDict[key][3] = false;
    }
  }
}

function isToggled(bonus, tglMap){
  return (!('tglId' in bonus) || tglMap[bonus.tglId]);
}

function meetsCond(bonus, val) {
  return (!('cond' in bonus) || bonus.cond(val));
}

function skillSorter(data) {
  // Returns: 0 or 1
  function isSet(skill_id) {
    return data.skillColor[skill_id].Set;
  }

  // Returns: -1, 0, 1
  return function(a, b) {
    const [id_a, lvl_a] = a;
    const [id_b, lvl_b] = b;
    const sortBySet = isSet(id_b) - isSet(id_a);
    return sortBySet ? sortBySet : lvl_b - lvl_a;
  }
}

export default function Builder(data) {
  const screenshotRef = React.useRef(null);
  const [image, takeScreenShot] = useScreenshot({scale: 2});

  const download = (image, { name = "img", extension = "png" } = {}) => {
    const a = document.createElement("a");
    a.href = image;
    a.download = createFileName(extension, name);
    a.click();
  };

  const getImage = () => {
    takeScreenShot(screenshotRef.current)
    .then((img) => download(img, {name: "New set"}))
  };

  const [openSearch, setOpenSearch] = React.useState(false);
  const [equipItem, setEquipItem] = React.useState()
  const [searchClass, setSearchClass] = React.useState(0);

  // Opens the dialog according to an equipped item 'value'
  // if value is a weapon, default to searching for the same class
  const handleClickOpen = (value) => {
    if (value.Mode == 2) {
      setSearchClass(value.Wep.Class);
    }
    setEquipItem(value);
    setOpenSearch(true);
  };

  const [equip, setEquip] = React.useState({
    "Armor": {
      "0": data.armor[0],     // Head
      "1": data.armor[667],   // Chest
      "2": data.armor[1284],  // Arms
      "3": data.armor[1899],  // Waist
      "4": data.armor[2508],  // Legs
      "5": data.armor[3123]   // Charm
    },
    "Weapon": {...data.weapons[0][10], 'Class': 0},
    "Mantle": {
      "0": null,
      "1": null,
    }
  });

  const handleClose = (value) => {
    setOpenSearch(false);

    // Set slot
    if (equipItem.Mode == 1) {
      if (equipItem.Type <= 5) {
        setEquip(update(equip, {
          Armor: {
            [equipItem.Type]: {
              Slots: {
                [equipItem.Pos]: {
                  $set: value
                }
              }
            }
          }
        }))
      }
      else if (equipItem.Type == 6) {
        setEquip(update(equip, {
          Weapon: {
            Slots: {
              [equipItem.Pos]: {
                $set: value
              }
            }
          }
        }))
      }
      else if (equipItem.Type == 7) {
        setEquip(update(equip, {
          Mantle: {
            [equipItem.Pos[0]]: {
              Slots: {
                [equipItem.Pos[1]]: {
                  $set: value
                }
              }
            }
          }
        }))
      }
    }
    // Set weapon
    else if (equipItem.Mode == 2) {
      setEquip(update(equip, {
        Weapon: {$set: value}
      }))
    }
    // Set mantle
    else if (equipItem.Mode == 3) {
      setEquip(update(equip, {
        Mantle: {
          [equipItem.Pos]: {
            $set: value
          }
        }
      }))
    }
    // Set armor
    else {
      setEquip(update(equip, {
        Armor: {
          [value.Type]: {$set: value}
        }
      }))
    }
  };

  const [mySkills, setMySkills] = React.useState({});
  const [tglMap, setToggleMap] = React.useState(data.toggleMap);  // TODO: toggleList should contain the default toggle of ALL effects
  const [openTglDialog, setOpenTglDialog] = React.useState(false);

  React.useEffect(() => {
    var tempSkills = {}
    let e = JSON.parse(JSON.stringify(equip))  // Deep clone
    Object.values(e.Armor).forEach(a => {
      if ('SetSkill' in a) {
        const s = [a.SetSkill, 1];
        pushSkill(tempSkills, s);
      }

      if ('Skills' in a) {
        a.Skills.forEach(s => pushSkill(tempSkills, s));
      }

      a.Slots.forEach(sl => {
        if (typeof(sl) != "number") {
          sl.Deco.Skills.forEach(s => pushSkill(tempSkills, s));
        }
      })
    });

    let w = e.Weapon;
    if ('Skill' in w) {
      const s = [w.Skill, 1];
      pushSkill(tempSkills, s);
    }
    w.Slots.forEach(sl => {
      if (typeof(sl) != "number") {
        sl.Deco.Skills.forEach(s => pushSkill(tempSkills, s));
      }
    });

    applySkillLvlMax(data, tempSkills);
    setMySkills(tempSkills);
  }, [equip]);

  const [myStats, setMyStats] = React.useState({});

  React.useEffect(() => {
    const classNo = 50;  // TODO: Set proper size
    let bonusBucket = Array.from(Array(classNo), () => new Array());
    data.skillDefault.forEach(s => {
      if (isToggled(s, tglMap)) {
        bonusBucket[s.effect.class].push([-1, s]);
      }
    })

    let e = JSON.parse(JSON.stringify(mySkills));
    for (const key in e) {
      if (key in data.skillBonus) {
        const bonuses = data.skillBonus[key];
        bonuses.forEach(s => {
          if (isToggled(s, tglMap)) {
            bonusBucket[s.effect.class].push([key, s])
          }
        })
      }
    }
    console.log(bonusBucket);

    let calcs = {
      "Attack": equip.Weapon.Damage,
      "Affinity": equip.Weapon.Affinity,
      "CritDmg": 125,
    }

    if ('Element' in equip.Weapon) {
      calcs.Element = equip.Weapon.Element;
      calcs.EleDmg = equip.Weapon.ElementDmg;
    }
    else if ('HiddenEle' in equip.Weapon && 47 in mySkills) {
      calcs.Element = equip.Weapon.Element;
      const [_, lvl] = mySkills[47];
      calcs.EleDmg = equip.Weapon.HiddenEleDmg * (lvl/3);
    }
    else {
      calcs.Element = 0;
      calcs.EleDmg = 0;
    }

    let rawCap = calcs.Attack * data.attackCap;
    if (211 in mySkills && mySkills[211][1] >= 3) {
      // TODO: Apply bowgun caps
      if (calcs.Element >= 6) {
        if (mySkills[211][1] == 5) {
          var eleDmgCap = calcs.EleDmg * 2;
        }
        else {
          var eleDmgCap = calcs.EleDmg * 1.7;
        }
      }
      else {
        if (mySkills[211][1] == 5) {
          var eleDmgCap = calcs.EleDmg * 2.55;
        }
        else {
          var eleDmgCap = calcs.EleDmg * 2.2;
        }
      }
    }
    else {
      var eleDmgCap = Math.max(calcs.EleDmg * data.elementCap[0],
                               calcs.EleDmg + data.elementCap[1]);
    }

    if (54 in mySkills) {
      calcs.Handicraft = mySkills[54][1];
    }
    else {
      calcs.Handicraft = 0;
    }
    calcs.Sharpness = getSharpness(data, equip.Weapon, calcs.Handicraft);
    calcs.SharpMod = getSharpnessMod(calcs.Sharpness);

    for (var i=0; i < classNo; i++) {
      var sum = 0;
      var mult = 1;
      const bonusPackage = bonusBucket[i];
      switch(i) {
        case 12:
          bonusPackage.forEach(s => {
            const [id, bonus] = s;
            if (meetsCond(bonus, calcs.EleDmg)) {
              if ('param' in bonus.effect) {
                const lvl = mySkills[id][1];
                mult *= (data.skills[id].Params[lvl - 1][bonus.effect.param]/100);
              }
              else if ('value' in bonus.effect) {
                mult *= (bonus.effect.value/100);
              }
            }
          })
          calcs.Attack *= mult;
          break;
        case 13:
          bonusPackage.forEach(s => {
            const [id, bonus] = s;
            if ('param' in bonus.effect) {
              const lvl = mySkills[id][1];
              sum += data.skills[id].Params[lvl - 1][bonus.effect.param];
            }
            else if ('value' in bonus.effect) {
              sum += bonus.effect.value;
            }
          })
          calcs.Attack += sum;
          if (calcs.Attack > rawCap) {
            calcs.Attack = rawCap;
          }
          break;
        case 14:
          // TODO: Post-cap attack mult
          calcs.Attack *= mult;
          calcs.Attack = Math.round(calcs.Attack);
          break;
        case 15:
          bonusPackage.forEach(s => {
            const [id, bonus] = s;
            if ('param' in bonus.effect) {
              const lvl = mySkills[id][1];
              sum += data.skills[id].Params[lvl - 1][bonus.effect.param];
            }
            else if ('cusParam' in bonus.effect) {
              const lvl = mySkills[id][1];
              sum += bonus.effect.cusParam[lvl - 1];
            }
            else if ('value' in bonus.effect) {
              sum += bonus.effect.value;
            }
          })
          calcs.Affinity += sum;
          break;
        case 16:
          bonusPackage.forEach(s => {
            const [id, bonus] = s;
            const lvl = mySkills[id][1];
            calcs.CritDmg = data.skills[id].Params[lvl - 1][bonus.effect.param];
          })
        case 17:
          bonusPackage.forEach(s => {
            const [id, bonus] = s;
            if (meetsCond(bonus, calcs.Element)) {
              const lvl = mySkills[id][1];
              mult *= (data.skills[id].Params[lvl - 1][bonus.effect.param]/100);
            }
          })
          calcs.EleDmg *= mult;
          break;
        case 18:
          bonusPackage.forEach(s => {
            const [id, bonus] = s;
            if (meetsCond(bonus, calcs.Element)) {
              if ('param' in bonus.effect) {
                const lvl = mySkills[id][1];
                sum += data.skills[id].Params[lvl - 1][bonus.effect.param];
              }
              else if ('cusParam' in bonus.effect) {
                const lvl = mySkills[id][1];
                sum += bonus.effect.cusParam[lvl - 1];
              }
              else if ('value' in bonus.effect) {
                sum += bonus.effect.value;
              }
            }
          })
          calcs.EleDmg += sum;
          break;
        case 19:
          // TODO: pre-cap ele mult
          calcs.EleDmg *= mult;
          if (calcs.EleDmg > eleDmgCap) {
            calcs.EleDmg = eleDmgCap;
          }
          break;
        case 20:
          // TODO: post-cap ele mult
          calcs.EleDmg *= mult;
          calcs.EleDmg = Math.round(calcs.EleDmg);
          break;
      }
    }
    calcs.RawAffinity = calcs.Affinity;
    calcs.Affinity = Math.min(100, calcs.RawAffinity);
    calcs.EffRaw = calcs.Attack * (1 + (calcs.Affinity/100)*(calcs.CritDmg/100 - 1)) * calcs.SharpMod[0];
    calcs.EffEle = calcs.EleDmg * calcs.SharpMod[1];

    setMyStats(calcs);
  }, [mySkills, tglMap])

  const theme = useTheme();
  const breakPoint = theme.breakpoints.values[
    [...theme.breakpoints.keys].reverse().reduce((output, key) => {
      const matches = useMediaQuery(theme.breakpoints.only(key));

      return !output && matches ? key : output;
    }, null) || 'xs'
  ]
  // Hacky fix for flex & minHeight
  var equipBlockStyle = (breakPoint < theme.breakpoints.values.lg) ? {} : {height: "1px", minHeight: `calc(83vh - 50px)`};
  var mantleWrap = (breakPoint > theme.breakpoints.values.lg) ? "nowrap" : "wrap";

  return (
    <Box>
    {openSearch &&
      <SearchDialog
        data={data}
        open={openSearch}
        equipItem={equipItem}
        searchClass={searchClass}
        setSearchClass={setSearchClass}
        onClose={handleClose}
      />}

    {openTglDialog &&
      <ToggleDialog
        data={data}
        toggleMap={tglMap}
        setToggleMap={setToggleMap}
        open={openTglDialog}
        onClose={() => setOpenTglDialog(false)}
      />}

    <Box
      sx={{
        mb: 1,
        backgroundColor: 'primary.main',
      }}
    >
      <Toolbar>
        <ModeIcon sx={{ mr: 2 }}/>
        <Typography variant="h5" flex={1}> New Set (placeholder) </Typography>
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={getImage}>
          <PhotoCameraIcon />
        </IconButton>
      </Toolbar>
    </Box>

    <Grid ref={screenshotRef} backgroundColor="background.default" container wrap="wrap-reverse" spacing={1}>
      <Grid item xs={12} lg={2}>
          <Paper sx={{height: "83vh", overflow: 'auto', p: 0.3}}>
            {(() => {
                let e = JSON.parse(JSON.stringify(mySkills));
                return (
                  Object.values(e)
                  .sort(skillSorter(data))
                  .map(s => {
                    const [id, lvl] = s;
                    return (
                      <div key={id}>
                        <SkillCard data={data} skill={s} sx={{mb: 0.3}}/>
                      </div>
                    )
                  })
                )
            })()}
          </Paper>
      </Grid>

      <Grid item xs={12} lg={10}>
        <Paper
          sx={{
            width: "100%",
            p: 0.3,
            mb: 0.5
          }}
        >
          <ButtonBase
            onClick={() => setOpenTglDialog(true)}
            sx={{
              display: "flex",
              justifyContent: "left",
              width: "100%",
              minHeight: 42,
              p: 0.5,
              border: 1,
              borderRadius: 1,
              borderColor: 'text.secondary',
            }}
          >
              {Object.entries(data.toggleData).map(entry => {
                const [key, item] = entry;
                if (tglMap[key]) {
                  if ('sprite' in item) {
                    return (
                      <Sprite
                        {...item.sprite}
                      />
                    )
                  }
                  if ('src' in item) {
                    return (
                      <Box
                        component="img"
                        src={item.src}
                      />
                    )
                  }
                  if ('nick' in item) {
                    return (
                      <Box
                        sx={{
                          ml: 0.5,
                          p: 0.3,
                          border: 1,
                          borderRadius: 1,
                          borderColor: 'text.disabled'
                        }}
                      >
                        <Typography variant='button'>
                          { item.nick }
                        </Typography>
                      </Box>
                    )
                  }
                }
              })}
          </ButtonBase>
        </Paper>

        <Grid container spacing={"0.5vh"}>
          <Grid item xs={12} md={8}>
            <Box display="flex" flexDirection="column" sx={equipBlockStyle}>
              <WepCard
                main
                data={data}
                wep={equip.Weapon}
                onClick={handleClickOpen}
                sx={{ flexGrow: 1, mb: 0.5, p: 0.3}}
              />
              <ArmorCard main data={data} armor={equip.Armor[0]} onClick={handleClickOpen} sx={{ flexGrow: 1, mb: 0.5, p: 0.3, height: 1}}/>
              <ArmorCard main data={data} armor={equip.Armor[1]} onClick={handleClickOpen} sx={{ flexGrow: 1, mb: 0.5, p: 0.3, height: 1}}/>
              <ArmorCard main data={data} armor={equip.Armor[2]} onClick={handleClickOpen} sx={{ flexGrow: 1, mb: 0.5, p: 0.3, height: 1}}/>
              <ArmorCard main data={data} armor={equip.Armor[3]} onClick={handleClickOpen} sx={{ flexGrow: 1, mb: 0.5, p: 0.3, height: 1}}/>
              <ArmorCard main data={data} armor={equip.Armor[4]} onClick={handleClickOpen} sx={{ flexGrow: 1, mb: 0.5, p: 0.3, height: 1}}/>
              <Grid container spacing={0.3}>
                <Grid item xs={12} xl={4}>
                  <ArmorCard charm data={data} armor={equip.Armor[5]} onClick={handleClickOpen} sx={{p: 0.3}}/>
                </Grid>
                <Grid item xs>
                  <Grid container wrap={mantleWrap} spacing={0.3} height="100%">
                    <Grid item xl={6}>
                      <MantleCard main data={data} pos={0} mantle={equip.Mantle[0]} onClick={handleClickOpen} sx={{flex: 1, p: 0.3}}/>
                    </Grid>
                    <Grid item xl={6}>
                      <MantleCard main data={data} pos={1} mantle={equip.Mantle[1]} onClick={handleClickOpen} sx={{flex: 1, p: 0.3}}/>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper style={{height: "13vh", marginBottom: "0.5vh"}}>
              {/* Safi/Gun mod zone */}
            </Paper>
            <Paper sx={{height: "64vh"}}>
              <Paper elevation={0} square
                sx={{
                  borderTopLeftRadius: 4,
                  borderTopRightRadius: 4
                }}>
                <Box flex={1} display="flex" justifyContent="center">
                  <Typography variant="h6">Damage</Typography>
                </Box>
              </Paper>
              <TableContainer component={Paper} sx={{width: "100%"}}>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>Raw</TableCell>
                      <TableCell>{myStats.Attack}</TableCell>
                      <TableCell>Effective Raw</TableCell>
                      <TableCell>{Math.round(myStats.EffRaw * 100)/100}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Ele</TableCell>
                      <TableCell>{myStats.EleDmg}</TableCell>
                      <TableCell>Effective Ele</TableCell>
                      <TableCell>{Math.round(myStats.EffEle * 100)/100}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Affinity</TableCell>
                      {(() => {
                        if (myStats.RawAffinity <= 100) {
                          return (
                            <TableCell>
                              { myStats.Affinity }%
                            </TableCell>
                          )
                        }
                        else {
                          return (
                            <TableCell>
                              <span style={{color: 'orange'}}>{ myStats.Affinity }% </span>
                              <span>({ myStats.RawAffinity }%)</span>
                            </TableCell>
                          )
                        }
                      })()}
                      <TableCell>Crit Damage</TableCell>
                      <TableCell>{myStats.CritDmg / 100}x</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              { 'Sharpness' in myStats && 
                <Box>
                  <Paper elevation={0} square sx={{mb: 1}}>
                    <Box flex={1} display="flex" justifyContent="center">
                      <Typography variant="h6">Sharpness</Typography>
                    </Box>
                  </Paper>
                  <SharpnessBar sharpness={myStats.Sharpness}/>
                  <TableContainer>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell>Raw Mod</TableCell>
                          <TableCell>{myStats.SharpMod[0]}</TableCell>
                          <TableCell>Ele Mod</TableCell>
                          <TableCell>{myStats.SharpMod[1]}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              }
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
    </Box>
  );
}