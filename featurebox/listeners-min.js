function listAllEventListeners(){const e=Array.prototype.slice.call(document.querySelectorAll("*"));e.push(document),e.push(window);const t=[];for(let e in window)/^on/.test(e)&&(t[t.length]=e);let n=[];for(let s=0;s<e.length;s++){const i=e[s];for(let e=0;e<t.length;e++)"function"==typeof i[t[e]]&&n.push({node:i,type:t[e],func:i[t[e]].toString()});if("function"==typeof i._getEventListeners&&(evts=i._getEventListeners(),Object.keys(evts).length>0))for(let e of Object.keys(evts))for(k=0;k<evts[e].length;k++)n.push({node:i,type:e,func:evts[e][k].listener.toString()})}return n.sort()}function _showEvents(e){for(let t of Object.keys(e))for(let n=0;n<e[t].length;n++);}EventTarget.prototype._addEventListener=EventTarget.prototype.addEventListener,EventTarget.prototype.addEventListener=function(e,t,n){null==n&&(n=!1),this._addEventListener(e,t,n),this.eventListenerList||(this.eventListenerList={}),this.eventListenerList[e]||(this.eventListenerList[e]=[]),this.eventListenerList[e].push({listener:t,options:n})},EventTarget.prototype._getEventListeners=function(e){return this.eventListenerList||(this.eventListenerList={}),null==e?this.eventListenerList:this.eventListenerList[e]},EventTarget.prototype._removeEventListener=EventTarget.prototype.removeEventListener,EventTarget.prototype.removeEventListener=function(e,t,n){null==n&&(n=!1),this._removeEventListener(e,t,n),this.eventListenerList||(this.eventListenerList={}),this.eventListenerList[e]||(this.eventListenerList[e]=[]);for(let t=0;t<this.eventListenerList[e].length;t++)if(this.eventListenerList[e][t].listener,this.eventListenerList[e][t].options==n){this.eventListenerList[e].splice(t,1);break}0==this.eventListenerList[e].length&&delete this.eventListenerList[e]};