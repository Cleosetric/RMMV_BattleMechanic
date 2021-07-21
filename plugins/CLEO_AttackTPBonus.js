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
* This plugin allows attack add bonus damage with actor TP Level
*
* ============================================================================
* Notetags
* ============================================================================
*
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
  $.Parameters = PluginManager.parameters("CLEO_AttackTPBonus");
  $.Param = $.Param || {};

  $.Param.param_name = Number($.Parameters.param_name ||20);
  
//=============================================================================
// Script begin here tehee                                                             
//=============================================================================


})(CLEO_AttackTPBonus);
Imported.CLEO_AttackTPBonus = 0.0;
