const db = require('./index')

const addMatch = async (match) => {
  try{
    const query = {
      text : `INSERT INTO match VALUES ($1)
              ON CONFLICT (id) DO UPDATE SET
              game_creation = EXCLUDED.game_creation,
              game_duration = EXCLUDED.game_duration,
              game_mode = EXCLUDED.game_mode,
              game_type = EXCLUDED.game_type,
              game_version = EXCLUDED.game_version,
              platform = EXCLUDED.platform,
              queue_id = EXCLUDED.queue_id`,
      values : [
        match
      ]
    }
    const res = await db.query(query)
    return res

  }catch(e){
    console.log('Error adding a match: ',e)
  } 
} 

const addMatchRel = async (match,summ) => {
  try{
    const query = {
      text : `INSERT INTO match_summoner
              (summoner_id,match_id)
              VALUES ($1,$2)
              ON CONFLICT (summoner_id,match_id) DO NOTHING`,
      values : [
        summ.id,
        match,        
      ]
    }
    const res = await db.query(query)
    return res

  }catch(e){
    console.log('Error adding match relationship: ',e)
  } 
}

const completeMatch = async match => {
  try{
    const query = {
      text: `UPDATE match
              SET game_creation = $1,
                  game_duration = $2,
                  game_mode = $3,
                  game_type = $4,
                  game_version = $5,
                  platform = $6,
                  queue_id = $7
              WHERE id = $8
            `,
      values : [
        match.info.gameCreation,
        match.info.gameDuration,
        match.info.gameMode,
        match.info.gameType,
        match.info.gameVersion,
        match.info.platformId,
        match.info.queueId,
        match.metadata.matchId,
      ]
    }
  
    const res  = await db.query(query)
    return res.rows
  }catch(e){
    console.log('Error updating the complete match: ',e)
  }


}

