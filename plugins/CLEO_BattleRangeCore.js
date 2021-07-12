//=============================================================================
// CLEO_BattleRangeCore.js                                                             
//=============================================================================
/*:
*
* @author Cleosetric
* @plugindesc v0.4.2 Add Range Mechanic to Battle System
*
* @param ---Enemy Setting---
* @param ---Actor Setting---
* @param ---Skill Setting---
*
* @param enemy_pos
* @desc default enemy position
* @default 20
* @parent ---Enemy Setting---
*
* @param enemy_min_distance
* @desc default enemy position
* @default 20
* @parent ---Enemy Setting---
*
* @param enemy_max_distance
* @desc default enemy position
* @default 20
* @parent ---Enemy Setting---
*
* @param actor_pos
* @desc default actor position
* @default 2
* @parent ---Actor Setting---
*
* @param actor_min_distance
* @desc default enemy position
* @default 20
* @parent ---Actor Setting---
*
* @param actor_max_distance
* @desc default enemy position
* @default 20
* @parent ---Actor Setting---
*
* @param skill_range
* @desc maximal skill range from player
* @default 10
* @parent ---Skill Setting---
*
* @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * This plugin allows battle with range adition
 * enemy and actor has position and distance
 * and battle based with range each battler and skill range
 * 
 * ============================================================================
 * Notetags
 * ============================================================================
 *
 * You can use these notetags to adjust how enemies and actor are positioned
 *
 * Enemy Notetags:
 *
 *   <SET POSITION: x>  = SET INITIAL POSITION
 *   <MIN DISTANCE: x>  = SET MINIMAL DISTANCE ENEMY WILL STOP MOVE
 *   <MAX DISTANCE: x>  = SET MAXIMAL DISTANCE ENEMY WILL RUN AWAY
 *   <BRAVE>            = SET TRAIT THAT ENEMY WILL NOT MOVE AWAY EVEN IN LOW HEALTH
 *
 * Actor Notetags:
 *
 *   <SET POSITION: x>  = SET INITIAL POSITION
 *   <MIN DISTANCE: x>  = SET MINIMAL DISTANCE ENEMY WILL STOP MOVE
 *   <MAX DISTANCE: x>  = SET MAXIMAL DISTANCE ENEMY WILL RUN AWAY
 *
 *  Skill Notetags:
 * 
 *   <SET RANGE: x>     = SET SKILL RANGE
 * 
 *
*/

var Imported = Imported || {};
var CLEO_BattleRangeCore = CLEO_BattleRangeCore || {};

