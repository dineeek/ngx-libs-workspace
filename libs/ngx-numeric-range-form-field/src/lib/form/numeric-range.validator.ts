import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms'

export const numericRangeValues: ValidatorFn = (
  group: AbstractControl
): ValidationErrors | null => {
  const maxValue = group.get('maximum')?.value
  const minValue = group.get('minimum')?.value

  const max = maxValue != null ? Number(maxValue) : null
  const min = minValue != null ? Number(minValue) : null

  if (max !== null && min !== null && max < min) {
    return { notValidRange: true }
  }
  return null
}
