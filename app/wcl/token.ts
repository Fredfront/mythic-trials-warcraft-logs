// Assuming you have a way to store and retrieve the token and its expiry
let tokenCache = { value: null, expiry: 0 }

export async function getToken() {
  const now = Date.now()

  if (tokenCache.value && tokenCache.expiry > now) {
    return tokenCache.value
  }

  const client_id = '9baa5259-2b2e-4fb8-aa0c-f2203c8fc9e9'
  const client_secret = 'VAo3hDpypinXIgGoqYwQKzMjYbgMty1N9h683POh'
  const url = 'https://www.warcraftlogs.com/oauth/token'
  const credentials = `${client_id}:${client_secret}`
  const encodedCredentials = Buffer.from(credentials).toString('base64')

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${encodedCredentials}`,
    },
    body: 'grant_type=client_credentials',
  }

  try {
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const expiry = now + data.expires_in * 1000 - 60000 // Subtract 1 minute to ensure freshness
      tokenCache = { value: data.access_token, expiry }
      return data.access_token
    } else {
      throw new Error('Failed to retrieve token')
    }
  } catch (error) {
    console.error('Error fetching token:', error)
    return null
  }
}
