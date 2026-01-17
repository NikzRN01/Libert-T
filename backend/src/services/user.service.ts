export type User = {
  id: string;
};

export function getUserById(id: string): User {
  return { id };
}
