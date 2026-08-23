import { BadRequestException } from '@nestjs/common';

function toDisplayString(value: string | number | boolean | bigint): string {
  return String(value);
}

function isPrimitive(
  value: unknown,
): value is string | number | boolean | bigint {
  const type = typeof value;
  return (
    type === 'string' ||
    type === 'number' ||
    type === 'boolean' ||
    type === 'bigint'
  );
}

export function normalizeOptionalString(
  value: unknown,
): string | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  if (!isPrimitive(value)) {
    throw new BadRequestException('Invalid string value.');
  }

  const normalized = toDisplayString(value).trim();

  return normalized.length > 0 ? normalized : null;
}

export function normalizeRequiredString(value: unknown, label: string): string {
  const normalized = normalizeOptionalString(value);

  if (typeof normalized !== 'string') {
    throw new BadRequestException(`${label} is required.`);
  }

  return normalized;
}

export function normalizeOptionalInteger(
  value: unknown,
  label: string,
): number | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  if (typeof value === 'number') {
    if (!Number.isInteger(value)) {
      throw new BadRequestException(`${label} must be an integer.`);
    }

    return value;
  }

  if (!isPrimitive(value)) {
    throw new BadRequestException(`${label} must be an integer.`);
  }

  const normalized = toDisplayString(value).trim();

  if (normalized.length === 0) {
    return null;
  }

  const parsed = Number(normalized);

  if (!Number.isInteger(parsed)) {
    throw new BadRequestException(`${label} must be an integer.`);
  }

  return parsed;
}

export function normalizeOptionalDecimal(
  value: unknown,
  label: string,
): string | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  if (!isPrimitive(value)) {
    throw new BadRequestException(`${label} must be a number.`);
  }

  const normalized = toDisplayString(value).trim();

  if (normalized.length === 0) {
    return null;
  }

  if (Number.isNaN(Number(normalized))) {
    throw new BadRequestException(`${label} must be a number.`);
  }

  return normalized;
}

export function normalizeOptionalDate(
  value: unknown,
  label: string,
): Date | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  if (!isPrimitive(value)) {
    throw new BadRequestException(`${label} is not a valid date.`);
  }

  const date = new Date(toDisplayString(value));

  if (Number.isNaN(date.getTime())) {
    throw new BadRequestException(`${label} is not a valid date.`);
  }

  return date;
}
