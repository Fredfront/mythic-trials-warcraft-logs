export async function fights(reportCode: string, token: string) {
  if (reportCode.length < 10) return

  const response = await fetch('https://www.warcraftlogs.com/api/v2/client', {
    method: 'POST',
    body: JSON.stringify({
      query: `
        query {
          reportData {
            report(code: "${reportCode}") {
              code
              fights {
                id
                encounterID
                name
                startTime
                endTime
                keystoneAffixes
                keystoneLevel
              }
            }
          }
        }
        `,
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json()
  return {
    data: data?.data?.reportData?.report?.fights,
    errorMessage: data.errors?.[0].message,
  }
}
