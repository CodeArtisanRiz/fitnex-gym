import{t as e}from"./rolldown-runtime.uxh0A31G.mjs";import{F as t,M as n,T as r,_ as i,b as a,c as o,j as s,k as c,l,o as u}from"./react.CGG9stYK.mjs";import{a as d,r as f,t as p,w as m}from"./motion.CWve7XER.mjs";import{$ as h,L as g,N as _,O as v,Ot as y,P as b,R as x,bt as S,dt as C,kt as w,o as T,q as E}from"./framer.CWVObrnq.mjs";import{a as D,i as O,o as k,r as A}from"./shared-lib.DvX1fqWN.mjs";import{i as j,n as M,r as N,t as P}from"./OfgnAVnWs._5Ty7hCG.mjs";var F,I=e((()=>{h(),F=x({title:`Wave Gradient`,fragment:`
#define S(a,b,t) smoothstep(a,b,t)

mat2 Rot(float a) {
    float s = sin(a), c = cos(a);
    return mat2(c, -s, s, c);
}

vec2 hash(vec2 p) {
    float s = u_seed;
    vec2 k1 = vec2(2127.1 + s * 13.37, 81.17 + s * 7.31);
    vec2 k2 = vec2(1269.5 + s * 11.13, 283.37 + s * 5.79);
    p = vec2(dot(p, k1), dot(p, k2));
    return fract(sin(p) * (43758.5453 + s * 1.618));
}

float noise(in vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float n = mix(
        mix(dot(-1.0 + 2.0 * hash(i), f),
            dot(-1.0 + 2.0 * hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
        mix(dot(-1.0 + 2.0 * hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
            dot(-1.0 + 2.0 * hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
        u.y
    );
    return 0.5 + 0.5 * n;
}

vec3 getColor(int idx) {
    if (u_colors_length < 1) return vec3(0.0);
    int safeIdx = clamp(idx, 0, u_colors_length - 1);
    return u_colors[safeIdx].rgb;
}

float seedF(float base) {
    return base * (1.0 + 0.5 * sin(u_seed * 3.17 + base));
}

vec2 warpUV(vec2 uv) {
    float t = u_time * u_waveSpeed;

    float angleOffset = sin(u_seed * 2.73) * 30.0;
    mat2 dirRot = Rot(radians(u_waveAngle + angleOffset));
    vec2 ruv = dirRot * uv;

    float fxMod = seedF(u_waveFreqX);
    float fyMod = seedF(u_waveFreqY);

    float phaseX = fract(sin(u_seed * 7.19) * 437.58) * 6.2832;
    float phaseY = fract(cos(u_seed * 3.41) * 291.37) * 6.2832;

    // Core wave with seed-dependent harmonics
    float harmonic = sin(u_seed * 1.23) * 0.5;
    float a = fyMod * ruv.y - sin(ruv.x * fxMod + ruv.y - t + phaseX);
    a += harmonic * sin(ruv.x * fxMod * 2.0 + ruv.y * 0.5 + t * 0.7 + phaseY);

    // Smoothstep mask (unchanged)
    a = smoothstep(
        cos(a) * u_maskSoftness,
        sin(a) * u_maskSoftness + 3.,
        cos(a - fyMod * ruv.y) - sin(a - fxMod * ruv.x)
    );

    a *= u_waveAmplitude;

    uv = cos(a) * uv + sin(a) * vec2(-uv.y, uv.x);
    return uv;
}

void main() {
    vec2 fragCoord = v_uv * u_resolution;
    vec2 uv = fragCoord / u_resolution.xy;
    float ratio = u_resolution.x / u_resolution.y;
    float t = u_time * u_waveSpeed;

    vec2 tuv = uv - 0.5;

    vec2 seedShift = vec2(sin(u_seed * 4.37), cos(u_seed * 5.91)) * 100.0;
    float degree = noise(vec2(t * 0.1, tuv.x * tuv.y) + seedShift);
    tuv.y *= 1.0 / ratio;
    tuv *= Rot(radians((degree - 0.5) * 720.0 + 180.0));
    tuv.y *= ratio;

    // Seed-rotate uv2 before warping
    vec2 uv2 = (fragCoord * 2.0 - u_resolution.xy) / (u_resolution.x + u_resolution.y) * 2.0;
    float preRotAngle = fract(sin(u_seed * 5.63) * 173.29) * 6.2832;
    uv2 *= Rot(preRotAngle);
    vec2 warped = warpUV(uv2) * 0.5 + 0.5;

    vec2 blendUV = mix(tuv, warped - 0.5, u_blendAmount);

    float layerRot1 = -5.0 + sin(u_seed * 1.83) * 20.0;
    float layerRot2 = 10.0 + cos(u_seed * 2.47) * 20.0;

    vec3 c0 = getColor(0);
    vec3 c1 = getColor(1);
    vec3 c2 = getColor(2);
    vec3 c3 = getColor(3);

    vec3 layer1 = mix(c0, c2, S(-0.3, 0.3, (blendUV * Rot(radians(layerRot1))).x));
    vec3 layer2 = mix(c3, c1, S(-0.3, 0.3, (blendUV * Rot(radians(layerRot2))).x));
    vec3 col = mix(layer1, layer2, S(0.3, -0.3, blendUV.y));

    col = mix(col, col * col + 0.5 * sqrt(col), 0.3);

    fragColor = vec4(col, 1.0);
}
`,propertyControls:{colors:{type:T.Array,title:`Colors`,control:{type:T.Color},maxCount:4,defaultValue:[`#FF3624`,`#9EABFF`,`#FFAE00`,`#E29EFF`]},seed:{type:T.Number,title:`Seed`,defaultValue:32,min:0,max:100,step:1},waveSpeed:{type:T.Number,title:`Speed`,defaultValue:1.5,min:0,max:3,step:.01},waveFreqX:{type:T.Number,title:`Freq X`,defaultValue:.9,min:.1,max:6,step:.1},waveFreqY:{type:T.Number,title:`Freq Y`,defaultValue:6,min:.1,max:6,step:.1},waveAngle:{type:T.Number,title:`Angle`,defaultValue:105,min:-180,max:180,step:1},waveAmplitude:{type:T.Number,title:`Amplitude`,defaultValue:2.1,min:.5,max:3,step:.01},maskSoftness:{type:T.Number,title:`Softness`,defaultValue:.74,min:.01,max:2,step:.01},blendAmount:{type:T.Number,title:`Blend`,defaultValue:.54,min:0,max:1,step:.01}}})})),L,R,z,B,V,H,U,W,G,K,q,J,Y,X,Z=e((()=>{u(),h(),p(),r(),j(),k(),L=`framer-V8xcb`,R={wZaD4eY5M:`framer-v-35gn8d`},z=e=>{if(typeof e!=`number`)return e;if(Number.isFinite(e))return Math.max(0,e)+`px`},B={bounce:.2,delay:0,duration:.4,type:`spring`},V={opacity:.001,rotate:0,scale:1,skewX:0,skewY:0,x:50,y:0},H={bounce:.25,delay:.1,duration:.45,type:`spring`},U={effect:V,startDelay:.2,threshold:.5,tokenization:`character`,transition:H,trigger:`onInView`,type:`appear`},W={effect:V,startDelay:.5,threshold:.5,tokenization:`line`,transition:H,trigger:`onInView`,type:`appear`},G=({value:e,children:t})=>{let r=s(d),i=e??r.transition,a=n(()=>({...r,transition:i}),[JSON.stringify(i)]);return o(d.Provider,{value:a,children:t})},K=m.create(t),q=({height:e,id:t,padding:n,text:r,title:i,width:a,...o})=>({...o,mA6zbtZri:i??o.mA6zbtZri??`2000+`,qHVgPpjg2:r??o.qHVgPpjg2??`Active Members`,tjCrWr1z8:n??o.tjCrWr1z8??`64px 48px 24px 24px`}),J=(e,t)=>e.layoutDependency?t.join(`-`)+e.layoutDependency:t.join(`-`),Y=w(i(function(e,n){let r=c(null),i=n??r,s=a(),{activeLocale:u,setLocale:d}=S();C();let{style:p,className:h,layoutId:_,variant:b,mA6zbtZri:x,qHVgPpjg2:w,tjCrWr1z8:T,...E}=q(e),{baseVariant:D,classNames:O,clearLoadingGesture:k,gestureHandlers:j,gestureVariant:M,isLoading:N,setGestureState:F,setVariant:I,variants:V}=y({defaultVariant:`wZaD4eY5M`,ref:i,variant:b,variantClassNames:R}),H=J(e,V),Y=g(L,P,A);return o(f,{id:_??s,children:o(K,{animate:V,initial:!1,children:o(G,{value:B,children:l(m.div,{...E,...j,className:g(Y,`framer-35gn8d`,h,O),"data-border":!0,"data-framer-name":`Default`,layoutDependency:H,layoutId:`wZaD4eY5M`,ref:i,style:{"--1e1cuzz":z(T),"--border-bottom-width":`1px`,"--border-color":`var(--token-2ce0616d-7f6c-4d88-a64f-b73a72a6509e, rgb(255, 255, 255))`,"--border-left-width":`1px`,"--border-right-width":`1px`,"--border-style":`solid`,"--border-top-width":`1px`,borderBottomLeftRadius:20,borderBottomRightRadius:20,borderTopLeftRadius:20,borderTopRightRadius:20,...p},children:[o(v,{__fromCanvasComponent:!0,children:o(t,{children:o(m.p,{className:`framer-styles-preset-5p1f8t`,"data-styles-preset":`OfgnAVnWs`,dir:`auto`,children:`2000+`})}),className:`framer-1hff82o`,effect:U,fonts:[`Inter`],layoutDependency:H,layoutId:`xVprknOL3`,style:{"--framer-link-text-color":`rgb(0, 153, 255)`,"--framer-link-text-decoration":`underline`},text:x,verticalAlignment:`top`,withExternalLayout:!0}),o(v,{__fromCanvasComponent:!0,children:o(t,{children:o(m.p,{className:`framer-styles-preset-1071qhr`,"data-styles-preset":`Y9p4GfHpL`,dir:`auto`,style:{"--framer-text-color":`var(--extracted-r6o4lv, var(--token-7914b2f8-156d-462a-902f-54e863772704, rgb(226, 75, 74)))`},children:`Active Members`})}),className:`framer-8d9a4g`,effect:W,fonts:[`Inter`],layoutDependency:H,layoutId:`rCXCVhVw2`,style:{"--extracted-r6o4lv":`var(--token-7914b2f8-156d-462a-902f-54e863772704, rgb(226, 75, 74))`,"--framer-link-text-color":`rgb(0, 153, 255)`,"--framer-link-text-decoration":`underline`},text:w,verticalAlignment:`top`,withExternalLayout:!0})]})})})})}),[`@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }`,`.framer-V8xcb.framer-n4qjjr, .framer-V8xcb .framer-n4qjjr { display: block; }`,`.framer-V8xcb.framer-35gn8d { align-content: flex-start; align-items: flex-start; display: flex; flex-direction: column; flex-wrap: nowrap; gap: 8px; height: min-content; justify-content: flex-start; overflow: var(--overflow-clip-fallback, clip); padding: var(--1e1cuzz); position: relative; width: min-content; will-change: var(--framer-will-change-override, transform); }`,`.framer-V8xcb .framer-1hff82o, .framer-V8xcb .framer-8d9a4g { flex: none; height: auto; position: relative; white-space: pre; width: auto; }`,...M,...O,`.framer-V8xcb[data-border="true"]::after, .framer-V8xcb [data-border="true"]::after { content: ""; border-width: var(--border-top-width, 0) var(--border-right-width, 0) var(--border-bottom-width, 0) var(--border-left-width, 0); border-color: var(--border-color, none); border-style: var(--border-style, none); width: 100%; height: 100%; position: absolute; box-sizing: border-box; left: 0; top: 0; border-radius: inherit; corner-shape: inherit; pointer-events: none; }`],`framer-V8xcb`),X=Y,Y.displayName=`Stat Card`,Y.defaultProps={height:170,width:209},b(Y,{mA6zbtZri:{defaultValue:`2000+`,displayTextArea:!1,title:`Title`,type:T.String},onmA6zbtZriChange:{changes:`mA6zbtZri`,type:T.ChangeHandler},qHVgPpjg2:{defaultValue:`Active Members`,displayTextArea:!1,title:`Text`,type:T.String},onqHVgPpjg2Change:{changes:`qHVgPpjg2`,type:T.ChangeHandler},tjCrWr1z8:{defaultValue:`64px 48px 24px 24px`,title:`Padding`,type:T.Padding}}),_(Y,[{explicitInter:!0,fonts:[{cssFamilyName:`Inter`,source:`framer`,style:`normal`,uiFamilyName:`Inter`,unicodeRange:`U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F`,url:`/fonts/5vvr9Vy74if2I6bQbJvbw7SY1pQ.woff2`,weight:`400`},{cssFamilyName:`Inter`,source:`framer`,style:`normal`,uiFamilyName:`Inter`,unicodeRange:`U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116`,url:`/fonts/EOr0mi4hNtlgWNn9if640EZzXCo.woff2`,weight:`400`},{cssFamilyName:`Inter`,source:`framer`,style:`normal`,uiFamilyName:`Inter`,unicodeRange:`U+1F00-1FFF`,url:`/fonts/Y9k9QrlZAqio88Klkmbd8VoMQc.woff2`,weight:`400`},{cssFamilyName:`Inter`,source:`framer`,style:`normal`,uiFamilyName:`Inter`,unicodeRange:`U+0370-03FF`,url:`/fonts/OYrD2tBIBPvoJXiIHnLoOXnY9M.woff2`,weight:`400`},{cssFamilyName:`Inter`,source:`framer`,style:`normal`,uiFamilyName:`Inter`,unicodeRange:`U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF`,url:`/fonts/JeYwfuaPfZHQhEG8U5gtPDZ7WQ.woff2`,weight:`400`},{cssFamilyName:`Inter`,source:`framer`,style:`normal`,uiFamilyName:`Inter`,unicodeRange:`U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2070, U+2074-207E, U+2080-208E, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD`,url:`/fonts/GrgcKwrN6d3Uz8EwcLHZxwEfC4.woff2`,weight:`400`},{cssFamilyName:`Inter`,source:`framer`,style:`normal`,uiFamilyName:`Inter`,unicodeRange:`U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB`,url:`/fonts/b6Y37FthZeALduNqHicBT6FutY.woff2`,weight:`400`}]},...E(N),...E(D)],{supportsExplicitInterCodegen:!0})}));export{I as i,Z as n,F as r,X as t};
//# sourceMappingURL=GqlsktTfC.1UgPtG-x.mjs.map