import { Static, Type } from '@sinclair/typebox';
import ajv from '@practica/validation';

export const permissionSchema = Type.Object({
  ability: Type.String({ minLength: 1 }),
});

export const editPermissionSchema = Type.Object({
  ability: Type.String({ minLength: 1 }),
});

export type addPermissionDTO = Static<typeof permissionSchema>;
export type editPermissionDTO = Static<typeof permissionSchema>;

export function addPermissionValidator() {
  const validator = ajv.getSchema<addPermissionDTO>('add-permission');
  if (!validator) {
    ajv.addSchema(permissionSchema, 'add-permission');
  }

  return ajv.getSchema<addPermissionDTO>('add-permission')!;
}

export function editPermissionValidator() {
  const validator = ajv.getSchema<editPermissionDTO>('edit-permission');
  if (!validator) {
    ajv.addSchema(editPermissionSchema, 'edit-permission');
  }

  return ajv.getSchema<editPermissionDTO>('edit-permission')!;
}
