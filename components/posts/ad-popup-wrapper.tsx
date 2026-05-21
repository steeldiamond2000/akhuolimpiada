"use client"

import { AdPopup } from "./ad-popup"
import type { PostWithMedia } from "@/lib/types"

interface AdPopupWrapperProps {
  ads: PostWithMedia[]
}

export function AdPopupWrapper({ ads }: AdPopupWrapperProps) {
  if (ads.length === 0) return null
  return <AdPopup ads={ads} />
}
