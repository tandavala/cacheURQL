import { useQuery, useSubscription } from "urql";
import React from "react";
import { Todo } from "./Todo";

const TodosQuery = `
  query {
    todos {
      id
      text
      complete
      updatedBy
    }
  }
`;

const TodoSubscription = `
  subscription {
    updateTodo {
      id
      text
      complete
      updatedBy
    }
  }
`;

export const Todos = () => {
  const [todos, setTodos] = React.useState([]);
  const [todosResult] = useQuery({ query: TodosQuery });

  // We're making a mutable reference where we'll keep the value
  // for fetching from the previous render.
  const previousFetching = React.useRef(todosResult.fetching);

  useSubscription(
    {
      query: TodoSubscription
    },
    // This callback will be invoked every time the subscription
    // gets notified of an updated todo.
    (_, result) => {
      const todo = todos.find(({ id }) => id === result.updateTodo.id);
      if (todo) {
        const newTodos = [...todos];
        newTodos[todos.indexOf(todo)] = result.updateTodo;
        setTodos(newTodos);
      }
    }
  );

  React.useEffect(() => {
    // When we transition from fetching to not fetching and we have
    // data we'll set these todos as our current set.
    if (previousFetching.current && !todosResult.fetching && todosResult.data) {
      setTodos(todosResult.data.todos);
    }
    // set the fetching on the mutable ref
    previousFetching.current = todosResult.fetching;
  }, [todosResult]); // When our result changes trigger this.

  if (todosResult.fetching) return <p>Loading...</p>;
  if (todosResult.error) return <p>Oh no... {todosResult.error.message}</p>;

  return (
    <ul>
      {todosResult.data.todos.map(({ id, text, complete, updatedBy }) => (
        <Todo
          key={id}
          text={text}
          id={id}
          complete={complete}
          disabled={todosResult.fetching}
          updatedBy={updatedBy}
        />
      ))}
    </ul>
  );
};
