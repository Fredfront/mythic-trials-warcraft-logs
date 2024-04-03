export async function tableOverview(
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
           interrupts: table(dataType: Interrupts, fightIDs: ${fightInfo.id})
           damageDone: table(dataType: DamageDone, fightIDs: ${fightInfo.id})
           damageTaken: table(dataType: DamageTaken, fightIDs: ${fightInfo.id})
           deaths: table(dataType: Deaths, fightIDs: ${fightInfo.id})
           healing: table(dataType: Healing, fightIDs: ${fightInfo.id})
           sanguineHealing: table(dataType: Healing, fightIDs: ${fightInfo.id}, hostilityType:Enemies )
          }
        } 
      }`,
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json()

  return {
    interrupts: data?.data?.reportData?.report.interrupts.data.entries?.[0].entries,
    damageDone: data?.data?.reportData?.report.damageDone.data.entries,
    damageTaken: data?.data?.reportData?.report.damageTaken.data.entries,
    deaths: data?.data?.reportData?.report.deaths.data.entries,
    healing: data?.data?.reportData?.report.healing.data.entries,
    sanguineHealing: data?.data?.reportData?.report.sanguineHealing.data.entries,
  }
}
