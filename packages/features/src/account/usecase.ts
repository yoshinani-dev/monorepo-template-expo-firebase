import * as domain from "./domain"
import * as repo from "./repo"

export const createOrGetAccount = async (userId: string) => {
  const accounts = await repo.getAccountFindByUserId(userId)
  if (accounts && accounts.length > 0) {
    return accounts.at(0)
  }

  const newAccount = domain.createNewAccount({ userId })
  await repo.createAccount(newAccount)

  return newAccount
}

export const getAccount = async (userId: string) => {
  const accounts = await repo.getAccountFindByUserId(userId)
  if (accounts && accounts.length > 0) {
    return accounts.at(0)
  }

  return null
}
