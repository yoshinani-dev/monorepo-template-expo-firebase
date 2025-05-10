import * as FU from "@repo/firestore-utils-server"
import {
  type CollectionReference,
  getFirestore,
} from "firebase-admin/firestore"

import { type ForCreate, type ForUpdate } from "../core"

import * as domain from "./domain"

const accountsRef = () =>
  getFirestore().collection("accounts") as CollectionReference<domain.Account>

export const getAccountFindByUserId = (
  userId: string,
): Promise<domain.Account[] | null> =>
  FU.pipe(accountsRef().where("userId", "==", userId), FU.fetchDocs)

export const createAccount = (data: ForCreate<domain.Account>) =>
  FU.createDocIn(accountsRef(), data)

export const updateAccount = (data: ForUpdate<domain.Account>) =>
  FU.updateDocIn(accountsRef(), data)

export const getAccounts = (): Promise<domain.Account[]> =>
  FU.pipe(accountsRef(), FU.fetchDocs)
