import React, { useMemo } from 'react'
import { Chart } from 'react-charts'

type Tdata = {
  data: {
    [x: string]: any
    name: string
    total: number
    type: string
  }[]
}

const MyBarChart = ({ data }: Tdata) => {
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

  // WoW class colors
  const classColors: { [key: string]: string } = useMemo(
    () => ({
      DemonHunter: '#A330C9',
      Druid: '#FF7D0A',
      Hunter: '#ABD473',
      Mage: '#40C7EB',
      Paladin: '#F58CBA',
      Priest: '#FFFFFF',
      Rogue: '#FFF569',
      Shaman: '#0070DE',
      Warlock: '#8787ED',
      Warrior: '#C79C6E',
    }),
    [],
  )

  // Define a color for each bar

  return (
    <div className="flex min-w-7xl min-h-[340px] mt-20 my-chart ">
      <Chart
        options={{
          data: chartData,
          primaryAxis,
          secondaryAxes,
          getSeriesStyle: (series) => ({
            color: classColors[series.label],
          }),
          dark: true,
        }}
      />
    </div>
  )
}

export default MyBarChart