const completeMatchRel = async (match,summoner) => {
  try{
    const summ = await singleSummoner(match,summoner)

    const query = {
      text : `UPDATE match_summoner
              SET assists = $3,
                  deaths = $4,
                  kills = $5,
                  baron_kills = $6,
                  dragon_kills = $7,
                  bounty_level =$8,
                  champ_experience = $9,
                  champ_level = $10,
                  consumables_purchased = $11,
                  damage_to_buildings = $12,
                  damage_to_objectives = $13,
                  damage_to_turrets = $14,
                  damage_self_mitigated = $15,
                  detector_wards = $16,
                  double_kills = $17,
                  triple_kills = $18,
                  quadra_kills = $19,
                  penta_kills = $20,
                  first_blood_assist = $21,
                  first_blood_kill = $22,
                  first_tower_assist = $23,
                  first_tower_kill = $24,
                  gold_earned = $25,
                  gold_spent = $26,
                  individual_position = $27,
                  inhibitor_kills = $28,
                  items_purchased = $29,
                  killing_sprees = $30,
                  lane = $31,
                  largest_critical_strike = $32,
                  largest_killing_spree = $33,
                  longest_time_alive = $34,
                  magic_damage_dealt = $35,
                  magic_damage_dealt_champs = $36,
                  magic_damage_taken = $37,
                  physical_damage_dealt = $38,
                  physical_damage_dealt_champs = $39,
                  physical_damage_taken = $40,
                  true_damage_dealt = $41,
                  true_damage_dealt_champs = $42,
                  true_damage_taken = $43,
                  total_damage_dealt = $44,
                  total_damage_dealt_champs = $45,
                  total_damage_taken = $46,
                  minions_killed = $47,
                  participant = $48,
                  sight_wards = $49,
                  summoner_spell_casts_1 = $50,
                  summoner_spell_casts_2 = $51,
                  current_summoner_level = $52,
                  current_summoner_name = $53,
                  team = $54,
                  time_cc_others = $55,
                  damage_shielded_ally = $56,
                  total_heal = $57,
                  total_heal_on_teammates = $58,
                  total_minions_killed = $59,
                  total_cc_dealt = $60,
                  time_spent_dead = $61,
                  turret_kills = $62,
                  turrets_lost = $63,
                  unreal_kills = $64,
                  vision_score = $65,
                  wards_killed = $66,
                  wards_placed = $67,
                  win = $68,
                  inhibitors_lost = $69
              WHERE summoner_id = $1 AND match_id = $2
              `,
      values : [
        summ.summonerId, //summoner_id= $1
        match.metadata.matchId, //match_id = $2
        summ.assists,// assists = $3,
        summ.deaths,// deaths = $4,
        summ.kills,// kills = $5,
        summ.baronKills,// baron_kills = $6,
        summ.dragonKills,// dragon_kills =$ 7,
        summ.bountyLevel,// bounty_level =$ 8,
        summ.champExperience,// champ_experience =$ 9,
        summ.champLevel,// champ_level = $10,
        summ.consumablesPurchased,// consumables_purchased = $11,
        summ.damageDealtToBuildings,// damage_to_buildings = $12,
        summ.damageDealtToObjectives,// damage_to_objectives = $13,
        summ.damageDealtToTurrets,// damage_to_turrets = $14,
        summ.damageSelfMitigated,// damage_self_mitigated = $15,
        summ.detectorWardsPlaced,// detector_wards = $16,
        summ.doubleKills,// double_kills = $17,
        summ.tripleKills,// triple_kills = $18,
        summ.quadraKills,// cuadra_kills = $19,
        summ.pentaKills,// penta_kills = $20,
        summ.firstBloodAssist,// first_blood_assist = $21,
        summ.firstBloodKill,// first_blood_kill = $22,
        summ.firstTowerAssist,// first_tower_assist = $23,
        summ.firstTowerKill,// first_tower_kill = $24,
        summ.goldEarned,// gold_earned = $25,
        summ.goldSpent,// gold_spent = $26,
        summ.individualPosition,// individual_position = $27,
        summ.inhibitorKills,// inhibitor_kills = $28,
        summ.itemsPurchased,// items_purchased = $29,
        summ.killingSprees,// killing_sprees = $30,
        summ.lane,// lane = $31,
        summ.largestCriticalStrike,// largest_critical_strike = $32,
        summ.largestKillingSpree,// largest_killing_spree = $33,
        summ.longestTimeSpentLiving,// longest_time_alive = $34,
        summ.magicDamageDealt,// magic_damage_dealt = $35,
        summ.magicDamageDealtToChampions,// magic_damage_dealt_champs = $36,
        summ.magicDamageTaken,// magic_damage_taken = $37,
        summ.physicalDamageDealt,// physical_damage_dealt = $38,
        summ.physicalDamageDealtToChampions,// physical_damage_dealt_champs = $39,
        summ.physicalDamageTaken,// physical_damage_taken = $40,
        summ.trueDamageDealt,// true_damage_dealt = $41,
        summ.trueDamageDealtToChampions,// true_damage_dealt_champs = $42,
        summ.trueDamageTaken,// true_damage_taken = $43,
        summ.totalDamageDealt,// total_damage_dealt = $44,
        summ.totalDamageDealtToChampions,// total_damage_dealt_champs = $45,
        summ.totalDamageTaken,// total_damage_taken = $46,
        parseInt(summ.totalMinionsKilled) + parseInt(summ.neutralMinionsKilled),// neutral_minions_killed = $47,
        summ.participantId,// participant = $48,
        summ.sightWardsBoughtInGame,// sight_wards = $49,
        summ.summoner1Casts,// summoner_spell_casts_1 = $50,
        summ.summoner2Casts,// summoner_spell_casts_2 = $51,
        summ.summonerLevel,// current_summoner_level = $52,
        summ.summonerName,// current_summoner_name = $53,
        summ.teamId,// team = $54,
        summ.timeCCingOthers,// time_cc_others = $55,
        summ.totalDamageShieldedOnTeammates,// damage_shielded_ally = $56,
        summ.totalHeal,// total_heal = $57,
        summ.totalHealsOnTeammates,// total_heal_on_teammates = $58,
        summ.totalMinionsKilled,// total_minions_killed = $59,
        summ.totalTimeCCDealt,// total_cc_dealt = $60,
        summ.totalTimeSpentDead,// time_spent_dead = $61,
        summ.turretKills,// turret_kills = $62,
        summ.turretsLost,// turrets_lost = $63,
        summ.unrealKills,// unreal_kills = $64,
        summ.visionScore,// vision_score = $65,
        summ.wardsKilled,// wards_killed = $66,
        summ.wardsPlaced,// wards_placed = $67,
        summ.win,// win = $68,
        summ.inhibitorsLost,// inhibitors_lost = $69,
      ]
    }
  
    const res = await db.query(query)
    return res.rows
  }catch(e){
    console.log("Match summoner error :",e)
  }  
}

