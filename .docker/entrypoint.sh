#!/bin/sh
set -eu

: "${IAM_URL:?Missing required env var IAM_URL}"
: "${IAM_REALM:?Missing required env var IAM_REALM}"
: "${IAM_CLIENT_ID:?Missing required env var IAM_CLIENT_ID}"
: "${API_URL:?Missing required env var API_URL}"
: "${VIEWER_URL:?Missing required env var VIEWER_URL}"
: "${REDIRECT_URI:?Missing required env var REDIRECT_URI}"

if [ ! -w /tmp ]; then
    echo >&2 "ERROR: /tmp is not writable; mount an emptyDir/tmpfs at /tmp"
    exit 1
fi

# Minimal JS string escaping for values interpolated inside double quotes.
escape_js_string() {
  printf '%s' "$1" \
    | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g'
}

iam_url_escaped="$(escape_js_string "$IAM_URL")"
iam_realm_escaped="$(escape_js_string "$IAM_REALM")"
iam_client_id_escaped="$(escape_js_string "$IAM_CLIENT_ID")"
api_url_escaped="$(escape_js_string "$API_URL")"
viewer_url_escaped="$(escape_js_string "$VIEWER_URL")"
redirect_uri_escaped="$(escape_js_string "$REDIRECT_URI")"

cat > /tmp/env.js <<EOF
// Generated at container startup. Do not edit.
(() => {
    // @ts-ignore
    window.__DASHBOARD_EDITEUR_ENV = {
        iamUrl: "${iam_url_escaped}",
        iamRealm: "${iam_realm_escaped}",
        iamClientId: "${iam_client_id_escaped}",
        apiUrl: "${api_url_escaped}",
        viewerUrl: "${viewer_url_escaped}",
        redirectUri: "${redirect_uri_escaped}",
    };
    // @ts-ignore
    Object.freeze(window.__DASHBOARD_EDITEUR_ENV);
    Object.defineProperty(window, '__DASHBOARD_EDITEUR_ENV', { configurable: false, writable: false });
})();
EOF

exec "$@"