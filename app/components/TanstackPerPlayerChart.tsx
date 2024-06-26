import React, { useMemo } from 'react'
import { Chart } from 'react-charts'

type Tdata = {
  data: {
    [x: string]: any
    name: string
    total: number
    type: string
  }[]
  teamName: string
  reportOne: boolean
}

const MyBarChart = ({ data, teamName, reportOne }: Tdata) => {
  // Transform the data into a format suitable for React Charts

  const chartData = React.useMemo(
    () => [
      {
        label: 'Total',
        data: data.map((item) => ({
          primary: item.name,
          secondary: item.total,
          type: item.type,
        })),
      },
    ],
    [data],
  )

  // Configure the axes
  const primaryAxis = React.useMemo(
    () => ({
      getValue: (datum: { primary: any }) => datum.primary,
    }),
    [],
  )

  const secondaryAxes = React.useMemo(
    () => [
      {
        getValue: (datum: { secondary: any }) => datum.secondary,
        elementType: 'bar' as const, // Specify that we want to use bars
      },
    ],
    [],
  )

  // Define a color for each bar

  return (
    <>
      {teamName ? (
        <h3 className="mt-20 text-center font-bold ">Damage done ({teamName} )</h3>
      ) : (
        <h3 className="mt-20 text-center font-bold ">Damage done</h3>
      )}

      <div className="flex min-w-7xl min-h-[340px] my-chart ">
        <Chart
          options={{
            data: chartData,
            primaryAxis,
            secondaryAxes,
            defaultColors: reportOne ? ['#FDB202'] : ['#FF4500'],

            dark: true,
          }}
        />
      </div>
    </>
  )
}

export default MyBarChart
