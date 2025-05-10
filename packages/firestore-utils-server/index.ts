import {
  type CollectionReference,
  type DocumentData,
  DocumentReference,
  type DocumentSnapshot,
  FieldValue,
  type Query,
  Timestamp,
  type WithFieldValue,
} from "firebase-admin/firestore"
import * as R from "remeda"

export { pipe } from "remeda"

interface Base {
  id: string
  createdAt: Date
  updatedAt: Date
}

/**
 * ドキュメントを作成します。既に存在する場合はエラーになります。
 * IDを指定しない場合はautoIdが設定されます。
 * @param ref - ドキュメントを作成するコレクションの参照
 * @param data - 作成するデータ
 * @returns 作成結果
 */
export function createDocIn<T extends Base>(
  ref: CollectionReference<T>,
  data: Omit<T, keyof Base> & {
    id?: T["id"]
    createdAt?: Date
    updatedAt?: Date
  },
) {
  return ref.doc(data.id ?? autoId()).create(
    serialize({
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      ...data,
    }) as WithFieldValue<T>,
  )
}

/**
 * ドキュメントを更新します。ドキュメントが存在しない場合はエラーになります。
 * @param ref - 更新対象のドキュメントが存在するコレクションの参照
 * @param data - 更新するデータ
 * @returns 更新結果
 */
export async function updateDocIn<T extends Base>(
  ref: CollectionReference<T>,
  data: Partial<Omit<T, keyof Base>> & {
    id: T["id"]
    createdAt?: Date
    updatedAt?: Date
  },
) {
  return ref.doc(data.id).update(
    serialize({
      updatedAt: FieldValue.serverTimestamp(),
      ...R.omit(data, ["id"]),
    }) as Record<string, unknown>,
  )
}

/**
 * ドキュメントが存在しない場合は作成し、存在する場合は置き換えます。IDを指定しない場合はautoIdが設定されます。
 * @param ref - ドキュメントを作成または置き換えるコレクションの参照
 * @param data - 作成または置き換えるデータ
 * @returns 作成または置き換え結果
 */
export function createOrReplaceDocIn<T extends Base>(
  ref: CollectionReference<T>,
  data: Omit<T, "id" | "createdAt" | "updatedAt"> & {
    id?: T["id"]
    createdAt?: Date
    updatedAt?: Date
  },
) {
  return ref.doc(data.id ?? autoId()).set(
    serialize({
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      ...R.omit(data, ["id"]),
    }) as WithFieldValue<T>,
  )
}

/**
 * ドキュメントを取得します。
 * @param ref - 取得するドキュメントの参照
 * @returns 取得されたドキュメント
 */
export async function fetchDoc<S>(
  ref: DocumentReference<S>,
): Promise<S | null> {
  const result = await ref.get()

  if (!result.exists) {
    return null
  }

  return deserializeSnapshot(result)
}

/**
 * クエリを実行し、取得されたドキュメントを返します。
 * @param ref - 取得するドキュメントのクエリ
 * @returns 取得されたドキュメント
 */
export async function fetchDocs<T extends Base>(ref: Query<T>): Promise<T[]> {
  const snapshot = await ref.get()

  return snapshot.docs.map(deserializeSnapshot)
}

/**
 * コレクションから指定されたIDのドキュメントを取得する関数を返します。
 * @param id - 取得するドキュメントのID
 * @returns コレクションの参照を受け取り指定されたIDのドキュメントを取得する関数
 *
 * 例:
 * ```ts
 * const doc = docById("123")(ref)
 * ```
 */
export const docById =
  <M extends Base, DD extends DocumentData = DocumentData>(id: M["id"]) =>
  (ref: CollectionReference<M, DD>) =>
    ref.doc(id)

function serialize(data: unknown): unknown {
  if (data instanceof FieldValue) {
    return data
  }

  if (data === null) {
    return null
  }

  if (data instanceof Date) {
    return Timestamp.fromDate(data)
  }

  if (Array.isArray(data)) {
    return data.map(serialize)
  }

  if (typeof data === "object") {
    return R.mapValues(data, serialize)
  }

  return data
}

function deserialize(data: unknown): unknown {
  if (data instanceof Timestamp) {
    return data.toDate()
  }

  if (Array.isArray(data)) {
    return data.map(deserialize)
  }

  if (data instanceof DocumentReference) {
    return data.path
  }

  if (typeof data === "object" && data !== null) {
    return R.mapValues(data, deserialize)
  }

  return data
}

function deserializeSnapshot<T>(snapshot: DocumentSnapshot<T>) {
  return deserialize({
    id: snapshot.id,
    ...snapshot.data(),
  }) as T
}

/**
 * Firestoreが自動生成するものと同じ形式のIDを生成します。
 * @returns ランダムなID
 */
function autoId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let autoId = ""
  while (autoId.length < 20) {
    const bytes = crypto.getRandomValues(new Uint8Array(40))

    bytes.forEach((b) => {
      // Length of `chars` is 62. We only take bytes between 0 and 62*4-1
      // (both inclusive). The value is then evenly mapped to indices of `char`
      // via a modulo operation.
      const maxValue = 62 * 4 - 1
      if (autoId.length < 20 && b <= maxValue) {
        autoId += chars.charAt(b % 62)
      }
    })
  }
  return autoId
}
