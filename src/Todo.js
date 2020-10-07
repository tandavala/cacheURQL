import { useMutation } from "urql";
import React from "react";

const ToggleTodoMutation = `
  mutation($id: ID!) {
    toggleTodo(id: $id) {
      id
      complete
      updatedBy
    }
  }
`;

export const Todo = ({ id, text, complete, disabled, updatedBy }) => {
  const [result, toggleTodo] = useMutation(ToggleTodoMutation);

  if (result.error)
    return <p style={{ color: "red" }}>Something went wrong while toggling</p>;

  return (
    <li>
      <p onClick={() => toggleTodo({ id })}>{text}</p>
      <div style={{ display: "flex", alignItems: "center" }}>
        <p style={{ marginRight: 16 }}>{complete ? "Completed" : "Todo"}</p>
        {updatedBy && <p>Updated by: {updatedBy}</p>}
      </div>
      <button
        onClick={() => toggleTodo({ id })}
        disabled={disabled || result.fetching}
        type="button"
      >
        {" "}
        {complete ? "Toggle todo" : "Complete todo"}
      </button>
    </li>
  );
};