const addTeam = async (match) => {
  try{
    const res = await db.query(`
      INSERT INTO team
      (match_id,
      first_baron,baron_kills,
      first_champion,champion_kills,
      first_dragon,dragon_kills,
      first_inhibitor,inhibitor_kills,
      first_herald,herald_kills,
      first_tower,tower_kills,
      team_number)
      VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
      ON CONFLICT (match_id,team_number) DO NOTHING
      RETURNING id
    
    
    `,[match.matchId,
      match.firstBaron,
      match.baronKills,
      match.firstChampion,
      match.championKills,
      match.firstDragon,
      match.dragonKills,
      match.firstInhibitor,
      match.inhibitorKills,
      match.firstHerald,
      match.heraldKills,
      match.firstTower,
      match.towerKills,
      match.teamNumber
      ])

      return res.rows
  }catch(e){
    console.log("Error in addTeam",e)
  }

}

const addBans = async (match) => {
  try{
    const res = await db.query(`
    INSERT INTO bans
    (team_id,champion_id,pick_turn)
    VALUES($1,$2,$3)
    ON CONFLICT (team_id,champion_id) DO NOTHING
    `,[match.teamId,
      match.championId,
      match.pickTurn])
    return res.rows
  }catch(e){
    console.log('Error in addBans',e)
  }
}

const addChampionMatch = async (match,summoner,matchSummonerId) => {
  try{
    const summ = await singleSummoner(match,summoner)

    const res = await db.query(
      `INSERT INTO champion_ms
       (champion_id,match_summoner_id)
      VALUES($1,$2)
      ON CONFLICT (champion_id,match_summoner_id) DO NOTHING`,

      [summ.championId,
      matchSummonerId])

  return res.rows

  }catch(e){
    console.log('Error adding champion match',e)
  }

  

}

const addItemMatch = async (match,summoner,matchSummonerId) => {
  try{
    const summ = await singleSummoner(match,summoner)
    const itemList = [
                    summ.item0,
                    summ.item1,
                    summ.item2,
                    summ.item3,
                    summ.item4,
                    summ.item5,
                    summ.item6
                  ]
    itemList.forEach(async (item) => {
      if(item !== 0){
        try{
          const res = await db.query(
            `INSERT INTO match_summoner_items
             (item_id,match_summoner_id) 
            VALUES($1,$2)
            ON CONFLICT (item_id,match_summoner_id) DO NOTHING`,
            [item,
            matchSummonerId]
            )
        }catch(e){
          console.log(e)
        }
      }      
    })
  }catch(e){
    console.log('Error adding item match: ',e)
  }
  
}

const singleSummoner = async (match,summoner) => {
  const summList = match.info.participants
  var summ = summList[0]
    for (const summInst of summList){
      if (summInst.summonerId === summoner.id){
        summ = summInst
      }
    }
  return summ
}

