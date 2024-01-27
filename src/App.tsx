import AuthProvider from "./providers/AuthProvider";
import Routes from "./router/routes";

export default function App() {
  return (
    <>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </>
  );
}
