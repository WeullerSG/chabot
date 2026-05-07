import { Authenticated, Unauthenticated } from "convex/react";
import Pages from "./Pages";
import AuthPage from "./components/AuthPage";

function App() {
  return (
    <>
      <Authenticated>
        <Pages />
      </Authenticated>
      <Unauthenticated>
        <AuthPage />
      </Unauthenticated>
    </>
  );
}

export default App;
