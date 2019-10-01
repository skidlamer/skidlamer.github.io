// ==UserScript==
// @name         Krunker Skid
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  skiddy underpantz
// @author       SkidLamer
// @include      /^(https?:\/\/)?(www\.)?(.+)krunker\.io(|\/|\/\?game=.+)$/
// @run-at       document-start
// @grant        none
// ==/UserScript==

class Utilities{constructor(exports=[]){console.dir(exports)
this.ui;this.me;this.world;this.inputs;this.control;this.socket;this.view;this.server=exports.c[7].exports;this.keysDown={};this.features=[];this.settings={canShoot:!0,scopingOut:!1,isSliding:!1,}
let interval_world=setInterval(()=>{if(this.world!==null){clearInterval(interval_world);this.onLoad()}},100)}
onLoad(){addEventListener("keydown",e=>{if("INPUT"==window.document.activeElement.tagName)return;this.keysDown[e.code]=!0});addEventListener("keyup",e=>{this.keysDown[e.code]=!1
const key=e.key.toUpperCase();for(const feature of this.features){if(feature.hotkey.toUpperCase()===key){this.onUpdated(feature)}}})
new Map([["fov",85],["fpsFOV",85],["weaponBob",3],["weaponLean",6],["weaponOffX",2],["weaponOffY",2],["weaponOffZ",2]]).forEach(function(value,key,map){window.setSetting(key,value)});document.getElementById("uiBase").innerHTML+="<h1 id='utilitiesView' style='position: absolute;top: 50%;left: 50%;transform: translateX(-50%) translateY(-50%);color:#1e90ff;opacity:50%;font-size:100%;'></h1>"
this.newFeature('AutoAim',"1",['Off','Aim Assist','Aim Bot','Trigger Bot']);this.newFeature('AutoBhop',"2",['Off','Auto Jump','Auto SlideJump']);this.newFeature('AutoReload',"3",[]);this.newFeature('NoDeathDelay',"4",[]);let interval_leader=setInterval(()=>{if(document.querySelector('#leaderDisplay')!==null){clearInterval(interval_leader);this.createInfoBox()}},100)}
createInfoBox(){const leaderDisplay=document.querySelector('#leaderDisplay');if(leaderDisplay){var infoBox=document.createElement('div');if(infoBox)infoBox.innerHTML='<div><h1> <style> #InfoBox { text-align: left; width: 310px; z-index: 3; padding: 10px; padding-left: 20px; padding-right: 20px; color: rgba(255, 255, 255, 0.7); line-height: 25px; margin-top: 0px; background-color: rgba(0, 0, 0, 0.3); } #InfoBox .utilitiesTitle { font-size: 16px; font-weight: bold; text-align: center; color: #FFC147; margin-top: 5px; margin-bottom: 5px; } #InfoBox .leaderItem { font-size: 14px; } </style></h1> <div id="InfoBox"></div> </div>'.trim();leaderDisplay.parentNode.insertBefore(infoBox.firstChild,leaderDisplay.nextSibling);this.updateInfoBox()}}
updateInfoBox(){const infoBox=document.querySelector('#InfoBox');if(infoBox){const lines=this.features.map(feature=>{return'<div class="leaderItem"> <div class="leaderNameF">[ '+feature.hotkey.toUpperCase()+' ]  '+this.colorText(feature.name,[255,255,255])+'</div> <div class="leaderScore">'+this.colorText(feature.valueStr,this.featureColor(feature.valueStr))+'</div> </div>'});infoBox.innerHTML='<h1><div class="utilitiesTitle">Krunker Skid</div></h1>'+lines.join('').trim()}}
byte2Hex(n){var chars="0123456789ABCDEF";return String(chars.substr((n>>4)&0x0F,1))+chars.substr(n&0x0F,1)}
rgb2hex(r,g,b){return'#'+this.byte2Hex(r)+this.byte2Hex(g)+this.byte2Hex(b)}
colorText(str,rgb,options){return String('<font style="color:'+this.rgb2hex(rgb[0],rgb[1],rgb[2])+'"'+options+'>'+str+'</font>')}
onTick(me,world,inputs){this.me=me;this.world=world;this.inputs=inputs;this.view=document.getElementById("utilitiesView");for(let i=0,sz=this.features.length;i<sz;i++){const feature=this.features[i];switch(feature.name){case 'AutoAim':this.autoAim(feature.value);break;case 'AutoReload':if(feature.value)this.wpnReload();break;case 'AutoBhop':this.autoBhop(feature.value);break;case 'NoDeathDelay':if(feature.value&&this.me&&this.me.health===0){this.server.deathDelay=0}
break}}}
resetSettings(){if(confirm("Are you sure you want to reset all your skid settings? This will also refresh the page")){Object.keys(window.localStorage).filter(x=>x.includes("utilities_")).forEach(x=>window.localStorage.removeItem(x));window.location.reload()}}
newFeature(name,key,array){const cStruct=(...keys)=>((...v)=>keys.reduce((o,k,i)=>{o[k]=v[i];return o},{}));const feature=cStruct('name','hotkey','value','valueStr','container')
const value=parseInt(window.getSavedVal("utilities_"+name)||0);this.features.push(feature(name,key,value,array.length?array[value]:value?"On":"Off",array))}
getFeature(name){for(const feature of this.features){if(feature.name.toLowerCase()===name.toLowerCase()){return feature}}
return null}
featureColor(valueStr){switch(valueStr){case "On":return[178,242,82];case "Off":return[235,86,86];default:return[32,146,236]}}
onUpdated(feature){if(feature.container.length){feature.value+=1;if(feature.value>feature.container.length-1){feature.value=0}
feature.valueStr=feature.container[feature.value]}else{feature.value^=1;feature.valueStr=feature.value?"On":"Off"}
window.saveVal("utilities_"+feature.name,feature.value);this.updateInfoBox()}
getDistance3D(fromX,fromY,fromZ,toX,toY,toZ){var distX=fromX-toX,distY=fromY-toY,distZ=fromZ-toZ;return Math.sqrt(distX*distX+distY*distY+distZ*distZ)}
getDistance(player1,player2){return this.getDistance3D(player1.x,player1.y,player1.z,player2.x,player2.y,player2.z)}
getDirection(fromZ,fromX,toZ,toX){return Math.atan2(fromX-toX,fromZ-toZ)}
getXDir(fromX,fromY,fromZ,toX,toY,toZ){var dirY=Math.abs(fromY-toY),dist=this.getDistance3D(fromX,fromY,fromZ,toX,toY,toZ);return Math.asin(dirY/dist)*(fromY>toY?-1:1)}
getAngleDist(start,end){return Math.atan2(Math.sin(end-start),Math.cos(start-end))}
camLookAt(X,Y,Z){var xdir=this.getXDir(this.control.object.position.x,this.control.object.position.y,this.control.object.position.z,X,Y,Z),ydir=this.getDirection(this.control.object.position.z,this.control.object.position.x,Z,X),camChaseDst=this.server.camChaseDst;this.control.target={xD:xdir,yD:ydir,x:X+camChaseDst*Math.sin(ydir)*Math.cos(xdir),y:Y-camChaseDst*Math.sin(xdir),z:Z+camChaseDst*Math.cos(ydir)*Math.cos(xdir)}}
lookAt(target){this.camLookAt(target.x2,target.y2+target.height-target.headScale*0.75-this.server.crouchDst*target.crouchVal-this.me.recoilAnimY*this.server.recoilMlt,target.z2)}
getStatic(s,d){if(typeof s=='undefined'){return d}
return s}
getPlayers(){const players=this.world.players.list.filter(player=>{return player.active&&!player.isYou});return players}
getTarget(){const targets=this.getPlayers().filter(player=>{return player.inView&&(!player.team||player.team!==this.me.team)}).sort((p1,p2)=>this.getDistance(this.me,p1)-this.getDistance(this.me,p2));return targets[0]}
autoAim(value){if(!value)return;var lockedOn=!1;const target=this.getTarget();if(this.me.didShoot){this.settings.canShoot=!1;setTimeout(()=>{this.settings.canShoot=!0},this.me.weapon.rate/1.85);setTimeout(()=>{if(this.view)this.view.innerText=""},4000)}
if(target){this.world.config.deltaMlt=this.control.mouseDownL?3:1;let playerDist=(Math.round(this.getDistance(this.me,target))/10).toFixed(0);const currentXDR=this.control.xDr;const currentYDR=this.control.yDr;if(isNaN(playerDist))playerDist=0;switch(value){case 1:if(this.control.mouseDownR===1){this.lookAt(target);lockedOn=!0;if(this.view&&playerDist)this.view.innerText=playerDist+'mt'}
break;case 2:this.lookAt(target);if(this.control.mouseDownR===0){this.control.mouseDownR=2}else{lockedOn=!0;if(this.view&&playerDist)this.view.innerText=playerDist+'mt'}
break;case 3:lockedOn=this.quickscoper(target);this.control.xDr=currentXDR;this.control.yDr=currentYDR;if(this.view&&playerDist)this.view.innerText=playerDist+'mt';break}}
if(!lockedOn){this.camLookAt(0,0,0);this.control.target=null;if(this.control.mouseDownR==2){this.control.mouseDownR=0}
this.world.config.deltaMlt=1}}
quickscoper(target){if(this.control.mouseDownL===1){this.control.mouseDownL=0;this.control.mouseDownR=0;this.settings.scopingOut=!0}
if(this.me.aimVal===1){this.settings.scopingOut=!1}
if(this.settings.scopingOut||!this.settings.canShoot){return!1}
if(this.me.recoilForce>0.01){return!1}
if(this.control.mouseDownR!==2){this.control.mouseDownR=2}
if(this.me.aimVal<0.2){this.lookAt(target);this.control.mouseDownL^=1}
return!0}
autoBhop(value){if(!value)return;if(this.keysDown.Space){this.control.keys[this.control.jumpKey]=!this.control.keys[this.control.jumpKey];if(value===2){if(this.settings.isSliding){this.inputs[8]=1;return}
if(this.me.yVel<-0.04&&this.me.canSlide){this.settings.isSliding=!0;setTimeout(()=>{this.settings.isSliding=!1},this.me.slideTimer);this.inputs[8]=1}}}}
wpnReload(force=!1){const ammoLeft=this.me.ammos[this.me.weaponIndex];if(force||ammoLeft===0)this.world.players.reload(this.me)}}
var myScript=Utilities.toString();var patches=new Map().set("html_payPal_dupe",[/<script src=".*?paypal.*?"><\/script>/,``]).set("html_myScript",[/\*\/(!function)/,`*/${myScript}$1`]).set("html_exports",[/("}}}\).call\(this,\w\(\d+\)\)},function\(\w,\w,(\w)\){)/,'$1window.utilities=new Utilities($2);']).set("html_controlView",[/{(var \w=\w.getAngleDst)/,'{this.object.rotation.y=this.target.yD;this.pitchObject.rotation.x=this.target.xD;const half=Math.PI/2;this.yDr=Math.max(-half,Math.min(half,this.target.xD))%Math.PI;this.xDr=this.target.yD%Math.PI;$1']).set("html_control",[/(\w=)(this;this.gamepad)/,'$1utilities.control=$2']).set("html_procInputs",[/(this.procInputs=function\((\w),(\w),(\w)\){)/,'$1utilities.onTick(this,$3,$2);']).set("html_ui",[/(\w=)(this,\w={};this.frustum)/,'$1utilities.ui=$2']).set("html_fixHowler",[/(Howler.orientation(.+?)\)\),)/,'']).set("html_pInfo",[/if\(!tmpObj.inView\)continue;/,'']).set("html_wallhack",[/(\(((\w+))=this.map.manager.objects\[(\w+)]\))(.+?)\)/,'$1.penetrable&&$2.active)']).set("html_socket",[/(new WebSocket)/,'utilities.socket=$1'])
function attemptPatch(source,patches){for(const[name,item]of patches){const patched=source.replace(item[0],item[1]);if(source===patched){alert(`Failed to patch ${name}`);continue}else console.log("Successfully patched ",name);source=patched}
return source}
function writeToDom(html){try{window.document.open();window.document.write(html);window.document.close()}catch(err){try{window.location=`javascript: document.open(); document.write(${ JSON.stringify(html) }); document.close();`}catch(err2){window.location.reload()}}}(async function(){return fetch('https://krunker.io').then(res=>res.text()).then(html=>{const patched=attemptPatch(html,patches);writeToDom(patched);return new Promise(resolve=>{resolve()})})})()