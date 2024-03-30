/* eslint-disable @next/next/no-img-element */
import React from 'react'
import atalImg from '../public/dungeons/atal.webp'
import blackrookholdImg from '../public/dungeons/blackrookhold.webp'
import darkheartImg from '../public/dungeons/darkheart.webp'
import everbloomImg from '../public/dungeons/everbloom.webp'
import fallImg from '../public/dungeons/fall.webp'
import riseImg from '../public/dungeons/rise.webp'
import throneImg from '../public/dungeons/throne.webp'
import waycrestImg from '../public/dungeons/waycrest.webp'
import LUL from '../public/dungeons/LUL.webp'
import { Card, CardContent } from './ui/card'
import Image from 'next/image'

type DungeonCardProps = {
  data: {
    id: string
    startTime: string
    endTime: string
    name: string
    keystoneAffixes: string[]
    keystoneLevel: number
  }
}

function DungeonCard({ data }: DungeonCardProps) {
  let imgSrc = LUL
  if (data.name === 'Black Rook Hold') imgSrc = blackrookholdImg
  if (data.name === "Atal'Dazar") imgSrc = atalImg
  if (data.name === 'Darkheart Thicket') imgSrc = darkheartImg
  if (data.name === 'Everbloom') imgSrc = everbloomImg
  if (data.name?.includes('Rise')) imgSrc = riseImg
  if (data.name?.includes('Throne')) imgSrc = throneImg
  if (data.name?.includes('Waycrest')) imgSrc = waycrestImg

  return (
    <Card>
      <CardContent className="flex items-center space-x-4 mt-4">
        <label className="flex items-center space-x-2 cursor-pointer" htmlFor="result-4">
          <Image
            alt={data.name}
            className="rounded-full border border-card bg"
            height="40"
            src={imgSrc as unknown as string}
            style={{
              aspectRatio: '40/40',
              objectFit: 'cover',
            }}
            width="40"
          />
          <div className="grid gap-0.5">
            <h3 className="text-sm font-bold leading-none">{data.name}</h3>
            <p className="text-xs text-muted-foreground leading-none">
              {data?.keystoneLevel} - {data?.keystoneAffixes?.join(', ')}
            </p>
          </div>
        </label>
      </CardContent>
    </Card>
  )
}

export default DungeonCard
