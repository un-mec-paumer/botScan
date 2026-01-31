import { z } from 'zod';

/**
 * Fabrique un schema zod pour un param d'URL dont le nom de propriété est fourni.
 * Exemple: `makeIdParamsDto('itemId')` -> { itemId: string }
 */
export const makeIdParamsDto = (paramName: string) =>
  z.object({ [paramName]: z.uuid({ message: `Wrong id format` }) });
