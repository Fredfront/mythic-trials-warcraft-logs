'use client'
import { useEffect, useState } from 'react'
import { fights } from './api/fights'
import { getToken } from './wcl/token'
import { useRouter, useSearchParams } from 'next/navigation'
import { damageDoneGraph, healingDoneGraph } from './api/damageDone'
import Line, { DungeonInfo } from './components/TanstackCharts'
import { Icons } from './components/Loading'

export default function Home() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const fallbackReportCode = searchParams.get('reportCode') || ''
  const fallbackReportCodeTwo = searchParams.get('reportCodeTwo') || ''

  const [fightData, setFightData] = useState<any[]>([])
  const [fightDataTwo, setFightDataTwo] = useState<any[]>([])
  const [reportCode, setReportCode] = useState(fallbackReportCode)
  const [reportCodeTwo, setReportCodeTwo] = useState<string>(fallbackReportCodeTwo)
  const [damageDone, setDamageDone] = useState<any>([])
  const [damageDoneTwo, setDamageDoneTwo] = useState<any>([])
  const [healingDone, setHealingDone] = useState<any>([])
  const [healingDoneTwo, setHealingDoneTwo] = useState<any>([])
  const [fightInfo, setFightInfo] = useState<{
    startTime?: number
    endTime?: number
    id?: number
    name?: string
    keystoneAffixes?: number[]
  }>({
    id: undefined,
    startTime: undefined,
    endTime: undefined,
    name: undefined,
    keystoneAffixes: undefined,
  })

  const [loadingFightDataOne, setLoadingFightDataOne] = useState<boolean>(false)
  const [loadingFightDataTwo, setLoadingFightDataTwo] = useState<boolean>(false)
  const [loadingDamageDone, setLoadingDamageDone] = useState<boolean>(false)
  const [loadingDamageDoneTwo, setLoadingDamageDoneTwo] = useState<boolean>(false)

  const [fightInfoTwo, setFightInfoTwo] = useState<{ startTime?: number; endTime?: number; id?: number }>({
    id: undefined,
    startTime: undefined,
    endTime: undefined,
  })

  function fetchFightDataOne() {
    async function fetchData() {
      setLoadingFightDataOne(true)

      const token = await getToken()
      const fightData = await fights(reportCode, token)
      setFightData(fightData)
      setLoadingFightDataOne(false)
    }
    fetchData()
  }

  function fetchFightDataTwo() {
    async function fetchData() {
      setLoadingFightDataTwo(true)
      const token = await getToken()
      const fightDataTwo = await fights(reportCodeTwo, token)
      setFightDataTwo(fightDataTwo)
      setLoadingFightDataTwo(false)
    }
    fetchData()
  }

  function fetchDamageDone(fightInfo: DungeonInfo) {
    async function fetchData() {
      setLoadingDamageDone(true)
      const token = await getToken()
      const damageDone = await damageDoneGraph(reportCode, fightInfo, token)
      setDamageDone(damageDone)

      setLoadingDamageDone(false)
    }
    fetchData()
  }

  function fetchDamageDoneTwo(fightInfo: DungeonInfo) {
    async function fetchData() {
      setLoadingDamageDoneTwo(true)
      const token = await getToken()
      const damageDoneTwo = await damageDoneGraph(reportCodeTwo, fightInfo, token)
      setDamageDoneTwo(damageDoneTwo)
      setLoadingDamageDoneTwo(false)
    }
    fetchData()
  }

  function fetchHealingDone(fightInfo: DungeonInfo) {
    async function fetchData() {
      const token = await getToken()
      const healingDone = await healingDoneGraph(reportCode, fightInfo, token)
      setHealingDone(healingDone)
    }
    fetchData()
  }

  function fetchHealingDoneTwo(fightInfo: DungeonInfo) {
    async function fetchData() {
      const token = await getToken()
      const healingDone = await healingDoneGraph(reportCodeTwo, fightInfo, token)
      setHealingDoneTwo(healingDone)
    }
    fetchData()
  }

  const dmgDoneArrayLength = damageDone?.graph?.data?.series?.length
  const dmgDoneArrayLengthTwo = damageDoneTwo?.graph?.data?.series?.length
  const totalDamageDone = damageDone?.graph?.data?.series?.[dmgDoneArrayLength - 1]
  const totalDamageDoneTwo = damageDoneTwo?.graph?.data?.series?.[dmgDoneArrayLengthTwo - 1]

  const healingDoneArrayLength = healingDone?.graph?.data?.series?.length
  const healingDoneArrayLengthTwo = healingDoneTwo?.graph?.data?.series?.length
  const totalHealingDone = healingDone?.graph?.data?.series?.[healingDoneArrayLength - 1]
  const totalHealingDoneTwo = healingDoneTwo?.graph?.data?.series?.[healingDoneArrayLengthTwo - 1]

  const [compareData, setCompareData] = useState<boolean>(false)

  const [selectedReportOne, setSelectedReportOne] = useState<number | undefined>(undefined)
  const [selectedReportTwo, setSelectedReportTwo] = useState<number | undefined>(undefined)

  const [teamNameOne, setTeamNameOne] = useState<string>('Lag 1')
  const [teamNameTwo, setTeamNameTwo] = useState<string>('Lag 2')

  if (compareData) {
    return (
      <>
        <button className="absolute right-0 p-1" onClick={() => setCompareData(false)}>
          Close graph
        </button>

        <div className=" min-h-80 max-w-7xl m-auto">
          <Line
            isDamageDone={true}
            totalDamageDone={{
              ...totalDamageDone,
              name: teamNameOne,
            }}
            totalDamageDoneTwo={{
              ...totalDamageDoneTwo,
              name: teamNameTwo,
            }}
            fightInfo={fightInfo as DungeonInfo}
            fightInfoTwo={fightInfoTwo as DungeonInfo}
          />
        </div>
        <div className=" min-h-80 max-w-7xl m-auto">
          <Line
            isDamageDone={false}
            totalDamageDone={{
              ...totalHealingDone,
              name: teamNameOne,
            }}
            totalDamageDoneTwo={{
              ...totalHealingDoneTwo,
              name: teamNameTwo,
            }}
            fightInfo={fightInfo as DungeonInfo}
            fightInfoTwo={fightInfoTwo as DungeonInfo}
          />
        </div>
      </>
    )
  }

  return (
    <main className=" max-w-7xl flex justify-center m-auto lg:flex-col flex-row flex-wrap ">
      <h1 className="text-center text-4xl mb-20 mt-20 font-bold">Generate fancy MDI graphs</h1>
      <div className="flex m-auto gap-40">
        <div className="flex flex-col">
          <h3>Search for report to compare (Team name is optional)</h3>

          <div className="flex">
            <input
              placeholder="Report code"
              className=" lg:min-w-72 p-1  text-black"
              name="reportCodeOne"
              onChange={(event) => {
                setReportCode(event.target.value)
                router.replace(`/?reportCode=${event.target.value}`)
                setFightInfo({
                  id: undefined,
                  startTime: undefined,
                  endTime: undefined,
                  name: undefined,
                  keystoneAffixes: undefined,
                })
              }}
              value={reportCode}
            />
            <input
              placeholder="Team name"
              className=" lg:min-w-72 p-1  text-black"
              onChange={(event) => setTeamNameOne(event.target.value)}
            />
            <button
              disabled={reportCode.length < 15 || loadingDamageDone || loadingFightDataOne}
              onClick={fetchFightDataOne}
              className="bg-[#FDB202] min-w-20 "
            >
              {' '}
              <div className=" ml-4 flex mr-4">
                {loadingFightDataOne ? 'Loading...' : 'Søk'}{' '}
                {loadingFightDataOne && <Icons.spinner className="h-4 w-4 animate-spin mt-1 ml-2" />}
              </div>
            </button>
          </div>
          <div>
            <ul>
              <h3 className="mt-4">Select a report to compare</h3>
              {fightData?.map((e, index) => {
                const classNameForList = selectedReportOne === e.id ? 'bg-[#FDB202] hover:bg-[#FDB202]' : 'bg-slate-500'
                return (
                  <li
                    onClick={() => {
                      const fightInfo = {
                        id: e.id,
                        startTime: e.startTime,
                        endTime: e.endTime,
                        name: e.name,
                        keystoneAffixes: e.keystoneAffixes,
                        keystoneLevel: e.keystoneLevel,
                      }
                      setFightInfo(fightInfo)
                      fetchDamageDone(fightInfo)
                      fetchHealingDone(fightInfo)
                      setSelectedReportOne(e.id)
                    }}
                    className={`p-2 ${classNameForList} mb-1 mt-1 lg:w-3/4 rounded-md cursor-pointer hover:bg-slate-600`}
                    key={index}
                  >
                    {e.id}. {e.name}
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        {fightData && fightData.length > 0 && fightInfo.name ? (
          <div className="flex flex-col">
            <h3>Search for second log to compare</h3>

            <div className="flex">
              <input
                placeholder="Report code"
                className=" lg:min-w-72 p-1  text-black "
                name="reportCodeTwo"
                value={reportCodeTwo}
                onChange={(event) => {
                  setReportCodeTwo(event.target.value)
                  setFightDataTwo([])
                  if (reportCode) {
                    router.replace(`/?reportCode=${reportCode}&reportCodeTwo=${event.target.value}`)
                  }
                }}
              />
              <input
                placeholder="Team name"
                className=" lg:min-w-72 p-1  text-black"
                onChange={(event) => setTeamNameTwo(event.target.value)}
              />
              <button
                disabled={reportCodeTwo.length < 15 || loadingDamageDoneTwo}
                onClick={fetchFightDataTwo}
                className="bg-[#FDB202] min-w-20 "
              >
                <div className=" ml-4 flex mr-4">
                  {loadingFightDataTwo ? 'Søker...' : 'Søk'}{' '}
                  {loadingFightDataTwo && <Icons.spinner className="h-4 w-4 animate-spin mt-1 ml-2" />}
                </div>
              </button>
            </div>
            <div>
              <ul>
                <h3 className="mt-4">Select a report to compare</h3>

                {fightDataTwo?.map((e, index) => {
                  const classNameForList =
                    selectedReportTwo === e.id ? 'bg-[#FDB202] hover:bg-[#FDB202]' : 'bg-slate-500'

                  if (e.name !== fightInfo.name) return null

                  return (
                    <li
                      onClick={() => {
                        const fightInfoTwo = {
                          id: e.id,
                          startTime: e.startTime,
                          endTime: e.endTime,
                          name: e.name,
                          keystoneAffixes: e.keystoneAffixes,
                          keystoneLevel: e.keystoneLevel,
                        }
                        if (fightInfoTwo.name === fightInfoTwo.name) {
                          setFightInfoTwo(fightInfoTwo)
                          fetchDamageDoneTwo(fightInfoTwo)
                          fetchHealingDoneTwo(fightInfoTwo)
                          setSelectedReportTwo(e.id)
                        }
                      }}
                      className={`p-2 ${classNameForList} mb-1 mt-1 lg:w-3/4 rounded-md cursor-pointer hover:bg-slate-600`}
                      key={index}
                    >
                      {e.id}. {e.name}
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        ) : null}
      </div>
      {totalDamageDone && totalDamageDoneTwo ? (
        <button
          onClick={() => setCompareData(true)}
          className=" bg-[#FDB202] rounded-md min-w-72 m-auto mt-10 p-[10px] text-black font-bold  "
        >
          Generate fancy graph
        </button>
      ) : null}
    </main>
  )
}
