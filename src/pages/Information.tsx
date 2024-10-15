import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { axiosInstance } from "../services/config";
import { useNavigate, useParams } from "react-router-dom";
import { Flex, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

export const Information = () => {
  const { accessToken, user } = useAuth();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { liffId } = useParams<{ liffId: string }>(); // Add type for useParams

  const getProfile = async (accessToken: string) => {
    try {
      const res = await axiosInstance.get(`/member/${user?.userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Fixed template string
        },
      });
      setUserInfo(res.data); // Store user info
    } catch (err) {
      console.error(err); // Log error to console
    }
  };

  useEffect(() => {
    if (userInfo && !userInfo?.isRegistered) {
        navigate(`/register/${liffId}`); // Fixed template string
      }
    if (accessToken && user) {
      getProfile(accessToken).finally(() => setLoading(false));
    }
   
  }, [accessToken, liffId, userInfo]); // Added user?.isRegistered to dependencies

  return loading ? (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
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
      }}
    >
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
