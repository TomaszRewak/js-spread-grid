!function(e,t){if("object"==typeof exports&&"object"==typeof module)module.exports=t(require("react"));else if("function"==typeof define&&define.amd)define(["react"],t);else{var n="object"==typeof exports?t(require("react")):t(e.react);for(var o in n)("object"==typeof exports?exports:e)[o]=n[o]}}(self,(e=>(()=>{"use strict";var t={155:t=>{t.exports=e}},n={};function o(e){var i=n[e];if(void 0!==i)return i.exports;var r=n[e]={exports:{}};return t[e](r,r.exports,o),r.exports}o.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return o.d(t,{a:t}),t},o.d=(e,t)=>{for(var n in t)o.o(t,n)&&!o.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},o.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),o.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var i={};return(()=>{o.r(i),o.d(i,{default:()=>le});var e=o(155),t=o.n(e);function n(e){return null===e?"null":Array.isArray(e)?`[${e.map(n).join(",")}]`:"object"==typeof e?(t=e,`{${Object.keys(t).sort().map((e=>`${e}:${n(t[e])}`)).join(",")}}`):JSON.stringify(e);var t}function r(e,t){return"FILTER"===e.type^"FILTER"===t.type?"FILTER":"DATA"===e.type&&"DATA"===t.type?"DATA":"OTHER"}function l(e,t,o,i){return e.map((e=>{const l=n(e.columnId),s=n(e.rowId);if(!o.has(l))return null;if(!i.has(s))return null;const d=o.get(l),a=i.get(s);return{edit:t.resolve(a,d).edit,cell:e,type:r(d,a)}})).filter((e=>e?.edit))}function s(e,t){return Math.round(e*t)/t}function d(e,t,n){const o=e.state,i=e.canvases[`${t}-${n}`],r=o.sections[t],l=o.sections[n],d=l.columns,a=r.rows;if(0===a.length||0===d.length)return void(i.parentElement&&i.parentElement.removeChild(i));i.parentElement||e.element.appendChild(i);const c=i.getContext("2d",{alpha:!1}),u=o.scrollRect,h=o.textResolver,f=o.renderFormatResolver,m=o.borderWidth,p=r.showTopBorder,g=r.showBottomBorder,y=l.showLeftBorder,w=l.showRightBorder,x=m/2,b=a.length-1+(p?1:0)+(g?1:0),v=d.length-1+(y?1:0)+(w?1:0),k=a.map((e=>e.height)),R=d.map((e=>e.width)),B=R.reduce(((e,t)=>e+t),0)+v*m,E=k.reduce(((e,t)=>e+t),0)+b*m,A="center"===n?u.left:0,C="middle"===t?u.top:0,I="center"===n?u.width:l.width,M="middle"===t?u.height:r.height,L=R.reduce(((e,t,n)=>{const o=e[n]+t+m;return e.push(o),e}),[y?m:0]),T=k.reduce(((e,t,n)=>{const o=e[n]+t+m;return e.push(o),e}),[p?m:0]),F=L.slice(0,-1),N=T.slice(0,-1),S=Math.max(F.findLastIndex((e=>e<=A)),0),K=F.findLastIndex((e=>e<=A+I)),V=Math.max(N.findLastIndex((e=>e<=C)),0),D=N.findLastIndex((e=>e<=C+M)),P=Math.max(S,y?0:1),O=K+(w?1:0),W=Math.max(V,p?0:1),q=D+(g?1:0),Y=Array.from({length:D-V+1},((e,t)=>{const n=a[t+V];return Array.from({length:K-S+1},((e,t)=>{const o=d[t+S];return f.resolve(n,o)}))})),z=(e,t)=>Y[e-V][t-S];i.width=Math.round(I*devicePixelRatio),i.height=Math.round(M*devicePixelRatio),i.style.width=`${I}px`,i.style.height=`${M}px`,i.style.marginLeft=`${A}px`,i.style.marginTop=`${C}px`,i.style.marginRight=B-I-A+"px",i.style.marginBottom=E-M-C+"px",c.fillStyle="#E9E9E9",c.fillRect(0,0,i.width,i.height);const $=(e,t)=>{c.setTransform(devicePixelRatio,0,0,devicePixelRatio,(e-A)*devicePixelRatio,(t-C)*devicePixelRatio)},j=(e,t,n,o)=>{c.beginPath(),c.rect(e,t,n,o),c.clip()};for(let e=S;e<=K;e++){c.save(),$(L[e],0),j(0,0,R[e],E);for(let t=V;t<=D;t++){const n=z(t,e),o=n.style,i=T[t],r=L[e],l=R[e],d=k[t],a="text"in n?n.text:n.value,u=o.textAlign||"left",f=o.textBaseline||"middle",p="paddingLeft"in o?o.paddingLeft:5,g="paddingRight"in o?o.paddingRight:5,y="paddingTop"in o?o.paddingTop:2,w="paddingBottom"in o?o.paddingBottom:2;$(r,i),c.fillStyle=o.background||"white",c.fillRect(0,0,l,d),"draw"in n&&n.draw(c),o.highlight&&(c.fillStyle=o.highlight,c.fillRect(0,0,l,d)),o.corner&&(c.fillStyle=o.corner,c.beginPath(),c.moveTo(l-7,d),c.lineTo(l,d),c.lineTo(l,d-7),c.fill()),c.fillStyle=o.foreground||"black",c.font=o.font||"12px Calibri",c.textAlign=u;const b=h.getFontMetrics(c.font),v=s("left"===u?p:"center"===u?l/2:"right"===u?l-g:0,devicePixelRatio),B=s("top"===f?b.middle+b.topOffset+y:"middle"===f?d/2+b.middle:"bottom"===f?d+b.middle-b.bottomOffset-w:0,devicePixelRatio);B-b.middle-b.topOffset>=0&&B-b.middle+b.bottomOffset<=d?c.fillText(a,v,B):(c.strokeStyle="#E9E9E9",c.lineWidth=m,c.beginPath(),c.moveTo(0,m+x),c.lineTo(l,m+x),c.moveTo(0,d-m-x),c.lineTo(l,d-m-x),c.stroke(),c.save(),j(0,2*m,l,d-4*m),c.fillText(a,v,B),c.restore())}c.restore()}$(0,0);const _=(e,t,n,o,i)=>{if(!i)return;const r=i.width*m,l=t===o,s=e-(l?r/2:0),d=t-(l?0:r/2),a=n+(l?r/2:0),u=o+(l?0:r/2);c.strokeStyle=i.color||"black",c.lineWidth=r,i.dash?(c.setLineDash(i.dash.map((e=>e/devicePixelRatio))),c.lineDashOffset=l?s:d):c.setLineDash([]),c.beginPath(),c.moveTo(s,d),c.lineTo(a,u),c.stroke()},G=(e,t)=>e?t?e.index>t.index?e:t:e:t;for(let e=W;e<=q;e++){const t=e-1,n=e;for(let e=S;e<=K;e++){const o=G(t>=V?z(t,e).style.borderBottom:null,n<=D?z(n,e).style.borderTop:null);_(L[e]-x,T[n]-x,L[e+1]-x,T[n]-x,o)}}for(let e=P;e<=O;e++){const t=e-1,n=e;for(let e=V;e<=D;e++){const o=G(t>=S?z(e,t).style.borderRight:null,n<=K?z(e,n).style.borderLeft:null);_(L[n]-x,T[e]-x,L[n]-x,T[e+1]-x,o)}}}function a(e){d(e,"top","left"),d(e,"top","center"),d(e,"top","right"),d(e,"middle","left"),d(e,"middle","center"),d(e,"middle","right"),d(e,"bottom","left"),d(e,"bottom","center"),d(e,"bottom","right"),function(e){const t=e.element,n=e.input,o=e.state,i=o.inputPlacement;if(i){if(!n.parentElement){const o=document.activeElement===t;e.element.appendChild(n),o&&n.focus()}n.style.left=`${i.left}px`,n.style.top=`${i.top}px`,n.style.width=`${i.width}px`,n.style.height=`${i.height}px`,n.style.backgroundColor=o.isTextValid?"white":"#eb3434"}else if(n.parentElement){const e=document.activeElement===n;n.parentElement.removeChild(n),e&&t.focus()}}(e)}function c(e,t){return[{column:{match:"ANY"},row:{match:"HEADER"},value:({column:e})=>e.header},{column:{match:"ANY"},row:{match:"FILTER"},value:({newValue:e})=>e||"",text:({newValue:e})=>e||"Search...",edit:{validate:()=>!0,parse:({string:e})=>e}},{column:{match:"DATA"},row:{match:"DATA"},value:t},...e]}function u(e){return e}function h(e,t){return t?e+"99":e+"33"}function f(e,t,o,i,r,l){const s=t?n(t.columnId):null,d=t?n(t.rowId):null,a=o?n(o.columnId):null,c=o?n(o.rowId):null,u=(e,t,n,o)=>{if(n<0||n>=e.length)return!1;if(o<0||o>=t.length)return!1;const r=e[n].key,l=t[o].key;return i.isKeySelected(r,l)};return[{column:{match:"ANY"},row:{match:"FILTER"},style:({newValue:e})=>({background:"#FBFBFB",foreground:e?"black":"#cccccc",border:{width:1,color:"gray"}})},{column:{match:"ANY"},row:{match:"HEADER"},style:{background:"#F5F5F5",border:{width:1,color:"gray"}}},...e,{column:{match:"ANY"},row:{match:"ANY"},condition:({row:e,column:t})=>s===t.key||d===e.key,style:{highlight:"#81948133"}},{column:{match:"ANY"},row:{match:"ANY"},condition:({row:e,column:t})=>s===t.key&&d===e.key,style:{highlight:"#81948188"}},{column:{match:"ANY"},row:{match:"ANY"},condition:({rows:e,columns:t,row:n,column:o})=>u(e,t,n.index,o.index),style:({rows:e,columns:t,row:n,column:o,edit:i})=>({...u(e,t,n.index-1,o.index)?{}:{borderTop:{width:3,color:"#596959",index:Number.MAX_SAFE_INTEGER}},...u(e,t,n.index+1,o.index)?{}:{borderBottom:{width:3,color:"#596959",index:Number.MAX_SAFE_INTEGER}},...u(e,t,n.index,o.index-1)?{}:{borderLeft:{width:3,color:"#596959",index:Number.MAX_SAFE_INTEGER}},...u(e,t,n.index,o.index+1)?{}:{borderRight:{width:3,color:"#596959",index:Number.MAX_SAFE_INTEGER}},highlight:h(i?"#798d9c":"#819481",a!==o.key||c!==n.key)})},{column:{match:"ANY"},row:{match:"ANY"},condition:({row:e,column:t})=>r.isKeySelected(e.key,t.key),style:({row:e,column:t})=>({highlight:h("#93a8b8",a!==t.key||c!==e.key)})},{column:{match:"ANY"},row:{match:"ANY"},condition:({row:e,column:t})=>a===t.key&&c===e.key,style:{background:"white"}},{column:{match:"ANY"},row:{match:"ANY"},condition:({edit:e})=>e,style:{corner:"#77777720"}},{column:{match:"ANY"},row:{match:"ANY"},condition:({row:e,column:t})=>l.hasValueByKey(e.key,t.key),style:{corner:"darkgreen"}}]}function m(e,t){const n=t.filter((e=>"BEGIN"===e.pinned)).length,o=t.filter((e=>"END"===e.pinned)).length,i=t.length-n-o,r=e.filter((e=>"BEGIN"===e.pinned)).length,l=e.filter((e=>"END"===e.pinned)).length,s=e.length-r-l,d=t.slice(0,n),a=t.slice(t.length-o,t.length),c=t.slice(n,t.length-o),u=e.slice(0,r),h=e.slice(e.length-l,e.length),f=e.slice(r,e.length-l),m=n>0,p=r>0,g=i>0||!m,y=!m,w=!(o>0),x=s>0||!p,b=!p,v=!(l>0),k=(e,t,n)=>{if(0===e.length)return 0;const o=t?e.at(0).topWithBorder:e.at(0).top;return(n?e.at(-1).bottomWithBorder:e.at(-1).bottom)-o},R=(e,t,n)=>{if(0===e.length)return 0;const o=t?e.at(0).leftWithBorder:e.at(0).left;return(n?e.at(-1).rightWithBorder:e.at(-1).right)-o};return{top:{rows:d,showTopBorder:!0,showBottomBorder:!0,height:k(d,!0,!0)},bottom:{rows:a,showTopBorder:g,showBottomBorder:!0,height:k(a,g,!0)},middle:{rows:c,showTopBorder:y,showBottomBorder:w,height:k(c,y,w)},left:{columns:u,showLeftBorder:!0,showRightBorder:!0,width:R(u,!0,!0)},right:{columns:h,showLeftBorder:x,showRightBorder:!0,width:R(h,x,!0)},center:{columns:f,showLeftBorder:b,showRightBorder:v,width:R(f,b,v)}}}function p(e){return e}function g(e,t){return[...e,...t.map((e=>({columnId:e.columnId,rowId:e.rowId,value:e.expression})))]}class y{constructor(e){this.lookup=new Map,e.forEach((e=>{const t=n(e.rowId),o=n(e.columnId);this.lookup.has(t)||this.lookup.set(t,new Map),this.lookup.get(t).set(o,e.value)}))}hasValueByKey(e,t){return this.lookup.has(e)&&this.lookup.get(e).has(t)}getValueByKey(e,t){if(this.hasValueByKey(e,t))return this.lookup.get(e).get(t)}hasValueById(e,t){return this.hasValueByKey(n(e),n(t))}getValueById(e,t){return this.getValueByKey(n(e),n(t))}}function w(e){return new y(e)}class x{constructor(e){this.lookup=new Map,this.filteredColumns=new Set,this.filteredRows=new Set,e.forEach((e=>{const t=n(e.rowId),o=n(e.columnId);this.lookup.has(t)||this.lookup.set(t,new Map),this.lookup.get(t).set(o,e.expression),this.filteredColumns.add(o),this.filteredRows.add(t)}))}hasRowFilters(){return this.filteredRows.size>0}hasColumnFilters(){return this.filteredColumns.size>0}hasRowFiltersByKey(e){return this.filteredRows.has(e)}hasColumnFiltersByKey(e){return this.filteredColumns.has(e)}hasValueByKey(e,t){return this.lookup.has(e)&&this.lookup.get(e).has(t)}getValueByKey(e,t){if(this.hasValueByKey(e,t))return this.lookup.get(e).get(t)}hasValueById(e,t){return this.hasValueByKey(n(e),n(t))}getValueById(e,t){return this.getValueByKey(n(e),n(t))}hasValueByKeyAndSelector(e,t,n){return"ROW"===n.type?this.hasValueByKey(n.key,t):"COLUMN"===n.type&&this.hasValueByKey(e,n.key)}getValueByKeyAndSelector(e,t,n){return"ROW"===n.type?this.getValueByKey(n.key,t):"COLUMN"===n.type?this.getValueByKey(e,n.key):void 0}}function b(e){return new x(e)}class v{constructor(e){this.lookup=new Map,e.forEach((e=>{const t=n(e.rowId),o=n(e.columnId);this.lookup.has(t)||this.lookup.set(t,new Set),this.lookup.get(t).add(o)}))}isKeySelected(e,t){return this.lookup.has(e)&&this.lookup.get(e).has(t)}isIdSelected(e,t){return this.isKeySelected(n(e),n(t))}}function k(e){return new v(e)}function R(e,t){return"function"==typeof e?e(t):e}function B(e,t,n,o){return e<n?"BEGIN":e>=t-o?"END":void 0}function E(e,t,o){return e.map(((i,r)=>({...i,type:i.type||"DATA",index:r,key:n(i.id),pinned:B(r,e.length,t,o)})))}function A(e,t,n){let o=n;return e.map(((e,i)=>{const r=s(e.width,t),l={...e,index:i,width:r,leftWithBorder:o-n,left:o,right:o+r,rightWithBorder:o+r+n};return o+=l.width+n,l}))}function C(e,t,n){let o=n;return e.map(((e,i)=>{const r=s(e.height,t),l={...e,index:i,height:r,topWithBorder:o-n,top:o,bottom:o+r,bottomWithBorder:o+r+n};return o+=l.height+n,l}))}const I=["borderTop","borderRight","borderBottom","borderLeft"];function M(e,t){const n={...e};if("border"in n){for(const e of I)n[e]=n.border;delete n.border}for(const e of I)e in n&&(n[e]={...n[e],index:t});return n}class L{byKey=new Map;byIndex=new Map;byMatch=new Map}const T={HEADER:["HEADER"],FILTER:["FILTER"],DATA:["DATA"],ANY:["HEADER","DATA","FILTER"],undefined:[]};class F{constructor(e){this.columnLookup=new L,this.rulesCount=0;for(const t of e)this.addRule(t)}addRule(e){const t=this.columnLookup,o=this.rulesCount++,i="column"in e?"id"in e.column?{key:n(e.column.id)}:e.column:{match:"DATA"},r="row"in e?"id"in e.row?{key:n(e.row.id)}:e.row:{match:"DATA"},l={};var s;function d(e,t){e.has(t)||e.set(t,[]),e.get(t).push({index:o,...l})}function a(e,t){e.has(t)||e.set(t,new L),"key"in r&&d(e.get(t).byKey,r.key),"index"in r&&d(e.get(t).byIndex,r.index);for(const n of T[r.match])d(e.get(t).byMatch,n)}"condition"in e&&(l.condition=e.condition),"style"in e&&(l.style="function"==typeof e.style?e.style:()=>e.style),"value"in e&&(l.value="function"==typeof e.value?e.value:()=>e.value),"text"in e&&(l.text="function"==typeof e.text?e.text:()=>e.text),"edit"in e&&(l.edit=e.edit),"draw"in e&&(l.draw=e.draw),"filter"in e&&(l.filter={by:{type:(s=e.filter).by.type,key:n(s.by.id)},condition:s.condition}),"key"in i&&a(t.byKey,i.key),"index"in i&&a(t.byIndex,i.index);for(const e of T[i.match])a(t.byMatch,e)}resolve(e,t,n,o,i,r,l){const s=this.columnLookup,d=[];function a(e){for(const t of e)d.push(t)}function c(e){e.byKey.has(o.key)&&a(e.byKey.get(o.key)),e.byIndex.has(o.index)&&a(e.byIndex.get(o.index)),e.byMatch.has(o.type)&&a(e.byMatch.get(o.type))}s.byKey.has(i.key)&&c(s.byKey.get(i.key)),s.byIndex.has(i.index)&&c(s.byIndex.get(i.index)),s.byMatch.has(i.type)&&c(s.byMatch.get(i.type)),d.sort(((e,t)=>e.index-t.index));let u,h={data:e,rows:t,columns:n,row:o,column:i},f={},m=!0;r.hasValueByKey(o.key,i.key)&&(h={...h,newValue:r.getValueByKey(o.key,i.key)});for(const e of d)if(!("condition"in e)||e.condition(h)){if("value"in e&&(h={...h,value:e.value(h)}),"style"in e&&(f={...f,...M(e.style(h),e.index)}),"text"in e&&(h={...h,text:e.text(h)}),"edit"in e&&(h={...h,edit:e.edit}),"draw"in e){const t=h;u=n=>e.draw({...t,ctx:n})}if("filter"in e&&l.hasValueByKeyAndSelector(o.key,i.key,e.filter.by)){const t={...h,expression:l.getValueByKeyAndSelector(o.key,i.key,e.filter.by)};m=m&&e.filter.condition(t)}}const p={style:f,visible:m};return"value"in h&&(p.value=h.value),"edit"in h&&(p.edit=h.edit),void 0!==u&&(p.draw=u),"text"in h&&(p.text=h.text),p}}function N(e){return new F(e)}class S{constructor(e,t,n,o,i){this.formattingRules=e,this.data=t,this.rows=n,this.columns=o,this.edition=i,this.filtering=new x([])}resolve(e,t){return this.formattingRules.resolve(this.data,this.rows,this.columns,e,t,this.edition,this.filtering)}}function K(e,t,n,o,i){return new S(e,t,n,o,i)}class V{constructor(e,t,n,o,i){this.formattingRules=e,this.data=t,this.rows=n,this.columns=o,this.edition=new y([]),this.filtering=i}findVisibleColumns(){return this.filtering.hasRowFilters()?this.columns.filter((e=>this.rows.every((t=>!this.filtering.hasRowFiltersByKey(t.key)||this.formattingRules.resolve(this.data,this.rows,this.columns,t,e,this.edition,this.filtering).visible)))):this.columns}findVisibleRows(){return this.filtering.hasColumnFilters()?this.rows.filter((e=>this.columns.every((t=>!this.filtering.hasColumnFiltersByKey(t.key)||this.formattingRules.resolve(this.data,this.rows,this.columns,e,t,this.edition,this.filtering).visible)))):this.rows}}function D(e,t,n,o,i){return new V(e,t,n,o,i)}function P(e){return e.findVisibleColumns()}function O(e){return e.findVisibleRows()}function W(e,t,n,o){return{top:e,bottom:t,left:n,right:o}}function q(e,t){return{width:e.length?e.at(-1).rightWithBorder:0,height:t.length?t.at(-1).bottomWithBorder:0}}class Y{constructor(){this.canvas=document.createElement("canvas"),this.context=this.canvas.getContext("2d"),this.fontMetrics=new Map}getFontMetrics(e){const t=e;if(this.fontMetrics.has(t))return this.fontMetrics.get(t);const n=this.context;n.font=e;const o=n.measureText("X"),i=(o.actualBoundingBoxDescent-o.actualBoundingBoxAscent)/2,r={topOffset:i+o.fontBoundingBoxAscent,middle:-i,bottomOffset:o.fontBoundingBoxDescent-i};return this.fontMetrics.set(t,r),r}}function z(){return new Y}function $(e,t){return t.top>=e.top&&t.left>=e.left&&t.top+t.height<=e.top+e.height&&t.left+t.width<=e.left+e.width}function j(e,t){const n={top:Math.max(e.top,t.top),left:Math.max(e.left,t.left),width:Math.min(e.left+e.width,t.left+t.width)-Math.max(e.left,t.left),height:Math.min(e.top+e.height,t.top+t.height)-Math.max(e.top,t.top)};return n.width>=0&&n.height>=0?n:{top:e.top,left:e.left,width:0,height:0}}function _(e,t){return{top:e.top-t,left:e.left-t,width:e.width+2*t,height:e.height+2*t}}function G(e){return e.width*e.height}function H(e,t){return{top:e.top,left:e.left,width:Math.max(0,e.width-t.left-t.right),height:Math.max(0,e.height-t.top-t.bottom)}}const X=200,U=400,J={left:0,top:0,width:0,height:0};function Q(e){return e.reduce(((e,t)=>e.set(t.key,t)),new Map)}function Z(e,t,o,i,r,l,s){if(!e)return[];if(!o)return[];if(!t)return[];const d=n(t.columnId),a=n(t.rowId),c=n(o.columnId),u=n(o.rowId);if(!l.has(d))return[];if(!s.has(a))return[];if(!l.has(c))return[];if(!s.has(u))return[];const h=Math.min(l.get(d).index,l.get(c).index),f=Math.max(l.get(d).index,l.get(c).index),m=Math.min(s.get(a).index,s.get(u).index),p=Math.max(s.get(a).index,s.get(u).index);return i.slice(h,f+1).flatMap((e=>r.slice(m,p+1).map((t=>({rowId:t.id,columnId:e.id})))))}function ee(e,t,o,i){if(!t)return null;const r=n(t.columnId),l=n(t.rowId);if(!o.has(r))return null;if(!i.has(l))return null;const s=o.get(r),d=i.get(l);return 0===e.length?null:{left:s.left,top:d.top,width:s.width,height:d.height,boxSizing:"border-box"}}function te(e,t){return t.every((t=>t.edit.validate({string:e})))}function ne(e){console.count("updateState");const t={...e.localOptions,...e.externalOptions},n=e.memory,o=e.state;function i(e,t,o){const i=n[e]&&n[e].dependencies;return i&&!o.some(((e,t)=>e!==i[t]))||(n[e]={value:t(...o),dependencies:o}),n[e].value}const r=window.devicePixelRatio,s=t.borderWidth/r,d=t.data,a=e.input.value,h=i("dataFormatting",c,[t.formatting,t.dataSelector]),y=i("editedCellsAndFilters",g,[t.editedCells,t.filters]),x=i("edition",w,[y]),v=i("filters",b,[t.filters]),B=i("invokedColumns",R,[t.columns,d]),I=i("invokedRows",R,[t.rows,d]),M=i("unfilteredColumns",E,[B,t.pinnedLeft,t.pinnedRight]),L=i("unfilteredRows",E,[I,t.pinnedTop,t.pinnedBottom]),T=i("visibilityFormatting",p,[h]),F=i("visibilityFormattingRules",N,[T]),S=i("visibilityResolver",D,[F,d,L,M,v]),V=i("filteredColumns",P,[S]),Y=i("filteredRows",O,[S]),ne=i("columns",A,[V,r,s]),oe=i("rows",C,[Y,r,s]),ie=i("columnLookup",Q,[ne]),re=i("rowLookup",Q,[oe]),le=t.focusedCell,se=i("sections",m,[ne,oe]),de=t.selectedCells,ae=i("fixedSize",W,[se.top.height,se.bottom.height,se.left.width,se.right.width]),ce=i("totalSize",q,[ne,oe]),ue=function(e,t,n,o,i,r){if(!t)return null;if(t.x<0||t.y<0||t.x>r.width||t.y>r.height)return null;const l=e.scrollLeft,s=e.scrollTop,d=e.clientWidth,a=e.clientHeight,c=t.x<=i.left?t.x:t.x>=d-i.right?r.width-d+t.x:t.x+l,u=function(e,t){if(0===e.length)return-1;if(t<e[0].topWithBorder)return-1;if(t>e[e.length-1].bottomWithBorder)return-1;let n=0,o=e.length-1;for(;n<=o;){const i=Math.floor((n+o)/2);if(t<e[i].topWithBorder)o=i-1;else{if(!(t>e[i].bottomWithBorder))return i;n=i+1}}return-1}(n,t.y<=i.top?t.y:t.y>=a-i.bottom?r.height-a+t.y:t.y+s),h=function(e,t){if(0===e.length)return-1;if(t<e[0].leftWithBorder)return-1;if(t>e[e.length-1].rightWithBorder)return-1;let n=0,o=e.length-1;for(;n<=o;){const i=Math.floor((n+o)/2);if(t<e[i].leftWithBorder)o=i-1;else{if(!(t>e[i].rightWithBorder))return i;n=i+1}}return-1}(o,c);return-1===u||-1===h?null:{rowId:n[u].id,columnId:o[h].id}}(e.element,e.mousePosition,oe,ne,ae,ce),he=i("highlightedCells",Z,[e.isMouseDown,le,ue,ne,oe,ie,re]),fe=i("selection",k,[de]),me=i("highlight",k,[he]),pe=i("renderFormatting",f,[h,ue,le,fe,me,x]),ge=i("renderFormattingRules",N,[pe]),ye=i("renderFormatResolver",K,[ge,d,oe,ne,x]),we=i("inputFormatting",u,[h]),xe=i("inputFormattingRules",N,[we]),be=i("inputFormatResolver",K,[xe,d,oe,ne,x]),ve=i("textResolver",z,[]),ke=i("editableCells",l,[de,be,ie,re]),Re=i("inputPlacement",ee,[ke,le,ie,re]),Be=i("isTextValid",te,[a,ke]),Ee=function(e,t,n,o){const i={width:o.getBoundingClientRect().width,height:o.getBoundingClientRect().height},r={left:o.scrollLeft,top:o.scrollTop},l=e||J,s=H({left:0,top:0,...t},n),d=H({...r,...i},n),a=j(s,_(d,X)),c=j(s,_(d,U));return $(s,l)&&$(l,a)?G(l)>2*G(c)?c:l:c}(o?.scrollRect,ce,ae,e.element);e.state={options:t,devicePixelRatio:r,borderWidth:s,data:d,dataFormatting:h,edition:x,filters:v,unfilteredColumns:M,unfilteredRows:L,visibilityFormatting:T,visibilityResolver:S,filteredColumns:V,filteredRows:Y,columns:ne,rows:oe,sections:se,selectedCells:de,selection:fe,highlight:me,hoveredCell:ue,focusedCell:le,renderFormatting:pe,renderFormatResolver:ye,inputFormatting:we,inputFormatResolver:be,fixedSize:ae,totalSize:ce,textResolver:ve,scrollRect:Ee,highlightedCells:he,inputPlacement:Re,columnLookup:ie,rowLookup:re,text:a,isTextValid:Be}}function oe(e,t){const n=new v(t);return[...t,...e.filter((e=>!n.isIdSelected(e.rowId,e.columnId)))]}function ie(e,t){const n=new v(t);return e.filter((e=>!n.isIdSelected(e.rowId,e.columnId)))}function re(e){if("spread-grid-context"in e)return;const t={"top-left":document.createElement("canvas"),"top-center":document.createElement("canvas"),"top-right":document.createElement("canvas"),"middle-left":document.createElement("canvas"),"middle-center":document.createElement("canvas"),"middle-right":document.createElement("canvas"),"bottom-left":document.createElement("canvas"),"bottom-center":document.createElement("canvas"),"bottom-right":document.createElement("canvas")},o=document.createElement("input");e.setAttribute("tabindex","0"),e.setAttribute("style","max-width: 100vw; max-height: 100vh; overflow: auto; display: grid; position: relative; grid-template-columns: fit-content(0) fit-content(0) fit-content(0); grid-template-rows: fit-content(0) fit-content(0) fit-content(0); outline: none;"),e.classList.add("spread-grid"),t["top-left"].setAttribute("style","position: sticky; left: 0; top: 0; z-index: 2; grid-row: 1; grid-column: 1;"),t["top-center"].setAttribute("style","position: sticky; top: 0; z-index: 1; grid-row: 1; grid-column: 2;"),t["top-right"].setAttribute("style","position: sticky; right: 0; top: 0; z-index: 2; grid-row: 1; grid-column: 3;"),t["middle-left"].setAttribute("style","position: sticky; left: 0; z-index: 1; grid-row: 2; grid-column: 1;"),t["middle-center"].setAttribute("style","grid-row: 2; grid-column: 2;"),t["middle-right"].setAttribute("style","position: sticky; right: 0; z-index: 1; grid-row: 2; grid-column: 3;"),t["bottom-left"].setAttribute("style","position: sticky; left: 0; bottom: 0; z-index: 2; grid-row: 3; grid-column: 1;"),t["bottom-center"].setAttribute("style","position: sticky; bottom: 0; z-index: 1; grid-row: 3; grid-column: 2;"),t["bottom-right"].setAttribute("style","position: sticky; right: 0; bottom: 0; z-index: 2; grid-row: 3; grid-column: 3;"),o.setAttribute("style","position: absolute; z-index: 3; outline: none; border: none; box-shadow: none; padding: 0 5px; font-size: 12px; font-family: Calibri; background-color: white; box-sizing: border-box; opacity: 0; pointer-events: none;");const i={externalOptions:{},state:null,memory:{},element:e,canvases:t,input:o,renderRequested:!1,mousePosition:null,isMouseDown:!1,requestNewRender:()=>{i.renderRequested||(i.renderRequested=!0,requestAnimationFrame((()=>{i.renderRequested=!1,ne(i),a(i)})))}};i.localOptions={data:[],columns:e=>e.length>0?Object.keys(e[0]).map((e=>({id:e,header:e,width:100}))):[],rows:e=>[{id:"top-header",type:"HEADER",height:20},...e.map(((e,t)=>({id:t,height:20})))],formatting:[],dataSelector:({data:e,row:t,column:n})=>e[t.id][n.id],pinnedTop:0,pinnedBottom:0,pinnedLeft:0,pinnedRight:0,borderWidth:1,focusedCell:null,onFocusedCellChange:e=>{i.localOptions.focusedCell=e,i.requestNewRender()},selectedCells:[],onSelectedCellsChange:e=>{i.localOptions.selectedCells=e,i.requestNewRender()},highlightedCells:[],editedCells:[],onEditedCellsChange:e=>{i.localOptions.editedCells=e,i.requestNewRender()},filters:[],onFiltersChange:e=>{i.localOptions.filters=e,i.requestNewRender()}},e["spread-grid-context"]=i;const r=e=>{o.value=e,o.dispatchEvent(new Event("input"))};e.addEventListener("scroll",(e=>{i.requestNewRender()})),e.addEventListener("mouseenter",(t=>{i.mousePosition={x:t.clientX-e.offsetLeft,y:t.clientY-e.offsetTop},i.requestNewRender()})),e.addEventListener("mousemove",(t=>{i.mousePosition={x:t.clientX-e.offsetLeft,y:t.clientY-e.offsetTop},i.requestNewRender()})),e.addEventListener("mouseleave",(()=>{i.mousePosition=null,i.requestNewRender()})),e.addEventListener("mousedown",(e=>{ne(i),r(""),i.isMouseDown=!0,i.state.options.onFocusedCellChange(i.state.hoveredCell),e.ctrlKey||i.state.options.onSelectedCellsChange([]),i.requestNewRender()})),e.addEventListener("mouseup",(e=>{ne(i),i.isMouseDown=!1,i.state.options.onSelectedCellsChange(oe(i.state.options.selectedCells,i.state.highlightedCells)),i.requestNewRender()})),e.addEventListener("dblclick",(e=>{ne(i);const t=i.state.focusedCell;if(null===t)return;const l=n(t.columnId),s=n(t.rowId),d=i.state.columnLookup,a=i.state.rowLookup,c=i.state.inputFormatResolver;if(!d.has(l))return;if(!a.has(s))return;const u=d.get(l),h=a.get(s),f=`${c.resolve(h,u).value}`;r(f),o?.select()})),e.addEventListener("focus",(()=>{o.parentElement&&o.focus()})),e.addEventListener("keydown",(e=>{ne(i);const t=i.state.focusedCell,o=i.state.columnLookup,s=i.state.rowLookup,d=i.state.inputFormatResolver,a=i.state.options.selectedCells,c=i.state.options.onSelectedCellsChange,u=i.state.options.onFocusedCellChange,h=i.state.options.editedCells,f=i.state.options.onEditedCellsChange,m=i.state.options.onFiltersChange,p=i.state.columns,g=i.state.rows,y=i.state.text,w=i.state.isTextValid,x=(e,t)=>{u(e),t.shiftKey?c(oe(a,[e])):c([e])},b=(e,i)=>{if(!t)return;const r=n(t.columnId);if(!o.has(r))return;const l=o.get(r).index,s=Math.max(0,Math.min(p.length-1,l+e));if(s===l)return;const d={rowId:t.rowId,columnId:p[s].id};x(d,i)},v=(e,o)=>{if(!t)return;const i=n(t.rowId);if(!s.has(i))return;const r=s.get(i).index,l=Math.max(0,Math.min(g.length-1,r+e));if(l===r)return;const d={rowId:g[l].id,columnId:t.columnId};x(d,o)},k=()=>{e.preventDefault(),e.stopPropagation()};switch(e.key){case"Escape":""!==y?r(""):a.length>1?c([t]):h.length>0?f([]):(u(null),c([]));break;case"Enter":(()=>{const e=l(a,d,o,s);if(""===y)return;if(!w)return;const t=e.filter((e=>"DATA"===e.type)),n=e.filter((e=>"FILTER"===e.type));var c;c=t.map((e=>({...e.cell,value:e.edit.parse({string:y})}))),f(oe(i.state.options.editedCells,c)),(e=>{m(oe(i.state.options.filters,e))})(n.map((e=>({...e.cell,expression:e.edit.parse({string:y})})))),r("")})();break;case"ArrowUp":k(),v(e.ctrlKey?-g.length:-1,e);break;case"ArrowDown":k(),v(e.ctrlKey?g.length:1,e);break;case"ArrowLeft":k(),b(e.ctrlKey?-p.length:-1,e);break;case"ArrowRight":k(),b(e.ctrlKey?p.length:1,e);break;case"Delete":case"Backspace":R=a,f(ie(i.state.options.editedCells,R)),(e=>{m(ie(i.state.options.filters,e))})(a)}var R})),new ResizeObserver((()=>{i.requestNewRender()})).observe(e),o.addEventListener("input",(e=>{e.target.value?(o.style.opacity=1,o.style.pointerEvents="auto"):(o.style.opacity=0,o.style.pointerEvents="none")})),o.addEventListener("click",(e=>{e.stopPropagation()})),o.addEventListener("dblclick",(e=>{e.stopPropagation()})),o.addEventListener("mousedown",(e=>{e.stopPropagation()})),o.addEventListener("keydown",(e=>{switch(e.key){case"Enter":case"Escape":break;case"Delete":case"Backspace":case"ArrowUp":case"ArrowDown":case"ArrowLeft":case"ArrowRight":""!==o.value&&(e.stopPropagation(),i.requestNewRender());break;default:e.stopPropagation(),i.requestNewRender()}}))}function le(n){const[o,i]=(0,e.useState)(null);return o&&function(e,t){console.log("createGrid"),re(e);const n=e["spread-grid-context"];n.externalOptions=t,null===n.state?(ne(n),a(n)):n.requestNewRender()}(o,n),t().createElement("div",{ref:i})}})(),i})()));