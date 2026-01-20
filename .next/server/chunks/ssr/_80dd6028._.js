module.exports=[96221,a=>{"use strict";let b=(0,a.i(70106).default)("LoaderCircle",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]]);a.s(["Loader2",()=>b],96221)},70025,a=>{"use strict";var b=a.i(72131),c=a.i(12794),d=a.i(18544),e=a.i(33791),f=a.i(42871),g=class extends e.Subscribable{#a;#b=void 0;#c;#d;constructor(a,b){super(),this.#a=a,this.setOptions(b),this.bindMethods(),this.#e()}bindMethods(){this.mutate=this.mutate.bind(this),this.reset=this.reset.bind(this)}setOptions(a){let b=this.options;this.options=this.#a.defaultMutationOptions(a),(0,f.shallowEqualObjects)(this.options,b)||this.#a.getMutationCache().notify({type:"observerOptionsUpdated",mutation:this.#c,observer:this}),b?.mutationKey&&this.options.mutationKey&&(0,f.hashKey)(b.mutationKey)!==(0,f.hashKey)(this.options.mutationKey)?this.reset():this.#c?.state.status==="pending"&&this.#c.setOptions(this.options)}onUnsubscribe(){this.hasListeners()||this.#c?.removeObserver(this)}onMutationUpdate(a){this.#e(),this.#f(a)}getCurrentResult(){return this.#b}reset(){this.#c?.removeObserver(this),this.#c=void 0,this.#e(),this.#f()}mutate(a,b){return this.#d=b,this.#c?.removeObserver(this),this.#c=this.#a.getMutationCache().build(this.#a,this.options),this.#c.addObserver(this),this.#c.execute(a)}#e(){let a=this.#c?.state??(0,c.getDefaultState)();this.#b={...a,isPending:"pending"===a.status,isSuccess:"success"===a.status,isError:"error"===a.status,isIdle:"idle"===a.status,mutate:this.mutate,reset:this.reset}}#f(a){d.notifyManager.batch(()=>{if(this.#d&&this.hasListeners()){let b=this.#b.variables,c=this.#b.context,d={client:this.#a,meta:this.options.meta,mutationKey:this.options.mutationKey};a?.type==="success"?(this.#d.onSuccess?.(a.data,b,c,d),this.#d.onSettled?.(a.data,null,b,c,d)):a?.type==="error"&&(this.#d.onError?.(a.error,b,c,d),this.#d.onSettled?.(void 0,a.error,b,c,d))}this.listeners.forEach(a=>{a(this.#b)})})}},h=a.i(37927);function i(a,c){let e=(0,h.useQueryClient)(c),[i]=b.useState(()=>new g(e,a));b.useEffect(()=>{i.setOptions(a)},[i,a]);let j=b.useSyncExternalStore(b.useCallback(a=>i.subscribe(d.notifyManager.batchCalls(a)),[i]),()=>i.getCurrentResult(),()=>i.getCurrentResult()),k=b.useCallback((a,b)=>{i.mutate(a,b).catch(f.noop)},[i]);if(j.error&&(0,f.shouldThrowError)(i.options.throwOnError,[j.error]))throw j.error;return{...j,mutate:k,mutateAsync:j.mutate}}a.s(["useMutation",()=>i],70025)},6704,a=>{"use strict";let b,c;var d,e=a.i(72131);let f={data:""},g=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,h=/\/\*[^]*?\*\/|  +/g,i=/\n+/g,j=(a,b)=>{let c="",d="",e="";for(let f in a){let g=a[f];"@"==f[0]?"i"==f[1]?c=f+" "+g+";":d+="f"==f[1]?j(g,f):f+"{"+j(g,"k"==f[1]?"":b)+"}":"object"==typeof g?d+=j(g,b?b.replace(/([^,])+/g,a=>f.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,b=>/&/.test(b)?b.replace(/&/g,a):a?a+" "+b:b)):f):null!=g&&(f=/^--/.test(f)?f:f.replace(/[A-Z]/g,"-$&").toLowerCase(),e+=j.p?j.p(f,g):f+":"+g+";")}return c+(b&&e?b+"{"+e+"}":e)+d},k={},l=a=>{if("object"==typeof a){let b="";for(let c in a)b+=c+l(a[c]);return b}return a};function m(a){let b,c,d=this||{},e=a.call?a(d.p):a;return((a,b,c,d,e)=>{var f;let m=l(a),n=k[m]||(k[m]=(a=>{let b=0,c=11;for(;b<a.length;)c=101*c+a.charCodeAt(b++)>>>0;return"go"+c})(m));if(!k[n]){let b=m!==a?a:(a=>{let b,c,d=[{}];for(;b=g.exec(a.replace(h,""));)b[4]?d.shift():b[3]?(c=b[3].replace(i," ").trim(),d.unshift(d[0][c]=d[0][c]||{})):d[0][b[1]]=b[2].replace(i," ").trim();return d[0]})(a);k[n]=j(e?{["@keyframes "+n]:b}:b,c?"":"."+n)}let o=c&&k.g?k.g:null;return c&&(k.g=k[n]),f=k[n],o?b.data=b.data.replace(o,f):-1===b.data.indexOf(f)&&(b.data=d?f+b.data:b.data+f),n})(e.unshift?e.raw?(b=[].slice.call(arguments,1),c=d.p,e.reduce((a,d,e)=>{let f=b[e];if(f&&f.call){let a=f(c),b=a&&a.props&&a.props.className||/^go/.test(a)&&a;f=b?"."+b:a&&"object"==typeof a?a.props?"":j(a,""):!1===a?"":a}return a+d+(null==f?"":f)},"")):e.reduce((a,b)=>Object.assign(a,b&&b.call?b(d.p):b),{}):e,d.target||f,d.g,d.o,d.k)}m.bind({g:1});let n,o,p,q=m.bind({k:1});function r(a,b){let c=this||{};return function(){let d=arguments;function e(f,g){let h=Object.assign({},f),i=h.className||e.className;c.p=Object.assign({theme:o&&o()},h),c.o=/ *go\d+/.test(i),h.className=m.apply(c,d)+(i?" "+i:""),b&&(h.ref=g);let j=a;return a[0]&&(j=h.as||a,delete h.as),p&&j[0]&&p(h),n(j,h)}return b?b(e):e}}var s=(a,b)=>"function"==typeof a?a(b):a,t=(b=0,()=>(++b).toString()),u="default",v=(a,b)=>{let{toastLimit:c}=a.settings;switch(b.type){case 0:return{...a,toasts:[b.toast,...a.toasts].slice(0,c)};case 1:return{...a,toasts:a.toasts.map(a=>a.id===b.toast.id?{...a,...b.toast}:a)};case 2:let{toast:d}=b;return v(a,{type:+!!a.toasts.find(a=>a.id===d.id),toast:d});case 3:let{toastId:e}=b;return{...a,toasts:a.toasts.map(a=>a.id===e||void 0===e?{...a,dismissed:!0,visible:!1}:a)};case 4:return void 0===b.toastId?{...a,toasts:[]}:{...a,toasts:a.toasts.filter(a=>a.id!==b.toastId)};case 5:return{...a,pausedAt:b.time};case 6:let f=b.time-(a.pausedAt||0);return{...a,pausedAt:void 0,toasts:a.toasts.map(a=>({...a,pauseDuration:a.pauseDuration+f}))}}},w=[],x={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},y={},z=(a,b=u)=>{y[b]=v(y[b]||x,a),w.forEach(([a,c])=>{a===b&&c(y[b])})},A=a=>Object.keys(y).forEach(b=>z(a,b)),B=(a=u)=>b=>{z(b,a)},C={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},D=(a={},b=u)=>{let[c,d]=(0,e.useState)(y[b]||x),f=(0,e.useRef)(y[b]);(0,e.useEffect)(()=>(f.current!==y[b]&&d(y[b]),w.push([b,d]),()=>{let a=w.findIndex(([a])=>a===b);a>-1&&w.splice(a,1)}),[b]);let g=c.toasts.map(b=>{var c,d,e;return{...a,...a[b.type],...b,removeDelay:b.removeDelay||(null==(c=a[b.type])?void 0:c.removeDelay)||(null==a?void 0:a.removeDelay),duration:b.duration||(null==(d=a[b.type])?void 0:d.duration)||(null==a?void 0:a.duration)||C[b.type],style:{...a.style,...null==(e=a[b.type])?void 0:e.style,...b.style}}});return{...c,toasts:g}},E=a=>(b,c)=>{let d,e=((a,b="blank",c)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:b,ariaProps:{role:"status","aria-live":"polite"},message:a,pauseDuration:0,...c,id:(null==c?void 0:c.id)||t()}))(b,a,c);return B(e.toasterId||(d=e.id,Object.keys(y).find(a=>y[a].toasts.some(a=>a.id===d))))({type:2,toast:e}),e.id},F=(a,b)=>E("blank")(a,b);F.error=E("error"),F.success=E("success"),F.loading=E("loading"),F.custom=E("custom"),F.dismiss=(a,b)=>{let c={type:3,toastId:a};b?B(b)(c):A(c)},F.dismissAll=a=>F.dismiss(void 0,a),F.remove=(a,b)=>{let c={type:4,toastId:a};b?B(b)(c):A(c)},F.removeAll=a=>F.remove(void 0,a),F.promise=(a,b,c)=>{let d=F.loading(b.loading,{...c,...null==c?void 0:c.loading});return"function"==typeof a&&(a=a()),a.then(a=>{let e=b.success?s(b.success,a):void 0;return e?F.success(e,{id:d,...c,...null==c?void 0:c.success}):F.dismiss(d),a}).catch(a=>{let e=b.error?s(b.error,a):void 0;e?F.error(e,{id:d,...c,...null==c?void 0:c.error}):F.dismiss(d)}),a};var G=1e3,H=(a,b="default")=>{let{toasts:c,pausedAt:d}=D(a,b),f=(0,e.useRef)(new Map).current,g=(0,e.useCallback)((a,b=G)=>{if(f.has(a))return;let c=setTimeout(()=>{f.delete(a),h({type:4,toastId:a})},b);f.set(a,c)},[]);(0,e.useEffect)(()=>{if(d)return;let a=Date.now(),e=c.map(c=>{if(c.duration===1/0)return;let d=(c.duration||0)+c.pauseDuration-(a-c.createdAt);if(d<0){c.visible&&F.dismiss(c.id);return}return setTimeout(()=>F.dismiss(c.id,b),d)});return()=>{e.forEach(a=>a&&clearTimeout(a))}},[c,d,b]);let h=(0,e.useCallback)(B(b),[b]),i=(0,e.useCallback)(()=>{h({type:5,time:Date.now()})},[h]),j=(0,e.useCallback)((a,b)=>{h({type:1,toast:{id:a,height:b}})},[h]),k=(0,e.useCallback)(()=>{d&&h({type:6,time:Date.now()})},[d,h]),l=(0,e.useCallback)((a,b)=>{let{reverseOrder:d=!1,gutter:e=8,defaultPosition:f}=b||{},g=c.filter(b=>(b.position||f)===(a.position||f)&&b.height),h=g.findIndex(b=>b.id===a.id),i=g.filter((a,b)=>b<h&&a.visible).length;return g.filter(a=>a.visible).slice(...d?[i+1]:[0,i]).reduce((a,b)=>a+(b.height||0)+e,0)},[c]);return(0,e.useEffect)(()=>{c.forEach(a=>{if(a.dismissed)g(a.id,a.removeDelay);else{let b=f.get(a.id);b&&(clearTimeout(b),f.delete(a.id))}})},[c,g]),{toasts:c,handlers:{updateHeight:j,startPause:i,endPause:k,calculateOffset:l}}},I=q`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,J=q`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,K=q`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,L=r("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${a=>a.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${I} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${J} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${a=>a.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${K} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,M=q`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,N=r("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${a=>a.secondary||"#e0e0e0"};
  border-right-color: ${a=>a.primary||"#616161"};
  animation: ${M} 1s linear infinite;
`,O=q`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,P=q`
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
}`,Q=r("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${a=>a.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${O} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${P} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${a=>a.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,R=r("div")`
  position: absolute;
`,S=r("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,T=q`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,U=r("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${T} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,V=({toast:a})=>{let{icon:b,type:c,iconTheme:d}=a;return void 0!==b?"string"==typeof b?e.createElement(U,null,b):b:"blank"===c?null:e.createElement(S,null,e.createElement(N,{...d}),"loading"!==c&&e.createElement(R,null,"error"===c?e.createElement(L,{...d}):e.createElement(Q,{...d})))},W=r("div")`
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
`,X=r("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,Y=e.memo(({toast:a,position:b,style:d,children:f})=>{let g=a.height?((a,b)=>{let d=a.includes("top")?1:-1,[e,f]=c?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*d}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*d}%,-1px) scale(.6); opacity:0;}
`];return{animation:b?`${q(e)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${q(f)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(a.position||b||"top-center",a.visible):{opacity:0},h=e.createElement(V,{toast:a}),i=e.createElement(X,{...a.ariaProps},s(a.message,a));return e.createElement(W,{className:a.className,style:{...g,...d,...a.style}},"function"==typeof f?f({icon:h,message:i}):e.createElement(e.Fragment,null,h,i))});d=e.createElement,j.p=void 0,n=d,o=void 0,p=void 0;var Z=({id:a,className:b,style:c,onHeightUpdate:d,children:f})=>{let g=e.useCallback(b=>{if(b){let c=()=>{d(a,b.getBoundingClientRect().height)};c(),new MutationObserver(c).observe(b,{subtree:!0,childList:!0,characterData:!0})}},[a,d]);return e.createElement("div",{ref:g,className:b,style:c},f)},$=m`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,_=({reverseOrder:a,position:b="top-center",toastOptions:d,gutter:f,children:g,toasterId:h,containerStyle:i,containerClassName:j})=>{let{toasts:k,handlers:l}=H(d,h);return e.createElement("div",{"data-rht-toaster":h||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...i},className:j,onMouseEnter:l.startPause,onMouseLeave:l.endPause},k.map(d=>{let h,i,j=d.position||b,k=l.calculateOffset(d,{reverseOrder:a,gutter:f,defaultPosition:b}),m=(h=j.includes("top"),i=j.includes("center")?{justifyContent:"center"}:j.includes("right")?{justifyContent:"flex-end"}:{},{left:0,right:0,display:"flex",position:"absolute",transition:c?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${k*(h?1:-1)}px)`,...h?{top:0}:{bottom:0},...i});return e.createElement(Z,{id:d.id,key:d.id,onHeightUpdate:l.updateHeight,className:d.visible?$:"",style:m},"custom"===d.type?s(d.message,d):g?g(d):e.createElement(Y,{toast:d,position:j}))}))};a.s(["CheckmarkIcon",()=>Q,"ErrorIcon",()=>L,"LoaderIcon",()=>N,"ToastBar",()=>Y,"ToastIcon",()=>V,"Toaster",()=>_,"default",()=>F,"resolveValue",()=>s,"toast",()=>F,"useToaster",()=>H,"useToasterStore",()=>D],6704)},59931,a=>{"use strict";let b=new(a.i(54289)).QueryClient({defaultOptions:{queries:{retry:2,staleTime:3e5}}});a.s(["queryClient",0,b])},33217,a=>{"use strict";let b;var c=a.i(99745),d=a.i(18544),e=a.i(76644),f=a.i(33791),g=a.i(79715),h=a.i(42871),i=a.i(8361),j=class extends f.Subscribable{constructor(a,b){super(),this.options=b,this.#a=a,this.#g=null,this.#h=(0,g.pendingThenable)(),this.bindMethods(),this.setOptions(b)}#a;#i=void 0;#j=void 0;#b=void 0;#k;#l;#h;#g;#m;#n;#o;#p;#q;#r;#s=new Set;bindMethods(){this.refetch=this.refetch.bind(this)}onSubscribe(){1===this.listeners.size&&(this.#i.addObserver(this),k(this.#i,this.options)?this.#t():this.updateResult(),this.#u())}onUnsubscribe(){this.hasListeners()||this.destroy()}shouldFetchOnReconnect(){return l(this.#i,this.options,this.options.refetchOnReconnect)}shouldFetchOnWindowFocus(){return l(this.#i,this.options,this.options.refetchOnWindowFocus)}destroy(){this.listeners=new Set,this.#v(),this.#w(),this.#i.removeObserver(this)}setOptions(a){let b=this.options,c=this.#i;if(this.options=this.#a.defaultQueryOptions(a),void 0!==this.options.enabled&&"boolean"!=typeof this.options.enabled&&"function"!=typeof this.options.enabled&&"boolean"!=typeof(0,h.resolveEnabled)(this.options.enabled,this.#i))throw Error("Expected enabled to be a boolean or a callback that returns a boolean");this.#x(),this.#i.setOptions(this.options),b._defaulted&&!(0,h.shallowEqualObjects)(this.options,b)&&this.#a.getQueryCache().notify({type:"observerOptionsUpdated",query:this.#i,observer:this});let d=this.hasListeners();d&&m(this.#i,c,this.options,b)&&this.#t(),this.updateResult(),d&&(this.#i!==c||(0,h.resolveEnabled)(this.options.enabled,this.#i)!==(0,h.resolveEnabled)(b.enabled,this.#i)||(0,h.resolveStaleTime)(this.options.staleTime,this.#i)!==(0,h.resolveStaleTime)(b.staleTime,this.#i))&&this.#y();let e=this.#z();d&&(this.#i!==c||(0,h.resolveEnabled)(this.options.enabled,this.#i)!==(0,h.resolveEnabled)(b.enabled,this.#i)||e!==this.#r)&&this.#A(e)}getOptimisticResult(a){var b,c;let d=this.#a.getQueryCache().build(this.#a,a),e=this.createResult(d,a);return b=this,c=e,(0,h.shallowEqualObjects)(b.getCurrentResult(),c)||(this.#b=e,this.#l=this.options,this.#k=this.#i.state),e}getCurrentResult(){return this.#b}trackResult(a,b){return new Proxy(a,{get:(a,c)=>(this.trackProp(c),b?.(c),"promise"===c&&(this.trackProp("data"),this.options.experimental_prefetchInRender||"pending"!==this.#h.status||this.#h.reject(Error("experimental_prefetchInRender feature flag is not enabled"))),Reflect.get(a,c))})}trackProp(a){this.#s.add(a)}getCurrentQuery(){return this.#i}refetch({...a}={}){return this.fetch({...a})}fetchOptimistic(a){let b=this.#a.defaultQueryOptions(a),c=this.#a.getQueryCache().build(this.#a,b);return c.fetch().then(()=>this.createResult(c,b))}fetch(a){return this.#t({...a,cancelRefetch:a.cancelRefetch??!0}).then(()=>(this.updateResult(),this.#b))}#t(a){this.#x();let b=this.#i.fetch(this.options,a);return a?.throwOnError||(b=b.catch(h.noop)),b}#y(){this.#v();let a=(0,h.resolveStaleTime)(this.options.staleTime,this.#i);if(h.isServer||this.#b.isStale||!(0,h.isValidTimeout)(a))return;let b=(0,h.timeUntilStale)(this.#b.dataUpdatedAt,a);this.#p=i.timeoutManager.setTimeout(()=>{this.#b.isStale||this.updateResult()},b+1)}#z(){return("function"==typeof this.options.refetchInterval?this.options.refetchInterval(this.#i):this.options.refetchInterval)??!1}#A(a){this.#w(),this.#r=a,!h.isServer&&!1!==(0,h.resolveEnabled)(this.options.enabled,this.#i)&&(0,h.isValidTimeout)(this.#r)&&0!==this.#r&&(this.#q=i.timeoutManager.setInterval(()=>{(this.options.refetchIntervalInBackground||c.focusManager.isFocused())&&this.#t()},this.#r))}#u(){this.#y(),this.#A(this.#z())}#v(){this.#p&&(i.timeoutManager.clearTimeout(this.#p),this.#p=void 0)}#w(){this.#q&&(i.timeoutManager.clearInterval(this.#q),this.#q=void 0)}createResult(a,b){let c,d=this.#i,f=this.options,i=this.#b,j=this.#k,l=this.#l,o=a!==d?a.state:this.#j,{state:p}=a,q={...p},r=!1;if(b._optimisticResults){let c=this.hasListeners(),g=!c&&k(a,b),h=c&&m(a,d,b,f);(g||h)&&(q={...q,...(0,e.fetchState)(p.data,a.options)}),"isRestoring"===b._optimisticResults&&(q.fetchStatus="idle")}let{error:s,errorUpdatedAt:t,status:u}=q;c=q.data;let v=!1;if(void 0!==b.placeholderData&&void 0===c&&"pending"===u){let a;i?.isPlaceholderData&&b.placeholderData===l?.placeholderData?(a=i.data,v=!0):a="function"==typeof b.placeholderData?b.placeholderData(this.#o?.state.data,this.#o):b.placeholderData,void 0!==a&&(u="success",c=(0,h.replaceData)(i?.data,a,b),r=!0)}if(b.select&&void 0!==c&&!v)if(i&&c===j?.data&&b.select===this.#m)c=this.#n;else try{this.#m=b.select,c=b.select(c),c=(0,h.replaceData)(i?.data,c,b),this.#n=c,this.#g=null}catch(a){this.#g=a}this.#g&&(s=this.#g,c=this.#n,t=Date.now(),u="error");let w="fetching"===q.fetchStatus,x="pending"===u,y="error"===u,z=x&&w,A=void 0!==c,B={status:u,fetchStatus:q.fetchStatus,isPending:x,isSuccess:"success"===u,isError:y,isInitialLoading:z,isLoading:z,data:c,dataUpdatedAt:q.dataUpdatedAt,error:s,errorUpdatedAt:t,failureCount:q.fetchFailureCount,failureReason:q.fetchFailureReason,errorUpdateCount:q.errorUpdateCount,isFetched:q.dataUpdateCount>0||q.errorUpdateCount>0,isFetchedAfterMount:q.dataUpdateCount>o.dataUpdateCount||q.errorUpdateCount>o.errorUpdateCount,isFetching:w,isRefetching:w&&!x,isLoadingError:y&&!A,isPaused:"paused"===q.fetchStatus,isPlaceholderData:r,isRefetchError:y&&A,isStale:n(a,b),refetch:this.refetch,promise:this.#h,isEnabled:!1!==(0,h.resolveEnabled)(b.enabled,a)};if(this.options.experimental_prefetchInRender){let b=a=>{"error"===B.status?a.reject(B.error):void 0!==B.data&&a.resolve(B.data)},c=()=>{b(this.#h=B.promise=(0,g.pendingThenable)())},e=this.#h;switch(e.status){case"pending":a.queryHash===d.queryHash&&b(e);break;case"fulfilled":("error"===B.status||B.data!==e.value)&&c();break;case"rejected":("error"!==B.status||B.error!==e.reason)&&c()}}return B}updateResult(){let a=this.#b,b=this.createResult(this.#i,this.options);if(this.#k=this.#i.state,this.#l=this.options,void 0!==this.#k.data&&(this.#o=this.#i),(0,h.shallowEqualObjects)(b,a))return;this.#b=b;let c=()=>{if(!a)return!0;let{notifyOnChangeProps:b}=this.options,c="function"==typeof b?b():b;if("all"===c||!c&&!this.#s.size)return!0;let d=new Set(c??this.#s);return this.options.throwOnError&&d.add("error"),Object.keys(this.#b).some(b=>this.#b[b]!==a[b]&&d.has(b))};this.#f({listeners:c()})}#x(){let a=this.#a.getQueryCache().build(this.#a,this.options);if(a===this.#i)return;let b=this.#i;this.#i=a,this.#j=a.state,this.hasListeners()&&(b?.removeObserver(this),a.addObserver(this))}onQueryUpdate(){this.updateResult(),this.hasListeners()&&this.#u()}#f(a){d.notifyManager.batch(()=>{a.listeners&&this.listeners.forEach(a=>{a(this.#b)}),this.#a.getQueryCache().notify({query:this.#i,type:"observerResultsUpdated"})})}};function k(a,b){return!1!==(0,h.resolveEnabled)(b.enabled,a)&&void 0===a.state.data&&("error"!==a.state.status||!1!==b.retryOnMount)||void 0!==a.state.data&&l(a,b,b.refetchOnMount)}function l(a,b,c){if(!1!==(0,h.resolveEnabled)(b.enabled,a)&&"static"!==(0,h.resolveStaleTime)(b.staleTime,a)){let d="function"==typeof c?c(a):c;return"always"===d||!1!==d&&n(a,b)}return!1}function m(a,b,c,d){return(a!==b||!1===(0,h.resolveEnabled)(d.enabled,a))&&(!c.suspense||"error"!==a.state.status)&&n(a,c)}function n(a,b){return!1!==(0,h.resolveEnabled)(b.enabled,a)&&a.isStaleByTime((0,h.resolveStaleTime)(b.staleTime,a))}var o=a.i(72131),p=a.i(37927);a.i(87924);var q=o.createContext((b=!1,{clearReset:()=>{b=!1},reset:()=>{b=!0},isReset:()=>b})),r=o.createContext(!1);r.Provider;var s=(a,b,c)=>b.fetchOptimistic(a).catch(()=>{c.clearReset()});function t(a,b){return function(a,b,c){let e=o.useContext(r),f=o.useContext(q),g=(0,p.useQueryClient)(c),i=g.defaultQueryOptions(a);if(g.getDefaultOptions().queries?._experimental_beforeQuery?.(i),i._optimisticResults=e?"isRestoring":"optimistic",i.suspense){let a=a=>"static"===a?a:Math.max(a??1e3,1e3),b=i.staleTime;i.staleTime="function"==typeof b?(...c)=>a(b(...c)):a(b),"number"==typeof i.gcTime&&(i.gcTime=Math.max(i.gcTime,1e3))}(i.suspense||i.throwOnError||i.experimental_prefetchInRender)&&!f.isReset()&&(i.retryOnMount=!1),o.useEffect(()=>{f.clearReset()},[f]);let j=!g.getQueryCache().get(i.queryHash),[k]=o.useState(()=>new b(g,i)),l=k.getOptimisticResult(i),m=!e&&!1!==a.subscribed;if(o.useSyncExternalStore(o.useCallback(a=>{let b=m?k.subscribe(d.notifyManager.batchCalls(a)):h.noop;return k.updateResult(),b},[k,m]),()=>k.getCurrentResult(),()=>k.getCurrentResult()),o.useEffect(()=>{k.setOptions(i)},[i,k]),i?.suspense&&l.isPending)throw s(i,k,f);if((({result:a,errorResetBoundary:b,throwOnError:c,query:d,suspense:e})=>a.isError&&!b.isReset()&&!a.isFetching&&d&&(e&&void 0===a.data||(0,h.shouldThrowError)(c,[a.error,d])))({result:l,errorResetBoundary:f,throwOnError:i.throwOnError,query:g.getQueryCache().get(i.queryHash),suspense:i.suspense}))throw l.error;if(g.getDefaultOptions().queries?._experimental_afterQuery?.(i,l),i.experimental_prefetchInRender&&!h.isServer&&l.isLoading&&l.isFetching&&!e){let a=j?s(i,k,f):g.getQueryCache().get(i.queryHash)?.promise;a?.catch(h.noop).finally(()=>{k.updateResult()})}return i.notifyOnChangeProps?l:k.trackResult(l)}(a,j,b)}a.s(["useQuery",()=>t],33217)}];

//# sourceMappingURL=_80dd6028._.js.map