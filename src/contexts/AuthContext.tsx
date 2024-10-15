import { createContext, useEffect, useMemo, useState } from "react";
import { AUTH_STATUS } from "../constants";
import { UserInfo } from "../types/user-info";
import liff from "@line/liff";
import { LoadingOutlined } from "@ant-design/icons";
import { Flex, Spin } from "antd";

type AuthContextType = {
  user: UserInfo | null;
  authStatus: (typeof AUTH_STATUS)[keyof typeof AUTH_STATUS];
  loading: boolean;
  logout: () => void;
  accessToken: string | null;
};

type AuthContextProviderProps = {
  children: React.ReactNode;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  authStatus: AUTH_STATUS.UNAUTHORIZED,
  loading: true,
  logout: () => {},
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

  useEffect(() => {
    const initializeLiff = async () => {
      console.log("Initializing LIFF with ID:", liffId);
      if (!liffId) {
        console.error("LIFF ID is not defined");
        setAuthStatus(AUTH_STATUS.UNAUTHORIZED);
        return;
      }

      try {
        await liff.init({ liffId });
        console.log("LIFF initialized successfully");

        if (!liff.isLoggedIn()) {
          liff.login();
        } else {
          handleLineLogin();
        }
      } catch (error) {
        console.error("LIFF initialization failed", error);
        setAuthStatus(AUTH_STATUS.UNAUTHORIZED);
      } finally {
        setLoading(false);
      }
    };

    initializeLiff();
  }, [liffId]);

  const handleLineLogin = async () => {
    try {
      const profile = await liff.getProfile();
      console.log("Retrieved profile:", profile);
      setUser(profile as unknown as UserInfo);
      setAccessToken(liff.getAccessToken());
      setAuthStatus(AUTH_STATUS.AUTHORIZED);
    } catch (error) {
      console.error("Error during LINE login", error);
      setAuthStatus(AUTH_STATUS.UNAUTHORIZED);
    }
  };

  const logout = async () => {
    try {
      await liff.logout();
      setUser(null);
      setAccessToken(null);
      setAuthStatus(AUTH_STATUS.UNAUTHORIZED);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const memoizedUser = useMemo(
    () => ({
      accessToken,
      authStatus,
      user,
      loading,
      logout,
    }),
    [user, authStatus, accessToken, loading]
  );

  return (
    <AuthContext.Provider value={memoizedUser}>
      {loading ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}>
          <Flex align="center" gap="middle">
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
            />
          </Flex>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
