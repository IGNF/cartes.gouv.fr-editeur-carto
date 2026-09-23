import{i as p,O as l,W as f}from"./createOidc-DVcFRuvu.js";import{a as w,e as C}from"./index-oHoKjkkB.js";function I(a){const{issuerUri:e}=a;if(!p({issuerUri:e}))throw new Error([`oidc-spa: The issuer uri provided ${e}`,"if you are in an environnement that should support multiple","auth provider, you should first test `isKeycloakUrl({ issuerUri })`","before calling parseKeycloakIssuerUri({ issuerUri })"].join(" "));const t=new URL(e.replace(/\/$/,"")),r=t.pathname.split("/realms/");w(r.length===2);const[c,i]=r;return{origin:t.origin,realm:i,kcHttpRelativePath:c===""?void 0:c}}function v(a){const{issuerUri:e}=a,t=I({issuerUri:e}),r=`${t.origin}${t.kcHttpRelativePath??""}`,c=s=>`${r}/admin/${encodeURIComponent(s)}/console`,i=`${r}/realms/${encodeURIComponent(t.realm)}`;return{issuerUriParsed:t,adminConsoleUrl:c(t.realm),adminConsoleUrl_master:c("master"),getAccountUrl:({clientId:s,locale:n,validRedirectUri:u})=>{const o=new URL(`${r}/realms/${t.realm}/account`);return o.searchParams.set("referrer",s),o.searchParams.set("referrer_uri",(()=>{try{return C({urlish:u,doAssertNoQueryParams:!0,doOutputWithTrailingSlash:!0})}catch{return C({urlish:u,doAssertNoQueryParams:!1})}})()),n!==void 0&&o.searchParams.set("kc_locale",n),o.href},fetchUserProfile:({accessToken:s})=>fetch(`${i}/account`,{headers:{Accept:"application/json",Authorization:`Bearer ${s}`}}).then(n=>n.json()),fetchUserInfo:({accessToken:s})=>fetch(`${i}/protocol/openid-connect/userinfo`,{headers:{Accept:"application/json",Authorization:`Bearer ${s}`}}).then(n=>n.json()),transformUrlBeforeRedirectForRegister:s=>{const n=new URL(s);return n.pathname=n.pathname.replace(/\/auth$/,"/registrations"),n.href}}}function g(a){return fetch(a).then(async e=>{if(!e.ok)return!1;try{await e.json()}catch{return!1}return!0},()=>!1)}function T(a){const{stringWithWildcards:e,candidate:t}=a;if(!e.includes("*"))return e===t;const r=e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&").replace(/\\\*/g,".*");return new RegExp(`^${r}$`).test(t)}async function P(a){const{issuerUri:e}=a,t=["The OIDC server is either down or the issuerUri you provided is incorrect.",`You provided the issuerUri: ${e}`,`Endpoint that couldn't be reached: ${e}${f}`].join(`
`);if(!p({issuerUri:e}))return new l({messageOrCause:[t,"","If you happen to be using Keycloak, be aware that the issuerUri you provided doesn't match the expected shape.","It should look like: https://<YOUR_KEYCLOAK_DOMAIN><KC_HTTP_RELATIVE_PATH>/realms/<YOUR_REALM>","Unless configured otherwise the KC_HTTP_RELATIVE_PATH is '/' by default on recent version of Keycloak."].join(`
`),isAuthServerLikelyDown:!0});const r=v({issuerUri:e}),c=i=>{const{kcHttpRelativePath:s}=i;return`${r.issuerUriParsed.origin}${s??""}/realms/${encodeURIComponent(r.issuerUriParsed.realm)}`};if(r.issuerUriParsed.kcHttpRelativePath===void 0){const i=c({kcHttpRelativePath:"/auth"});if(await g(`${i}${f}`))return new l({messageOrCause:["Your Keycloak server is configured with KC_HTTP_RELATIVE_PATH=/auth",`The issuerUri you provided: ${e}`,`The correct issuerUri is: ${i}`,"(You are missing the /auth portion)"].join(`
`),isAuthServerLikelyDown:!1})}else{const i=c({kcHttpRelativePath:void 0});if(await g(`${i}${f}`))return new l({messageOrCause:["Your Keycloak server is configured with KC_HTTP_RELATIVE_PATH=/",`The issuerUri you provided: ${e}`,`The correct issuerUri is: ${i}`,`(You should remove the ${r.issuerUriParsed.kcHttpRelativePath} portion.)`].join(`
`),isAuthServerLikelyDown:!1})}return new l({messageOrCause:[t,"","Given the shape of the issuerUri you provided, it seems that you are using Keycloak.",`- Make sure the realm '${r.issuerUriParsed.realm}' exists.`,"- Check the KC_HTTP_RELATIVE_PATH that you might have configured your keycloak server with.",`  For example if you have KC_HTTP_RELATIVE_PATH=/xxx the issuerUri should be ${c({kcHttpRelativePath:"/xxx"})}`].join(`
`),isAuthServerLikelyDown:!0})}async function b(a){const{redirectUri:e,issuerUri:t,clientId:r,authorizationEndpointUrl:c}=a;e:{if(await g(`${t}${f}`))break e;return P({issuerUri:t})}{const i=await fetch(e).then(n=>n.ok?{"Content-Security-Policy":n.headers.get("Content-Security-Policy"),"X-Frame-Options":n.headers.get("X-Frame-Options")}:new Error(`${e} responded with a ${n.status} status code.`),n=>n);if(i instanceof Error)return new l({isAuthServerLikelyDown:!1,messageOrCause:new Error("Unexpected error while trying to diagnose why the silent sign-in process timed out.",{cause:i})});const s=i;e:{const n=s["Content-Security-Policy"];if(n===null)break e;const u=Object.fromEntries(n.split(";").filter(o=>o!=="").map(o=>{const[m,...y]=o.split(" ");return w(m!==void 0),w(y.length!==0),[m,y]}));t:{const o=u["frame-src"];if(o===void 0||!(()=>{for(const d of o){if(d==="'none'")return!0;const h=new URL(c).origin;if(d==="'self'"&&new URL(location.href).origin===h||T({candidate:h,stringWithWildcards:d}))return!1}return!0})())break t;const y=(()=>{const d=new URL(location.href).hostname,{hostname:h,origin:k}=new URL(c);if(d===h)return"'self'";const[U,$]=d.split(".").reverse();return $&&h.endsWith(`.${$}.${U}`)?`https://*.${$}.${U}`:k})();return new l({isAuthServerLikelyDown:!1,messageOrCause:[`Session restoration via iframe failed due to the following HTTP header on GET ${e}:`,`
Content-Security-Policy “frame-src”: ${o.join("; ")}`,`
This header prevents opening an iframe to ${c}.`,`
To fix this:`,`
  - Update your CSP to: frame-src ${[...o.filter(d=>d!=="'none'"),y]}`,`
  - OR remove the frame-src directive from your CSP`,`
  - OR, if you cannot change your CSP, call bootstrapOidc/createOidc with sessionRestorationMethod: "full page redirect"`,`

More info: https://docs.oidc-spa.dev/v/v10/resources/csp-configuration`].join(" ")})}t:{const o=u["frame-ancestors"];if(o===void 0||!(o.includes("'none'")||!o.includes("'self'")))break t;return new l({isAuthServerLikelyDown:!1,messageOrCause:[`Session restoration via iframe failed due to the following HTTP header on GET ${e}:`,`
Content-Security-Policy “frame-ancestors”: ${o.join("; ")}`,`
This header prevents your app from being iframed by itself.`,`
To fix this:`,`
  - Update your CSP to: frame-ancestors 'self'`,`
  - OR remove the frame-ancestors directive from your CSP`,`
  - OR, if you cannot modify your CSP, call bootstrapOidc/createOidc with sessionRestorationMethod: "full page redirect"`,`

More info: https://docs.oidc-spa.dev/v/v10/resources/csp-configuration`].join(" ")})}}e:{const n="X-Frame-Options",u=s[n];if(u===null||!u.toLowerCase().includes("deny"))break e;return new l({isAuthServerLikelyDown:!1,messageOrCause:[`Session restoration via iframe failed due to the following HTTP header on GET ${e}:`,`
${n}: ${u}`,`
This header prevents your app from being framed by itself.`,`
To fix this, remove the ${n} header and rely on Content-Security-Policy if you need to restrict framing.`,`

More info: https://docs.oidc-spa.dev/v/v10/resources/csp-configuration`].join(" ")})}}return new l({isAuthServerLikelyDown:!1,messageOrCause:[`The silent sign-in process timed out.
`,`Based on the diagnostic performed by oidc-spa the more likely causes are:
`,`- Either the client ID "${r}" does not exist, or
`,`- You forgot to add the OIDC callback URL to the list of Valid Redirect URIs.
`,`Client ID: "${r}"
`,`Callback URL to add to the list of Valid Redirect URIs: "${e}"

`,...(()=>{if(!p({issuerUri:t}))return["Check the documentation of your OIDC server to learn how to configure the public client (Authorization Code Flow + PKCE) properly."];const i=v({issuerUri:t});return[`It seems you are using Keycloak. Follow these steps to resolve the issue:

`,`1. Go to the Keycloak admin console: ${i.adminConsoleUrl_master}
`,`2. Log in as an admin user.
`,`3. In the top left corner select the realm "${i.issuerUriParsed.realm}".
`,`4. In the left menu, click on "Clients".
`,`5. Locate the client "${r}" in the list and click on it.
`,`6. Find "Valid Redirect URIs" and add "${e}" to the list.
`,`7. Save the changes.

`,"For more information, refer to the documentation: https://docs.oidc-spa.dev/v/v10/providers-configuration/keycloak"]})(),`

`,"If nothing works, or if you see in the console a message mentioning 'refused to frame' there might be a problem with your CSP.","Read more: https://docs.oidc-spa.dev/v/v10/resources/csp-configuration"].join(" ")})}function A(a){const{issuerUri:e,clientId:t}=a;return new l({isAuthServerLikelyDown:!1,messageOrCause:[`The token endpoint rejected the OIDC client "${t}" with "Invalid client or Invalid client credentials".
`,`This usually means the client is configured as a confidential/private client and requires a client secret.
`,`oidc-spa performs the token exchange in the browser, so the OIDC client must be a public client that does not require a client secret.
`,`Issuer URI: "${e}"
`,...(()=>{if(!p({issuerUri:e}))return["Check the documentation of your OIDC server and configure this client as a public client using Authorization Code Flow + PKCE."];const r=v({issuerUri:e});return[`Since it seems that you are using Keycloak, here are the steps to follow:
`,`1. Go to the Keycloak admin console: ${r.adminConsoleUrl_master}
`,`2. Log in as an admin user.
`,`3. In the top left corner select the realm "${r.issuerUriParsed.realm}".
`,`4. In the left menu, click on "Clients".
`,`5. Find "${t}" in the list of clients and click on it.
`,`6. In "Capability config", turn "Client authentication" off. On older Keycloak versions, set the client access type to "public".
`,`7. Save the changes.

`,"More info: https://docs.oidc-spa.dev/v/v10/providers-configuration/keycloak"]})()].join(" ")})}async function E(a){const{issuerUri:e,clientId:t}=a;e:{if(await g(`${e}${f}`))break e;return P({issuerUri:e})}return new l({isAuthServerLikelyDown:!1,messageOrCause:[`Failed to fetch the token endpoint.
`,`This is usually due to a CORS issue.
`,`Make sure you have added '${window.location.origin}' to the list of Web Origins`,`in the '${t}' client configuration of your OIDC server.
`,`
`,...(()=>{if(!p({issuerUri:e}))return["Check the documentation of your OIDC server to learn how to configure the public client (Authorization Code Flow + PKCE) properly."];const r=v({issuerUri:e});return[`Since it seems that you are using Keycloak, here are the steps to follow:
`,`1. Go to the Keycloak admin console: ${r.adminConsoleUrl_master}
`,`2. Log in as an admin user.
`,`3. In the top left corner select the realm "${r.issuerUriParsed.realm}".
`,`4. In the left menu, click on "Clients".
`,`5. Find '${t}' in the list of clients and click on it.
`,`6. Find 'Web Origins' and add '${window.location.origin}' to the list.
`,`7. Save the changes.

`,"More info: https://docs.oidc-spa.dev/v/v10/providers-configuration/keycloak"]})()].join(" ")})}export{E as createFailedToFetchTokenEndpointInitializationError,b as createIframeTimeoutInitializationError,A as createInvalidClientCredentialsInitializationError,P as createWellKnownOidcConfigurationEndpointUnreachableInitializationError};
