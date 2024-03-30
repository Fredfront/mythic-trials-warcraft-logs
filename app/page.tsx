'use client'
import { useCallback, useEffect, useState } from 'react'
import { fights } from './api/fights'
import { getToken } from './wcl/token'
import { useRouter, useSearchParams } from 'next/navigation'
import { damageDoneGraph, healingDoneGraph } from './api/damageDone'
import Line, { DungeonInfo } from './components/TanstackCharts'
import { Icons } from './components/Loading'

export default function Home() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const fallbackToken = sessionStorage.getItem('WCL_token') || ''

  const fallbackReportCode = searchParams.get('reportCode') || ''
  const fallbackReportCodeTwo = searchParams.get('reportCodeTwo') || ''
  const fallbackTeamNameOne = searchParams.get('teamNameOne') || ''
  const fallbackTeamNameTwo = searchParams.get('teamNameTwo') || ''
  const generateInUrl = searchParams.get('generate') || ''
  const fallbackSelectedReportOne = searchParams.get('selectedReportOne')
  const fallbackSelectedReportTwo = searchParams.get('selectedReportTwo')
  const [loading, setLoading] = useState<boolean>(false)
  const [token, setToken] = useState<string>(fallbackToken)
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

  const [fightInfoTwo, setFightInfoTwo] = useState<{
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

  useEffect(() => {
    async function fetchToken() {
      const token = await getToken()
      setToken(token)
      sessionStorage.setItem('WCL_token', token)
    }
    fetchToken()
  }, [])

  const fetchFightDataOne = useCallback(() => {
    async function fetchData() {
      setLoadingFightDataOne(true)

      const fightData = await fights(reportCode, token)
      setFightData(fightData)
      setLoadingFightDataOne(false)
    }
    fetchData()
  }, [reportCode, token])

  const fetchFightDataTwo = useCallback(() => {
    async function fetchData() {
      setLoadingFightDataTwo(true)
      const fightDataTwo = await fights(reportCodeTwo, token)
      setFightDataTwo(fightDataTwo)
      setLoadingFightDataTwo(false)
    }
    fetchData()
  }, [reportCodeTwo, token])

  const fetchDamageDone = useCallback(
    (fightInfo: DungeonInfo) => {
      async function fetchData() {
        setLoadingDamageDone(true)
        const damageDone = await damageDoneGraph(reportCode, fightInfo, token)
        setDamageDone(damageDone)

        setLoadingDamageDone(false)
      }
      fetchData()
    },
    [reportCode, token],
  )

  const fetchDamageDoneTwo = useCallback(
    (fightInfo: DungeonInfo) => {
      async function fetchData() {
        setLoadingDamageDoneTwo(true)
        const damageDoneTwo = await damageDoneGraph(reportCodeTwo, fightInfo, token)
        setDamageDoneTwo(damageDoneTwo)
        setLoadingDamageDoneTwo(false)
      }
      fetchData()
    },
    [reportCodeTwo, token],
  )

  const fetchHealingDone = useCallback(
    (fightInfo: DungeonInfo) => {
      async function fetchData() {
        const healingDone = await healingDoneGraph(reportCode, fightInfo, token)
        setHealingDone(healingDone)
      }
      fetchData()
    },
    [reportCode, token],
  )

  const fetchHealingDoneTwo = useCallback(
    (fightInfo: DungeonInfo) => {
      async function fetchData() {
        const healingDone = await healingDoneGraph(reportCodeTwo, fightInfo, token)
        setHealingDoneTwo(healingDone)
      }
      fetchData()
    },
    [reportCodeTwo, token],
  )

  const dmgDoneArrayLength = damageDone?.graph?.data?.series?.length
  const dmgDoneArrayLengthTwo = damageDoneTwo?.graph?.data?.series?.length
  const totalDamageDone = damageDone?.graph?.data?.series?.[dmgDoneArrayLength - 1]
  const totalDamageDoneTwo = damageDoneTwo?.graph?.data?.series?.[dmgDoneArrayLengthTwo - 1]

  const healingDoneArrayLength = healingDone?.graph?.data?.series?.length
  const healingDoneArrayLengthTwo = healingDoneTwo?.graph?.data?.series?.length
  const totalHealingDone = healingDone?.graph?.data?.series?.[healingDoneArrayLength - 1]
  const totalHealingDoneTwo = healingDoneTwo?.graph?.data?.series?.[healingDoneArrayLengthTwo - 1]

  const [compareData, setCompareData] = useState<boolean>(false)

  const fallbackSelectedReportOneNumber = parseInt(fallbackSelectedReportOne || '')
  const fallbackSelectedReportTwoNumber = parseInt(fallbackSelectedReportTwo || '')

  const [selectedReportOne, setSelectedReportOne] = useState<number | undefined>(fallbackSelectedReportOneNumber)
  const [selectedReportTwo, setSelectedReportTwo] = useState<number | undefined>(fallbackSelectedReportTwoNumber)

  const [teamNameOne, setTeamNameOne] = useState<string>(fallbackTeamNameOne)
  const [teamNameTwo, setTeamNameTwo] = useState<string>(fallbackTeamNameTwo)

  const barChartDataOne = damageDone?.graph?.data?.series.filter((e: any) => e.name !== 'Total')
  const barChartDataTwo = damageDoneTwo?.graph?.data?.series.filter((e: any) => e.name !== 'Total')

  useEffect(() => {
    if (fightData && fightData.length > 0 && reportCode === '') {
      setFightData([])
      setFightDataTwo([])
      router.replace('/')
    }
  }, [fightData, reportCode, router])

  const findFightDataToFallback = fightData?.find((e) => e.id === fallbackSelectedReportOneNumber)
  const findFightDataToFallbackTwo = fightDataTwo?.find((e) => e.id === fallbackSelectedReportTwoNumber)

  useEffect(() => {
    if (
      generateInUrl === 'true' &&
      fightData &&
      fightData.length === 0 &&
      fightDataTwo &&
      fightDataTwo.length === 0 &&
      totalDamageDone === undefined &&
      totalDamageDoneTwo === undefined &&
      fallbackSelectedReportOneNumber &&
      fallbackSelectedReportTwoNumber
    ) {
      fetchFightDataOne()
      fetchFightDataTwo()
    }
  }, [
    fallbackSelectedReportOneNumber,
    fallbackSelectedReportTwoNumber,
    fetchFightDataOne,
    fetchFightDataTwo,
    fightData,
    fightData?.length,
    fightDataTwo,
    fightDataTwo?.length,
    generateInUrl,
    totalDamageDone,
    totalDamageDoneTwo,
  ])

  useEffect(() => {
    if (
      generateInUrl === 'true' &&
      compareData === false &&
      totalDamageDone &&
      totalDamageDoneTwo &&
      fightData &&
      fightDataTwo
    ) {
      setCompareData(true)
    }
  }, [compareData, fightData, fightDataTwo, generateInUrl, totalDamageDone, totalDamageDoneTwo])

  //store totalDamgeDone in localstorage
  useEffect(() => {
    if (totalDamageDone) {
      sessionStorage.setItem(
        'totalDamageDone',
        JSON.stringify({
          ...totalDamageDone,
          reportCode,
        }),
      )
    }

    if (totalDamageDoneTwo) {
      sessionStorage.setItem(
        'totalDamageDoneTwo',
        JSON.stringify({
          ...totalDamageDoneTwo,
          reportCodeTwo,
        }),
      )
    }

    if (fightInfo.id) {
      sessionStorage.setItem('fightInfo', JSON.stringify(fightInfo))
    }

    if (fightInfoTwo.id) {
      sessionStorage.setItem('fightInfoTwo', JSON.stringify(fightInfoTwo))
    }
  }, [fightInfo, fightInfoTwo, reportCode, reportCodeTwo, totalDamageDone, totalDamageDoneTwo])

  useEffect(() => {
    if (findFightDataToFallback && generateInUrl === 'true' && fightInfo.id === undefined) {
      setFightInfo(findFightDataToFallback)
      fetchDamageDone(findFightDataToFallback)
      fetchHealingDone(findFightDataToFallback)
      setTeamNameOne(fallbackTeamNameOne)
    }
  }, [fallbackTeamNameOne, fetchDamageDone, fetchHealingDone, fightInfo.id, findFightDataToFallback, generateInUrl])

  useEffect(() => {
    if (findFightDataToFallbackTwo && generateInUrl === 'true' && fightInfoTwo.id === undefined) {
      setFightInfoTwo(findFightDataToFallbackTwo)
      fetchDamageDoneTwo(findFightDataToFallbackTwo)
      fetchHealingDoneTwo(findFightDataToFallbackTwo)
      setTeamNameTwo(fallbackTeamNameTwo)
    }
  }, [
    fallbackTeamNameTwo,
    fetchDamageDoneTwo,
    fetchHealingDoneTwo,
    fightInfoTwo.id,
    findFightDataToFallbackTwo,
    generateInUrl,
  ])

  function addQueryParams() {
    const params = new URLSearchParams()
    params.append('reportCode', reportCode)
    params.append('reportCodeTwo', reportCodeTwo)
    selectedReportOne && params.append('selectedReportOne', selectedReportOne.toString())
    selectedReportTwo && params.append('selectedReportTwo', selectedReportTwo.toString())
    params.append('teamNameOne', teamNameOne)
    params.append('teamNameTwo', teamNameTwo)
    params.append('generate', 'true')

    router.replace(`/?${params.toString()}`)
  }

  if (
    generateInUrl === 'true' &&
    (totalDamageDone === undefined ||
      totalDamageDoneTwo === undefined ||
      fightData === undefined ||
      fightDataTwo === undefined)
  ) {
    return (
      <div className="flex w-full h-screen justify-center items-center">
        <Icons.spinner className="h-20 w-20 animate-spin" />
      </div>
    )
  }

  if (
    compareData === true &&
    totalDamageDone &&
    totalDamageDoneTwo &&
    totalHealingDone &&
    totalHealingDoneTwo &&
    fightData &&
    fightDataTwo
  ) {
    return (
      <>
        <button
          className="absolute right-0 p-1"
          onClick={() => {
            router.replace(`?reportCode=${reportCode}&reportCodeTwo=${reportCodeTwo}`)
            setFightData([])
            setFightDataTwo([])
            setDamageDone([])
            setDamageDoneTwo([])
            setHealingDone([])
            setHealingDoneTwo([])
            setTeamNameOne('')
            setTeamNameTwo('')
            setFightInfo({
              id: undefined,
              startTime: undefined,
              endTime: undefined,
              name: undefined,
              keystoneAffixes: undefined,
            })
            setFightInfoTwo({
              id: undefined,
              startTime: undefined,
              endTime: undefined,
              name: undefined,
              keystoneAffixes: undefined,
            })
            setCompareData(false)
            setSelectedReportOne(undefined)
            setSelectedReportTwo(undefined)
          }}
        >
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
        {/* <div className=" min-h-80 max-w-7xl m-auto">
          <MyBarChart data={barChartDataOne} />
        </div> */}
      </>
    )
  }

  return (
    <main className="flex w-full mb-20 mt-20 flex-col p-4">
      <h1 className="text-center m-auto text-4xl font-bold">Generate fancy MDI graphs</h1>
      <h2 className="text-center m-auto text-lg mt-4">Compare two reports</h2>
      <div className=" w-full  max-w-4xl m-auto mt-20 grid grid-cols-1 lg:grid-cols-2">
        <div>
          <div className="flex w-full ">
            <input
              placeholder="Report code"
              className=" lg:min-w-72 p-1  text-black flex-1 lg:max-w-72 rounded-l-lg "
              name="reportCodeOne"
              onChange={(event) => {
                setReportCode(event.target.value)
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

            <button
              disabled={reportCode.length < 15 || loadingDamageDone || loadingFightDataOne}
              onClick={fetchFightDataOne}
              className="bg-[#FDB202] min-w-20 p-1 rounded-r-lg "
            >
              {' '}
              <div className=" ml-4 flex mr-4">
                {loadingFightDataOne ? 'Loading...' : 'Søk'}{' '}
                {loadingFightDataOne && <Icons.spinner className="h-4 w-4 animate-spin mt-1 ml-2" />}
              </div>
            </button>
          </div>
        </div>
        <div>
          <div className="flex w-full mt-2 lg:mt-0">
            <input
              placeholder="Report code"
              className=" lg:min-w-72 p-1  text-black flex-1 rounded-l-lg  "
              name="reportCodeTwo"
              onChange={(event) => {
                setReportCodeTwo(event.target.value)

                setFightInfoTwo({
                  id: undefined,
                  startTime: undefined,
                  endTime: undefined,
                  name: undefined,
                  keystoneAffixes: undefined,
                })
              }}
              value={reportCodeTwo}
            />

            <button
              disabled={reportCodeTwo.length < 15 || loadingDamageDoneTwo || loadingFightDataTwo}
              onClick={fetchFightDataTwo}
              className="bg-[#FDB202] min-w-20 p-1 rounded-r-lg"
            >
              {' '}
              <div className=" ml-4 flex mr-4">
                {loadingFightDataTwo ? 'Loading...' : 'Søk'}{' '}
                {loadingFightDataTwo && <Icons.spinner className="h-4 w-4 animate-spin mt-1 ml-2" />}
              </div>
            </button>
          </div>
        </div>
      </div>
      <div className="w-full max-w-4xl m-auto grid lg:grid-cols-2 ">
        <div>
          <ul>
            {fightData && fightData.length ? <h3 className="mt-4">Select a report to compare</h3> : null}
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
        <div>
          <ul>
            {fightData && fightData.length ? <h3 className="mt-4">Select second report to compare</h3> : null}

            {fightData &&
              fightData.length > 0 &&
              fightDataTwo?.map((e, index) => {
                const classNameForList = selectedReportTwo === e.id ? 'bg-[#FDB202] hover:bg-[#FDB202]' : 'bg-slate-500'
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
                      setFightInfoTwo(fightInfo)
                      fetchDamageDoneTwo(fightInfo)
                      fetchHealingDoneTwo(fightInfo)
                      setSelectedReportTwo(e.id)
                    }}
                    className={`p-2 ${classNameForList} lg:w-3/4 rounded-md cursor-pointer hover:bg-slate-600`}
                    key={index}
                  >
                    {e.id}. {e.name}
                  </li>
                )
              })}
          </ul>
        </div>
      </div>

      {totalDamageDone && totalDamageDoneTwo ? (
        <div className=" w-full flex flex-col">
          <button
            onClick={() => {
              setCompareData(true)
              addQueryParams()
            }}
            className=" bg-[#FDB202] min-w-72 m-auto mt-10 p-[10px] text-black font-bold rounded-lg  "
          >
            Create graphs
          </button>
          <div className="m-auto flex gap-10 mt-10 ">
            <input
              placeholder="Team name one"
              className=" lg:min-w-72 max-w-72 m-auto p-1  text-black rounded-lg"
              onChange={(event) => {
                setTeamNameOne(event.target.value)
              }}
            />
            <input
              placeholder="Team name two"
              className=" lg:min-w-72 max-w-72 m-auto p-1  text-black rounded-lg"
              onChange={(event) => {
                setTeamNameTwo(event.target.value)
              }}
            />
          </div>
        </div>
      ) : null}
    </main>
  )
}
