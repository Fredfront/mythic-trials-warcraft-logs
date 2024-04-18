import React, { useMemo } from 'react'
import { AxisOptions, Chart } from 'react-charts'
import Image from 'next/image'
import { convertAffixIdsToNames } from '../utils/affixes'
import { useSearchParams } from 'next/navigation'

interface DamageDataPoint {
  primary: Date // For storing the converted timestamp
  secondary: number // Damage value
}

interface DamageDataSet {
  name: string
  type: string
  id: string
  pointStart: number
  pointInterval: number
  data: number[] // Array of damage values
}

export interface DungeonInfo {
  id: number
  startTime: number
  endTime: number
  name: string
  keystoneLevel: number
  keystoneAffixes: number[]
}

interface LineProps {
  totalDamageDone: DamageDataSet
  totalDamageDoneTwo: DamageDataSet
  fightInfo: DungeonInfo
  fightInfoTwo: DungeonInfo
  isDamageDone: boolean
}

interface ChartData {
  label: string
  data: DamageDataPoint[]
}

const LineComponent: React.FC<LineProps> = ({
  totalDamageDone,
  totalDamageDoneTwo,
  fightInfo,
  fightInfoTwo,
  isDamageDone,
}) => {
  // Function to convert your dataset into the format expected by react-charts
  const convertToChartData = (dataset: DamageDataSet): ChartData => {
    const { pointInterval, data, name } = dataset
    const dataPoints: DamageDataPoint[] = data?.map((value, index) => ({
      primary: new Date(0 + index * pointInterval),
      secondary: value,
    }))
    return { label: name, data: dataPoints }
  }

  const data = React.useMemo(
    () => [convertToChartData(totalDamageDone), convertToChartData(totalDamageDoneTwo)],
    [totalDamageDone, totalDamageDoneTwo],
  )

  const fightInfoStartTime = fightInfo.startTime
  const fightInfoTwoStartTime = fightInfoTwo.startTime
  const fightInfoEndTime = fightInfo.endTime
  const fightInfoTwoEndTime = fightInfoTwo.endTime

  const durationOne = fightInfoEndTime - fightInfoStartTime
  const durationTwo = fightInfoTwoEndTime - fightInfoTwoStartTime

  const startTime = Math.min(durationOne > durationTwo ? fightInfoStartTime : fightInfoTwoStartTime)
  const endTime = Math.max(durationOne > durationTwo ? fightInfoEndTime : fightInfoTwoEndTime)

  const totalDurationMs = endTime - startTime
  const hardMaxDate = useMemo(() => new Date(0 + totalDurationMs), [totalDurationMs])

  const primaryAxis = React.useMemo<AxisOptions<DamageDataPoint>>(
    () => ({
      getValue: (datum) => datum.primary,
      formatters: {
        scale: (value: any) => {
          const totalMilliseconds = value?.getTime()
          const minutes = Math.floor(totalMilliseconds / 60000)
          const seconds = Math.floor((totalMilliseconds % 60000) / 1000)
          return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        },
      },
      // Dynamically setting the hardMax based on the calculated max duration
      hardMin: new Date(0), // Assuming start at 0 for the display
      hardMax: hardMaxDate, // Use the dynamically calculated hardMax
    }),
    [hardMaxDate],
  )
  const secondaryAxes = React.useMemo<AxisOptions<DamageDataPoint>[]>(
    () => [
      {
        getValue: (datum) => datum.secondary,
        formatters: {
          scale: (value: number) => formatNumber(value), // Use a custom formatter for the scale
        },
      },
    ],
    [],
  )

  // Function to format numbers as "K" for thousands and "M" for millions
  function formatNumber(value: number): string {
    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)}M`
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`
    }
    return value?.toString()
  }

  const affixesToNames = convertAffixIdsToNames(fightInfo.keystoneAffixes)

  return (
    <div className="flex flex-col">
      {isDamageDone ? (
        <div className="flex m-auto mb-4">
          <Image width={45} height={45} src="/MT_logo_white.webp" alt="Mythic Trials Sesong 2 Logo" />

          <div className=" ml-2 mt-6 flex flex-col">
            <div>
              {fightInfo.name}, +{fightInfo.keystoneLevel}
            </div>
            <div>{affixesToNames?.join(', ')}</div>
          </div>
        </div>
      ) : null}
      {<div className="ml-4 text-center"> {isDamageDone ? 'Damage Done' : 'Healing Done'}</div>}

      <div className="flex min-w-7xl min-h-[340px]">
        <Chart
          options={{
            data,
            primaryAxis,
            secondaryAxes,
            defaultColors: ['#FFD700', '#FF4500'],
            dark: true,
          }}
        />
      </div>
      {!isDamageDone ? null : (
        <div className="flex m-auto gap-10 mt-10 mb-10">
          <div className="border-l-4 border-[#FFD700] pl-2">
            {totalDamageDone.name}
            {/* ({convertMillisToMinAndSec(fightInfoStartTime, fightInfoEndTime)}) */}
          </div>
          <div className="border-l-4 border-[#FF4500] pl-2">
            {totalDamageDoneTwo.name}
            {/* ({convertMillisToMinAndSec(fightInfoTwoStartTime, fightInfoTwoEndTime)}) */}
          </div>
        </div>
      )}
    </div>
  )
}

export default LineComponent

export function convertMillisToMinAndSec(startTime: number, endTime: number): string {
  // Calculate the difference in milliseconds
  const diffInMillis: number = endTime - startTime

  // Convert milliseconds to minutes and seconds
  const minutes: number = Math.floor(diffInMillis / 60000)
  const seconds: number = Math.floor((diffInMillis % 60000) / 1000)

  // Return the result formatted as "mm:ss"
  return `${minutes.toString().padStart(2, '0')} Min ${seconds.toString().padStart(2, '0')} Sec`
}