const getMatchSummoner = async (matchId,summonerId) => {
  try{
    const res = await db.query(
      'SELECT id FROM match_summoner WHERE  summoner_id = $1 AND match_id = $2',
      [
        summonerId,
        matchId,                        
      ])
    return res.rows 
  }catch(e){
    console.log(e)
  }                   
}

const addSummonerSpellRel  = async (match,summoner,matchSummId) => {
  try{
    const summ = await singleSummoner(match,summoner)
    const spellList = [
                      summ.summoner1Id,
                      summ.summoner2Id,
                      ]
    spellList.forEach(async (spell) => {
      try{
        if (spell === 0) return 
        const res = await db.query(
          `INSERT INTO summoner_spells_ms
          (match_summoner_id,summoner_spell_id)
          VALUES ($1,$2)
          ON CONFLICT (match_summoner_id,summoner_spell_id) DO NOTHING`,
          [
            matchSummId,
            spell
          ]
        )
      }catch(e){
        console.log(e)
      }      
    })                  
  }catch(e){
    console.log('Error adding summoner spell rel: ',e)
  }
}

const addMatchMasteries = async (match,summoner,matchSummId) => {
  try{
    const summ = await singleSummoner(match,summoner)
    const primaryStyle = summ.perks.styles[0].selections
    const secondaryStyle = summ.perks.styles[1].selections
    const runeList = [
                      primaryStyle[0],
                      primaryStyle[1],
                      primaryStyle[2],
                      primaryStyle[3],
                      secondaryStyle[0],
                      secondaryStyle[1]
                    ]
    runeList.forEach(async(rune) => {

      try{
        if (rune?.perk === 0) return
        const res = await db.query(
          `INSERT INTO match_summoner_runes
          (match_summoner_id,rune_id,var1,
            var2,var3)
          VALUES ($1,$2,$3,$4,$5)
          ON CONFLICT (rune_id,match_summoner_id) DO NOTHING`,
          [
            matchSummId,
            rune?.perk,
            rune?.var1,
            rune?.var2,
            rune?.var3
          ]
        )
      }catch(e){
        console.log('Error adding match runes: ',e)
      }
      
    })
  }catch(e){
    console.log('Error in preparation to add match runes: ',e)
  }
}

const getMatch = async matchId => {
  try{
    const res = await db.query(
      'SELECT * FROM match WHERE match.id = $1',
      [matchId]
    )
    return res.rows
  }catch(e){
    console.log(e)
  }
}