(function($) {
  'use strict';

//=============================================================================
// PluginManager Parameters                                                             
//=============================================================================

  //Registers the Plugin for use 
  $.Parameters = PluginManager.parameters("CLEO_BattleRangeCore");
  $.Param = $.Param || {};

  //A place that holds all the parameters from your plugin params above
  $.Param.enemy_pos = Number($.Parameters.enemy_pos ||20);
  $.Param.enemy_min_distance = Number($.Parameters.enemy_min_distance ||2);
  $.Param.enemy_max_distance = Number($.Parameters.enemy_max_distance ||40);

  //A place that holds all the parameters from your plugin params above
  $.Param.actor_pos = Number($.Parameters.actor_pos || 0);
  $.Param.actor_min_distance = Number($.Parameters.actor_min_distance ||2);
  $.Param.actor_max_distance = Number($.Parameters.actor_max_distance ||40);

  $.Param.skill_range = Number($.Parameters.skill_range || 10);

//=============================================================================
// Script begin here tehee                                                             
//=============================================================================
//=============================================================================
// DataManager
//=============================================================================

var DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function() {
  if (!DataManager_isDatabaseLoaded.call(this)) return false;
    this.processCLEOEnemyNotetags1($dataEnemies);
    this.processCLEOActorNotetags1($dataActors);
    this.processCLEOSkillNotetags1($dataSkills);
  return true;
};

DataManager.processCLEOEnemyNotetags1 = function(group) {
  for (var n = 1; n < group.length; n++) {
    var obj = group[n];
    var notedata = obj.note.split(/[\r\n]+/);

    obj.position = $.Param.enemy_pos;
    obj.min_distance = $.Param.enemy_min_distance;
    obj.max_distance = $.Param.enemy_max_distance;
    obj.brave = false;

    for (var i = 0; i < notedata.length; i++) {
      var line = notedata[i];
      if (line.match(/<(?:BRAVE)>/i)) {
        obj.brave = true;
      }else if (line.match(/<(?:SET POSITION):[ ](\d+)>/i)) {
        obj.position = parseInt(RegExp.$1);
      }else if (line.match(/<(?:MIN DISTANCE):[ ](\d+)>/i)) {
        obj.min_distance = parseInt(RegExp.$1);
      }else if (line.match(/<(?:MAX DISTANCE):[ ](\d+)>/i)) {
        obj.max_distance = parseInt(RegExp.$1);
      }
    }
  }
};

DataManager.processCLEOActorNotetags1 = function(group) {
  for (var n = 1; n < group.length; n++) {
    var obj = group[n];
    var notedata = obj.note.split(/[\r\n]+/);

    obj.position = $.Param.actor_pos;
    obj.min_distance = $.Param.actor_min_distance;
    obj.max_distance = $.Param.actor_max_distance;
    
    for (var i = 0; i < notedata.length; i++) {
      var line = notedata[i];
      if (line.match(/<(?:SET POSITION):[ ](\d+)>/i)) {
        obj.position = parseInt(RegExp.$1);
      }else if (line.match(/<(?:MIN DISTANCE):[ ](\d+)>/i)) {
        obj.min_distance = parseInt(RegExp.$1);
      }else if (line.match(/<(?:MAX DISTANCE):[ ](\d+)>/i)) {
        obj.max_distance = parseInt(RegExp.$1);
      }
    }
  }
};

DataManager.processCLEOSkillNotetags1 = function(group) {
  for (var n = 1; n < group.length; n++) {
    var obj = group[n];
    var notedata = obj.note.split(/[\r\n]+/);

    obj.skill_range = $.Param.skill_range;
    for (var i = 0; i < notedata.length; i++) {
      var line = notedata[i];
      if (line.match(/<(?:SET RANGE):[ ](\d+)>/i)) {
        obj.skill_range = parseInt(RegExp.$1);
      }
    }
  }
};

//=============================================================================
// BattleManager
//=============================================================================

// OVERWRITE processTurn method
BattleManager.processTurn = function() {
  var subject = this._subject;

  if(subject){
  var action = subject.currentAction();
  if (action) {
      action.prepare();
      if (action.isValid()) {
        if(subject.isEnemy()){

           //ENEMY
          var skill_range = $dataSkills[action._item._itemId].skill_range;
          var skillRange_isValid = subject.position() <= skill_range;
          var hp_tired = subject.hp <= subject.mhp * 0.3;
          var brave = subject._brave;

          if(skillRange_isValid){
            if(hp_tired){
              if(brave){
                this.startAction();
              }else{
                this.processMoveAway(subject);
              }
            }else{
              this.startAction();
            }
          }else{
            if(hp_tired){
              if(brave){
                this.processMoveCloser(subject);
              }else{
                this.processMoveAway(subject);
              }
            }else{
              this.processMoveCloser(subject);
            }
          }
        }else{

          //ACTOR
          var targets = action.makeTargets();
          var skill_range = $dataSkills[action._item._itemId].skill_range;
          var skillRange_isValid = false;

          targets.forEach(function(target) {
            skillRange_isValid = target.position() <= skill_range;
          },this);
          
          if(skillRange_isValid){
            this.startAction();
          }else{
            this._logWindow.displayOutsideRangeLog(subject);
          }
        }
      }
      subject.removeCurrentAction();
  } else {
      subject.onAllActionsEnd();
      this.refreshStatus();
      this._logWindow.displayAutoAffectedStatus(subject);
      this._logWindow.displayCurrentState(subject);
      this._logWindow.displayRegeneration(subject);
      this._subject = this.getNextSubject();
  }
  }
};

BattleManager.getDistance = function (target) {
  var distance = this._subject.position() - target.position();
  return Math.abs(distance);
};

BattleManager.performActionMove = function (leader) {
  var troop = $gameTroop.aliveMembers();
  var party = $gameParty.battleMembers();

  troop.forEach(function(enemy) {
    enemy.addPosition(-leader.moveSpeed());
  },this);

  party.forEach(function(actor) {
    if(actor.isAlive())
      actor.setActionState('waiting');
  },this);

  this.startTurn();
};

BattleManager.processMoveAway = function (subject) {
  if(subject.position() <= subject._max_distance){
    subject.moveAway();
    this._logWindow.displayMoveAway(subject);
  }else{
    subject._hidden = true;
    this._logWindow.displayRunAway(subject);
  }  
};

BattleManager.processMoveCloser = function (subject) {
  subject.moveCloser();
  this._logWindow.displayOutsideRangeLog(subject);
  this._logWindow.displayMoveCloser(subject);
};

//=============================================================================
// Scene_Battle
//=============================================================================
Scene_Battle.prototype.createPartyCommandWindow = function() {
  this._partyCommandWindow = new Window_PartyCommand();
  this._partyCommandWindow.setHandler('fight',  this.commandFight.bind(this));
  this._partyCommandWindow.setHandler('approach',  this.commandApproach.bind(this));
  this._partyCommandWindow.setHandler('escape', this.commandEscape.bind(this));
  this._partyCommandWindow.deselect();
  this.addWindow(this._partyCommandWindow);
};

Scene_Battle.prototype.commandApproach = function() {
  var leader = $gameParty.leader();
  BattleManager.performActionMove(leader);
};

//=============================================================================
// Window_Any*
//=============================================================================

Window_BattleLog.prototype.displayMoveCloser = function(subject) {
  var stateText = " Move Closer";
  if (stateText) {
      this.push('addText', subject.name() + stateText);
      this.push('wait');
      this.push('clear');
  }
};

Window_BattleLog.prototype.displayMoveAway = function(subject) {
  var stateText = " Move Away";
  if (stateText) {
      this.push('addText', subject.name() + stateText);
      this.push('wait');
      this.push('clear');
  }
};

Window_BattleLog.prototype.displayRunAway = function(subject) {
  var stateText = " Run Away";
  if (stateText) {
      this.push('addText', subject.name() + stateText);
      this.push('wait');
      this.push('clear');
  }
};

Window_BattleLog.prototype.displayOutsideRangeLog = function(subject) {
  var stateText = " Outside Range";
  var skillName = $dataSkills[subject.currentAction()._item._itemId].name;
  var skillRange = $dataSkills[subject.currentAction()._item._itemId].skill_range;
  // console.log(subject.name()+"'s "+skillName + " Range is "+skillRange+"km" );
  if (stateText) {
      this.push('addText', subject.name()+" "+ skillName + stateText);
      this.push('wait');
      this.push('clear');
  }
};

Window_SkillList.prototype.drawItem = function(index) {
  var skill = this._data[index];
  if (skill) {
      var costWidth = this.costWidth();
      var rect = this.itemRect(index);
      rect.width -= this.textPadding();
      this.changePaintOpacity(this.isEnabled(skill));
      this.drawIcon(skill.iconIndex,  rect.x + 2,  rect.y + 2);
      this.drawText(skill.name+" ["+skill.skill_range+"km]", rect.x + 40, rect.y, rect.width - costWidth);
      this.drawSkillCost(skill, rect.x, rect.y, rect.width);
      this.changePaintOpacity(1);
  }
};

var _Window_PartyCommand_makeCommandList = Window_PartyCommand.prototype.makeCommandList;
Window_PartyCommand.prototype.makeCommandList = function() {
  this.addCommand("Approach",  'approach');
  _Window_PartyCommand_makeCommandList.call(this);
};

//=============================================================================
// Game_Enemy
//=============================================================================

var _Game_Enemy_initMembers = Game_Enemy.prototype.initMembers;
Game_Enemy.prototype.initMembers = function() {
    _Game_Enemy_initMembers.call(this);
    this._position = 0;
    this._brave = false;
    this._min_distance = 0;
    this._max_distance = 0;
};

var _Game_Enemy_setup = Game_Enemy.prototype.setup;
Game_Enemy.prototype.setup = function(enemyId, x, y) {
  this._enemyId = enemyId;
  this.setupEnemyDistance();
  _Game_Enemy_setup.call(this, enemyId, x, y);
};

Game_Enemy.prototype.setupEnemyDistance = function() {
  this._position = this.enemy().position;
  this._min_distance = this.enemy().min_distance;
  this._max_distance = this.enemy().max_distance;
  this._brave = this.enemy().brave;
};

Game_Enemy.prototype.position = function() {
  return this._position;
};

Game_Enemy.prototype.addPosition = function(value) {
  this._position += value;
  if(this._position <= this._min_distance){
    this._position = this._min_distance;
  }
};

Game_Enemy.prototype.moveCloser = function(){
  this._position -= this.moveSpeed();
  if(this._position <= this._min_distance){
    this._position = this._min_distance;
  }
  // console.log(this.name() + " move closer "+this.moveSpeed()+"km");
  // console.log(this.name() + " current position : "+this._position+"km");
};

Game_Enemy.prototype.moveAway = function(){
  this._position += this.moveSpeed();
  // console.log(this.name() + " move away "+this.moveSpeed()+"km");
  // console.log(this.name() +" current position : "+this._position+"km");
};

Game_Enemy.prototype.moveSpeed = function(){
  // var speed = Math.floor(this.agi * 0.15);
  var speed =  Math.round((this.agi + Math.randomInt(Math.floor(5 + this.agi / 4)))*0.1);
  if(speed <= 0){
    return 2;
  }
  return speed;
};

//=============================================================================
// Game_Actor
//=============================================================================

var _Game_Actor_initMembers = Game_Actor.prototype.initMembers;
Game_Actor.prototype.initMembers = function() {
    _Game_Actor_initMembers.call(this);
    this._position = 0;
    this._min_distance = 0;
    this._max_distance = 0;
};

var _Game_Actor_setup = Game_Actor.prototype.setup;
Game_Actor.prototype.setup = function(actorId) {
  _Game_Actor_setup.call(this, actorId);
  this.setupActorDistance();
};

Game_Actor.prototype.setupActorDistance = function() {
  this._position = this.actor().position;
  this._min_distance = this.actor().min_distance;
  this._max_distance = this.actor().max_distance;
};

Game_Actor.prototype.position = function() {
  return this._position;
};

Game_Actor.prototype.moveCloser = function(){
  this._position += this.moveSpeed();
  // console.log(this.name() + " move closer "+this.moveSpeed()+"km");
  // console.log(this.name() +" current position : "+this._position+"km");
};

Game_Actor.prototype.moveAway = function(){
  this._position -= this.moveSpeed();
  if(this._position <= 0){
    this._position = 0;
  }
  // console.log(this.name() + " move away "+this.moveSpeed()+"km");
  // console.log(this.name() +" current position : "+this._position+"km");
};

Game_Actor.prototype.disableMoveCloser = function(){
  //return 
};

Game_Actor.prototype.disableMoveAway = function(){
  //return
};

Game_Actor.prototype.moveSpeed = function(){
  var speed =  Math.round((this.agi + Math.randomInt(Math.floor(5 + this.agi / 4)))*0.1);
  if(speed <= 0){
    return 2;
  }
  return speed;
};

})(CLEO_BattleRangeCore);
Imported.CLEO_BattleRangeCore = 0.4;