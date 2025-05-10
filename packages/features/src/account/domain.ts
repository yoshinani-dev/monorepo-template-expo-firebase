import { type Tagged } from "type-fest"

import { autoId } from "../core/autoId"

export type AccountId = Tagged<string, "AccountId">

export interface Account {
  id: AccountId
  userId: string
  createdAt: Date
  updatedAt: Date
}

export function createNewAccount({ userId }: { userId: string }): Account {
  return {
    userId,
    id: autoId() as AccountId,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}
