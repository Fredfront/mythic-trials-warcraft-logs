'use client'
import { JSX, SVGProps, useCallback, useEffect, useState } from 'react'
import { fights } from './api/fights'
import { getToken } from './wcl/token'
import { useRouter, useSearchParams } from 'next/navigation'
import { damageDoneGraph, healingDoneGraph } from './api/damageDone'
import Line, { DungeonInfo } from './components/TanstackCharts'
import { Icons } from './components/Loading'
import { convertAffixIdsToNames } from './utils/affixes'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { tableOverview } from './api/tableOverall'
import TableOverview from './components/Table'

type fightData = {
  encounterId: number
  endTime: number
  id: number
  keystoneAffixes: number[]
  keystoneLevel: number
  name: string
  startTime: number
}

export default function Home() {
  const searchParams = useSearchParams()
  const fallbackReportCode = searchParams.get('reportCode') || ''

  const router = useRouter()
  const fallbackToken = sessionStorage.getItem('WCL_token') || ''

  const fallbackReportCodeTwo = searchParams.get('reportCodeTwo') || ''
  const fallbackTeamNameOne = searchParams.get('teamNameOne') || ''
  const fallbackTeamNameTwo = searchParams.get('teamNameTwo') || ''
  const generateInUrl = searchParams.get('generate') || ''
  const fallbackSelectedReportOne = searchParams.get('selectedReportOne')
  const fallbackSelectedReportTwo = searchParams.get('selectedReportTwo')
  const fallbackShowTable = searchParams.get('showTable')
  const [token, setToken] = useState<string>(fallbackToken)
  const [fightData, setFightData] = useState<fightData[]>([])
  const [fightDataTwo, setFightDataTwo] = useState<fightData[]>([])
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

  const [overallTeamOne, setOverallTeamOne] = useState<any>(undefined)
  const [overallTeamTwo, setOverallTeamTwo] = useState<any>(undefined)

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

  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
  const [errorMessageTwo, setErrorMessageTwo] = useState<string | undefined>(undefined)

  const fetchFightDataOne = useCallback(() => {
    async function fetchData() {
      setLoadingFightDataOne(true)

      const fightData = await fights(reportCode, token)
      setFightData(fightData?.data)
      if (fightData?.errorMessage) {
        setErrorMessage(fightData.errorMessage)
      }

      setLoadingFightDataOne(false)
    }
    fetchData()
  }, [reportCode, token])

  const fetchFightDataTwo = useCallback(() => {
    async function fetchData() {
      setLoadingFightDataTwo(true)
      const fightDataTwo = await fights(reportCodeTwo, token)
      setFightDataTwo(fightDataTwo?.data)

      if (fightDataTwo?.errorMessage) {
        setErrorMessageTwo(fightDataTwo.errorMessage)
      }

      setLoadingFightDataTwo(false)
    }
    fetchData()
  }, [reportCodeTwo, token])

  const fetchDamageDone = useCallback(
    (fightInfo: DungeonInfo) => {
      async function fetchData() {
        setLoadingDamageDone(true)
        const damageDone = await damageDoneGraph(reportCode, fightInfo, token)
        const overall = await tableOverview(reportCode, fightInfo, token)
        setOverallTeamOne(overall)
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
        const overall = await tableOverview(reportCodeTwo, fightInfo, token)
        setOverallTeamTwo(overall)

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

  const [teamNameOne, setTeamNameOne] = useState<string>(fallbackTeamNameOne)
  const [teamNameTwo, setTeamNameTwo] = useState<string>(fallbackTeamNameTwo)

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
      fallbackSelectedReportTwoNumber &&
      token
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
    token,
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
    if (findFightDataToFallbackTwo && generateInUrl === 'true' && fightInfoTwo.id === undefined && token) {
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
    token,
  ])

  const [showTable, setShowTable] = useState<boolean>(fallbackShowTable === 'true' ? true : false)

  function addQueryParams() {
    const params = new URLSearchParams()
    params.append('reportCode', reportCode)
    params.append('reportCodeTwo', reportCodeTwo)
    fightInfo && fightInfo.id && params.append('selectedReportOne', fightInfo.id.toString())
    fightInfoTwo && fightInfoTwo.id && params.append('selectedReportTwo', fightInfoTwo.id.toString())
    params.append('teamNameOne', teamNameOne)
    params.append('teamNameTwo', teamNameTwo)
    params.append('showTable', 'true')
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
          className="absolute right-0 p-2"
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
          }}
        >
          Close graph
        </button>
        <div className="absolute left-0 p-2">
          <div className="flex gap-8">
            <div
              onClick={() => {
                setShowTable(!showTable)
              }}
            >
              {!showTable ? 'See overview' : 'See graph'}
            </div>
          </div>
        </div>
        {!showTable ? (
          <>
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
        ) : (
          <>
            <div className=" max-w-7xl m-auto ">
              <TableOverview data={overallTeamOne} fightInfo={fightInfo} teamName={teamNameOne} reportOne={true} />
            </div>
            {reportCode === reportCodeTwo ? null : (
              <div className="max-w-7xl m-auto ">
                <TableOverview
                  data={overallTeamTwo}
                  fightInfo={fightInfoTwo}
                  teamName={teamNameTwo}
                  reportOne={false}
                />
              </div>
            )}
          </>
        )}
      </>
    )
  }

  return (
    <div className="bg-[#052d49] py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center mb-4">Generate fancy MDI graphs</h1>
        <p className="text-center  mb-10">
          Search for two reports. Select which report you wanna compare after searching.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Input
                name="reportCodeOne"
                onChange={(event) => {
                  setReportCode(event.target.value)
                  setErrorMessage(undefined)
                  setFightInfo({
                    id: undefined,
                    startTime: undefined,
                    endTime: undefined,
                    name: undefined,
                    keystoneAffixes: undefined,
                  })
                }}
                placeholder="Enter report ID or name"
                value={reportCode}
              />
              <Button
                onClick={() => {
                  if (reportCode.length < 10) {
                    setErrorMessage('Report code is too short')
                  } else {
                    fetchFightDataOne()
                  }
                }}
                className="h-auto"
                variant="outline"
                disabled={reportCode === ''}
              >
                {loadingFightDataOne ? (
                  <Icons.spinner className="h-4 w-4 animate-spin text-black" />
                ) : (
                  <SearchIcon className="h-4 w-4" />
                )}
                <span className="sr-only">Search</span>
              </Button>
            </div>
            {!loadingFightDataOne && errorMessage ? <p className="text-red-500">{errorMessage}</p> : null}
            {fightData && fightData.length > 0 ? (
              <>
                <p className="text-sm  mb-2">Select a report to compare (Only showing M+ reports)</p>
                <Select
                  onValueChange={(value) => {
                    const data = fightData.find((data) => data.id === parseInt(value))
                    if (data) {
                      setFightInfo(data)
                      fetchDamageDone(data)
                      fetchHealingDone(data)
                    }
                  }}
                >
                  <SelectTrigger id="report-one">
                    <SelectValue placeholder={fightInfo.name ?? 'No report selected'} defaultValue={fightInfo.id} />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {fightData.map((data, index) => {
                      if (data.keystoneLevel === null) return null
                      return (
                        <SelectItem key={index} value={data.id.toString()}>
                          {data.id}. {data.name}, +{data.keystoneLevel} (
                          {convertAffixIdsToNames(data.keystoneAffixes)?.join(', ')})
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>

                <Input
                  value={teamNameOne}
                  onChange={(event) => {
                    setTeamNameOne(event.target.value)
                  }}
                  className="mt-4"
                  placeholder="Enter team name"
                  name="teamNameOne"
                />
              </>
            ) : null}
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Input
                name="reportCodeTwo"
                onChange={(event) => {
                  setErrorMessageTwo(undefined)
                  setReportCodeTwo(event.target.value)
                  setFightInfoTwo({
                    id: undefined,
                    startTime: undefined,
                    endTime: undefined,
                    name: undefined,
                    keystoneAffixes: undefined,
                  })
                  setFightDataTwo([])
                }}
                value={reportCodeTwo}
                placeholder="Enter report ID or name"
              />
              <Button
                onClick={() => {
                  if (reportCodeTwo.length < 10) {
                    setErrorMessageTwo('Report code is too short')
                  } else {
                    fetchFightDataTwo()
                  }
                }}
                className="h-auto"
                variant="outline"
                disabled={reportCodeTwo === ''}
              >
                {loadingFightDataTwo ? (
                  <Icons.spinner className="h-4 w-4 animate-spin text-black" />
                ) : (
                  <SearchIcon className="h-4 w-4" />
                )}
                <span className="sr-only">Search</span>
              </Button>
            </div>
            {!loadingFightDataTwo && errorMessageTwo ? <p className="text-red-500">{errorMessageTwo}</p> : null}
            {fightDataTwo && fightDataTwo.length > 0 ? (
              <>
                <p className="text-sm mb-2">Select second report to compare (Only showing M+ reports)</p>
                <Select
                  onValueChange={(value) => {
                    const data = fightDataTwo.find((data) => data.id === parseInt(value))

                    if (data) {
                      setFightInfoTwo(data)
                      fetchDamageDoneTwo(data)
                      fetchHealingDoneTwo(data)
                    }
                  }}
                >
                  <SelectTrigger id="report-two">
                    <SelectValue
                      placeholder={fightInfoTwo.name ?? 'No report selected'}
                      defaultValue={fightInfoTwo.id}
                    />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {fightDataTwo.map((data, index) => {
                      if (data.keystoneLevel === null) return null

                      return (
                        <SelectItem key={index} value={data.id.toString()}>
                          {data.id}. {data.name}, +{data.keystoneLevel} (
                          {convertAffixIdsToNames(data.keystoneAffixes)?.join(', ')})
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
                <Input
                  value={teamNameTwo}
                  onChange={(event) => {
                    setTeamNameTwo(event.target.value)
                  }}
                  className="mt-4"
                  placeholder="Enter team name"
                  name="teamNameTwo"
                />
              </>
            ) : null}
          </div>
        </div>
        {fightInfo && fightInfo.id && fightInfoTwo && fightInfoTwo.id ? (
          <div className="mt-6 flex justify-center">
            <Button
              onClick={() => {
                setCompareData(true)
                addQueryParams()
              }}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
            >
              Create graphs
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  )
}

function SearchIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="white"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}
