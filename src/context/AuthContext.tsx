/**
 * @deprecated This monolithic AuthContext file is deprecated.
 * Please use the separated modular architecture instead:
 * - Context definition: `@/src/context/context/AuthContext`
 * - Provider component: `@/src/providers/AuthProvider`
 * - Custom hook: `@/hooks/useAuth`
 */
export { AuthContext, type IAuthContext } from "./context/AuthContext";
export { AuthProvider } from "@/src/providers/AuthProvider";
export { useAuth } from "@/hooks/useAuth";
