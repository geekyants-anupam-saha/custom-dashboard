import { DocumentNode, OperationVariables } from "@apollo/client";
import client from "./client";

export async function fetchData<TData, TVariables extends OperationVariables>(
  query: DocumentNode,
  variables?: TVariables,
): Promise<TData | null> {
  try {
    const updatedVariables = {
      ...variables,
      ...(variables?.locale === "pt" && {
        locale: "pt-BR",
      }),
      ...(variables?.locale === "fr" && {
        locale: "fr-FR",
      }),
    } as TVariables;

    const result: any = await client.query({
      query,
      variables: updatedVariables,
    });

    if (result.error) {
      return null;
    }

    return result.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
