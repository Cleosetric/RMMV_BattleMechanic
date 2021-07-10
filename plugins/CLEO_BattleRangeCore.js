//=============================================================================
// CLEO_BattleRangeCore.js                                                             
//=============================================================================
/*:
*
* @author Cleosetric
* @plugindesc v0.1 An attemp to create my own mechanic battle system
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
 *   <Set Position : x>
 *   <Min Distance : x>
 *   <Max Distance : x>
 *
 * Actor Notetags:
 *
 *   <Set Position : x>
 *   <Min Distance : x>
 *   <Max Distance : x>
 * 
 *  Skill Notetags:
 * 
 *   <Set Range : x>
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


//=============================================================================
// Game_Enemy
//=============================================================================

var _Game_Enemy_initMembers = Game_Enemy.prototype.initMembers;
Game_Enemy.prototype.initMembers = function() {
    _Game_Enemy_initMembers.call(this);
    this._position = 0;
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
};

Game_Enemy.prototype.position = function() {
  return this._position;
};

Game_Enemy.prototype.moveCloser = function(){
  if(this._position >= this._min_distance){
    this._position -= this.moveSpeed();
  }else{
    this._position = this._min_distance;
  }
 
  console.log(this.name() + " move closer "+this.moveSpeed()+"km");
  console.log("current position : "+this._position);
};

Game_Enemy.prototype.moveAway = function(){
  this._position += this.moveSpeed();
  console.log(this.name() + " move away "+this.moveSpeed()+"km");
  console.log("current position : "+this._position);
};

Game_Enemy.prototype.moveSpeed = function(){
  // var speed = Math.floor(this.agi * 0.15);
  var speed =  Math.floor((this.agi + Math.randomInt(Math.floor(5 + this.agi / 4)))*0.1);
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
  console.log(this.name() + " move closer "+this.moveSpeed()+"km");
};

Game_Actor.prototype.moveAway = function(){
  this._position -= this.moveSpeed();
  if(this._position <= 0){
    this._position = 0;
  }
  console.log(this.name() + " move away "+this.moveSpeed()+"km");
};

Game_Actor.prototype.disableMoveCloser = function(){
  //return 
};

Game_Actor.prototype.disableMoveAway = function(){
  //return
};

Game_Actor.prototype.moveSpeed = function(){
  var speed =  Math.floor((this.agi + Math.randomInt(Math.floor(5 + this.agi / 4)))*0.1);
  if(speed <= 0){
    return 2;
  }
  return speed;
};

})(CLEO_BattleRangeCore);
Imported.CLEO_BattleRangeCore = 0.1;