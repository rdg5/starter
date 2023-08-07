import { Static, Type } from '@sinclair/typebox';
import ajv from '@practica/validation';

export const roleSchema = Type.Object({
  role: Type.String({ minLength: 1 }),
});

export const editRoleSchema = Type.Object({
  role: Type.String({ minLength: 1 }),
});

export type addRoleDTO = Static<typeof roleSchema>;
export type editRoleDTO = Static<typeof editRoleSchema>;

export function addRoleValidator() {
  const validator = ajv.getSchema<addRoleDTO>('add-role');
  if (!validator) {
    ajv.addSchema(roleSchema, 'add-role');
  }

  return ajv.getSchema<addRoleDTO>('add-role')!;
}

export function editRoleValidator() {
  const validator = ajv.getSchema<editRoleDTO>('edit-role');
  if (!validator) {
    ajv.addSchema(editRoleSchema, 'edit-role');
  }

  return ajv.getSchema<editRoleDTO>('edit-role')!;
}
