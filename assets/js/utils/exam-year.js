export function examYears() {
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;

  return (
    `<option value="" selected="">Select Year</option>
      <option value="${currentYear}">${currentYear}</option>
      <option value="${nextYear}">${nextYear}</option>`
  );
}
