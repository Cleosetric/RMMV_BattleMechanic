//=============================================================================
// CLEO_SkillSequences.js                                                             
//=============================================================================
/*:
*
* @author Cleosetric
* @plugindesc v0 Add Skill Sequences
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
* This plugin allows battler perform skill sequences
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
var CLEO_SkillSequences = CLEO_SkillSequences || {};

(function($) {
  'use strict';

//=============================================================================
// PluginManager Parameters                                                             
//=============================================================================

  //Registers the Plugin for use 
  $.Parameters = PluginManager.parameters("CLEO_SkillSequences");
  $.Param = $.Param || {};

  $.Param.param_name = Number($.Parameters.param_name ||20);
  
//=============================================================================
// Script begin here tehee                                                             
//=============================================================================


})(CLEO_SkillSequences);
Imported.CLEO_SkillSequences = 0.0;
