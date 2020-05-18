export function examYears() {
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;

  return (
    `<optgroup label="Exam Year">
        <option value="${currentYear}" selected>${currentYear}</option>
        <option value="${nextYear}">${nextYear}</option>
    </optgroup>`
  );
}
