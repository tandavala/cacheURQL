import { useMutation } from "urql";
import React from "react";
import { setToken } from "./utils";

export const Login = ({ setIsAuthenticated }) => {
  const [name, setName] = React.useState("");

  const [data, login] = useMutation(`
      mutation ($name: String!) {
          login (name: $name)
      }
  `);

  const handleSubmit = e => {
    e.preventDefault(); // no page reload due to submit
    login({ name }).then(({ data }) => {
      if (data.login) {
        setToken(data.login);
        setIsAuthenticated(true);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input value={name} onChange={e => setName(e.currentTarget.value)} />
      <button disabled={data.fetching} type="sumbit">
        Log in!
      </button>
    </form>
  );
};
