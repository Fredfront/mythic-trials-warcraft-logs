import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from '@/components/ui/table'
import { convertMillisToMinAndSec } from './TanstackCharts'
import monk from '../../public/classes/monk.png'
import druid from '../../public/classes/druid.png'
import hunter from '../../public/classes/hunter.png'
import mage from '../../public/classes/mage.png'
import paladin from '../../public/classes/paladin.png'
import priest from '../../public/classes/priest.png'
import rogue from '../../public/classes/rogue.png'
import shaman from '../../public/classes/shaman.png'
import warlock from '../../public/classes/warlock.png'
import warrior from '../../public/classes/warrior.png'
import deathknight from '../../public/classes/deathknight.png'
import demonhunter from '../../public/classes/demonhunter.png'
import evoker from '../../public/classes/evoker.png'
import sanguineIchor from '../../public/classes/sanguineIchor.png'
import Image from 'next/image'
import { convertAffixIdsToNames } from '../utils/affixes'

export interface TableOverviewProps {
  data: any
  fightInfo: any
  teamName: string
  reportOne: boolean
}

export default function TableOverview({ data, fightInfo, teamName, reportOne }: TableOverviewProps) {
  const damageDone = data.damageDone.sort((a: { total: number }, b: { total: number }) => b.total - a.total)

  type TmappedData = {
    damageDone: number
    damageTaken: number
    name: string
    deaths: number
    interrupts: number
    healing: number
    effectiveDPS: number
    effectiveHPS: number
    wowClass: string
  }
  const totalDungeonTime = fightInfo?.endTime - fightInfo?.startTime

  let mappedData = damageDone.map((e: any) => {
    return {
      damageDone: e.total,
      wowClass: e.type,
      name: e.name,
      deaths: summarizeNamesOccurrences(data.deaths)[e.name] || 0,
      interrupts: summarizeInterrupts(data.interrupts)[e.name] || 0,
      damageTaken: data.damageTaken.find((d: any) => d.name === e.name)?.total || 0,
      healing: data.healing.find((d: any) => d.name === e.name)?.total || 0,
      effectiveDPS: e.total / (totalDungeonTime / 1000) || 0,
      effectiveHPS: data.healing.find((d: any) => d.name === e.name)?.total / (totalDungeonTime / 1000) || 0,
    }
  }) as TmappedData[]

  const totalDamageDone = damageDone.reduce((acc: number, curr: { total: number }) => acc + curr.total, 0)
  const totalDamageDoneToMillion = totalDamageDone / 1000000

  const totalDamageTaken = data.damageTaken.reduce((acc: number, curr: { total: number }) => acc + curr.total, 0)
  const totalDamageTakenToMillion = totalDamageTaken / 1000000

  const totalHealingDone = data.healing.reduce((acc: number, curr: { total: number }) => acc + curr.total, 0)
  const totalHealingDoneToMillion = totalHealingDone / 1000000

  const totalDamageDoneTableValue =
    Math.round(totalDamageDoneToMillion) > 1000
      ? `${Math.round(totalDamageDoneToMillion / 1000)}B`
      : `${Math.round(totalDamageDoneToMillion)}M`

  const totalHealingDoneTableValue =
    Math.round(totalHealingDoneToMillion) > 1000
      ? `${Math.round(totalHealingDoneToMillion / 1000)}B`
      : `${Math.round(totalHealingDoneToMillion)}M`

  const totalDeaths = data.deaths.length

  const interrupts = mappedData.map((e) => e.interrupts)

  const totalInterrupts = interrupts.reduce((acc, curr) => acc + curr, 0)

  const effectiveHPS = mappedData.map((e) => e.effectiveHPS)

  const totalEffectiveHPS = effectiveHPS.reduce((acc, curr) => acc + curr, 0)

  const effectiveDPS = totalDamageDone / (totalDungeonTime / 1000)

  const effectiveDPSTablealueWithTwoDecimals =
    Math.round(effectiveDPS / 1000) > 1000 ? `${(effectiveDPS / 1000000).toFixed(2)}M` : `${effectiveDPS / 1000}K`

  const borderClass = reportOne ? 'border-[#FFD700]' : 'border-[#FF4500]'

  const dungeonTimeClass = reportOne
    ? 'mt-2 text-center text-[#FFD700] font-bold '
    : 'mt-2 text-center text-[#FF4500] font-bold'

  const affixesToNames = convertAffixIdsToNames(fightInfo.keystoneAffixes)

  const sanguineHealing = data.sanguineHealing.filter((e: any) => e.name === 'Environment')
  const sanguineHealingTotal = sanguineHealing?.[0]?.abilities?.filter((a: any) => a.name === 'Sanguine Ichor')?.[0]
    ?.total

  const sanguineInchor = {
    name: 'Sanguine Ichor',
    healing: sanguineHealingTotal,
    effectiveHPS: sanguineHealingTotal / (totalDungeonTime / 1000),
    wowClass: 'Sanguine Ichor',
    damageDone: 0,
    damageTaken: 0,
    deaths: 0,
    interrupts: 0,
    effectiveDPS: 0,
  }

  console.log(totalDeaths * 5 * 1000)

  mappedData = [...mappedData, sanguineInchor]

  return (
    <div className={`p-4  `}>
      <div>
        <h2 className="text-2xl mt-10 font-bold mb-2 text-center ">{teamName}</h2>
        <div className=" ml-2 mt-6 flex flex-col text-center ">
          <div>
            {fightInfo.name}, +{fightInfo.keystoneLevel}
          </div>
          <div>{affixesToNames?.join(', ')}</div>
        </div>
        <Table
          className={
            reportOne
              ? 'mt-4 text-[#FFD700] bg-[#ffd90061] rounded-lg drop-shadow-lg'
              : 'mt-4 text-white bg-[#ff440084] rounded-lg drop-shadow-lg'
          }
        >
          <TableHeader className=" bg-gray-800 text-white pt-2 pb-2  ">
            <TableRow className=" border-none ">
              <TableHead>Name</TableHead>
              <TableHead className="text-center">
                <div>Damage</div>
                <div>Done</div>
              </TableHead>
              <TableHead className="text-center">
                <div>Effective</div>
                <div>DPS</div>
              </TableHead>
              <TableHead className="text-center">
                <div>Healing</div>
                <div>Done</div>
              </TableHead>
              <TableHead className="text-center">
                <div>Effective</div>
                <div>HPS</div>
              </TableHead>
              <TableHead className="text-center">
                <div>Damage</div>
                <div>Taken</div>
              </TableHead>
              <TableHead className="text-center">
                <div>Interrupts</div>
              </TableHead>
              <TableHead className="text-center">
                <div>Deaths</div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mappedData.map((row) => {
              if (row.healing === undefined) return null

              return (
                <TableRow key={row.name} className={borderClass}>
                  <TableCell>
                    <div className="flex gap-4">
                      <Image
                        src={findWoWClassIcon(row.wowClass) as unknown as string}
                        height={16}
                        width={20}
                        alt={row.name}
                      />{' '}
                      {row.name}
                    </div>
                  </TableCell>

                  <TableCell className="text-center">{Math.round(row.damageDone / 1000000)}M</TableCell>
                  <TableCell className="text-center">{Math.round(row.effectiveDPS / 1000)}K</TableCell>
                  <TableCell className="text-center">{Math.round(row.healing / 1000000)}M</TableCell>
                  <TableCell className="text-center">{Math.round(row.effectiveHPS / 1000)}K</TableCell>
                  <TableCell className="text-center">{Math.round(row.damageTaken / 1000000)}M</TableCell>
                  <TableCell className="text-center">{row.interrupts}</TableCell>
                  <TableCell className="text-center">{row.deaths}</TableCell>
                </TableRow>
              )
            })}

            <TableRow className="font-bold">
              <TableCell>Total</TableCell>
              <TableCell className="text-center">{totalDamageDoneTableValue}</TableCell>
              <TableCell className="text-center">{effectiveDPSTablealueWithTwoDecimals}</TableCell>
              <TableCell className="text-center">{totalHealingDoneTableValue}</TableCell>
              <TableCell className="text-center">{Math.round(totalEffectiveHPS / 1000)}K</TableCell>
              <TableCell className="text-center">{Math.round(totalDamageTakenToMillion)}M</TableCell>
              <TableCell className="text-center">{totalInterrupts}</TableCell>
              <TableCell className="text-center">{totalDeaths}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div>
          <p className={dungeonTimeClass}>
            {/* {convertMillisToMinAndSec(fightInfo?.startTime, fightInfo?.endTime + totalDeaths * 5 * 1000)} */}
          </p>
        </div>
      </div>
    </div>
  )
}

