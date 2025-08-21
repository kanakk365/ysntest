export const toAppUid = (id: number | string) => `app_${String(id)}`

export const directConvId = (uidA: string, uidB: string) => {
  const [a, b] = [uidA, uidB].sort()
  return `direct_${a}_${b}`
}




