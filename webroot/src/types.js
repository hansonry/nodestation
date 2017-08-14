/*
    Node Station - A Space Station 13 clone
    Copyright (C) 2017  Ryan Hanson

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/


// This file will be used in both the client and the server as a dictionary of
// game objects

function buildTypeSet(typeSet) {
   typeSet.addItemType('idCard', function(item) {
      item.pawnSlotType = 'card';
      item.name = 'ID Card';
      item.render = {
         icon: {
            image: 'card',
            index: 1
         }
      };
   });
   typeSet.addItemType('uniformCaptian', function(item) {
      item.pawnSlotType = 'uniform';
      item.pawnVisible = true;
      item.name = 'Captian Uniform';
      item.render = {
         icon: {
            image: 'clothingUniform',
            index: 1
         },
         pawn: {
            image: 'pawnSuit',
            index: 12
         }
      };
   });
   typeSet.addItemType('feetCaptian', function(item) {
      item.pawnSlotType = 'feet';
      item.pawnVisible = true;
      item.name = 'Captian Boots';
      item.render = {
         icon: {
            image: 'clothingFeet',
            index: 4
         },
         pawn: {
            image: 'pawnFeet',
            index: 32
         }
      };
   });
   typeSet.addItemType('hatCaptian', function(item) {
      item.pawnSlotType = 'head';
      item.pawnVisible = true;
      item.name = 'Captian Hat';
      item.render = {
         icon: {
            image: 'clothingHead',
            index: 38
         },
         pawn: {
            image: 'pawnHead',
            index: 208
         }
      };
   });

}


if(typeof module !== 'undefined') {

   module.exports = {
      buildTypeSet: buildTypeSet
   };
}

