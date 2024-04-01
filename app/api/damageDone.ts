export async function damageDoneGraph(
  reportCode: string,
  fightInfo: { startTime?: number; endTime?: number; id?: number },
  token: string,
) {
  if (!fightInfo.id) return []
  if (reportCode.length < 10) return

  const response = await fetch('https://www.warcraftlogs.com/api/v2/client', {
    method: 'POST',
    body: JSON.stringify({
      query: `
        query {
          reportData {
            report(code: "${reportCode}") {
              graph(dataType: DamageDone, fightIDs: ${fightInfo.id}, startTime: ${fightInfo.startTime}, endTime: ${fightInfo.endTime})
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

  return data?.data?.reportData?.report
}

export async function healingDoneGraph(
  reportCode: string,
  fightInfo: { startTime?: number; endTime?: number; id?: number },
  token: string,
) {
  if (!fightInfo.id) return []
  if (reportCode.length < 10) return

  const response = await fetch('https://www.warcraftlogs.com/api/v2/client', {
    method: 'POST',
    body: JSON.stringify({
      query: `
        query {
          reportData {
            report(code: "${reportCode}") {
              graph(dataType: Healing, fightIDs: ${fightInfo.id}, startTime: ${fightInfo.startTime}, endTime: ${fightInfo.endTime} )
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
  return data?.data?.reportData?.report
}
