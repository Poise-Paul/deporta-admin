(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,32962,e=>{"use strict";var t=e.i(9e4),s=e.i(54616),a=e.i(9258),r=e.i(5766),i=e.i(81949),o=e.i(79239),n=e.i(30399);let l=async()=>{try{return(await t.api.get("/api/users/admin/bus-stop/get")).data}catch(e){throw console.error("Fetch User Error:",e),e}};e.s(["getAllBusStops",0,l,"useCreateBusStop",0,()=>(0,s.useMutation)({mutationFn:async e=>(await t.api.post("/api/users/admin/bus-stop/create",{routes:e.routes,location:e.location,area:e.area,state:e.state,country:e.country})).data,onSuccess:e=>(a.queryClient.invalidateQueries({queryKey:["busStops"]}),r.default.success(`${e.message}`),e),onError:(e,t)=>{if(i.default.isAxiosError(e)){let t=e.response?.data;console.log("User Erro",e),r.default.error(`${t?.error.message}`)}else console.error("❌ Unexpected error:",e)}}),"useDeleteBusStop",0,()=>(0,s.useMutation)({mutationFn:async e=>(await t.api.delete(`/api/users/admin/bus-stop/delete/${e}`)).data,onSuccess:e=>(a.queryClient.invalidateQueries({queryKey:["busStops"]}),r.default.success(`${e.message}`),e),onError:(e,t)=>{if(i.default.isAxiosError(e)){let t=e.response?.data;r.default.error(`${t?.error.message}`)}else console.error("❌ Unexpected error:",e)}}),"useModifyBusStop",0,()=>(0,s.useMutation)({mutationFn:async e=>(await t.api.patch("/api/users/admin/bus-stop/edit",{bus_stop_id:e.bus_stop_id,routes:e.routes,location:e.location,area:e.area,state:e.state,country:e.country})).data,onSuccess:e=>(a.queryClient.invalidateQueries({queryKey:["busStops"]}),console.log("Bus Stop==",e.bus_stop),o.store.dispatch((0,n.updateBusStopDetails)(e.bus_stop)),r.default.success(`${e.message}`),e),onError:(e,t)=>{if(i.default.isAxiosError(e)){let t=e.response?.data;console.log("User Erro",e),r.default.error(`${t?.error.message}`)}else console.error("❌ Unexpected error:",e)}})])},46897,e=>{"use strict";let t=(0,e.i(75254).default)("MapPin",[["path",{d:"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",key:"1r0f0z"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]]);e.s(["MapPin",()=>t],46897)},84614,71689,e=>{"use strict";var t=e.i(75254);let s=(0,t.default)("User",[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]]);e.s(["User",()=>s],84614);let a=(0,t.default)("ArrowLeft",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);e.s(["ArrowLeft",()=>a],71689)},87316,e=>{"use strict";let t=(0,e.i(75254).default)("Calendar",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]]);e.s(["Calendar",()=>t],87316)},69035,e=>{"use strict";var t=e.i(43476),s=e.i(71645),a=e.i(48425),r="horizontal",i=["horizontal","vertical"],o=s.forwardRef((e,s)=>{var o;let{decorative:n,orientation:l=r,...c}=e,d=(o=l,i.includes(o))?l:r;return(0,t.jsx)(a.Primitive.div,{"data-orientation":d,...n?{role:"none"}:{"aria-orientation":"vertical"===d?d:void 0,role:"separator"},...c,ref:s})});o.displayName="Separator";var n=e.i(47163);function l({className:e,orientation:s="horizontal",decorative:a=!0,...r}){return(0,t.jsx)(o,{"data-slot":"separator",decorative:a,orientation:s,className:(0,n.cn)("bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",e),...r})}e.s(["Separator",()=>l],69035)},94179,e=>{"use strict";var t=e.i(43476),s=e.i(91918),a=e.i(25913),r=e.i(47163);let i=(0,a.cva)("inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",{variants:{variant:{default:"border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",secondary:"border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",destructive:"border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",outline:"text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground"}},defaultVariants:{variant:"default"}});function o({className:e,variant:a,asChild:o=!1,...n}){let l=o?s.Slot:"span";return(0,t.jsx)(l,{"data-slot":"badge",className:(0,r.cn)(i({variant:a}),e),...n})}e.s(["Badge",()=>o])},31278,e=>{"use strict";let t=(0,e.i(75254).default)("LoaderCircle",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]]);e.s(["Loader2",()=>t],31278)},5766,e=>{"use strict";let t,s;var a,r=e.i(71645);let i={data:""},o=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,n=/\/\*[^]*?\*\/|  +/g,l=/\n+/g,c=(e,t)=>{let s="",a="",r="";for(let i in e){let o=e[i];"@"==i[0]?"i"==i[1]?s=i+" "+o+";":a+="f"==i[1]?c(o,i):i+"{"+c(o,"k"==i[1]?"":t)+"}":"object"==typeof o?a+=c(o,t?t.replace(/([^,])+/g,e=>i.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):i):null!=o&&(i=/^--/.test(i)?i:i.replace(/[A-Z]/g,"-$&").toLowerCase(),r+=c.p?c.p(i,o):i+":"+o+";")}return s+(t&&r?t+"{"+r+"}":r)+a},d={},u=e=>{if("object"==typeof e){let t="";for(let s in e)t+=s+u(e[s]);return t}return e};function p(e){let t,s,a=this||{},r=e.call?e(a.p):e;return((e,t,s,a,r)=>{var i;let p=u(e),m=d[p]||(d[p]=(e=>{let t=0,s=11;for(;t<e.length;)s=101*s+e.charCodeAt(t++)>>>0;return"go"+s})(p));if(!d[m]){let t=p!==e?e:(e=>{let t,s,a=[{}];for(;t=o.exec(e.replace(n,""));)t[4]?a.shift():t[3]?(s=t[3].replace(l," ").trim(),a.unshift(a[0][s]=a[0][s]||{})):a[0][t[1]]=t[2].replace(l," ").trim();return a[0]})(e);d[m]=c(r?{["@keyframes "+m]:t}:t,s?"":"."+m)}let h=s&&d.g?d.g:null;return s&&(d.g=d[m]),i=d[m],h?t.data=t.data.replace(h,i):-1===t.data.indexOf(i)&&(t.data=a?i+t.data:t.data+i),m})(r.unshift?r.raw?(t=[].slice.call(arguments,1),s=a.p,r.reduce((e,a,r)=>{let i=t[r];if(i&&i.call){let e=i(s),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;i=t?"."+t:e&&"object"==typeof e?e.props?"":c(e,""):!1===e?"":e}return e+a+(null==i?"":i)},"")):r.reduce((e,t)=>Object.assign(e,t&&t.call?t(a.p):t),{}):r,(e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||i})(a.target),a.g,a.o,a.k)}p.bind({g:1});let m,h,f,y=p.bind({k:1});function g(e,t){let s=this||{};return function(){let a=arguments;function r(i,o){let n=Object.assign({},i),l=n.className||r.className;s.p=Object.assign({theme:h&&h()},n),s.o=/ *go\d+/.test(l),n.className=p.apply(s,a)+(l?" "+l:""),t&&(n.ref=o);let c=e;return e[0]&&(c=n.as||e,delete n.as),f&&c[0]&&f(n),m(c,n)}return t?t(r):r}}var x=(e,t)=>"function"==typeof e?e(t):e,b=(t=0,()=>(++t).toString()),v=()=>{if(void 0===s&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");s=!e||e.matches}return s},j="default",w=(e,t)=>{let{toastLimit:s}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,s)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:a}=t;return w(e,{type:+!!e.toasts.find(e=>e.id===a.id),toast:a});case 3:let{toastId:r}=t;return{...e,toasts:e.toasts.map(e=>e.id===r||void 0===r?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let i=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+i}))}}},k=[],S={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},E={},C=(e,t=j)=>{E[t]=w(E[t]||S,e),k.forEach(([e,s])=>{e===t&&s(E[t])})},N=e=>Object.keys(E).forEach(t=>C(e,t)),M=(e=j)=>t=>{C(t,e)},O={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},A=(e={},t=j)=>{let[s,a]=(0,r.useState)(E[t]||S),i=(0,r.useRef)(E[t]);(0,r.useEffect)(()=>(i.current!==E[t]&&a(E[t]),k.push([t,a]),()=>{let e=k.findIndex(([e])=>e===t);e>-1&&k.splice(e,1)}),[t]);let o=s.toasts.map(t=>{var s,a,r;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(s=e[t.type])?void 0:s.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(a=e[t.type])?void 0:a.duration)||(null==e?void 0:e.duration)||O[t.type],style:{...e.style,...null==(r=e[t.type])?void 0:r.style,...t.style}}});return{...s,toasts:o}},T=e=>(t,s)=>{let a,r=((e,t="blank",s)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...s,id:(null==s?void 0:s.id)||b()}))(t,e,s);return M(r.toasterId||(a=r.id,Object.keys(E).find(e=>E[e].toasts.some(e=>e.id===a))))({type:2,toast:r}),r.id},B=(e,t)=>T("blank")(e,t);B.error=T("error"),B.success=T("success"),B.loading=T("loading"),B.custom=T("custom"),B.dismiss=(e,t)=>{let s={type:3,toastId:e};t?M(t)(s):N(s)},B.dismissAll=e=>B.dismiss(void 0,e),B.remove=(e,t)=>{let s={type:4,toastId:e};t?M(t)(s):N(s)},B.removeAll=e=>B.remove(void 0,e),B.promise=(e,t,s)=>{let a=B.loading(t.loading,{...s,...null==s?void 0:s.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let r=t.success?x(t.success,e):void 0;return r?B.success(r,{id:a,...s,...null==s?void 0:s.success}):B.dismiss(a),e}).catch(e=>{let r=t.error?x(t.error,e):void 0;r?B.error(r,{id:a,...s,...null==s?void 0:s.error}):B.dismiss(a)}),e};var R=1e3,D=(e,t="default")=>{let{toasts:s,pausedAt:a}=A(e,t),i=(0,r.useRef)(new Map).current,o=(0,r.useCallback)((e,t=R)=>{if(i.has(e))return;let s=setTimeout(()=>{i.delete(e),n({type:4,toastId:e})},t);i.set(e,s)},[]);(0,r.useEffect)(()=>{if(a)return;let e=Date.now(),r=s.map(s=>{if(s.duration===1/0)return;let a=(s.duration||0)+s.pauseDuration-(e-s.createdAt);if(a<0){s.visible&&B.dismiss(s.id);return}return setTimeout(()=>B.dismiss(s.id,t),a)});return()=>{r.forEach(e=>e&&clearTimeout(e))}},[s,a,t]);let n=(0,r.useCallback)(M(t),[t]),l=(0,r.useCallback)(()=>{n({type:5,time:Date.now()})},[n]),c=(0,r.useCallback)((e,t)=>{n({type:1,toast:{id:e,height:t}})},[n]),d=(0,r.useCallback)(()=>{a&&n({type:6,time:Date.now()})},[a,n]),u=(0,r.useCallback)((e,t)=>{let{reverseOrder:a=!1,gutter:r=8,defaultPosition:i}=t||{},o=s.filter(t=>(t.position||i)===(e.position||i)&&t.height),n=o.findIndex(t=>t.id===e.id),l=o.filter((e,t)=>t<n&&e.visible).length;return o.filter(e=>e.visible).slice(...a?[l+1]:[0,l]).reduce((e,t)=>e+(t.height||0)+r,0)},[s]);return(0,r.useEffect)(()=>{s.forEach(e=>{if(e.dismissed)o(e.id,e.removeDelay);else{let t=i.get(e.id);t&&(clearTimeout(t),i.delete(e.id))}})},[s,o]),{toasts:s,handlers:{updateHeight:c,startPause:l,endPause:d,calculateOffset:u}}},I=y`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,$=y`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,P=y`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,_=g("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${I} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${$} 0.15s ease-out forwards;
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
    animation: ${P} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,L=y`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,z=g("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${L} 1s linear infinite;
`,K=y`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,U=y`
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
}`,F=g("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${K} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${U} 0.2s ease-out forwards;
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
`,q=g("div")`
  position: absolute;
`,H=g("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,G=y`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,V=g("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${G} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,Q=({toast:e})=>{let{icon:t,type:s,iconTheme:a}=e;return void 0!==t?"string"==typeof t?r.createElement(V,null,t):t:"blank"===s?null:r.createElement(H,null,r.createElement(z,{...a}),"loading"!==s&&r.createElement(q,null,"error"===s?r.createElement(_,{...a}):r.createElement(F,{...a})))},Y=g("div")`
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
`,Z=g("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,J=r.memo(({toast:e,position:t,style:s,children:a})=>{let i=e.height?((e,t)=>{let s=e.includes("top")?1:-1,[a,r]=v()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*s}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*s}%,-1px) scale(.6); opacity:0;}
`];return{animation:t?`${y(a)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${y(r)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},o=r.createElement(Q,{toast:e}),n=r.createElement(Z,{...e.ariaProps},x(e.message,e));return r.createElement(Y,{className:e.className,style:{...i,...s,...e.style}},"function"==typeof a?a({icon:o,message:n}):r.createElement(r.Fragment,null,o,n))});a=r.createElement,c.p=void 0,m=a,h=void 0,f=void 0;var W=({id:e,className:t,style:s,onHeightUpdate:a,children:i})=>{let o=r.useCallback(t=>{if(t){let s=()=>{a(e,t.getBoundingClientRect().height)};s(),new MutationObserver(s).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,a]);return r.createElement("div",{ref:o,className:t,style:s},i)},X=p`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,ee=({reverseOrder:e,position:t="top-center",toastOptions:s,gutter:a,children:i,toasterId:o,containerStyle:n,containerClassName:l})=>{let{toasts:c,handlers:d}=D(s,o);return r.createElement("div",{"data-rht-toaster":o||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...n},className:l,onMouseEnter:d.startPause,onMouseLeave:d.endPause},c.map(s=>{let o,n,l=s.position||t,c=d.calculateOffset(s,{reverseOrder:e,gutter:a,defaultPosition:t}),u=(o=l.includes("top"),n=l.includes("center")?{justifyContent:"center"}:l.includes("right")?{justifyContent:"flex-end"}:{},{left:0,right:0,display:"flex",position:"absolute",transition:v()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${c*(o?1:-1)}px)`,...o?{top:0}:{bottom:0},...n});return r.createElement(W,{id:s.id,key:s.id,onHeightUpdate:d.updateHeight,className:s.visible?X:"",style:u},"custom"===s.type?x(s.message,s):i?i(s):r.createElement(J,{toast:s,position:l}))}))};e.s(["CheckmarkIcon",()=>F,"ErrorIcon",()=>_,"LoaderIcon",()=>z,"ToastBar",()=>J,"ToastIcon",()=>Q,"Toaster",()=>ee,"default",()=>B,"resolveValue",()=>x,"toast",()=>B,"useToaster",()=>D,"useToasterStore",()=>A],5766)},54616,e=>{"use strict";var t=e.i(71645),s=e.i(14272),a=e.i(40143),r=e.i(15823),i=e.i(19273),o=class extends r.Subscribable{#e;#t=void 0;#s;#a;constructor(e,t){super(),this.#e=e,this.setOptions(t),this.bindMethods(),this.#r()}bindMethods(){this.mutate=this.mutate.bind(this),this.reset=this.reset.bind(this)}setOptions(e){let t=this.options;this.options=this.#e.defaultMutationOptions(e),(0,i.shallowEqualObjects)(this.options,t)||this.#e.getMutationCache().notify({type:"observerOptionsUpdated",mutation:this.#s,observer:this}),t?.mutationKey&&this.options.mutationKey&&(0,i.hashKey)(t.mutationKey)!==(0,i.hashKey)(this.options.mutationKey)?this.reset():this.#s?.state.status==="pending"&&this.#s.setOptions(this.options)}onUnsubscribe(){this.hasListeners()||this.#s?.removeObserver(this)}onMutationUpdate(e){this.#r(),this.#i(e)}getCurrentResult(){return this.#t}reset(){this.#s?.removeObserver(this),this.#s=void 0,this.#r(),this.#i()}mutate(e,t){return this.#a=t,this.#s?.removeObserver(this),this.#s=this.#e.getMutationCache().build(this.#e,this.options),this.#s.addObserver(this),this.#s.execute(e)}#r(){let e=this.#s?.state??(0,s.getDefaultState)();this.#t={...e,isPending:"pending"===e.status,isSuccess:"success"===e.status,isError:"error"===e.status,isIdle:"idle"===e.status,mutate:this.mutate,reset:this.reset}}#i(e){a.notifyManager.batch(()=>{if(this.#a&&this.hasListeners()){let t=this.#t.variables,s=this.#t.context,a={client:this.#e,meta:this.options.meta,mutationKey:this.options.mutationKey};e?.type==="success"?(this.#a.onSuccess?.(e.data,t,s,a),this.#a.onSettled?.(e.data,null,t,s,a)):e?.type==="error"&&(this.#a.onError?.(e.error,t,s,a),this.#a.onSettled?.(void 0,e.error,t,s,a))}this.listeners.forEach(e=>{e(this.#t)})})}},n=e.i(12598);function l(e,s){let r=(0,n.useQueryClient)(s),[l]=t.useState(()=>new o(r,e));t.useEffect(()=>{l.setOptions(e)},[l,e]);let c=t.useSyncExternalStore(t.useCallback(e=>l.subscribe(a.notifyManager.batchCalls(e)),[l]),()=>l.getCurrentResult(),()=>l.getCurrentResult()),d=t.useCallback((e,t)=>{l.mutate(e,t).catch(i.noop)},[l]);if(c.error&&(0,i.shouldThrowError)(l.options.throwOnError,[c.error]))throw c.error;return{...c,mutate:d,mutateAsync:c.mutate}}e.s(["useMutation",()=>l],54616)},9258,e=>{"use strict";let t=new(e.i(17751)).QueryClient({defaultOptions:{queries:{retry:2,staleTime:3e5}}});e.s(["queryClient",0,t])},88511,e=>{"use strict";let t=(0,e.i(75254).default)("SquarePen",[["path",{d:"M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",key:"1m0v6g"}],["path",{d:"M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",key:"ohrbg2"}]]);e.s(["Edit",()=>t],88511)},27612,56940,e=>{"use strict";let t=(0,e.i(75254).default)("Trash2",[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17",key:"1uufr5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17",key:"xtxkd"}]]);e.s(["Trash2",()=>t],27612),e.s(["NIGERIA_STATES",0,["Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno","Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT - Abuja","Gombe","Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba","Yobe","Zamfara"]],56940)},48256,e=>{"use strict";let t=(0,e.i(75254).default)("Globe",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",key:"13o1zl"}],["path",{d:"M2 12h20",key:"9i4pu4"}]]);e.s(["Globe",()=>t],48256)},34098,e=>{"use strict";let t=(0,e.i(75254).default)("Route",[["circle",{cx:"6",cy:"19",r:"3",key:"1kj8tv"}],["path",{d:"M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15",key:"1d8sl"}],["circle",{cx:"18",cy:"5",r:"3",key:"gq8acd"}]]);e.s(["Route",()=>t],34098)},68945,e=>{"use strict";var t=e.i(43476),s=e.i(71645),a=e.i(70065),r=e.i(67881),i=e.i(94179),o=e.i(69035),n=e.i(10708),l=e.i(30374),c=e.i(62870),d=e.i(46897),u=e.i(48256),p=e.i(87316),m=e.i(84614),h=e.i(71689),f=e.i(31278),y=e.i(27612),g=e.i(88511),x=e.i(34098),b=e.i(47163),v=e.i(55487),j=e.i(23750),w=e.i(53145),k=e.i(56940),S=e.i(5766),E=e.i(18566),C=e.i(32962);function N({onBack:e}){let{selBusStop:N}=(0,v.useSelector)(e=>e.busStops),O=N?.status==="active",[A,T]=(0,s.useState)(!1),[B,R]=(0,s.useState)(!0),D=(0,C.useDeleteBusStop)(),I=(0,E.useRouter)(),{register:$,setValue:P,watch:_}=(0,w.useForm)({defaultValues:{routes:N?.routes,location:N?.location,area:N?.area,state:N?.state,country:N?.country}}),L=_("state"),z=(0,C.useModifyBusStop)(),{routes:K,location:U,area:F,state:q,country:H}=_();return(0,s.useEffect)(()=>{K&&U&&F&&q&&H?R(!1):R(!0)},[K,U,F,q,H]),(0,t.jsxs)("div",{className:"space-y-6",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsxs)(r.Button,{variant:"ghost",onClick:e,className:"gap-2",children:[(0,t.jsx)(h.ArrowLeft,{className:"h-4 w-4"})," Back to Bus Stops Table"]}),(0,t.jsxs)("div",{className:"flex gap-3",children:[(0,t.jsxs)(l.Dialog,{open:A,onOpenChange:T,children:[(0,t.jsx)(l.DialogTrigger,{asChild:!0,children:(0,t.jsxs)(r.Button,{variant:"outline",children:[(0,t.jsx)(g.Edit,{className:"h-4 w-4 mr-2"})," Edit Bus-Stop"]})}),(0,t.jsxs)(l.DialogContent,{className:"sm:max-w-md",children:[(0,t.jsx)(l.DialogHeader,{children:(0,t.jsx)(l.DialogTitle,{children:"Edit Bus-Stop"})}),(0,t.jsxs)("div",{className:"space-y-4 py-4",children:[(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(n.Label,{htmlFor:"routes",children:"Enter Routes"}),(0,t.jsx)(j.Input,{id:"routes",...$("routes"),placeholder:"Enter routes"})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(n.Label,{htmlFor:"location",children:"Enter Location"}),(0,t.jsx)(j.Input,{id:"location",...$("location"),placeholder:"Enter Location"})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(n.Label,{htmlFor:"area",children:"Enter Area"}),(0,t.jsx)(j.Input,{id:"area",...$("area"),placeholder:"Enter area"})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)("label",{className:"text-sm font-medium",children:"State"}),(0,t.jsxs)(c.Select,{value:L,onValueChange:e=>P("state",e),children:[(0,t.jsx)(c.SelectTrigger,{className:"w-full bg-transparent border-border",children:(0,t.jsx)(c.SelectValue,{placeholder:"Select a State"})}),(0,t.jsx)(c.SelectContent,{children:k.NIGERIA_STATES.map(e=>(0,t.jsx)(c.SelectItem,{value:e.toLowerCase(),children:e},e))})]})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(n.Label,{htmlFor:"state",children:"Country"}),(0,t.jsx)(j.Input,{id:"country",...$("country"),defaultValue:"Nigeria",placeholder:"Enter country"})]}),(0,t.jsx)(r.Button,{disabled:z.isPending||B,onClick:()=>{N&&z.mutate({bus_stop_id:N._id,location:U,routes:K,area:F,state:q,country:H},{onSettled:()=>T(!1)})},className:`w-full bg-primary ${z.isPending||B?"opacity-30":""} hover:bg-primary/90 text-primary-foreground`,children:z.isPending?(0,t.jsx)(f.Loader2,{className:"h-4 w-4 animate-spin"}):(0,t.jsx)(t.Fragment,{children:"Update Bus-Stop"})})]})]})]}),(0,t.jsxs)(r.Button,{variant:"destructive",onClick:()=>{var e;confirm("Permanently delete this Bus-Stop?")&&(e=N?._id||"",D.mutate(e,{onSettled:()=>I.push("/app-menu/bus-stops")}))},disabled:D.isPending,children:[D.isPending?(0,t.jsx)(f.Loader2,{className:"animate-spin h-4 w-4"}):(0,t.jsx)(y.Trash2,{className:"h-4 w-4 mr-2"}),"Delete Bus-Stop"]})]})]}),N&&(0,t.jsxs)("div",{className:"grid grid-cols-1 lg:grid-cols-3 gap-6",children:[(0,t.jsxs)(a.Card,{className:"lg:col-span-1 border-border",children:[(0,t.jsxs)(a.CardContent,{className:"pt-8 text-center",children:[(0,t.jsx)("div",{className:"h-20 w-20 bg-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-secondary",children:(0,t.jsx)(d.MapPin,{className:"h-10 w-10"})}),(0,t.jsx)("h2",{className:"text-xl font-bold px-4",children:N?.routes}),(0,t.jsx)("h2",{className:"text-xl font-bold px-4",children:N?.location}),(0,t.jsx)("p",{className:"text-muted-foreground text-sm mb-4",children:N?.area}),(0,t.jsx)(i.Badge,{variant:"outline",className:(0,b.cn)(O?"border-green-500 text-green-600 bg-green-50":"border-orange-500 text-orange-600 bg-orange-50"),children:O?"Active Station":"In-active Station"})]}),(0,t.jsx)(o.Separator,{className:"my-6"}),(0,t.jsxs)(a.CardContent,{className:"space-y-4",children:[(0,t.jsxs)("div",{className:"flex items-center gap-3 text-sm",children:[(0,t.jsx)(u.Globe,{className:"h-4 w-4 text-muted-foreground"})," ",(0,t.jsxs)("span",{children:[N.state,", ",N.country]})]}),(0,t.jsxs)("div",{className:"flex items-center gap-3 text-sm",children:[(0,t.jsx)(m.User,{className:"h-4 w-4 text-muted-foreground"})," ",(0,t.jsxs)("span",{children:["Added by: ",N.added_by.first_name," ",N.added_by.last_name]})]})]})]}),(0,t.jsxs)(a.Card,{className:"lg:col-span-2 border-border",children:[(0,t.jsx)(a.CardHeader,{children:(0,t.jsx)(a.CardTitle,{className:"text-lg",children:"Bus Stop Details"})}),(0,t.jsxs)(a.CardContent,{className:"grid grid-cols-1 md:grid-cols-2 gap-6",children:[(0,t.jsx)(M,{label:"Routes",value:`${N.routes}`,icon:(0,t.jsx)(x.Route,{})}),(0,t.jsx)(M,{label:"Address",value:N.location,icon:(0,t.jsx)(d.MapPin,{})}),(0,t.jsx)(M,{label:"Area",value:N.area,icon:(0,t.jsx)(d.MapPin,{})}),(0,t.jsx)(M,{label:"State",value:N.state,icon:(0,t.jsx)(u.Globe,{})}),(0,t.jsx)(M,{label:"Country",value:N.country,icon:(0,t.jsx)(u.Globe,{})}),(0,t.jsx)(M,{label:"Date Created",value:new Date(N.createdAt).toDateString(),icon:(0,t.jsx)(p.Calendar,{})})]})]})]}),(0,t.jsx)(S.Toaster,{})]})}function M({label:e,value:s,icon:a}){return(0,t.jsxs)("div",{className:"flex items-start gap-3",children:[(0,t.jsx)("div",{className:"mt-1 text-muted-foreground [&_svg]:h-4 [&_svg]:w-4",children:a}),(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-xs font-medium text-muted-foreground uppercase",children:e}),(0,t.jsx)("p",{className:"text-sm capitalize font-semibold",children:s})]})]})}function O(){let e=(0,E.useRouter)();return(0,t.jsx)("div",{className:"space-y-6",children:(0,t.jsx)(N,{onBack:()=>e.back()})})}e.s(["default",()=>O],68945)}]);