import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: number;
  token: string;
  name: string;
  email: string;
  user_type: number;
}

export const USER_TYPE = {
  SUPER_ADMIN: 9,
  COACH: 3,
  ORGANIZATION: 2,
  PLAYER: 5,
} as const;

export type AppRole = "super_admin" | "coach" | "organization" | "player";
export type AnyRole = AppRole | "guest";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  hydrated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  clearError: () => void;
  setHydrated: () => void;
  setUser: (user: User) => void;
  clearAllStorage: () => void;
  isSuperAdmin: () => boolean;
  isCoach: () => boolean;
  isOrganization: () => boolean;
  isPlayer: () => boolean;
  isUserType: (type: number) => boolean;
  getRole: () => AnyRole;
  hasAnyRole: (roles: AppRole[]) => boolean;
}

const clearAllLocalStorage = () => {
  try {
    const keys = Object.keys(localStorage);
    console.log("AuthStore: Clearing localStorage keys:", keys);

    localStorage.clear();
    console.log("AuthStore: All localStorage data cleared successfully");
  } catch (error) {
    console.warn("AuthStore: Error clearing localStorage:", error);
  }
};

export const clearAuthStorage = () => {
  try {
    localStorage.clear();
    console.log("AuthStore: All localStorage data cleared before rehydration");
  } catch (error) {
    console.warn("AuthStore: Error clearing auth storage:", error);
  }
};

export const checkAndClearStorage = () => {
  if (typeof window !== "undefined") {
    const pathname = window.location.pathname;
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get("status");

    if (
      (pathname === "/login" && !status) ||
      status === "error" ||
      (pathname === "/" && status === "error")
    ) {
      console.log(
        "AuthStore: Clearing localStorage for fresh state, status:",
        status || "none"
      );
      localStorage.clear();
    }
  }
};

checkAndClearStorage();

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      loading: true,
      hydrated: false,
      error: null,

      clearAllStorage: () => {
        clearAllLocalStorage();
        set({
          user: null,
          isAuthenticated: false,
          loading: false,
          hydrated: false,
          error: null,
        });
      },

      login: async (email: string, password: string) => {
        clearAllLocalStorage();

        set({ loading: true, error: null });

        try {
          const response = await fetch("https://beta.ysn.tv/api/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              password,
            }),
          });

          const data = await response.json();

          if (data.status === true) {
            set({
              user: data.data,
              isAuthenticated: true,
              loading: false,
              error: null,
            });
            return true;
          } else {
            set({
              loading: false,
              error: data.message || "Login failed",
            });
            return false;
          }
        } catch {
          set({
            loading: false,
            error: "Network error. Please try again.",
          });
          return false;
        }
      },

      logout: async () => {
        const { user } = get();

        clearAllLocalStorage();

        if (!user?.token) {
          set({
            user: null,
            isAuthenticated: false,
            error: null,
          });
          return true;
        }

        try {
          const response = await fetch("https://beta.ysn.tv/api/logout", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${user.token}`,
              "Content-Type": "application/json",
            },
          });

          const data = await response.json();

          set({
            user: null,
            isAuthenticated: false,
            error: null,
          });

          if (data.status === true) {
            return true;
          } else {
            console.warn("Logout API error:", data.message);
            return true;
          }
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            error: null,
          });
          console.warn("Logout network error:", error);
          return true;
        }
      },

      clearError: () => {
        set({ error: null });
      },

      setHydrated: () => {
        set({ loading: false, hydrated: true });
      },

      setUser: (user: User) => {
        console.log("AuthStore: setUser called with", user);
        set({
          user,
          isAuthenticated: true,
          loading: false,
          hydrated: true,
          error: null,
        });
        console.log("AuthStore: User state set successfully");
      },
      isSuperAdmin: () => get().user?.user_type === USER_TYPE.SUPER_ADMIN,
      isCoach: () => get().user?.user_type === USER_TYPE.COACH,
      isOrganization: () => get().user?.user_type === USER_TYPE.ORGANIZATION,
      isPlayer: () => get().user?.user_type === USER_TYPE.PLAYER,
      isUserType: (type: number) => get().user?.user_type === type,
      getRole: () => {
        const t = get().user?.user_type;
        if (t === USER_TYPE.SUPER_ADMIN) return "super_admin";
        if (t === USER_TYPE.COACH) return "coach";
        if (t === USER_TYPE.ORGANIZATION) return "organization";
        if (t === USER_TYPE.PLAYER) return "player";
        return "guest";
      },
      hasAnyRole: (roles: AppRole[]) => {
        const role = get().getRole();
        return roles.includes(role as AppRole);
      },
    }),
    {
      name: "ysn-auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      skipHydration: false,
      onRehydrateStorage: () => (state) => {
        console.log("AuthStore: Rehydrating state", state);

        if (typeof window !== "undefined") {
          const pathname = window.location.pathname;
          const urlParams = new URLSearchParams(window.location.search);
          const status = urlParams.get("status");

          const shouldClearStorage =
            (pathname === "/login" && !status) ||
            status === "error" ||
            (pathname === "/" && status === "error");

          if (state) {
            if (shouldClearStorage) {
              console.log(
                "AuthStore: Clearing localStorage and resetting state for fresh login, status:",
                status || "none"
              );
              clearAllLocalStorage();
              state.user = null;
              state.isAuthenticated = false;
              state.loading = false;
              state.hydrated = true;
              state.error = null;
              return;
            }

            if (status === "success") {
              console.log(
                "AuthStore: Success status detected, preserving state for AuthProvider processing"
              );
              state.loading = false;
              state.hydrated = true;
              return;
            }

            if (state.user && state.user.token && !state.isAuthenticated) {
              console.log(
                "AuthStore: User data found but not authenticated, fixing state"
              );
              state.isAuthenticated = true;
            }

            state.loading = false;
            state.hydrated = true;
            console.log("AuthStore: State hydrated successfully", {
              hasUser: !!state.user,
              isAuthenticated: state.isAuthenticated,
            });
          }
        }
      },
    }
  )
);
