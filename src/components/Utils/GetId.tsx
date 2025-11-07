export function getId(obj: any): string | number {
  if (!obj) return Math.random();
  return obj.skillId ?? obj.id ?? obj._id ?? obj.availabilityId ?? obj.badgeId ?? Math.random();
}