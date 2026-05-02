// OAuth proxy — bước 1: redirect user tới GitHub authorize
exports.handler = async (event) => {
  const params = event.queryStringParameters || {};
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;

  if (!clientId) {
    return { statusCode: 500, body: "OAUTH_GITHUB_CLIENT_ID env var chưa được cấu hình trên Netlify" };
  }

  const host = event.headers["x-forwarded-host"] || event.headers.host;
  const callbackUrl = `https://${host}/.netlify/functions/callback`;

  const authUrl = new URL("https://github.com/login/oauth/authorize");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", callbackUrl);
  authUrl.searchParams.set("scope", params.scope || "repo,user");
  authUrl.searchParams.set("state", Math.random().toString(36).slice(2));

  return {
    statusCode: 302,
    headers: { Location: authUrl.toString() },
  };
};
