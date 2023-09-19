export function slugify(element: HTMLElement) {
  if (element === undefined) {
    return "";
  } else {
    return String(element.innerText)
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, "")
      .replace(/\s+/g, "-")
      .trim();
  }
}
