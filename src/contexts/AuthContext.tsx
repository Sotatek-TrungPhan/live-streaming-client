import {
  createContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { AUTH_STATUS } from "../constants";
import { UserInfo } from "../types/user-info";
import liff from "@line/liff";
import { LoadingOutlined } from "@ant-design/icons";
import { Flex, Spin } from "antd";

type AuthContextType = {
  user: UserInfo | null;
  authStatus: (typeof AUTH_STATUS)[keyof typeof AUTH_STATUS];
  loading: boolean;
  logout: () => Promise<void>;
  accessToken: string | null;
};

type AuthContextProviderProps = {
  children: React.ReactNode;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  authStatus: AUTH_STATUS.UNAUTHORIZED,
  loading: true,
  logout: async () => {},
  accessToken: null,
});

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [authStatus, setAuthStatus] = useState<
    (typeof AUTH_STATUS)[keyof typeof AUTH_STATUS]
  >(AUTH_STATUS.UNAUTHORIZED);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const liffId = import.meta.env.VITE_APP_LIFF_APP_ID;

  const handleLineLogin = useCallback(async () => {
    if (user && accessToken) return; // Prevent duplicate login attempts

    try {
      const profile = await liff.getProfile();
      const token = liff.getAccessToken();
      if (!token) {
        throw new Error("Failed to get access token");
      }

      // Only update state if values change
      if (profile !== user) setUser(profile as unknown as UserInfo);
      if (token !== accessToken) setAccessToken(token);
      if (authStatus !== AUTH_STATUS.AUTHORIZED) setAuthStatus(AUTH_STATUS.AUTHORIZED);
    } catch (error) {
      console.error("Failed to get profile or access token", error);
      if (authStatus !== AUTH_STATUS.UNAUTHORIZED) setAuthStatus(AUTH_STATUS.UNAUTHORIZED);
    }
  }, [user, accessToken, authStatus]);

  useEffect(() => {
    let isMounted = true;

    const initializeLiff = async () => {
      if (!liffId) {
        console.error("LIFF ID is not defined");
        if (isMounted) {
          setAuthStatus(AUTH_STATUS.UNAUTHORIZED);
        }
        return;
      }

      try {
        await liff.init({ liffId });

        console.log("LIFF initialized successfully");

        if (!liff.isLoggedIn()) {
          liff.login();
        } else if (liff.isInClient()) {
          await handleLineLogin();
        } else {
          handleLineLogin();
        }
      } catch (err) {
        console.error("LIFF initialization failed", err);
        if (isMounted) setAuthStatus(AUTH_STATUS.UNAUTHORIZED);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initializeLiff();

    return () => {
      isMounted = false;
    };
  }, [liffId, handleLineLogin]);

  const logout = useCallback(async () => {
    try {
      if (liff.isLoggedIn()) {
        await liff.logout();
      }
      setUser(null);
      setAccessToken(null);
      setAuthStatus(AUTH_STATUS.UNAUTHORIZED);
    } catch (error) {
      console.error("Logout failed", error);
    }
  }, []);

  const memoizedUser = useMemo(
    () => ({
      accessToken,
      authStatus,
      user,
      loading,
      logout,
    }),
    [user, authStatus, accessToken, loading, logout]
  );

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}>
        <Flex align="center" gap="middle">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
        </Flex>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={memoizedUser}>{children}</AuthContext.Provider>
  );
};
