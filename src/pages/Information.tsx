import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { axiosInstance } from "../services/config";
import { useNavigate } from "react-router-dom";
import { Flex, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
export const Information = () => {
  const { accessToken, user } = useAuth();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const getProfile = async (accessToken: string) => {
    const res = await axiosInstance.get(`/member/${user?.memberId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    setUserInfo(res.data);
  };

  useEffect(() => {
    getProfile(accessToken!).finally(() => setLoading(false));
    if (user?.isRegistered) {
      navigate(`/register/`);
    }
  }, [user]);

  return loading ? (
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
  ) : (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}>
      <h1>Information</h1>
      <p>
        User: {userInfo?.firstName} {userInfo?.lastName}
      </p>
      <p>Email: {userInfo?.email}</p>
      <p>Telephone: {userInfo?.telephone}</p>
      <p>Address: {userInfo?.address}</p>
    </div>
  );
};
