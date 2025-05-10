interface Base<T extends string> {
  id: T
  createdAt: Date
  updatedAt: Date
}

export type ForUpdate<T extends Base<string>> = Omit<
  T,
  "id" | "createdAt" | "updatedAt"
> & {
  id: T["id"]
  createdAt?: T["createdAt"]
  updatedAt?: T["updatedAt"]
}

export type ForCreate<T extends Base<string>> = Omit<
  T,
  "id" | "createdAt" | "updatedAt"
> & {
  id?: T["id"]
  createdAt?: Date
  updatedAt?: Date
}
