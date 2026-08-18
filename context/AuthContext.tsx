/**
 * @deprecated This monolithic AuthContext file is deprecated.
 * Please use the separated modular architecture instead:
 * - Context definition: `@/context/context/AuthContext`
 * - Provider component: `@/context/providers/AuthProvider`
 * - Custom hook: `@/hooks/useAuth`
 */
export { AuthContext, type IAuthContext } from "./context/AuthContext";
export { AuthProvider } from "./providers/AuthProvider";
export { useAuth } from "@/hooks/useAuth";
