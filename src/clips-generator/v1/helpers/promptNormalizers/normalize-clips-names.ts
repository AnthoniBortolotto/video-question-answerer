import { InternalServerErrorException } from "@nestjs/common";

/**
 * Normalize the text containing the clips names to remove unentended characters
 * @param clipsNames Text generated containing the clips names
 * @returns the text with the clips names normalized
 */
export function normalizeClipsNames(clipsNames: string): string {
  try {
    return clipsNames.replace(/[*]/g, '');
  } catch (error) {
    throw new InternalServerErrorException();
  }
}
