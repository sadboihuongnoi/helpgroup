// OAuth proxy — bước 2: GitHub redirect về đây với ?code=...
// Đổi code lấy access_token rồi gửi về CMS qua window.postMessage
exports.handler = async (event) => {
  const { code } = event.queryStringParameters || {};
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  const clientSecret = process.env.OAUTH_GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return { statusCode: 500, body: "OAuth credentials chưa cấu hình" };
  }
  if (!code) {
    return { statusCode: 400, body: "Missing code parameter" };
  }

  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
    }),
  });
  const data = await tokenRes.json();

  if (data.error || !data.access_token) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  }

  const payload = JSON.stringify({
    token: data.access_token,
    provider: "github",
  });

  // CMS popup nhận token qua postMessage (theo chuẩn của Decap/Sveltia)
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Authorizing…</title>
</head>
<body>
  <p>Authorization complete. You can close this window.</p>
  <script>
    (function () {
      function send(origin) {
        window.opener.postMessage(
          'authorization:github:success:${payload}',
          origin
        );
      }
      window.addEventListener('message', function (e) {
        if (e.data === 'authorizing:github') {
          send(e.origin);
        }
      }, false);
      window.opener.postMessage('authorizing:github', '*');
    })();
  </script>
</body>
</html>`;

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
    body: html,
  };
};
