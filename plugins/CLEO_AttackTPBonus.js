//=============================================================================
// CLEO_AttackTPBonus.js                                                             
//=============================================================================
/*:
*
* @author Cleosetric
* @plugindesc v0 Add Attack Bonus By Current TP Level
*
* @param ---Default---
*
* @param param_name
* @desc some description
* @default 20
* @parent ---Default---
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
* 
*
*/

var Imported = Imported || {};
var CLEO_AttackTPBonus = CLEO_AttackTPBonus || {};

(function($) {
  'use strict';

//=============================================================================
// PluginManager Parameters                                                             
//=============================================================================

  //Registers the Plugin for use 
  $.Parameters = PluginManager.parameters("CLEO_BattleRangeCore");
  $.Param = $.Param || {};

  $.Param.param_name = Number($.Parameters.param_name ||20);
  
//=============================================================================
// Script begin here tehee                                                             
//=============================================================================


})(CLEO_AttackTPBonus);
Imported.CLEO_AttackTPBonus = 0.0;