const addMatchChallenges = async (match,summoner,matchSummId) => {
  try{
    const summ = await singleSummoner(match,summoner)
    const challenges = summ.challenges
    // console.log(challenges)
    if(challenges === null || challenges === undefined) return
    const query = {
      'text' : `INSERT INTO challenges
                VALUES(
                  DEFAULT,$1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
                  $11,$12,$13,$14,$15,$16,$17,$18,$19,$20,
                  $21,$22,$23,$24,$25,$26,$27,$28,$29,$30,
                  $31,$32,$33,$34,$35,$36,$37,$38,$39,$40,
                  $41,$42,$43,$44,$45,$46,$47,$48,$49,$50,
                  $51,$52,$53,$54,$55,$56,$57,$58,$59,$60,
                  $61,$62,$63,$64,$65,$66,$67,$68,$69,$70,
                  $71,$72,$73,$74,$75,$76,$77,$78,$79,$80,
                  $81,$82,$83
                )
                ON CONFLICT (id) DO NOTHING`,
      'values' : [
        matchSummId,
        challenges['12AssistStreakCount'],
        challenges.abilityUses,
        challenges.acesBefore15Minutes,
        challenges.alliedJungleMonsterKills,
        challenges.baronTakedowns,
        challenges.bountyGold,
        challenges.buffsStolen,
        challenges.completeSupportQuestInTime,
        challenges.damagePerMinute,
        challenges.damageTakenOnTeamPercentage,
        challenges.dancedWithRiftHerald,
        challenges.dodgeSkillShotsSmallWindow,
        challenges.earliestBaron,
        challenges.earliestDragonTakedown,
        challenges.earlyLaningPhaseGoldExpAdvantage,
        challenges.effectiveHealAndShielding,
        challenges.elderDragonKillsWithOpposingSoul,
        challenges.elderDragonMultikills,
        challenges.enemyChampionImmobilizations,
        challenges.enemyJungleMonsterKills,
        challenges.epicMonsterKillsNearEnemyJungler,
        challenges.epicMonsterKillsWithin30SecondsOfSpawn,
        challenges.epicMonsterSteals,
        challenges.epicMonsterStolenWithoutSmite,
        challenges.firstTurretKilledTime,
        challenges.flawlessAces,
        challenges.fullTeamTakedown,
        challenges.goldPerMinute,
        challenges.hadAfkTeammate,
        challenges.hadOpenNexus,
        challenges.jungleCsBefore10Minutes,
        challenges.junglerKillsEarlyJungle,
        challenges.junglerTakedownsNearDamagedEpicMonster,
        challenges.kTurretsDestroyedBeforePlatesFall,
        challenges.killAfterHiddenWithAlly,
        challenges.killParticipation,
        challenges.killedChampTookFullTeamDamageSurvived,
        challenges.killsNearEnemyTurret,
        challenges.killsUnderOwnTurret,
        challenges.killsWithHelpFromEpicMonster,
        challenges.knockEnemyIntoTeamAndKill,
        challenges.landSkillShotsEarlyGame,
        challenges.laneMinionsFirst10Minutes,
        challenges.laningPhaseGoldExpAdvantage,
        challenges.legendaryCount,
        challenges.maxCsAdvantageOnLaneOpponent,
        challenges.maxKillDeficit,
        challenges.maxLevelLeadLaneOpponent,
        challenges.multikillsAfterAggressiveFlash,
        challenges.outnumberedKills,
        challenges.perfectDragonSoulsTaken,
        challenges.perfectGame,
        challenges.pickKillWithAlly,
        challenges.poroExplosions,
        challenges.quickCleanse,
        challenges.quickSoloKills,
        challenges.saveAllyFromDeath,
        challenges.skillshotsDodged,
        challenges.skillshotsHit,
        challenges.snowballsHit,
        challenges.soloBaronKills,
        challenges.soloKills,
        challenges.soloTurretsLategame,
        challenges.survivedSingleDigitHpCount,
        challenges.survivedThreeImmobilizesInFight,
        challenges.takedownsAfterGainingLevelAdvantage,
        challenges.takedownsBeforeJungleMinionSpawn,
        challenges.takedownsFirst25Minutes,
        challenges.takedownsInAlcove,
        challenges.takedownsInEnemyFountain,
        challenges.teamDamagePercentage,
        challenges.teleportTakedowns,
        challenges.thirdInhibitorDestroyedTime,
        challenges.threeWardsOneSweeperCount,
        challenges.tookLargeDamageSurvived,
        challenges.turretPlatesTaken,
        challenges.turretsTakenWithRiftHerald,
        challenges.visionScoreAdvantageLaneOpponent,
        challenges.visionScorePerMinute,
        challenges.wardTakedowns,
        challenges.wardTakedownsBefore20M,
        challenges.wardsGuarded,        
      ]
    }
    const response = await db.query(query)
    return response.rows
  }catch(e){
    console.log('Challenges error: ',e)
  }

}


module.exports = {
  addMatch,
  addMatchRel,
  getMatch,
  completeMatch,
  completeMatchRel,
  addChampionMatch,
  addItemMatch,
  getMatchSummoner,
  addSummonerSpellRel,
  addMatchMasteries,
  addMatchChallenges,
  addTeam,
  addBans,
}