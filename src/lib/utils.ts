/* eslint-disable import/consistent-type-specifier-style */
/* eslint-disable @typescript-eslint/array-type */
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
