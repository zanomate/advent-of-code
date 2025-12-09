import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'
import { p, Pos } from '../../utils/space/Pos'

function getArea(p1: Pos, p2: Pos) {
  return (Math.abs(p2.x - p1.x) + 1) * (Math.abs(p2.y - p1.y) + 1)
}

function resolvePart1(points: Pos[]) {
  let largestArea = 0
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const p1 = points[i]
      const p2 = points[j]
      const area = getArea(p1, p2)
      if (area > largestArea) largestArea = area
    }
  }
  return largestArea
}

// Check if point p lies exactly on segment ab
function isPointOnSegment(p: Pos, a: Pos, b: Pos): boolean {
  // Check collinearity via cross product (area of parallelogram)
  const cross = (p.y - a.y) * (b.x - a.x) - (p.x - a.x) * (b.y - a.y)
  if (Math.abs(cross) > 1e-10) return false

  // Check projection: point must lie within segment bounds
  const dot = (p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y)
  if (dot < 0) return false

  const lenSq = (b.x - a.x) ** 2 + (b.y - a.y) ** 2
  if (dot > lenSq) return false

  return true
}

// Ray-casting rule to detect whether ray from p intersects segment p1→p2
function rayIntersectsSegment(p: Pos, p1: Pos, p2: Pos): boolean {
  const { x, y } = p

  // Sort points by ascending Y to simplify rule 1
  let a = p1,
    b = p2
  if (a.y > b.y) [a, b] = [b, a]

  // Y must be within segment bounds (min inclusive, max exclusive)
  if (y < a.y || y >= b.y) return false

  // Compute X coordinate of intersection with horizontal ray
  const intersectX = a.x + (b.x - a.x) * ((y - a.y) / (b.y - a.y))

  // Count intersection only if it occurs to the right of the point
  return intersectX >= x
}

// Check whether point p is inside polygon or exactly on its border
function isPointInPolygonOrOnEdge(p: Pos, poly: Pos[]): boolean {
  // First: detect if point lies on any edge
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    if (isPointOnSegment(p, poly[j], poly[i])) return true
  }

  // Otherwise perform ray casting
  let inside = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    if (rayIntersectsSegment(p, poly[j], poly[i])) {
      inside = !inside
    }
  }
  return inside
}

// Detect if two segments intersect
// (Touching at a single point is allowed by the final logic)
function segmentIntersectsSegment(a1: Pos, a2: Pos, b1: Pos, b2: Pos): boolean {
  function orient(p: Pos, q: Pos, r: Pos) {
    return (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y)
  }

  const o1 = orient(a1, a2, b1)
  const o2 = orient(a1, a2, b2)
  const o3 = orient(b1, b2, a1)
  const o4 = orient(b1, b2, a2)

  // Proper intersection
  if (o1 * o2 < 0 && o3 * o4 < 0) return true

  // Collinear cases (touching)
  const on = isPointOnSegment
  if (o1 === 0 && on(b1, a1, a2)) return true
  if (o2 === 0 && on(b2, a1, a2)) return true
  if (o3 === 0 && on(a1, b1, b2)) return true
  if (o4 === 0 && on(a2, b1, b2)) return true

  return false
}

// Check whether polygon p1 fully contains polygon p2
// Vertices or edges touching are considered valid containment
function polygonContainsPolygon(p1: Pos[], p2: Pos[]): boolean {
  // All vertices of p2 must be inside or on the border of p1
  for (const v of p2) {
    if (!isPointInPolygonOrOnEdge(v, p1)) return false
  }

  // No segment of p2 may cross outside p1
  for (let i = 0, j = p2.length - 1; i < p2.length; j = i++) {
    const a1 = p2[j]
    const a2 = p2[i]

    // Check intersection against each edge of p1
    for (let k = 0, h = p1.length - 1; k < p1.length; h = k++) {
      const b1 = p1[h]
      const b2 = p1[k]

      // If segments intersect, it may or may not invalidate containment:
      // touching is allowed, crossing is not.
      if (segmentIntersectsSegment(a1, a2, b1, b2)) {
        // Distinguish touching from real crossing
        const collinear =
          isPointOnSegment(a1, b1, b2) ||
          isPointOnSegment(a2, b1, b2) ||
          isPointOnSegment(b1, a1, a2) ||
          isPointOnSegment(b2, a1, a2)

        // If not collinear/touching, it's a true crossing → p2 exits p1
        if (!collinear) return false
      }
    }
  }

  return true
}

function resolvePart2(polygon: Pos[]) {
  let largestArea = 0
  for (let i = 0; i < polygon.length; i++) {
    for (let j = i + 1; j < polygon.length; j++) {
      const p1 = polygon[i]
      const p2 = polygon[j]
      const area = getArea(p1, p2)
      if (
        area > largestArea &&
        polygonContainsPolygon(polygon, [p1, p(p2.x, p1.y), p2, p(p1.x, p2.y)])
      ) {
        largestArea = area
      }
    }
  }
  return largestArea
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile)
  const points: Pos[] = input.split('\n').map((line) => {
    const [x, y] = line.split(',').map(Number)
    return p(x, y)
  })

  const t0 = performance.now()

  let part1 = resolvePart1(points)
  let part2 = resolvePart2(points)

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
