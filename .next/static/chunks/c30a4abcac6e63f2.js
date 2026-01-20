(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,67881,25913,e=>{"use strict";var t=e.i(43476),r=e.i(91918),s=e.i(7670);let i=e=>"boolean"==typeof e?`${e}`:0===e?"0":e,a=s.clsx,n=(e,t)=>r=>{var s;if((null==t?void 0:t.variants)==null)return a(e,null==r?void 0:r.class,null==r?void 0:r.className);let{variants:n,defaultVariants:o}=t,u=Object.keys(n).map(e=>{let t=null==r?void 0:r[e],s=null==o?void 0:o[e];if(null===t)return null;let a=i(t)||i(s);return n[e][a]}),l=r&&Object.entries(r).reduce((e,t)=>{let[r,s]=t;return void 0===s||(e[r]=s),e},{});return a(e,u,null==t||null==(s=t.compoundVariants)?void 0:s.reduce((e,t)=>{let{class:r,className:s,...i}=t;return Object.entries(i).every(e=>{let[t,r]=e;return Array.isArray(r)?r.includes({...o,...l}[t]):({...o,...l})[t]===r})?[...e,r,s]:e},[]),null==r?void 0:r.class,null==r?void 0:r.className)};e.s(["cva",0,n],25913);var o=e.i(47163);let u=n("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",{variants:{variant:{default:"bg-primary text-primary-foreground hover:bg-primary/90",destructive:"bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",outline:"border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",secondary:"bg-secondary text-secondary-foreground hover:bg-secondary/80",ghost:"hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",link:"text-primary underline-offset-4 hover:underline"},size:{default:"h-9 px-4 py-2 has-[>svg]:px-3",sm:"h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",lg:"h-10 rounded-md px-6 has-[>svg]:px-4",icon:"size-9","icon-sm":"size-8","icon-lg":"size-10"}},defaultVariants:{variant:"default",size:"default"}});function l({className:e,variant:s,size:i,asChild:a=!1,...n}){let l=a?r.Slot:"button";return(0,t.jsx)(l,{"data-slot":"button",className:(0,o.cn)(u({variant:s,size:i,className:e})),...n})}e.s(["Button",()=>l],67881)},70065,e=>{"use strict";var t=e.i(43476),r=e.i(47163);function s({className:e,...s}){return(0,t.jsx)("div",{"data-slot":"card",className:(0,r.cn)("bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",e),...s})}function i({className:e,...s}){return(0,t.jsx)("div",{"data-slot":"card-header",className:(0,r.cn)("@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",e),...s})}function a({className:e,...s}){return(0,t.jsx)("div",{"data-slot":"card-title",className:(0,r.cn)("leading-none font-semibold",e),...s})}function n({className:e,...s}){return(0,t.jsx)("div",{"data-slot":"card-description",className:(0,r.cn)("text-muted-foreground text-sm",e),...s})}function o({className:e,...s}){return(0,t.jsx)("div",{"data-slot":"card-content",className:(0,r.cn)("px-6",e),...s})}e.s(["Card",()=>s,"CardContent",()=>o,"CardDescription",()=>n,"CardHeader",()=>i,"CardTitle",()=>a])},99682,e=>{"use strict";var t=e.i(71645);function r(e){let r=t.useRef({value:e,previous:e});return t.useMemo(()=>(r.current.value!==e&&(r.current.previous=r.current.value,r.current.value=e),r.current.previous),[e])}e.s(["usePrevious",()=>r])},54616,e=>{"use strict";var t=e.i(71645),r=e.i(14272),s=e.i(40143),i=e.i(15823),a=e.i(19273),n=class extends i.Subscribable{#e;#t=void 0;#r;#s;constructor(e,t){super(),this.#e=e,this.setOptions(t),this.bindMethods(),this.#i()}bindMethods(){this.mutate=this.mutate.bind(this),this.reset=this.reset.bind(this)}setOptions(e){let t=this.options;this.options=this.#e.defaultMutationOptions(e),(0,a.shallowEqualObjects)(this.options,t)||this.#e.getMutationCache().notify({type:"observerOptionsUpdated",mutation:this.#r,observer:this}),t?.mutationKey&&this.options.mutationKey&&(0,a.hashKey)(t.mutationKey)!==(0,a.hashKey)(this.options.mutationKey)?this.reset():this.#r?.state.status==="pending"&&this.#r.setOptions(this.options)}onUnsubscribe(){this.hasListeners()||this.#r?.removeObserver(this)}onMutationUpdate(e){this.#i(),this.#a(e)}getCurrentResult(){return this.#t}reset(){this.#r?.removeObserver(this),this.#r=void 0,this.#i(),this.#a()}mutate(e,t){return this.#s=t,this.#r?.removeObserver(this),this.#r=this.#e.getMutationCache().build(this.#e,this.options),this.#r.addObserver(this),this.#r.execute(e)}#i(){let e=this.#r?.state??(0,r.getDefaultState)();this.#t={...e,isPending:"pending"===e.status,isSuccess:"success"===e.status,isError:"error"===e.status,isIdle:"idle"===e.status,mutate:this.mutate,reset:this.reset}}#a(e){s.notifyManager.batch(()=>{if(this.#s&&this.hasListeners()){let t=this.#t.variables,r=this.#t.context,s={client:this.#e,meta:this.options.meta,mutationKey:this.options.mutationKey};e?.type==="success"?(this.#s.onSuccess?.(e.data,t,r,s),this.#s.onSettled?.(e.data,null,t,r,s)):e?.type==="error"&&(this.#s.onError?.(e.error,t,r,s),this.#s.onSettled?.(void 0,e.error,t,r,s))}this.listeners.forEach(e=>{e(this.#t)})})}},o=e.i(12598);function u(e,r){let i=(0,o.useQueryClient)(r),[u]=t.useState(()=>new n(i,e));t.useEffect(()=>{u.setOptions(e)},[u,e]);let l=t.useSyncExternalStore(t.useCallback(e=>u.subscribe(s.notifyManager.batchCalls(e)),[u]),()=>u.getCurrentResult(),()=>u.getCurrentResult()),c=t.useCallback((e,t)=>{u.mutate(e,t).catch(a.noop)},[u]);if(l.error&&(0,a.shouldThrowError)(u.options.throwOnError,[l.error]))throw l.error;return{...l,mutate:c,mutateAsync:l.mutate}}e.s(["useMutation",()=>u],54616)},5766,e=>{"use strict";let t,r;var s,i=e.i(71645);let a={data:""},n=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,o=/\/\*[^]*?\*\/|  +/g,u=/\n+/g,l=(e,t)=>{let r="",s="",i="";for(let a in e){let n=e[a];"@"==a[0]?"i"==a[1]?r=a+" "+n+";":s+="f"==a[1]?l(n,a):a+"{"+l(n,"k"==a[1]?"":t)+"}":"object"==typeof n?s+=l(n,t?t.replace(/([^,])+/g,e=>a.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):a):null!=n&&(a=/^--/.test(a)?a:a.replace(/[A-Z]/g,"-$&").toLowerCase(),i+=l.p?l.p(a,n):a+":"+n+";")}return r+(t&&i?t+"{"+i+"}":i)+s},c={},d=e=>{if("object"==typeof e){let t="";for(let r in e)t+=r+d(e[r]);return t}return e};function h(e){let t,r,s=this||{},i=e.call?e(s.p):e;return((e,t,r,s,i)=>{var a;let h=d(e),p=c[h]||(c[h]=(e=>{let t=0,r=11;for(;t<e.length;)r=101*r+e.charCodeAt(t++)>>>0;return"go"+r})(h));if(!c[p]){let t=h!==e?e:(e=>{let t,r,s=[{}];for(;t=n.exec(e.replace(o,""));)t[4]?s.shift():t[3]?(r=t[3].replace(u," ").trim(),s.unshift(s[0][r]=s[0][r]||{})):s[0][t[1]]=t[2].replace(u," ").trim();return s[0]})(e);c[p]=l(i?{["@keyframes "+p]:t}:t,r?"":"."+p)}let f=r&&c.g?c.g:null;return r&&(c.g=c[p]),a=c[p],f?t.data=t.data.replace(f,a):-1===t.data.indexOf(a)&&(t.data=s?a+t.data:t.data+a),p})(i.unshift?i.raw?(t=[].slice.call(arguments,1),r=s.p,i.reduce((e,s,i)=>{let a=t[i];if(a&&a.call){let e=a(r),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;a=t?"."+t:e&&"object"==typeof e?e.props?"":l(e,""):!1===e?"":e}return e+s+(null==a?"":a)},"")):i.reduce((e,t)=>Object.assign(e,t&&t.call?t(s.p):t),{}):i,(e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||a})(s.target),s.g,s.o,s.k)}h.bind({g:1});let p,f,m,y=h.bind({k:1});function b(e,t){let r=this||{};return function(){let s=arguments;function i(a,n){let o=Object.assign({},a),u=o.className||i.className;r.p=Object.assign({theme:f&&f()},o),r.o=/ *go\d+/.test(u),o.className=h.apply(r,s)+(u?" "+u:""),t&&(o.ref=n);let l=e;return e[0]&&(l=o.as||e,delete o.as),m&&l[0]&&m(o),p(l,o)}return t?t(i):i}}var v=(e,t)=>"function"==typeof e?e(t):e,g=(t=0,()=>(++t).toString()),x=()=>{if(void 0===r&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");r=!e||e.matches}return r},R="default",w=(e,t)=>{let{toastLimit:r}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,r)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:s}=t;return w(e,{type:+!!e.toasts.find(e=>e.id===s.id),toast:s});case 3:let{toastId:i}=t;return{...e,toasts:e.toasts.map(e=>e.id===i||void 0===i?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let a=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+a}))}}},E=[],k={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},O={},C=(e,t=R)=>{O[t]=w(O[t]||k,e),E.forEach(([e,r])=>{e===t&&r(O[t])})},S=e=>Object.keys(O).forEach(t=>C(e,t)),I=(e=R)=>t=>{C(t,e)},T={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},Q=(e={},t=R)=>{let[r,s]=(0,i.useState)(O[t]||k),a=(0,i.useRef)(O[t]);(0,i.useEffect)(()=>(a.current!==O[t]&&s(O[t]),E.push([t,s]),()=>{let e=E.findIndex(([e])=>e===t);e>-1&&E.splice(e,1)}),[t]);let n=r.toasts.map(t=>{var r,s,i;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(r=e[t.type])?void 0:r.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(s=e[t.type])?void 0:s.duration)||(null==e?void 0:e.duration)||T[t.type],style:{...e.style,...null==(i=e[t.type])?void 0:i.style,...t.style}}});return{...r,toasts:n}},M=e=>(t,r)=>{let s,i=((e,t="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:(null==r?void 0:r.id)||g()}))(t,e,r);return I(i.toasterId||(s=i.id,Object.keys(O).find(e=>O[e].toasts.some(e=>e.id===s))))({type:2,toast:i}),i.id},_=(e,t)=>M("blank")(e,t);_.error=M("error"),_.success=M("success"),_.loading=M("loading"),_.custom=M("custom"),_.dismiss=(e,t)=>{let r={type:3,toastId:e};t?I(t)(r):S(r)},_.dismissAll=e=>_.dismiss(void 0,e),_.remove=(e,t)=>{let r={type:4,toastId:e};t?I(t)(r):S(r)},_.removeAll=e=>_.remove(void 0,e),_.promise=(e,t,r)=>{let s=_.loading(t.loading,{...r,...null==r?void 0:r.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let i=t.success?v(t.success,e):void 0;return i?_.success(i,{id:s,...r,...null==r?void 0:r.success}):_.dismiss(s),e}).catch(e=>{let i=t.error?v(t.error,e):void 0;i?_.error(i,{id:s,...r,...null==r?void 0:r.error}):_.dismiss(s)}),e};var D=1e3,j=(e,t="default")=>{let{toasts:r,pausedAt:s}=Q(e,t),a=(0,i.useRef)(new Map).current,n=(0,i.useCallback)((e,t=D)=>{if(a.has(e))return;let r=setTimeout(()=>{a.delete(e),o({type:4,toastId:e})},t);a.set(e,r)},[]);(0,i.useEffect)(()=>{if(s)return;let e=Date.now(),i=r.map(r=>{if(r.duration===1/0)return;let s=(r.duration||0)+r.pauseDuration-(e-r.createdAt);if(s<0){r.visible&&_.dismiss(r.id);return}return setTimeout(()=>_.dismiss(r.id,t),s)});return()=>{i.forEach(e=>e&&clearTimeout(e))}},[r,s,t]);let o=(0,i.useCallback)(I(t),[t]),u=(0,i.useCallback)(()=>{o({type:5,time:Date.now()})},[o]),l=(0,i.useCallback)((e,t)=>{o({type:1,toast:{id:e,height:t}})},[o]),c=(0,i.useCallback)(()=>{s&&o({type:6,time:Date.now()})},[s,o]),d=(0,i.useCallback)((e,t)=>{let{reverseOrder:s=!1,gutter:i=8,defaultPosition:a}=t||{},n=r.filter(t=>(t.position||a)===(e.position||a)&&t.height),o=n.findIndex(t=>t.id===e.id),u=n.filter((e,t)=>t<o&&e.visible).length;return n.filter(e=>e.visible).slice(...s?[u+1]:[0,u]).reduce((e,t)=>e+(t.height||0)+i,0)},[r]);return(0,i.useEffect)(()=>{r.forEach(e=>{if(e.dismissed)n(e.id,e.removeDelay);else{let t=a.get(e.id);t&&(clearTimeout(t),a.delete(e.id))}})},[r,n]),{toasts:r,handlers:{updateHeight:l,startPause:u,endPause:c,calculateOffset:d}}},F=y`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,U=y`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,A=y`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,P=b("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${F} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${U} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${A} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,$=y`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,N=b("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${$} 1s linear infinite;
`,q=y`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,z=y`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,L=b("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${q} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${z} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,H=b("div")`
  position: absolute;
`,K=b("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,B=y`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,W=b("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${B} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,V=({toast:e})=>{let{icon:t,type:r,iconTheme:s}=e;return void 0!==t?"string"==typeof t?i.createElement(W,null,t):t:"blank"===r?null:i.createElement(K,null,i.createElement(N,{...s}),"loading"!==r&&i.createElement(H,null,"error"===r?i.createElement(P,{...s}):i.createElement(L,{...s})))},X=b("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,Y=b("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,Z=i.memo(({toast:e,position:t,style:r,children:s})=>{let a=e.height?((e,t)=>{let r=e.includes("top")?1:-1,[s,i]=x()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*r}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*r}%,-1px) scale(.6); opacity:0;}
`];return{animation:t?`${y(s)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${y(i)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},n=i.createElement(V,{toast:e}),o=i.createElement(Y,{...e.ariaProps},v(e.message,e));return i.createElement(X,{className:e.className,style:{...a,...r,...e.style}},"function"==typeof s?s({icon:n,message:o}):i.createElement(i.Fragment,null,n,o))});s=i.createElement,l.p=void 0,p=s,f=void 0,m=void 0;var G=({id:e,className:t,style:r,onHeightUpdate:s,children:a})=>{let n=i.useCallback(t=>{if(t){let r=()=>{s(e,t.getBoundingClientRect().height)};r(),new MutationObserver(r).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,s]);return i.createElement("div",{ref:n,className:t,style:r},a)},J=h`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,ee=({reverseOrder:e,position:t="top-center",toastOptions:r,gutter:s,children:a,toasterId:n,containerStyle:o,containerClassName:u})=>{let{toasts:l,handlers:c}=j(r,n);return i.createElement("div",{"data-rht-toaster":n||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...o},className:u,onMouseEnter:c.startPause,onMouseLeave:c.endPause},l.map(r=>{let n,o,u=r.position||t,l=c.calculateOffset(r,{reverseOrder:e,gutter:s,defaultPosition:t}),d=(n=u.includes("top"),o=u.includes("center")?{justifyContent:"center"}:u.includes("right")?{justifyContent:"flex-end"}:{},{left:0,right:0,display:"flex",position:"absolute",transition:x()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${l*(n?1:-1)}px)`,...n?{top:0}:{bottom:0},...o});return i.createElement(G,{id:r.id,key:r.id,onHeightUpdate:c.updateHeight,className:r.visible?J:"",style:d},"custom"===r.type?v(r.message,r):a?a(r):i.createElement(Z,{toast:r,position:u}))}))};e.s(["CheckmarkIcon",()=>L,"ErrorIcon",()=>P,"LoaderIcon",()=>N,"ToastBar",()=>Z,"ToastIcon",()=>V,"Toaster",()=>ee,"default",()=>_,"resolveValue",()=>v,"toast",()=>_,"useToaster",()=>j,"useToasterStore",()=>Q],5766)},9258,e=>{"use strict";let t=new(e.i(17751)).QueryClient({defaultOptions:{queries:{retry:2,staleTime:3e5}}});e.s(["queryClient",0,t])},66027,e=>{"use strict";let t;var r=e.i(75555),s=e.i(40143),i=e.i(86491),a=e.i(15823),n=e.i(93803),o=e.i(19273),u=e.i(80166),l=class extends a.Subscribable{constructor(e,t){super(),this.options=t,this.#e=e,this.#n=null,this.#o=(0,n.pendingThenable)(),this.bindMethods(),this.setOptions(t)}#e;#u=void 0;#l=void 0;#t=void 0;#c;#d;#o;#n;#h;#p;#f;#m;#y;#b;#v=new Set;bindMethods(){this.refetch=this.refetch.bind(this)}onSubscribe(){1===this.listeners.size&&(this.#u.addObserver(this),c(this.#u,this.options)?this.#g():this.updateResult(),this.#x())}onUnsubscribe(){this.hasListeners()||this.destroy()}shouldFetchOnReconnect(){return d(this.#u,this.options,this.options.refetchOnReconnect)}shouldFetchOnWindowFocus(){return d(this.#u,this.options,this.options.refetchOnWindowFocus)}destroy(){this.listeners=new Set,this.#R(),this.#w(),this.#u.removeObserver(this)}setOptions(e){let t=this.options,r=this.#u;if(this.options=this.#e.defaultQueryOptions(e),void 0!==this.options.enabled&&"boolean"!=typeof this.options.enabled&&"function"!=typeof this.options.enabled&&"boolean"!=typeof(0,o.resolveEnabled)(this.options.enabled,this.#u))throw Error("Expected enabled to be a boolean or a callback that returns a boolean");this.#E(),this.#u.setOptions(this.options),t._defaulted&&!(0,o.shallowEqualObjects)(this.options,t)&&this.#e.getQueryCache().notify({type:"observerOptionsUpdated",query:this.#u,observer:this});let s=this.hasListeners();s&&h(this.#u,r,this.options,t)&&this.#g(),this.updateResult(),s&&(this.#u!==r||(0,o.resolveEnabled)(this.options.enabled,this.#u)!==(0,o.resolveEnabled)(t.enabled,this.#u)||(0,o.resolveStaleTime)(this.options.staleTime,this.#u)!==(0,o.resolveStaleTime)(t.staleTime,this.#u))&&this.#k();let i=this.#O();s&&(this.#u!==r||(0,o.resolveEnabled)(this.options.enabled,this.#u)!==(0,o.resolveEnabled)(t.enabled,this.#u)||i!==this.#b)&&this.#C(i)}getOptimisticResult(e){var t,r;let s=this.#e.getQueryCache().build(this.#e,e),i=this.createResult(s,e);return t=this,r=i,(0,o.shallowEqualObjects)(t.getCurrentResult(),r)||(this.#t=i,this.#d=this.options,this.#c=this.#u.state),i}getCurrentResult(){return this.#t}trackResult(e,t){return new Proxy(e,{get:(e,r)=>(this.trackProp(r),t?.(r),"promise"===r&&(this.trackProp("data"),this.options.experimental_prefetchInRender||"pending"!==this.#o.status||this.#o.reject(Error("experimental_prefetchInRender feature flag is not enabled"))),Reflect.get(e,r))})}trackProp(e){this.#v.add(e)}getCurrentQuery(){return this.#u}refetch({...e}={}){return this.fetch({...e})}fetchOptimistic(e){let t=this.#e.defaultQueryOptions(e),r=this.#e.getQueryCache().build(this.#e,t);return r.fetch().then(()=>this.createResult(r,t))}fetch(e){return this.#g({...e,cancelRefetch:e.cancelRefetch??!0}).then(()=>(this.updateResult(),this.#t))}#g(e){this.#E();let t=this.#u.fetch(this.options,e);return e?.throwOnError||(t=t.catch(o.noop)),t}#k(){this.#R();let e=(0,o.resolveStaleTime)(this.options.staleTime,this.#u);if(o.isServer||this.#t.isStale||!(0,o.isValidTimeout)(e))return;let t=(0,o.timeUntilStale)(this.#t.dataUpdatedAt,e);this.#m=u.timeoutManager.setTimeout(()=>{this.#t.isStale||this.updateResult()},t+1)}#O(){return("function"==typeof this.options.refetchInterval?this.options.refetchInterval(this.#u):this.options.refetchInterval)??!1}#C(e){this.#w(),this.#b=e,!o.isServer&&!1!==(0,o.resolveEnabled)(this.options.enabled,this.#u)&&(0,o.isValidTimeout)(this.#b)&&0!==this.#b&&(this.#y=u.timeoutManager.setInterval(()=>{(this.options.refetchIntervalInBackground||r.focusManager.isFocused())&&this.#g()},this.#b))}#x(){this.#k(),this.#C(this.#O())}#R(){this.#m&&(u.timeoutManager.clearTimeout(this.#m),this.#m=void 0)}#w(){this.#y&&(u.timeoutManager.clearInterval(this.#y),this.#y=void 0)}createResult(e,t){let r,s=this.#u,a=this.options,u=this.#t,l=this.#c,d=this.#d,f=e!==s?e.state:this.#l,{state:m}=e,y={...m},b=!1;if(t._optimisticResults){let r=this.hasListeners(),n=!r&&c(e,t),o=r&&h(e,s,t,a);(n||o)&&(y={...y,...(0,i.fetchState)(m.data,e.options)}),"isRestoring"===t._optimisticResults&&(y.fetchStatus="idle")}let{error:v,errorUpdatedAt:g,status:x}=y;r=y.data;let R=!1;if(void 0!==t.placeholderData&&void 0===r&&"pending"===x){let e;u?.isPlaceholderData&&t.placeholderData===d?.placeholderData?(e=u.data,R=!0):e="function"==typeof t.placeholderData?t.placeholderData(this.#f?.state.data,this.#f):t.placeholderData,void 0!==e&&(x="success",r=(0,o.replaceData)(u?.data,e,t),b=!0)}if(t.select&&void 0!==r&&!R)if(u&&r===l?.data&&t.select===this.#h)r=this.#p;else try{this.#h=t.select,r=t.select(r),r=(0,o.replaceData)(u?.data,r,t),this.#p=r,this.#n=null}catch(e){this.#n=e}this.#n&&(v=this.#n,r=this.#p,g=Date.now(),x="error");let w="fetching"===y.fetchStatus,E="pending"===x,k="error"===x,O=E&&w,C=void 0!==r,S={status:x,fetchStatus:y.fetchStatus,isPending:E,isSuccess:"success"===x,isError:k,isInitialLoading:O,isLoading:O,data:r,dataUpdatedAt:y.dataUpdatedAt,error:v,errorUpdatedAt:g,failureCount:y.fetchFailureCount,failureReason:y.fetchFailureReason,errorUpdateCount:y.errorUpdateCount,isFetched:y.dataUpdateCount>0||y.errorUpdateCount>0,isFetchedAfterMount:y.dataUpdateCount>f.dataUpdateCount||y.errorUpdateCount>f.errorUpdateCount,isFetching:w,isRefetching:w&&!E,isLoadingError:k&&!C,isPaused:"paused"===y.fetchStatus,isPlaceholderData:b,isRefetchError:k&&C,isStale:p(e,t),refetch:this.refetch,promise:this.#o,isEnabled:!1!==(0,o.resolveEnabled)(t.enabled,e)};if(this.options.experimental_prefetchInRender){let t=e=>{"error"===S.status?e.reject(S.error):void 0!==S.data&&e.resolve(S.data)},r=()=>{t(this.#o=S.promise=(0,n.pendingThenable)())},i=this.#o;switch(i.status){case"pending":e.queryHash===s.queryHash&&t(i);break;case"fulfilled":("error"===S.status||S.data!==i.value)&&r();break;case"rejected":("error"!==S.status||S.error!==i.reason)&&r()}}return S}updateResult(){let e=this.#t,t=this.createResult(this.#u,this.options);if(this.#c=this.#u.state,this.#d=this.options,void 0!==this.#c.data&&(this.#f=this.#u),(0,o.shallowEqualObjects)(t,e))return;this.#t=t;let r=()=>{if(!e)return!0;let{notifyOnChangeProps:t}=this.options,r="function"==typeof t?t():t;if("all"===r||!r&&!this.#v.size)return!0;let s=new Set(r??this.#v);return this.options.throwOnError&&s.add("error"),Object.keys(this.#t).some(t=>this.#t[t]!==e[t]&&s.has(t))};this.#a({listeners:r()})}#E(){let e=this.#e.getQueryCache().build(this.#e,this.options);if(e===this.#u)return;let t=this.#u;this.#u=e,this.#l=e.state,this.hasListeners()&&(t?.removeObserver(this),e.addObserver(this))}onQueryUpdate(){this.updateResult(),this.hasListeners()&&this.#x()}#a(e){s.notifyManager.batch(()=>{e.listeners&&this.listeners.forEach(e=>{e(this.#t)}),this.#e.getQueryCache().notify({query:this.#u,type:"observerResultsUpdated"})})}};function c(e,t){return!1!==(0,o.resolveEnabled)(t.enabled,e)&&void 0===e.state.data&&("error"!==e.state.status||!1!==t.retryOnMount)||void 0!==e.state.data&&d(e,t,t.refetchOnMount)}function d(e,t,r){if(!1!==(0,o.resolveEnabled)(t.enabled,e)&&"static"!==(0,o.resolveStaleTime)(t.staleTime,e)){let s="function"==typeof r?r(e):r;return"always"===s||!1!==s&&p(e,t)}return!1}function h(e,t,r,s){return(e!==t||!1===(0,o.resolveEnabled)(s.enabled,e))&&(!r.suspense||"error"!==e.state.status)&&p(e,r)}function p(e,t){return!1!==(0,o.resolveEnabled)(t.enabled,e)&&e.isStaleByTime((0,o.resolveStaleTime)(t.staleTime,e))}e.i(47167);var f=e.i(71645),m=e.i(12598);e.i(43476);var y=f.createContext((t=!1,{clearReset:()=>{t=!1},reset:()=>{t=!0},isReset:()=>t})),b=f.createContext(!1);b.Provider;var v=(e,t,r)=>t.fetchOptimistic(e).catch(()=>{r.clearReset()});function g(e,t){return function(e,t,r){let i=f.useContext(b),a=f.useContext(y),n=(0,m.useQueryClient)(r),u=n.defaultQueryOptions(e);if(n.getDefaultOptions().queries?._experimental_beforeQuery?.(u),u._optimisticResults=i?"isRestoring":"optimistic",u.suspense){let e=e=>"static"===e?e:Math.max(e??1e3,1e3),t=u.staleTime;u.staleTime="function"==typeof t?(...r)=>e(t(...r)):e(t),"number"==typeof u.gcTime&&(u.gcTime=Math.max(u.gcTime,1e3))}(u.suspense||u.throwOnError||u.experimental_prefetchInRender)&&!a.isReset()&&(u.retryOnMount=!1),f.useEffect(()=>{a.clearReset()},[a]);let l=!n.getQueryCache().get(u.queryHash),[c]=f.useState(()=>new t(n,u)),d=c.getOptimisticResult(u),h=!i&&!1!==e.subscribed;if(f.useSyncExternalStore(f.useCallback(e=>{let t=h?c.subscribe(s.notifyManager.batchCalls(e)):o.noop;return c.updateResult(),t},[c,h]),()=>c.getCurrentResult(),()=>c.getCurrentResult()),f.useEffect(()=>{c.setOptions(u)},[u,c]),u?.suspense&&d.isPending)throw v(u,c,a);if((({result:e,errorResetBoundary:t,throwOnError:r,query:s,suspense:i})=>e.isError&&!t.isReset()&&!e.isFetching&&s&&(i&&void 0===e.data||(0,o.shouldThrowError)(r,[e.error,s])))({result:d,errorResetBoundary:a,throwOnError:u.throwOnError,query:n.getQueryCache().get(u.queryHash),suspense:u.suspense}))throw d.error;if(n.getDefaultOptions().queries?._experimental_afterQuery?.(u,d),u.experimental_prefetchInRender&&!o.isServer&&d.isLoading&&d.isFetching&&!i){let e=l?v(u,c,a):n.getQueryCache().get(u.queryHash)?.promise;e?.catch(o.noop).finally(()=>{c.updateResult()})}return u.notifyOnChangeProps?d:c.trackResult(d)}(e,l,t)}e.s(["useQuery",()=>g],66027)},55394,e=>{"use strict";var t=e.i(9e4);let r=async()=>{try{return(await t.api.get("/api/users/get")).data}catch(e){throw console.error("Fetch User Error:",e),e}},s=async()=>{try{return(await t.api.get("/api/users/admin/staffs")).data}catch(e){throw console.error("Fetch User Error:",e),e}},i=async()=>{try{return(await t.api.get("/api/users/admin/staff/total")).data}catch(e){throw console.error("Fetch User Error:",e),e}},a=async()=>{try{return(await t.api.get("/api/users/admin/drivers/total")).data}catch(e){return console.error("Fetch Drivers Error:",e),{data:[],total:0}}},n=async()=>{try{return(await t.api.get("/api/users/admin/onsite-drivers/total")).data}catch(e){return console.error("Fetch Onsite Drivers Error:",e),{data:[],total:0}}};e.s(["getAllCustomers",0,i,"getAllDrivers",0,a,"getOnsiteDrivers",0,n,"getStaffList",0,s,"getUser",0,r])},87316,e=>{"use strict";let t=(0,e.i(75254).default)("Calendar",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]]);e.s(["Calendar",()=>t],87316)},46897,e=>{"use strict";let t=(0,e.i(75254).default)("MapPin",[["path",{d:"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",key:"1r0f0z"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]]);e.s(["MapPin",()=>t],46897)},98977,e=>{"use strict";var t=e.i(54616),r=e.i(9e4),s=e.i(5766),i=e.i(81949),a=e.i(9258),n=e.i(55487),o=e.i(72661);let u=async()=>{try{return(await r.api.get("/api/users/admin/staff/total")).data}catch(e){throw console.error("Fetch User Error:",e),e}};e.s(["getAllStaffs",0,u,"useCreateAdmin",0,()=>(0,t.useMutation)({mutationFn:async e=>(await r.api.post("/api/users/developer/admin/add",{first_name:e.first_name,last_name:e.last_name,phone_number:e.phone_number,email:e.email,otp:e.otp,gender:e.gender})).data,onSuccess:e=>(s.toast.success(`${e.message}`),e),onError:(e,t)=>{if(i.default.isAxiosError(e)){let t=e.response?.data;s.toast.error(`${t?.error.message}`)}else console.error("❌ Unexpected error:",e)}}),"useCreateRequest",0,()=>(0,t.useMutation)({mutationFn:async e=>(await r.api.post("/api/users/request-password-edit",{email:e})).data,onSuccess:e=>(s.toast.success(`${e.message}`),e),onError:(e,t)=>{if(i.default.isAxiosError(e)){let t=e.response?.data;console.log("User Erro",e),s.toast.error(`${t?.error.message}`)}else console.error("❌ Unexpected error:",e)}}),"useCreateStaff",0,()=>(0,t.useMutation)({mutationFn:async e=>(await r.api.post("/api/users/admin/staff/add",{first_name:e.first_name,last_name:e.last_name,phone_number:e.phone_number,email:e.email,gender:e.gender,role:e.role})).data,onSuccess:e=>(s.toast.success(`${e.message}`),e),onError:(e,t)=>{if(i.default.isAxiosError(e)){let t=e.response?.data;console.log("User Erro",e),s.toast.error(`${t?.error.message}`)}else console.error("❌ Unexpected error:",e)}}),"useStatusUpdate",0,()=>{let e=(0,n.useDispatch)();return(0,t.useMutation)({mutationFn:async e=>(console.log("Status>><,",e.isActive),(await r.api.patch("/api/users/admin/staff/change-status",{status:e.isActive,staff_id:e.staffId})).data),onSuccess:(t,r)=>{a.queryClient.invalidateQueries({queryKey:["staffs"]});let i="active"===r.isActive;e((0,o.updateStaffStatus)(r.isActive)),s.toast.success(`Staff ${i?"Activated":"De-activated"} successfully`)},onError:e=>{if(i.default.isAxiosError(e)){let t=e.response?.data;s.toast.error(`${t?.error.message}`)}else console.error("❌ Unexpected error:",e)}})},"useUpdateAccount",0,()=>(0,t.useMutation)({mutationFn:async e=>{let t=new FormData,s=new Date(e.date_of_birth).toISOString();return e.image instanceof File&&t.append("image",e.image),t.append("first_name",e.first_name),t.append("last_name",e.last_name),t.append("phone_number",e.phone_number),t.append("date_of_birth",s),(await r.api.patch("/api/users/edit",t,{headers:{"Content-Type":"multipart/form-data"}})).data},onSuccess:e=>(s.toast.success(`${e.message}`),e),onError:(e,t)=>{if(i.default.isAxiosError(e)){let t=e.response?.data;s.toast.error(`${t?.error.message}`)}else console.error("❌ Unexpected error:",e)}})])},19036,e=>{"use strict";var t=e.i(43476),r=e.i(71645),s=e.i(81140),i=e.i(20783),a=e.i(30030),n=e.i(69340),o=e.i(99682),u=e.i(35804),l=e.i(48425),c="Switch",[d,h]=(0,a.createContextScope)(c),[p,f]=d(c),m=r.forwardRef((e,a)=>{let{__scopeSwitch:o,name:u,checked:c,defaultChecked:d,required:h,disabled:f,value:m="on",onCheckedChange:y,form:b,...x}=e,[R,w]=r.useState(null),E=(0,i.useComposedRefs)(a,e=>w(e)),k=r.useRef(!1),O=!R||b||!!R.closest("form"),[C=!1,S]=(0,n.useControllableState)({prop:c,defaultProp:d,onChange:y});return(0,t.jsxs)(p,{scope:o,checked:C,disabled:f,children:[(0,t.jsx)(l.Primitive.button,{type:"button",role:"switch","aria-checked":C,"aria-required":h,"data-state":g(C),"data-disabled":f?"":void 0,disabled:f,value:m,...x,ref:E,onClick:(0,s.composeEventHandlers)(e.onClick,e=>{S(e=>!e),O&&(k.current=e.isPropagationStopped(),k.current||e.stopPropagation())})}),O&&(0,t.jsx)(v,{control:R,bubbles:!k.current,name:u,value:m,checked:C,required:h,disabled:f,form:b,style:{transform:"translateX(-100%)"}})]})});m.displayName=c;var y="SwitchThumb",b=r.forwardRef((e,r)=>{let{__scopeSwitch:s,...i}=e,a=f(y,s);return(0,t.jsx)(l.Primitive.span,{"data-state":g(a.checked),"data-disabled":a.disabled?"":void 0,...i,ref:r})});b.displayName=y;var v=e=>{let{control:s,checked:i,bubbles:a=!0,...n}=e,l=r.useRef(null),c=(0,o.usePrevious)(i),d=(0,u.useSize)(s);return r.useEffect(()=>{let e=l.current,t=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,"checked").set;if(c!==i&&t){let r=new Event("click",{bubbles:a});t.call(e,i),e.dispatchEvent(r)}},[c,i,a]),(0,t.jsx)("input",{type:"checkbox","aria-hidden":!0,defaultChecked:i,...n,tabIndex:-1,ref:l,style:{...e.style,...d,position:"absolute",pointerEvents:"none",opacity:0,margin:0}})};function g(e){return e?"checked":"unchecked"}var x=e.i(47163);function R({className:e,...r}){return(0,t.jsx)(m,{"data-slot":"switch",className:(0,x.cn)("peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",e),...r,children:(0,t.jsx)(b,{"data-slot":"switch-thumb",className:"bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0"})})}e.s(["Switch",()=>R],19036)}]);