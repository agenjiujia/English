export function buildAnnotationNoteCountMap(
  ids: string[],
  annotations: Array<{ targetId: string; note?: string }>,
) {
  const sortedIds = [...ids].sort((a, b) => b.length - a.length);
  const result: Record<string, number> = {};

  annotations.forEach((item) => {
    if (!item.note?.trim()) return;
    const matchedId = sortedIds.find(
      (id) => item.targetId === id || item.targetId.startsWith(`${id}-`),
    );
    if (!matchedId) return;
    result[matchedId] = (result[matchedId] || 0) + 1;
  });

  return result;
}

export function scrollToElementById(id: string) {
  const element = document.getElementById(id);
  if (!element) return;
  element.scrollIntoView({ behavior: "smooth", block: "start" });
}
