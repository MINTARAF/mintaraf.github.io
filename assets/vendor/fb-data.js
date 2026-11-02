import{A as Wt,B as Ht,C as Yt,E as Jt,F as Cn,G as Xt,H as Ln,I as X,d as zt,g as Gt,o as Qt,x as b,y as Kt,z as we}from"./fb-core.js";var $n="firebase",Mn="10.14.1";X($n,Mn,"app");var T=class{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}};T.UNAUTHENTICATED=new T(null),T.GOOGLE_CREDENTIALS=new T("google-credentials-uid"),T.FIRST_PARTY=new T("first-party-uid"),T.MOCK_USER=new T("mock-user");var Y="10.14.0";var z=new Wt("@firebase/firestore");function Ee(n,...e){if(z.logLevel<=we.DEBUG){let t=e.map(Lt);z.debug(`Firestore (${Y}): ${n}`,...t)}}function Ct(n,...e){if(z.logLevel<=we.ERROR){let t=e.map(Lt);z.error(`Firestore (${Y}): ${n}`,...t)}}function pn(n,...e){if(z.logLevel<=we.WARN){let t=e.map(Lt);z.warn(`Firestore (${Y}): ${n}`,...t)}}function Lt(n){if(typeof n=="string")return n;try{return(function(t){return JSON.stringify(t)})(n)}catch{return n}}function g(n="Unexpected state"){let e=`FIRESTORE (${Y}) INTERNAL ASSERTION FAILED: `+n;throw Ct(e),new Error(e)}function P(n,e){n||g()}function pe(n,e){return n}var Zt="ok",Un="cancelled",Z="unknown",d="invalid-argument",jn="deadline-exceeded",Bn="not-found";var zn="permission-denied",Ye="unauthenticated",Gn="resource-exhausted",O="failed-precondition",Qn="aborted",Kn="out-of-range",gn="unimplemented",Wn="internal",Hn="unavailable";var c=class extends Qt{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}};var Ae=class{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}},Je=class{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable((()=>t(T.UNAUTHENTICATED)))}shutdown(){}},Xe=class{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable((()=>t(this.token.user)))}shutdown(){this.changeListener=null}},Ze=class{constructor(e){this.auth=null,e.onInit((t=>{this.auth=t}))}getToken(){return this.auth?this.auth.getToken().then((e=>e?(P(typeof e.accessToken=="string"),new Ae(e.accessToken,new T(this.auth.getUid()))):null)):Promise.resolve(null)}invalidateToken(){}start(e,t){}shutdown(){}},et=class{constructor(e,t,r){this.t=e,this.i=t,this.o=r,this.type="FirstParty",this.user=T.FIRST_PARTY,this.u=new Map}l(){return this.o?this.o():null}get headers(){this.u.set("X-Goog-AuthUser",this.t);let e=this.l();return e&&this.u.set("Authorization",e),this.i&&this.u.set("X-Goog-Iam-Authorization-Token",this.i),this.u}},tt=class{constructor(e,t,r){this.t=e,this.i=t,this.o=r}getToken(){return Promise.resolve(new et(this.t,this.i,this.o))}start(e,t){e.enqueueRetryable((()=>t(T.FIRST_PARTY)))}shutdown(){}invalidateToken(){}},nt=class{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}},rt=class{constructor(e){this.h=e,this.appCheck=null,e.onInit((t=>{this.appCheck=t}))}getToken(){return this.appCheck?this.appCheck.getToken().then((e=>e?(P(typeof e.token=="string"),new nt(e.token)):null)):Promise.resolve(null)}invalidateToken(){}start(e,t){}shutdown(){}};var it=class{constructor(e,t,r,i,s,o,a,u,l){this.databaseId=e,this.appId=t,this.persistenceKey=r,this.host=i,this.ssl=s,this.forceLongPolling=o,this.autoDetectLongPolling=a,this.longPollingOptions=u,this.useFetchStreams=l}},Ve=class n{constructor(e,t){this.projectId=e,this.database=t||"(default)"}static empty(){return new n("","")}get isDefaultDatabase(){return this.database==="(default)"}isEqual(e){return e instanceof n&&e.projectId===this.projectId&&e.database===this.database}},Ie=class n{constructor(e,t,r){t===void 0?t=0:t>e.length&&g(),r===void 0?r=e.length-t:r>e.length-t&&g(),this.segments=e,this.offset=t,this.len=r}get length(){return this.len}isEqual(e){return n.comparator(this,e)===0}child(e){let t=this.segments.slice(this.offset,this.limit());return e instanceof n?e.forEach((r=>{t.push(r)})):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,r=this.limit();t<r;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){let r=Math.min(e.length,t.length);for(let i=0;i<r;i++){let s=e.get(i),o=t.get(i);if(s<o)return-1;if(s>o)return 1}return e.length<t.length?-1:e.length>t.length?1:0}},w=class n extends Ie{construct(e,t,r){return new n(e,t,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){let t=[];for(let r of e){if(r.indexOf("//")>=0)throw new c(d,`Invalid segment (${r}). Paths must not contain // in them.`);t.push(...r.split("/").filter((i=>i.length>0)))}return new n(t)}static emptyPath(){return new n([])}},Yn=/^[_a-zA-Z][_a-zA-Z0-9]*$/,D=class n extends Ie{construct(e,t,r){return new n(e,t,r)}static isValidIdentifier(e){return Yn.test(e)}canonicalString(){return this.toArray().map((e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),n.isValidIdentifier(e)||(e="`"+e+"`"),e))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)==="__name__"}static keyField(){return new n(["__name__"])}static fromServerFormat(e){let t=[],r="",i=0,s=()=>{if(r.length===0)throw new c(d,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(r),r=""},o=!1;for(;i<e.length;){let a=e[i];if(a==="\\"){if(i+1===e.length)throw new c(d,"Path has trailing escape character: "+e);let u=e[i+1];if(u!=="\\"&&u!=="."&&u!=="`")throw new c(d,"Path has invalid escape sequence: "+e);r+=u,i+=2}else a==="`"?(o=!o,i++):a!=="."||o?(r+=a,i++):(s(),i++)}if(s(),o)throw new c(d,"Unterminated ` in path: "+e);return new n(t)}static emptyPath(){return new n([])}};var I=class n{constructor(e){this.path=e}static fromPath(e){return new n(w.fromString(e))}static fromName(e){return new n(w.fromString(e).popFirst(5))}static empty(){return new n(w.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&w.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return w.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new n(new w(e.slice()))}};function _n(n,e,t){if(!t)throw new c(d,`Function ${n}() cannot be called with an empty ${e}.`)}function en(n){if(!I.isDocumentKey(n))throw new c(d,`Invalid document reference. Document references must have an even number of segments, but ${n} has ${n.length}.`)}function tn(n){if(I.isDocumentKey(n))throw new c(d,`Invalid collection reference. Collection references must have an odd number of segments, but ${n} has ${n.length}.`)}function Ge(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{let e=(function(r){return r.constructor?r.constructor.name:null})(n);return e?`a custom ${e} object`:"an object"}}return typeof n=="function"?"a function":g()}function U(n,e){if("_delegate"in n&&(n=n._delegate),!(n instanceof e)){if(e.name===n.constructor.name)throw new c(d,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{let t=Ge(n);throw new c(d,`Expected type '${e.name}', but it was: ${t}`)}}return n}function yn(n){let e={};return n.timeoutSeconds!==void 0&&(e.timeoutSeconds=n.timeoutSeconds),e}var ve=null;function Jn(){return ve===null?ve=(function(){return 268435456+Math.round(2147483648*Math.random())})():ve++,"0x"+ve.toString(16)}function Xn(n){return n==null}function Pe(n){return n===0&&1/n==-1/0}var Zn={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};var nn,f;function rn(n){if(n===void 0)return Ct("RPC_ERROR","HTTP error has no status"),Z;switch(n){case 200:return Zt;case 400:return O;case 401:return Ye;case 403:return zn;case 404:return Bn;case 409:return Qn;case 416:return Kn;case 429:return Gn;case 499:return Un;case 500:return Z;case 501:return gn;case 503:return Hn;case 504:return jn;default:return n>=200&&n<300?Zt:n>=400&&n<500?O:n>=500&&n<600?Wn:Z}}(f=nn||(nn={}))[f.OK=0]="OK",f[f.CANCELLED=1]="CANCELLED",f[f.UNKNOWN=2]="UNKNOWN",f[f.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",f[f.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",f[f.NOT_FOUND=5]="NOT_FOUND",f[f.ALREADY_EXISTS=6]="ALREADY_EXISTS",f[f.PERMISSION_DENIED=7]="PERMISSION_DENIED",f[f.UNAUTHENTICATED=16]="UNAUTHENTICATED",f[f.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",f[f.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",f[f.ABORTED=10]="ABORTED",f[f.OUT_OF_RANGE=11]="OUT_OF_RANGE",f[f.UNIMPLEMENTED=12]="UNIMPLEMENTED",f[f.INTERNAL=13]="INTERNAL",f[f.UNAVAILABLE=14]="UNAVAILABLE",f[f.DATA_LOSS=15]="DATA_LOSS";var st=class extends class{constructor(t){this.databaseInfo=t,this.databaseId=t.databaseId;let r=t.ssl?"https":"http",i=encodeURIComponent(this.databaseId.projectId),s=encodeURIComponent(this.databaseId.database);this.m=r+"://"+t.host,this.A=`projects/${i}/databases/${s}`,this.T=this.databaseId.database==="(default)"?`project_id=${i}`:`project_id=${i}&database_id=${s}`}get R(){return!1}P(t,r,i,s,o){let a=Jn(),u=this.V(t,r.toUriEncodedString());Ee("RestConnection",`Sending RPC '${t}' ${a}:`,u,i);let l={"google-cloud-resource-prefix":this.A,"x-goog-request-params":this.T};return this.I(l,s,o),this.p(t,u,l,i).then((h=>(Ee("RestConnection",`Received RPC '${t}' ${a}: `,h),h)),(h=>{throw pn("RestConnection",`RPC '${t}' ${a} failed with error: `,h,"url: ",u,"request:",i),h}))}g(t,r,i,s,o,a){return this.P(t,r,i,s,o)}I(t,r,i){t["X-Goog-Api-Client"]=(function(){return"gl-js/ fire/"+Y})(),t["Content-Type"]="text/plain",this.databaseInfo.appId&&(t["X-Firebase-GMPID"]=this.databaseInfo.appId),r&&r.headers.forEach(((s,o)=>t[o]=s)),i&&i.headers.forEach(((s,o)=>t[o]=s))}V(t,r){let i=Zn[t];return`${this.m}/v1/${r}:${i}`}terminate(){}}{constructor(e,t){super(e),this.F=t}v(e,t){throw new Error("Not supported by FetchConnection")}async p(e,t,r,i){var s;let o=JSON.stringify(i),a;try{a=await this.F(t,{method:"POST",headers:r,body:o})}catch(u){let l=u;throw new c(rn(l.status),"Request failed with error: "+l.statusText)}if(!a.ok){let u=await a.json();Array.isArray(u)&&(u=u[0]);let l=(s=u?.error)===null||s===void 0?void 0:s.message;throw new c(rn(a.status),`Request failed with error: ${l??a.statusText}`)}return a.json()}};function er(n){let e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(n);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let r=0;r<n;r++)t[r]=Math.floor(256*Math.random());return t}var ot=class{static newId(){let e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=Math.floor(256/e.length)*e.length,r="";for(;r.length<20;){let i=er(40);for(let s=0;s<i.length;++s)r.length<20&&i[s]<t&&(r+=e.charAt(i[s]%e.length))}return r}};function y(n,e){return n<e?-1:n>e?1:0}function wn(n,e,t){return n.length===e.length&&n.every(((r,i)=>t(r,e[i])))}function sn(n){let e=0;for(let t in n)Object.prototype.hasOwnProperty.call(n,t)&&e++;return e}function ge(n,e){for(let t in n)Object.prototype.hasOwnProperty.call(n,t)&&e(t,n[t])}var at=class extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}};var q=class n{constructor(e){this.binaryString=e}static fromBase64String(e){let t=(function(i){try{return atob(i)}catch(s){throw typeof DOMException<"u"&&s instanceof DOMException?new at("Invalid base64 string: "+s):s}})(e);return new n(t)}static fromUint8Array(e){let t=(function(i){let s="";for(let o=0;o<i.length;++o)s+=String.fromCharCode(i[o]);return s})(e);return new n(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return(function(t){return btoa(t)})(this.binaryString)}toUint8Array(){return(function(t){let r=new Uint8Array(t.length);for(let i=0;i<t.length;i++)r[i]=t.charCodeAt(i);return r})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return y(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}};q.EMPTY_BYTE_STRING=new q("");var tr=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function C(n){if(P(!!n),typeof n=="string"){let e=0,t=tr.exec(n);if(P(!!t),t[1]){let i=t[1];i=(i+"000000000").substr(0,9),e=Number(i)}let r=new Date(n);return{seconds:Math.floor(r.getTime()/1e3),nanos:e}}return{seconds:_(n.seconds),nanos:_(n.nanos)}}function _(n){return typeof n=="number"?n:typeof n=="string"?Number(n):0}function re(n){return typeof n=="string"?q.fromBase64String(n):q.fromUint8Array(n)}var S=class n{constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new c(d,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new c(d,"Timestamp nanoseconds out of range: "+t);if(e<-62135596800)throw new c(d,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new c(d,"Timestamp seconds out of range: "+e)}static now(){return n.fromMillis(Date.now())}static fromDate(e){return n.fromMillis(e.getTime())}static fromMillis(e){let t=Math.floor(e/1e3),r=Math.floor(1e6*(e-1e3*t));return new n(t,r)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(e){return this.seconds===e.seconds?y(this.nanoseconds,e.nanoseconds):y(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){let e=this.seconds- -62135596800;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}};function vn(n){var e,t;return((t=(((e=n?.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||t===void 0?void 0:t.stringValue)==="server_timestamp"}function Tn(n){let e=n.mapValue.fields.__previous_value__;return vn(e)?Tn(e):e}function ie(n){let e=C(n.mapValue.fields.__local_write_time__.timestampValue);return new S(e.seconds,e.nanos)}var Te={fields:{__type__:{stringValue:"__max__"}}};function L(n){return"nullValue"in n?0:"booleanValue"in n?1:"integerValue"in n||"doubleValue"in n?2:"timestampValue"in n?3:"stringValue"in n?5:"bytesValue"in n?6:"referenceValue"in n?7:"geoPointValue"in n?8:"arrayValue"in n?9:"mapValue"in n?vn(n)?4:(function(t){return(((t.mapValue||{}).fields||{}).__type__||{}).stringValue==="__max__"})(n)?9007199254740991:(function(t){var r,i;return((i=(((r=t?.mapValue)===null||r===void 0?void 0:r.fields)||{}).__type__)===null||i===void 0?void 0:i.stringValue)==="__vector__"})(n)?10:11:g()}function be(n,e){if(n===e)return!0;let t=L(n);if(t!==L(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return n.booleanValue===e.booleanValue;case 4:return ie(n).isEqual(ie(e));case 3:return(function(i,s){if(typeof i.timestampValue=="string"&&typeof s.timestampValue=="string"&&i.timestampValue.length===s.timestampValue.length)return i.timestampValue===s.timestampValue;let o=C(i.timestampValue),a=C(s.timestampValue);return o.seconds===a.seconds&&o.nanos===a.nanos})(n,e);case 5:return n.stringValue===e.stringValue;case 6:return(function(i,s){return re(i.bytesValue).isEqual(re(s.bytesValue))})(n,e);case 7:return n.referenceValue===e.referenceValue;case 8:return(function(i,s){return _(i.geoPointValue.latitude)===_(s.geoPointValue.latitude)&&_(i.geoPointValue.longitude)===_(s.geoPointValue.longitude)})(n,e);case 2:return(function(i,s){if("integerValue"in i&&"integerValue"in s)return _(i.integerValue)===_(s.integerValue);if("doubleValue"in i&&"doubleValue"in s){let o=_(i.doubleValue),a=_(s.doubleValue);return o===a?Pe(o)===Pe(a):isNaN(o)&&isNaN(a)}return!1})(n,e);case 9:return wn(n.arrayValue.values||[],e.arrayValue.values||[],be);case 10:case 11:return(function(i,s){let o=i.mapValue.fields||{},a=s.mapValue.fields||{};if(sn(o)!==sn(a))return!1;for(let u in o)if(o.hasOwnProperty(u)&&(a[u]===void 0||!be(o[u],a[u])))return!1;return!0})(n,e);default:return g()}}function se(n,e){return(n.values||[]).find((t=>be(t,e)))!==void 0}function Re(n,e){if(n===e)return 0;let t=L(n),r=L(e);if(t!==r)return y(t,r);switch(t){case 0:case 9007199254740991:return 0;case 1:return y(n.booleanValue,e.booleanValue);case 2:return(function(s,o){let a=_(s.integerValue||s.doubleValue),u=_(o.integerValue||o.doubleValue);return a<u?-1:a>u?1:a===u?0:isNaN(a)?isNaN(u)?0:-1:1})(n,e);case 3:return on(n.timestampValue,e.timestampValue);case 4:return on(ie(n),ie(e));case 5:return y(n.stringValue,e.stringValue);case 6:return(function(s,o){let a=re(s),u=re(o);return a.compareTo(u)})(n.bytesValue,e.bytesValue);case 7:return(function(s,o){let a=s.split("/"),u=o.split("/");for(let l=0;l<a.length&&l<u.length;l++){let h=y(a[l],u[l]);if(h!==0)return h}return y(a.length,u.length)})(n.referenceValue,e.referenceValue);case 8:return(function(s,o){let a=y(_(s.latitude),_(o.latitude));return a!==0?a:y(_(s.longitude),_(o.longitude))})(n.geoPointValue,e.geoPointValue);case 9:return an(n.arrayValue,e.arrayValue);case 10:return(function(s,o){var a,u,l,h;let p=s.fields||{},m=o.fields||{},v=(a=p.value)===null||a===void 0?void 0:a.arrayValue,V=(u=m.value)===null||u===void 0?void 0:u.arrayValue,ye=y(((l=v?.values)===null||l===void 0?void 0:l.length)||0,((h=V?.values)===null||h===void 0?void 0:h.length)||0);return ye!==0?ye:an(v,V)})(n.mapValue,e.mapValue);case 11:return(function(s,o){if(s===Te&&o===Te)return 0;if(s===Te)return 1;if(o===Te)return-1;let a=s.fields||{},u=Object.keys(a),l=o.fields||{},h=Object.keys(l);u.sort(),h.sort();for(let p=0;p<u.length&&p<h.length;++p){let m=y(u[p],h[p]);if(m!==0)return m;let v=Re(a[u[p]],l[h[p]]);if(v!==0)return v}return y(u.length,h.length)})(n.mapValue,e.mapValue);default:throw g()}}function on(n,e){if(typeof n=="string"&&typeof e=="string"&&n.length===e.length)return y(n,e);let t=C(n),r=C(e),i=y(t.seconds,r.seconds);return i!==0?i:y(t.nanos,r.nanos)}function an(n,e){let t=n.values||[],r=e.values||[];for(let i=0;i<t.length&&i<r.length;++i){let s=Re(t[i],r[i]);if(s)return s}return y(t.length,r.length)}function un(n,e){return{referenceValue:`projects/${n.projectId}/databases/${n.database}/documents/${e.path.canonicalString()}`}}function En(n){return!!n&&"arrayValue"in n}function ln(n){return!!n&&"nullValue"in n}function cn(n){return!!n&&"doubleValue"in n&&isNaN(Number(n.doubleValue))}function We(n){return!!n&&"mapValue"in n}function ee(n){if(n.geoPointValue)return{geoPointValue:Object.assign({},n.geoPointValue)};if(n.timestampValue&&typeof n.timestampValue=="object")return{timestampValue:Object.assign({},n.timestampValue)};if(n.mapValue){let e={mapValue:{fields:{}}};return ge(n.mapValue.fields,((t,r)=>e.mapValue.fields[t]=ee(r))),e}if(n.arrayValue){let e={arrayValue:{values:[]}};for(let t=0;t<(n.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=ee(n.arrayValue.values[t]);return e}return Object.assign({},n)}var Se=class{constructor(e,t){this.position=e,this.inclusive=t}};var ke=class{},k=class n extends ke{constructor(e,t,r){super(),this.field=e,this.op=t,this.value=r}static create(e,t,r){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,r):new ut(e,t,r):t==="array-contains"?new ht(e,r):t==="in"?new dt(e,r):t==="not-in"?new ft(e,r):t==="array-contains-any"?new mt(e,r):new n(e,t,r)}static createKeyFieldInFilter(e,t,r){return t==="in"?new lt(e,r):new ct(e,r)}matches(e){let t=e.data.field(this.field);return this.op==="!="?t!==null&&this.matchesComparison(Re(t,this.value)):t!==null&&L(this.value)===L(t)&&this.matchesComparison(Re(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return g()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}},oe=class n extends ke{constructor(e,t){super(),this.filters=e,this.op=t,this.D=null}static create(e,t){return new n(e,t)}matches(e){return(function(r){return r.op==="and"})(this)?this.filters.find((t=>!t.matches(e)))===void 0:this.filters.find((t=>t.matches(e)))!==void 0}getFlattenedFilters(){return this.D!==null||(this.D=this.filters.reduce(((e,t)=>e.concat(t.getFlattenedFilters())),[])),this.D}getFilters(){return Object.assign([],this.filters)}};var ut=class extends k{constructor(e,t,r){super(e,t,r),this.key=I.fromName(r.referenceValue)}matches(e){let t=I.comparator(e.key,this.key);return this.matchesComparison(t)}},lt=class extends k{constructor(e,t){super(e,"in",t),this.keys=An("in",t)}matches(e){return this.keys.some((t=>t.isEqual(e.key)))}},ct=class extends k{constructor(e,t){super(e,"not-in",t),this.keys=An("not-in",t)}matches(e){return!this.keys.some((t=>t.isEqual(e.key)))}};function An(n,e){var t;return(((t=e.arrayValue)===null||t===void 0?void 0:t.values)||[]).map((r=>I.fromName(r.referenceValue)))}var ht=class extends k{constructor(e,t){super(e,"array-contains",t)}matches(e){let t=e.data.field(this.field);return En(t)&&se(t.arrayValue,this.value)}},dt=class extends k{constructor(e,t){super(e,"in",t)}matches(e){let t=e.data.field(this.field);return t!==null&&se(this.value.arrayValue,t)}},ft=class extends k{constructor(e,t){super(e,"not-in",t)}matches(e){if(se(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;let t=e.data.field(this.field);return t!==null&&!se(this.value.arrayValue,t)}},mt=class extends k{constructor(e,t){super(e,"array-contains-any",t)}matches(e){let t=e.data.field(this.field);return!(!En(t)||!t.arrayValue.values)&&t.arrayValue.values.some((r=>se(this.value.arrayValue,r)))}};var ae=class{constructor(e,t="asc"){this.field=e,this.dir=t}};var A=class n{constructor(e){this.timestamp=e}static fromTimestamp(e){return new n(e)}static min(){return new n(new S(0,0))}static max(){return new n(new S(253402300799,999999999))}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}};var pt=class n{constructor(e,t){this.comparator=e,this.root=t||F.EMPTY}insert(e,t){return new n(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,F.BLACK,null,null))}remove(e){return new n(this.comparator,this.root.remove(e,this.comparator).copy(null,null,F.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){let r=this.comparator(e,t.key);if(r===0)return t.value;r<0?t=t.left:r>0&&(t=t.right)}return null}indexOf(e){let t=0,r=this.root;for(;!r.isEmpty();){let i=this.comparator(e,r.key);if(i===0)return t+r.left.size;i<0?r=r.left:(t+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal(((t,r)=>(e(t,r),!1)))}toString(){let e=[];return this.inorderTraversal(((t,r)=>(e.push(`${t}:${r}`),!1))),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new B(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new B(this.root,e,this.comparator,!1)}getReverseIterator(){return new B(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new B(this.root,e,this.comparator,!0)}},B=class{constructor(e,t,r,i){this.isReverse=i,this.nodeStack=[];let s=1;for(;!e.isEmpty();)if(s=t?r(e.key,t):1,t&&i&&(s*=-1),s<0)e=this.isReverse?e.left:e.right;else{if(s===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop(),t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;let e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}},F=class n{constructor(e,t,r,i,s){this.key=e,this.value=t,this.color=r??n.RED,this.left=i??n.EMPTY,this.right=s??n.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,r,i,s){return new n(e??this.key,t??this.value,r??this.color,i??this.left,s??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,r){let i=this,s=r(e,i.key);return i=s<0?i.copy(null,null,null,i.left.insert(e,t,r),null):s===0?i.copy(null,t,null,null,null):i.copy(null,null,null,null,i.right.insert(e,t,r)),i.fixUp()}removeMin(){if(this.left.isEmpty())return n.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let r,i=this;if(t(e,i.key)<0)i.left.isEmpty()||i.left.isRed()||i.left.left.isRed()||(i=i.moveRedLeft()),i=i.copy(null,null,null,i.left.remove(e,t),null);else{if(i.left.isRed()&&(i=i.rotateRight()),i.right.isEmpty()||i.right.isRed()||i.right.left.isRed()||(i=i.moveRedRight()),t(e,i.key)===0){if(i.right.isEmpty())return n.EMPTY;r=i.right.min(),i=i.copy(r.key,r.value,null,null,i.right.removeMin())}i=i.copy(null,null,null,null,i.right.remove(e,t))}return i.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){let e=this.copy(null,null,n.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){let e=this.copy(null,null,n.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){let e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){let e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw g();let e=this.left.check();if(e!==this.right.check())throw g();return e+(this.isRed()?0:1)}};F.EMPTY=null,F.RED=!0,F.BLACK=!1;F.EMPTY=new class{constructor(){this.size=0}get key(){throw g()}get value(){throw g()}get color(){throw g()}get left(){throw g()}get right(){throw g()}copy(e,t,r,i,s){return this}insert(e,t,r){return new F(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};var De=class n{constructor(e){this.comparator=e,this.data=new pt(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal(((t,r)=>(e(t),!1)))}forEachInRange(e,t){let r=this.data.getIteratorFrom(e[0]);for(;r.hasNext();){let i=r.getNext();if(this.comparator(i.key,e[1])>=0)return;t(i.key)}}forEachWhile(e,t){let r;for(r=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();r.hasNext();)if(!e(r.getNext().key))return}firstAfterOrEqual(e){let t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new Fe(this.data.getIterator())}getIteratorFrom(e){return new Fe(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach((r=>{t=t.add(r)})),t}isEqual(e){if(!(e instanceof n)||this.size!==e.size)return!1;let t=this.data.getIterator(),r=e.data.getIterator();for(;t.hasNext();){let i=t.getNext().key,s=r.getNext().key;if(this.comparator(i,s)!==0)return!1}return!0}toArray(){let e=[];return this.forEach((t=>{e.push(t)})),e}toString(){let e=[];return this.forEach((t=>e.push(t))),"SortedSet("+e.toString()+")"}copy(e){let t=new n(this.comparator);return t.data=e,t}},Fe=class{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}};var G=class n{constructor(e){this.fields=e,e.sort(D.comparator)}static empty(){return new n([])}unionWith(e){let t=new De(D.comparator);for(let r of this.fields)t=t.add(r);for(let r of e)t=t.add(r);return new n(t.toArray())}covers(e){for(let t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return wn(this.fields,e.fields,((t,r)=>t.isEqual(r)))}};var R=class n{constructor(e){this.value=e}static empty(){return new n({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let r=0;r<e.length-1;++r)if(t=(t.mapValue.fields||{})[e.get(r)],!We(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=ee(t)}setAll(e){let t=D.emptyPath(),r={},i=[];e.forEach(((o,a)=>{if(!t.isImmediateParentOf(a)){let u=this.getFieldsMap(t);this.applyChanges(u,r,i),r={},i=[],t=a.popLast()}o?r[a.lastSegment()]=ee(o):i.push(a.lastSegment())}));let s=this.getFieldsMap(t);this.applyChanges(s,r,i)}delete(e){let t=this.field(e.popLast());We(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return be(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let r=0;r<e.length;++r){let i=t.mapValue.fields[e.get(r)];We(i)&&i.mapValue.fields||(i={mapValue:{fields:{}}},t.mapValue.fields[e.get(r)]=i),t=i}return t.mapValue.fields}applyChanges(e,t,r){ge(t,((i,s)=>e[i]=s));for(let i of r)delete e[i]}clone(){return new n(ee(this.value))}};var ue=class n{constructor(e,t,r,i,s,o,a){this.key=e,this.documentType=t,this.version=r,this.readTime=i,this.createTime=s,this.data=o,this.documentState=a}static newInvalidDocument(e){return new n(e,0,A.min(),A.min(),A.min(),R.empty(),0)}static newFoundDocument(e,t,r,i){return new n(e,1,t,A.min(),r,i,0)}static newNoDocument(e,t){return new n(e,2,t,A.min(),A.min(),R.empty(),0)}static newUnknownDocument(e,t){return new n(e,3,t,A.min(),A.min(),R.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(A.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=R.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=R.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=A.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof n&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new n(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}};var gt=class{constructor(e,t=null,r=[],i=[],s=null,o=null,a=null){this.path=e,this.collectionGroup=t,this.orderBy=r,this.filters=i,this.limit=s,this.startAt=o,this.endAt=a,this.C=null}};function hn(n,e=null,t=[],r=[],i=null,s=null,o=null){return new gt(n,e,t,r,i,s,o)}var Ne=class{constructor(e,t=null,r=[],i=[],s=null,o="F",a=null,u=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=r,this.filters=i,this.limit=s,this.limitType=o,this.startAt=a,this.endAt=u,this.S=null,this.N=null,this.O=null,this.startAt,this.endAt}};function nr(n){return n.collectionGroup!==null}function rr(n){let e=pe(n);if(e.S===null){e.S=[];let t=new Set;for(let s of e.explicitOrderBy)e.S.push(s),t.add(s.field.canonicalString());let r=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(o){let a=new De(D.comparator);return o.filters.forEach((u=>{u.getFlattenedFilters().forEach((l=>{l.isInequality()&&(a=a.add(l.field))}))})),a})(e).forEach((s=>{t.has(s.canonicalString())||s.isKeyField()||e.S.push(new ae(s,r))})),t.has(D.keyField().canonicalString())||e.S.push(new ae(D.keyField(),r))}return e.S}function ir(n){let e=pe(n);return e.N||(e.N=sr(e,rr(n))),e.N}function sr(n,e){if(n.limitType==="F")return hn(n.path,n.collectionGroup,e,n.filters,n.limit,n.startAt,n.endAt);{e=e.map((i=>{let s=i.dir==="desc"?"asc":"desc";return new ae(i.field,s)}));let t=n.endAt?new Se(n.endAt.position,n.endAt.inclusive):null,r=n.startAt?new Se(n.startAt.position,n.startAt.inclusive):null;return hn(n.path,n.collectionGroup,e,n.filters,n.limit,t,r)}}function _t(n,e){let t=n.filters.concat([e]);return new Ne(n.path,n.collectionGroup,n.explicitOrderBy.slice(),t,n.limit,n.limitType,n.startAt,n.endAt)}function Vn(n,e){if(n.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Pe(e)?"-0":e}}function or(n,e){return(function(r){return typeof r=="number"&&Number.isInteger(r)&&!Pe(r)&&r<=Number.MAX_SAFE_INTEGER&&r>=Number.MIN_SAFE_INTEGER})(e)?(function(r){return{integerValue:""+r}})(e):Vn(n,e)}var Q=class{constructor(){this._=void 0}},xe=class extends Q{},yt=class extends Q{constructor(e){super(),this.elements=e}},wt=class extends Q{constructor(e){super(),this.elements=e}},vt=class extends Q{constructor(e,t){super(),this.serializer=e,this.q=t}};var Tt=class{constructor(e,t){this.field=e,this.transform=t}},N=class n{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new n}static exists(e){return new n(void 0,e)}static updateTime(e){return new n(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}},K=class{},qe=class extends K{constructor(e,t,r,i=[]){super(),this.key=e,this.value=t,this.precondition=r,this.fieldTransforms=i,this.type=0}getFieldMask(){return null}},le=class extends K{constructor(e,t,r,i,s=[]){super(),this.key=e,this.data=t,this.fieldMask=r,this.precondition=i,this.fieldTransforms=s,this.type=1}getFieldMask(){return this.fieldMask}},ce=class extends K{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}},Et=class extends K{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}};var ar={asc:"ASCENDING",desc:"DESCENDING"},ur={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},lr={and:"AND",or:"OR"},At=class{constructor(e,t){this.databaseId=e,this.useProto3Json=t}};function Vt(n,e){return n.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function cr(n,e){return n.useProto3Json?e.toBase64():e.toUint8Array()}function hr(n,e){return Vt(n,e.toTimestamp())}function te(n){return P(!!n),A.fromTimestamp((function(t){let r=C(t);return new S(r.seconds,r.nanos)})(n))}function $t(n,e){return It(n,e).canonicalString()}function It(n,e){let t=(function(i){return new w(["projects",i.projectId,"databases",i.database])})(n).child("documents");return e===void 0?t:t.child(e)}function Oe(n,e){return $t(n.databaseId,e.path)}function Pt(n,e){let t=(function(i){let s=w.fromString(i);return P(Pn(s)),s})(e);if(t.get(1)!==n.databaseId.projectId)throw new c(d,"Tried to deserialize key from different project: "+t.get(1)+" vs "+n.databaseId.projectId);if(t.get(3)!==n.databaseId.database)throw new c(d,"Tried to deserialize key from different database: "+t.get(3)+" vs "+n.databaseId.database);return new I((function(i){return P(i.length>4&&i.get(4)==="documents"),i.popFirst(5)})(t))}function dn(n,e,t){return{name:Oe(n,e),fields:t.value.mapValue.fields}}function dr(n,e){return"found"in e?(function(r,i){P(!!i.found),i.found.name,i.found.updateTime;let s=Pt(r,i.found.name),o=te(i.found.updateTime),a=i.found.createTime?te(i.found.createTime):A.min(),u=new R({mapValue:{fields:i.found.fields}});return ue.newFoundDocument(s,o,a,u)})(n,e):"missing"in e?(function(r,i){P(!!i.missing),P(!!i.readTime);let s=Pt(r,i.missing),o=te(i.readTime);return ue.newNoDocument(s,o)})(n,e):g()}function fr(n,e){let t;if(e instanceof qe)t={update:dn(n,e.key,e.value)};else if(e instanceof ce)t={delete:Oe(n,e.key)};else if(e instanceof le)t={update:dn(n,e.key,e.data),updateMask:yr(e.fieldMask)};else{if(!(e instanceof Et))return g();t={verify:Oe(n,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map((r=>(function(s,o){let a=o.transform;if(a instanceof xe)return{fieldPath:o.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(a instanceof yt)return{fieldPath:o.field.canonicalString(),appendMissingElements:{values:a.elements}};if(a instanceof wt)return{fieldPath:o.field.canonicalString(),removeAllFromArray:{values:a.elements}};if(a instanceof vt)return{fieldPath:o.field.canonicalString(),increment:a.q};throw g()})(0,r)))),e.precondition.isNone||(t.currentDocument=(function(i,s){return s.updateTime!==void 0?{updateTime:hr(i,s.updateTime)}:s.exists!==void 0?{exists:s.exists}:g()})(n,e.precondition)),t}function mr(n,e){let t={structuredQuery:{}},r=e.path,i;e.collectionGroup!==null?(i=r,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(i=r.popLast(),t.structuredQuery.from=[{collectionId:r.lastSegment()}]),t.parent=(function(l,h){return $t(l.databaseId,h)})(n,i);let s=(function(l){if(l.length!==0)return In(oe.create(l,"and"))})(e.filters);s&&(t.structuredQuery.where=s);let o=(function(l){if(l.length!==0)return l.map((h=>(function(m){return{field:j(m.field),direction:pr(m.dir)}})(h)))})(e.orderBy);o&&(t.structuredQuery.orderBy=o);let a=(function(l,h){return l.useProto3Json||Xn(h)?h:{value:h}})(n,e.limit);return a!==null&&(t.structuredQuery.limit=a),e.startAt&&(t.structuredQuery.startAt=(function(l){return{before:l.inclusive,values:l.position}})(e.startAt)),e.endAt&&(t.structuredQuery.endAt=(function(l){return{before:!l.inclusive,values:l.position}})(e.endAt)),{B:t,parent:i}}function pr(n){return ar[n]}function gr(n){return ur[n]}function _r(n){return lr[n]}function j(n){return{fieldPath:n.canonicalString()}}function In(n){return n instanceof k?(function(t){if(t.op==="=="){if(cn(t.value))return{unaryFilter:{field:j(t.field),op:"IS_NAN"}};if(ln(t.value))return{unaryFilter:{field:j(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(cn(t.value))return{unaryFilter:{field:j(t.field),op:"IS_NOT_NAN"}};if(ln(t.value))return{unaryFilter:{field:j(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:j(t.field),op:gr(t.op),value:t.value}}})(n):n instanceof oe?(function(t){let r=t.getFilters().map((i=>In(i)));return r.length===1?r[0]:{compositeFilter:{op:_r(t.op),filters:r}}})(n):g()}function yr(n){let e=[];return n.fields.forEach((t=>e.push(t.canonicalString()))),{fieldPaths:e}}function Pn(n){return n.length>=4&&n.get(0)==="projects"&&n.get(2)==="databases"}function Mt(n){return new At(n,!0)}var bt=class extends class{}{constructor(e,t,r,i){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=r,this.serializer=i,this.Y=!1}Z(){if(this.Y)throw new c(O,"The client has already been terminated.")}P(e,t,r,i){return this.Z(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([s,o])=>this.connection.P(e,It(t,r),i,s,o))).catch((s=>{throw s.name==="FirebaseError"?(s.code===Ye&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),s):new c(Z,s.toString())}))}g(e,t,r,i,s){return this.Z(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([o,a])=>this.connection.g(e,It(t,r),i,o,a,s))).catch((o=>{throw o.name==="FirebaseError"?(o.code===Ye&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new c(Z,o.toString())}))}terminate(){this.Y=!0,this.connection.terminate()}};async function Qe(n,e){let t=pe(n),r={writes:e.map((i=>fr(t.serializer,i)))};await t.P("Commit",t.serializer.databaseId,w.emptyPath(),r)}async function wr(n,e){let t=pe(n),r={documents:e.map((a=>Oe(t.serializer,a)))},i=await t.g("BatchGetDocuments",t.serializer.databaseId,w.emptyPath(),r,e.length),s=new Map;i.forEach((a=>{let u=dr(t.serializer,a);s.set(u.key.toString(),u)}));let o=[];return e.forEach((a=>{let u=s.get(a.toString());P(!!u),o.push(u)})),o}async function vr(n,e){let t=pe(n),{B:r,parent:i}=mr(t.serializer,ir(e));return(await t.g("RunQuery",t.serializer.databaseId,i,{structuredQuery:r.structuredQuery})).filter((s=>!!s.document)).map((s=>(function(a,u,l){let h=Pt(a,u.name),p=te(u.updateTime),m=u.createTime?te(u.createTime):A.min(),v=new R({mapValue:{fields:u.fields}}),V=ue.newFoundDocument(h,p,m,v);return l&&V.setHasCommittedMutations(),l?V.setHasCommittedMutations():V})(t.serializer,s.document,void 0)))}var ne=new Map;function J(n){if(n._terminated)throw new c(O,"The client has already been terminated.");if(!ne.has(n)){Ee("ComponentProvider","Initializing Datastore");let e=(function(s){return new st(s,fetch.bind(null))})((function(s,o,a,u){return new it(s,o,a,u.host,u.ssl,u.experimentalForceLongPolling,u.experimentalAutoDetectLongPolling,yn(u.experimentalLongPollingOptions),u.useFetchStreams)})(n._databaseId,n.app.options.appId||"",n._persistenceKey,n._freezeSettings())),t=Mt(n._databaseId),r=(function(s,o,a,u){return new bt(s,o,a,u)})(n._authCredentials,n._appCheckCredentials,e,t);ne.set(n,r)}return ne.get(n)}var Ce=class{constructor(e){var t,r;if(e.host===void 0){if(e.ssl!==void 0)throw new c(d,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=e.host,this.ssl=(t=e.ssl)===null||t===void 0||t;if(this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<1048576)throw new c(d,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}(function(s,o,a,u){if(o===!0&&u===!0)throw new c(d,`${s} and ${a} cannot be used together.`)})("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=yn((r=e.experimentalLongPollingOptions)!==null&&r!==void 0?r:{}),(function(s){if(s.timeoutSeconds!==void 0){if(isNaN(s.timeoutSeconds))throw new c(d,`invalid long polling timeout: ${s.timeoutSeconds} (must not be NaN)`);if(s.timeoutSeconds<5)throw new c(d,`invalid long polling timeout: ${s.timeoutSeconds} (minimum allowed value is 5)`);if(s.timeoutSeconds>30)throw new c(d,`invalid long polling timeout: ${s.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(function(r,i){return r.timeoutSeconds===i.timeoutSeconds})(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}},$=class{constructor(e,t,r,i){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=r,this._app=i,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new Ce({}),this._settingsFrozen=!1,this._terminateTask="notTerminated"}get app(){if(!this._app)throw new c(O,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new c(O,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new Ce(e),e.credentials!==void 0&&(this._authCredentials=(function(r){if(!r)return new Je;switch(r.type){case"firstParty":return new tt(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new c(d,"makeAuthCredentialsProvider failed due to invalid credential type")}})(e.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(t){let r=ne.get(t);r&&(Ee("ComponentProvider","Removing Datastore"),ne.delete(t),r.terminate())})(this),Promise.resolve()}};function Tr(n,e){let t=typeof n=="object"?n:Xt(),r=typeof n=="string"?n:e||"(default)",i=Yt(t,"firestore/lite").getImmediate({identifier:r});if(!i._initialized){let s=zt("firestore");s&&Er(i,...s)}return i}function Er(n,e,t,r={}){var i;let s=(n=U(n,$))._getSettings(),o=`${e}:${t}`;if(s.host!=="firestore.googleapis.com"&&s.host!==o&&pn("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),n._setSettings(Object.assign(Object.assign({},s),{host:o,ssl:!1})),r.mockUserToken){let a,u;if(typeof r.mockUserToken=="string")a=r.mockUserToken,u=T.MOCK_USER;else{a=Gt(r.mockUserToken,(i=n._app)===null||i===void 0?void 0:i.options.projectId);let l=r.mockUserToken.sub||r.mockUserToken.user_id;if(!l)throw new c(d,"mockUserToken must contain 'sub' or 'user_id' field!");u=new T(l)}n._authCredentials=new Xe(new Ae(a,u))}}var W=class n{constructor(e,t,r){this.converter=t,this._query=r,this.type="query",this.firestore=e}withConverter(e){return new n(this.firestore,e,this._query)}},E=class n{constructor(e,t,r){this.converter=t,this._key=r,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new x(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new n(this.firestore,e,this._key)}},x=class n extends W{constructor(e,t,r){super(e,t,(function(s){return new Ne(s)})(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){let e=this._path.popLast();return e.isEmpty()?null:new E(this.firestore,null,new I(e))}withConverter(e){return new n(this.firestore,e,this._path)}};function Ar(n,e,...t){if(n=b(n),_n("collection","path",e),n instanceof $){let r=w.fromString(e,...t);return tn(r),new x(n,null,r)}{if(!(n instanceof E||n instanceof x))throw new c(d,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");let r=n._path.child(w.fromString(e,...t));return tn(r),new x(n.firestore,null,r)}}function Vr(n,e,...t){if(n=b(n),arguments.length===1&&(e=ot.newId()),_n("doc","path",e),n instanceof $){let r=w.fromString(e,...t);return en(r),new E(n,null,new I(r))}{if(!(n instanceof E||n instanceof x))throw new c(d,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");let r=n._path.child(w.fromString(e,...t));return en(r),new E(n.firestore,n instanceof x?n.converter:null,new I(r))}}var he=class n{constructor(e){this._byteString=e}static fromBase64String(e){try{return new n(q.fromBase64String(e))}catch(t){throw new c(d,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new n(q.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}};var M=class{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new c(d,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new D(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}};var H=class{constructor(e){this._methodName=e}};var de=class{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new c(d,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new c(d,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(e){return y(this._lat,e._lat)||y(this._long,e._long)}};var fe=class{constructor(e){this._values=(e||[]).map((t=>t))}toArray(){return this._values.map((e=>e))}isEqual(e){return(function(r,i){if(r.length!==i.length)return!1;for(let s=0;s<r.length;++s)if(r[s]!==i[s])return!1;return!0})(this._values,e._values)}};var Ir=/^__.*__$/,Rt=class{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return this.fieldMask!==null?new le(e,this.data,this.fieldMask,t,this.fieldTransforms):new qe(e,this.data,t,this.fieldTransforms)}},Le=class{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return new le(e,this.data,this.fieldMask,t,this.fieldTransforms)}};function bn(n){switch(n){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw g()}}var St=class n{constructor(e,t,r,i,s,o){this.settings=e,this.databaseId=t,this.serializer=r,this.ignoreUndefinedProperties=i,s===void 0&&this.tt(),this.fieldTransforms=s||[],this.fieldMask=o||[]}get path(){return this.settings.path}get et(){return this.settings.et}rt(e){return new n(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}nt(e){var t;let r=(t=this.path)===null||t===void 0?void 0:t.child(e),i=this.rt({path:r,it:!1});return i.st(e),i}ot(e){var t;let r=(t=this.path)===null||t===void 0?void 0:t.child(e),i=this.rt({path:r,it:!1});return i.tt(),i}ut(e){return this.rt({path:void 0,it:!0})}_t(e){return Me(e,this.settings.methodName,this.settings.ct||!1,this.path,this.settings.lt)}contains(e){return this.fieldMask.find((t=>e.isPrefixOf(t)))!==void 0||this.fieldTransforms.find((t=>e.isPrefixOf(t.field)))!==void 0}tt(){if(this.path)for(let e=0;e<this.path.length;e++)this.st(this.path.get(e))}st(e){if(e.length===0)throw this._t("Document fields must not be empty");if(bn(this.et)&&Ir.test(e))throw this._t('Document fields cannot begin and end with "__"')}},kt=class{constructor(e,t,r){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=r||Mt(e)}ht(e,t,r,i=!1){return new St({et:e,methodName:t,lt:r,path:D.emptyPath(),it:!1,ct:i},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}};function Ke(n){let e=n._freezeSettings(),t=Mt(n._databaseId);return new kt(n._databaseId,!!e.ignoreUndefinedProperties,t)}function Rn(n,e,t,r,i,s={}){let o=n.ht(s.merge||s.mergeFields?2:0,e,t,i);Ut("Data must be an object, but it was:",o,r);let a=Dn(r,o),u,l;if(s.merge)u=new G(o.fieldMask),l=o.fieldTransforms;else if(s.mergeFields){let h=[];for(let p of s.mergeFields){let m=Ft(e,p,t);if(!o.contains(m))throw new c(d,`Field '${m}' is specified in your field mask but missing from your input data.`);Nn(h,m)||h.push(m)}u=new G(h),l=o.fieldTransforms.filter((p=>u.covers(p.field)))}else u=null,l=o.fieldTransforms;return new Rt(new R(a),u,l)}var $e=class n extends H{_toFieldTransform(e){if(e.et!==2)throw e.et===1?e._t(`${this._methodName}() can only appear at the top level of your update data`):e._t(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof n}};var Dt=class n extends H{_toFieldTransform(e){return new Tt(e.path,new xe)}isEqual(e){return e instanceof n}};function Sn(n,e,t,r){let i=n.ht(1,e,t);Ut("Data must be an object, but it was:",i,r);let s=[],o=R.empty();ge(r,((u,l)=>{let h=jt(e,u,t);l=b(l);let p=i.ot(h);if(l instanceof $e)s.push(h);else{let m=_e(l,p);m!=null&&(s.push(h),o.set(h,m))}}));let a=new G(s);return new Le(o,a,i.fieldTransforms)}function kn(n,e,t,r,i,s){let o=n.ht(1,e,t),a=[Ft(e,r,t)],u=[i];if(s.length%2!=0)throw new c(d,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let m=0;m<s.length;m+=2)a.push(Ft(e,s[m])),u.push(s[m+1]);let l=[],h=R.empty();for(let m=a.length-1;m>=0;--m)if(!Nn(l,a[m])){let v=a[m],V=u[m];V=b(V);let ye=o.ot(v);if(V instanceof $e)l.push(v);else{let Bt=_e(V,ye);Bt!=null&&(l.push(v),h.set(v,Bt))}}let p=new G(l);return new Le(h,p,o.fieldTransforms)}function Pr(n,e,t,r=!1){return _e(t,n.ht(r?4:3,e))}function _e(n,e){if(Fn(n=b(n)))return Ut("Unsupported field value:",e,n),Dn(n,e);if(n instanceof H)return(function(r,i){if(!bn(i.et))throw i._t(`${r._methodName}() can only be used with update() and set()`);if(!i.path)throw i._t(`${r._methodName}() is not currently supported inside arrays`);let s=r._toFieldTransform(i);s&&i.fieldTransforms.push(s)})(n,e),null;if(n===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),n instanceof Array){if(e.settings.it&&e.et!==4)throw e._t("Nested arrays are not supported");return(function(r,i){let s=[],o=0;for(let a of r){let u=_e(a,i.ut(o));u==null&&(u={nullValue:"NULL_VALUE"}),s.push(u),o++}return{arrayValue:{values:s}}})(n,e)}return(function(r,i){if((r=b(r))===null)return{nullValue:"NULL_VALUE"};if(typeof r=="number")return or(i.serializer,r);if(typeof r=="boolean")return{booleanValue:r};if(typeof r=="string")return{stringValue:r};if(r instanceof Date){let s=S.fromDate(r);return{timestampValue:Vt(i.serializer,s)}}if(r instanceof S){let s=new S(r.seconds,1e3*Math.floor(r.nanoseconds/1e3));return{timestampValue:Vt(i.serializer,s)}}if(r instanceof de)return{geoPointValue:{latitude:r.latitude,longitude:r.longitude}};if(r instanceof he)return{bytesValue:cr(i.serializer,r._byteString)};if(r instanceof E){let s=i.databaseId,o=r.firestore._databaseId;if(!o.isEqual(s))throw i._t(`Document reference is for database ${o.projectId}/${o.database} but should be for database ${s.projectId}/${s.database}`);return{referenceValue:$t(r.firestore._databaseId||i.databaseId,r._key.path)}}if(r instanceof fe)return(function(o,a){return{mapValue:{fields:{__type__:{stringValue:"__vector__"},value:{arrayValue:{values:o.toArray().map((u=>{if(typeof u!="number")throw a._t("VectorValues must only contain numeric values.");return Vn(a.serializer,u)}))}}}}}})(r,i);throw i._t(`Unsupported field value: ${Ge(r)}`)})(n,e)}function Dn(n,e){let t={};return(function(i){for(let s in i)if(Object.prototype.hasOwnProperty.call(i,s))return!1;return!0})(n)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):ge(n,((r,i)=>{let s=_e(i,e.nt(r));s!=null&&(t[r]=s)})),{mapValue:{fields:t}}}function Fn(n){return!(typeof n!="object"||n===null||n instanceof Array||n instanceof Date||n instanceof S||n instanceof de||n instanceof he||n instanceof E||n instanceof H||n instanceof fe)}function Ut(n,e,t){if(!Fn(t)||!(function(i){return typeof i=="object"&&i!==null&&(Object.getPrototypeOf(i)===Object.prototype||Object.getPrototypeOf(i)===null)})(t)){let r=Ge(t);throw r==="an object"?e._t(n+" a custom object"):e._t(n+" "+r)}}function Ft(n,e,t){if((e=b(e))instanceof M)return e._internalPath;if(typeof e=="string")return jt(n,e);throw Me("Field path arguments must be of type string or ",n,!1,void 0,t)}var br=new RegExp("[~\\*/\\[\\]]");function jt(n,e,t){if(e.search(br)>=0)throw Me(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,n,!1,void 0,t);try{return new M(...e.split("."))._internalPath}catch{throw Me(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n,!1,void 0,t)}}function Me(n,e,t,r,i){let s=r&&!r.isEmpty(),o=i!==void 0,a=`Function ${e}() called with invalid data`;t&&(a+=" (via `toFirestore()`)"),a+=". ";let u="";return(s||o)&&(u+=" (found",s&&(u+=` in field ${r}`),o&&(u+=` in document ${i}`),u+=")"),new c(d,a+n+u)}function Nn(n,e){return n.some((t=>t.isEqual(e)))}var Ue=class{constructor(e,t,r,i,s){this._firestore=e,this._userDataWriter=t,this._key=r,this._document=i,this._converter=s}get id(){return this._key.path.lastSegment()}get ref(){return new E(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){let e=new je(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){let t=this._document.data.field(xn("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}},je=class extends Ue{data(){return super.data()}},Nt=class{constructor(e,t){this._docs=t,this.query=e}get docs(){return[...this._docs]}get size(){return this.docs.length}get empty(){return this.docs.length===0}forEach(e,t){this._docs.forEach(e,t)}};function xn(n,e){return typeof e=="string"?jt(n,e):e instanceof M?e._internalPath:e._delegate._internalPath}var me=class{},xt=class extends me{};function Rr(n,e,...t){let r=[];e instanceof me&&r.push(e),r=r.concat(t),(function(s){let o=s.filter((u=>u instanceof qt)).length,a=s.filter((u=>u instanceof Be)).length;if(o>1||o>0&&a>0)throw new c(d,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")})(r);for(let i of r)n=i._apply(n);return n}var Be=class n extends xt{constructor(e,t,r){super(),this._field=e,this._op=t,this._value=r,this.type="where"}static _create(e,t,r){return new n(e,t,r)}_apply(e){let t=this._parse(e);return qn(e._query,t),new W(e.firestore,e.converter,_t(e._query,t))}_parse(e){let t=Ke(e.firestore);return(function(s,o,a,u,l,h,p){let m;if(l.isKeyField()){if(h==="array-contains"||h==="array-contains-any")throw new c(d,`Invalid Query. You can't perform '${h}' queries on documentId().`);if(h==="in"||h==="not-in"){mn(p,h);let v=[];for(let V of p)v.push(fn(u,s,V));m={arrayValue:{values:v}}}else m=fn(u,s,p)}else h!=="in"&&h!=="not-in"&&h!=="array-contains-any"||mn(p,h),m=Pr(a,o,p,h==="in"||h==="not-in");return k.create(l,h,m)})(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}};function Sr(n,e,t){let r=e,i=xn("where",n);return Be._create(i,r,t)}var qt=class n extends me{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new n(e,t)}_parse(e){let t=this._queryConstraints.map((r=>r._parse(e))).filter((r=>r.getFilters().length>0));return t.length===1?t[0]:oe.create(t,this._getOperator())}_apply(e){let t=this._parse(e);return t.getFilters().length===0?e:((function(i,s){let o=i,a=s.getFlattenedFilters();for(let u of a)qn(o,u),o=_t(o,u)})(e._query,t),new W(e.firestore,e.converter,_t(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}};function fn(n,e,t){if(typeof(t=b(t))=="string"){if(t==="")throw new c(d,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!nr(e)&&t.indexOf("/")!==-1)throw new c(d,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${t}' contains a '/' character.`);let r=e.path.child(w.fromString(t));if(!I.isDocumentKey(r))throw new c(d,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${r}' is not because it has an odd number of segments (${r.length}).`);return un(n,new I(r))}if(t instanceof E)return un(n,t._key);throw new c(d,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${Ge(t)}.`)}function mn(n,e){if(!Array.isArray(n)||n.length===0)throw new c(d,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function qn(n,e){let t=(function(i,s){for(let o of i)for(let a of o.getFlattenedFilters())if(s.indexOf(a.op)>=0)return a.op;return null})(n.filters,(function(i){switch(i){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}})(e.op));if(t!==null)throw t===e.op?new c(d,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new c(d,`Invalid query. You cannot use '${e.op.toString()}' filters with '${t.toString()}' filters.`)}function On(n,e,t){let r;return r=n?t&&(t.merge||t.mergeFields)?n.toFirestore(e,t):n.toFirestore(e):e,r}var ze=class extends class{convertValue(t,r="none"){switch(L(t)){case 0:return null;case 1:return t.booleanValue;case 2:return _(t.integerValue||t.doubleValue);case 3:return this.convertTimestamp(t.timestampValue);case 4:return this.convertServerTimestamp(t,r);case 5:return t.stringValue;case 6:return this.convertBytes(re(t.bytesValue));case 7:return this.convertReference(t.referenceValue);case 8:return this.convertGeoPoint(t.geoPointValue);case 9:return this.convertArray(t.arrayValue,r);case 11:return this.convertObject(t.mapValue,r);case 10:return this.convertVectorValue(t.mapValue);default:throw g()}}convertObject(t,r){return this.convertObjectMap(t.fields,r)}convertObjectMap(t,r="none"){let i={};return ge(t,((s,o)=>{i[s]=this.convertValue(o,r)})),i}convertVectorValue(t){var r,i,s;let o=(s=(i=(r=t.fields)===null||r===void 0?void 0:r.value.arrayValue)===null||i===void 0?void 0:i.values)===null||s===void 0?void 0:s.map((a=>_(a.doubleValue)));return new fe(o)}convertGeoPoint(t){return new de(_(t.latitude),_(t.longitude))}convertArray(t,r){return(t.values||[]).map((i=>this.convertValue(i,r)))}convertServerTimestamp(t,r){switch(r){case"previous":let i=Tn(t);return i==null?null:this.convertValue(i,r);case"estimate":return this.convertTimestamp(ie(t));default:return null}}convertTimestamp(t){let r=C(t);return new S(r.seconds,r.nanos)}convertDocumentKey(t,r){let i=w.fromString(t);P(Pn(i));let s=new Ve(i.get(1),i.get(3)),o=new I(i.popFirst(5));return s.isEqual(r)||Ct(`Document ${o} contains a document reference within a different database (${s.projectId}/${s.database}) which is not supported. It will be treated as a reference in the current database (${r.projectId}/${r.database}) instead.`),o}}{constructor(e){super(),this.firestore=e}convertBytes(e){return new he(e)}convertReference(e){let t=this.convertDocumentKey(e,this.firestore._databaseId);return new E(this.firestore,null,t)}};function kr(n){let e=J((n=U(n,E)).firestore),t=new ze(n.firestore);return wr(e,[n._key]).then((r=>{P(r.length===1);let i=r[0];return new Ue(n.firestore,t,n._key,i.isFoundDocument()?i:null,n.converter)}))}function Dr(n){(function(i){if(i.limitType==="L"&&i.explicitOrderBy.length===0)throw new c(gn,"limitToLast() queries require specifying at least one orderBy() clause")})((n=U(n,W))._query);let e=J(n.firestore),t=new ze(n.firestore);return vr(e,n._query).then((r=>{let i=r.map((s=>new je(n.firestore,t,s.key,s,n.converter)));return n._query.limitType==="L"&&i.reverse(),new Nt(n,i)}))}function Fr(n,e,t){let r=On((n=U(n,E)).converter,e,t),i=Rn(Ke(n.firestore),"setDoc",n._key,r,n.converter!==null,t);return Qe(J(n.firestore),[i.toMutation(n._key,N.none())])}function Nr(n,e,t,...r){let i=Ke((n=U(n,E)).firestore),s;return s=typeof(e=b(e))=="string"||e instanceof M?kn(i,"updateDoc",n._key,e,t,r):Sn(i,"updateDoc",n._key,e),Qe(J(n.firestore),[s.toMutation(n._key,N.exists(!0))])}function xr(n){return Qe(J((n=U(n,E)).firestore),[new ce(n._key,N.none())])}function qr(){return new Dt("serverTimestamp")}var Ot=class{constructor(e,t){this._firestore=e,this._commitHandler=t,this._mutations=[],this._committed=!1,this._dataReader=Ke(e)}set(e,t,r){this._verifyNotCommitted();let i=He(e,this._firestore),s=On(i.converter,t,r),o=Rn(this._dataReader,"WriteBatch.set",i._key,s,i.converter!==null,r);return this._mutations.push(o.toMutation(i._key,N.none())),this}update(e,t,r,...i){this._verifyNotCommitted();let s=He(e,this._firestore),o;return o=typeof(t=b(t))=="string"||t instanceof M?kn(this._dataReader,"WriteBatch.update",s._key,t,r,i):Sn(this._dataReader,"WriteBatch.update",s._key,t),this._mutations.push(o.toMutation(s._key,N.exists(!0))),this}delete(e){this._verifyNotCommitted();let t=He(e,this._firestore);return this._mutations=this._mutations.concat(new ce(t._key,N.none())),this}commit(){return this._verifyNotCommitted(),this._committed=!0,this._mutations.length>0?this._commitHandler(this._mutations):Promise.resolve()}_verifyNotCommitted(){if(this._committed)throw new c(O,"A write batch can no longer be used after commit() has been called.")}};function He(n,e){if((n=b(n)).firestore!==e)throw new c(d,"Provided document reference is from a different Firestore instance.");return n}function Or(n){let e=J(n=U(n,$));return new Ot(n,(t=>Qe(e,t)))}(function(){(function(t){Y=t})(`${Jt}_lite`),Ht(new Kt("firestore/lite",((e,{instanceIdentifier:t,options:r})=>{let i=e.getProvider("app").getImmediate(),s=new $(new Ze(e.getProvider("auth-internal")),new rt(e.getProvider("app-check-internal")),(function(a,u){if(!Object.prototype.hasOwnProperty.apply(a.options,["projectId"]))throw new c(d,'"projectId" not provided in firebase.initializeApp.');return new Ve(a.options.projectId,u)})(i,t),i);return r&&s._setSettings(r),s}),"PUBLIC").setMultipleInstances(!0)),X("firestore-lite","4.7.3",""),X("firestore-lite","4.7.3","esm2017")})();export{S as Timestamp,Ar as collection,Ln as deleteApp,xr as deleteDoc,Vr as doc,kr as getDoc,Dr as getDocs,Tr as getFirestore,Cn as initializeApp,Rr as query,qr as serverTimestamp,Fr as setDoc,Nr as updateDoc,Sr as where,Or as writeBatch};
/*! Bundled license information:

firebase/app/dist/esm/index.esm.js:
@firebase/firestore/dist/lite/index.browser.esm2017.js:
@firebase/firestore/dist/lite/index.browser.esm2017.js:
@firebase/firestore/dist/lite/index.browser.esm2017.js:
@firebase/firestore/dist/lite/index.browser.esm2017.js:
@firebase/firestore/dist/lite/index.browser.esm2017.js:
@firebase/firestore/dist/lite/index.browser.esm2017.js:
@firebase/firestore/dist/lite/index.browser.esm2017.js:
@firebase/firestore/dist/lite/index.browser.esm2017.js:
@firebase/firestore/dist/lite/index.browser.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm2017.js:
@firebase/firestore/dist/lite/index.browser.esm2017.js:
@firebase/firestore/dist/lite/index.browser.esm2017.js:
@firebase/firestore/dist/lite/index.browser.esm2017.js:
@firebase/firestore/dist/lite/index.browser.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm2017.js:
  (**
  * @license
  * Copyright 2020 Google LLC
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *   http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm2017.js:
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm2017.js:
@firebase/firestore/dist/lite/index.browser.esm2017.js:
@firebase/firestore/dist/lite/index.browser.esm2017.js:
@firebase/firestore/dist/lite/index.browser.esm2017.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2018 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2024 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
*/