interface NameCounts {
  [key: string]: number
}

function summarizeNamesOccurrences(data: { name: string }[]): NameCounts {
  const nameCounts: NameCounts = {}

  data?.forEach((death) => {
    const { name } = death
    if (nameCounts[name]) {
      nameCounts[name]++
    } else {
      nameCounts[name] = 1
    }
  })

  return nameCounts
}

interface Summary {
  [key: string]: number
}

function summarizeInterrupts(data: any[]): Summary {
  const summary: Summary = {}

  data.forEach((item) => {
    item.details.forEach((detail: { name: string; total: number }) => {
      const { name, total } = detail
      if (!summary[name]) {
        summary[name] = 0
      }
      summary[name] += total
    })
  })

  return summary
}

enum wowClasses {
  druid = 'Druid',
  hunter = 'Hunter',
  mage = 'Mage',
  paladin = 'Paladin',
  priest = 'Priest',
  rogue = 'Rogue',
  shaman = 'Shaman',
  warlock = 'Warlock',
  warrior = 'Warrior',
  deathknight = 'DeathKnight',
  monk = 'Monk',
  demonhunter = 'DemonHunter',
  evoker = 'Evoker',
  sanguine = 'Sanguine Ichor',
}

function findWoWClassIcon(wowClass: string) {
  switch (wowClass) {
    case wowClasses.sanguine:
      return sanguineIchor
    case wowClasses.druid:
      return druid
    case wowClasses.hunter:
      return hunter
    case wowClasses.mage:
      return mage
    case wowClasses.paladin:
      return paladin
    case wowClasses.priest:
      return priest
    case wowClasses.rogue:
      return rogue
    case wowClasses.shaman:
      return shaman
    case wowClasses.warlock:
      return warlock
    case wowClasses.warrior:
      return warrior
    case wowClasses.deathknight:
      return deathknight
    case wowClasses.monk:
      return monk
    case wowClasses.demonhunter:
      return demonhunter
    case wowClasses.evoker:
      return evoker
    default:
      return
  }
}
