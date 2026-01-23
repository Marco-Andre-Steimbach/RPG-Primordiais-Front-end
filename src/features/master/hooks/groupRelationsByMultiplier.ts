import type { ElementRelation, GroupedElementRelations } from '../elements.types'

export function groupRelationsByMultiplier(
  relations: ElementRelation[]
): {
  immune: ElementRelation[]
  groups: GroupedElementRelations[]
} {
  const immune: ElementRelation[] = []
  const map = new Map<number, ElementRelation[]>()

  for (const rel of relations) {
    if (rel.immunity || rel.multiplier === 0) {
      immune.push(rel)
      continue
    }

    if (!map.has(rel.multiplier)) {
      map.set(rel.multiplier, [])
    }

    map.get(rel.multiplier)!.push(rel)
  }

  const groups: GroupedElementRelations[] = Array.from(map.entries())
    .sort((a, b) => b[0] - a[0])
    .map(([multiplier, elements]) => ({
      multiplier,
      elements
    }))

  return { immune, groups }
}
